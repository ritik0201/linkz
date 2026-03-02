import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Message from "@/models/message";
import User from "@/models/User"; // Ensure User model is registered

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGO_URI as string);
};

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userObjectId }, { receiver: userObjectId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userObjectId] },
              then: "$receiver",
              else: "$sender",
            },
          },
          lastMessage: { $first: "$message" },
          createdAt: { $first: "$createdAt" },
          // Optional: Calculate unread count if needed
          unread: {
            $sum: {
              $cond: [{ $and: [{ $eq: ["$receiver", userObjectId] }, { $eq: ["$isRead", false] }] }, 1, 0]
            }
          }
        },
      },
      {
        $lookup: {
          from: "users", // The collection name for the User model
          localField: "_id",
          foreignField: "_id",
          as: "otherUser",
        },
      },
      {
        $unwind: "$otherUser",
      },
      {
        $project: {
          _id: 0,
          otherUser: {
            _id: "$otherUser._id",
            username: "$otherUser.username",
            avatar: "$otherUser.profileImage", // Map profileImage to avatar
            online: "$otherUser.online",
          },
          lastMessage: "$lastMessage",
          time: "$createdAt",
          unread: 1
        },
      },
      { $sort: { time: -1 } },
    ]);

    return NextResponse.json(conversations, { status: 200 });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
