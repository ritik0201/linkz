import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Message from "@/models/message";
import User from "@/models/User"; // Ensure User model is registered

// Helper to ensure DB connection
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  await mongoose.connect(process.env.MONGO_URI as string);
};

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { senderId, receiverId, message } = body;

    if (!senderId || !receiverId || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message,
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const otherUserId = searchParams.get("otherUserId");

    if (!userId || !otherUserId) {
      return NextResponse.json(
        { error: "Missing user IDs" },
        { status: 400 }
      );
    }

    // Find messages between the two users (sent by either one)
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    }).sort({ createdAt: 1 }); // Sort by oldest first

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}