import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGO_URI as string);
};

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get("search");

    if (!searchQuery) {
      return NextResponse.json([], { status: 200 });
    }

    // This assumes the User model has a 'username' field that is indexed for searching.
    const users = await User.find({
      username: { $regex: searchQuery, $options: "i" },
    }).select("username _id profileImage"); // select fields to return

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}