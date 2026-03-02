import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGO_URI as string);
};

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id: userId } = await params;

    let user;

    if (mongoose.Types.ObjectId.isValid(userId)) {
      user = await User.findById(userId).select("username profileImage");
    } else {
      user = await User.findOne({ username: userId }).select("username profileImage");
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}