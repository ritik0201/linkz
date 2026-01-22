import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { fullName, email, mobile, username, password } = await req.json();

    if (!email || !username || !password) {
      return NextResponse.json({ message: "Email, Username, and Password are required" }, { status: 400 });
    }

    // Check if username is taken by another user
    const existingUsername = await User.findOne({ username });
    if (existingUsername && existingUsername.email !== email) {
      return NextResponse.json({ message: "Username already taken" }, { status: 400 });
    }

    // Find or create user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists with this email" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      email,
      mobile,
      username,
      password: hashedPassword,
      isVerified: true, // Auto-verify for now since we removed OTP
      role: 'user',
    });

    await user.save();

    return NextResponse.json({ message: "User created successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
