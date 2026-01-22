import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    // console.log("Startup Signup Request Body:", body); // Debugging: Check server logs to see received data

    let {
      fullName,
      email,
      mobile,
      username,
      password
    } = body;



    if (!fullName || !email || !username || !password) {
      return NextResponse.json({ message: "Full name, email, username and password are required" }, { status: 400 });
    }
    // this is testing phase
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json({ message: `Email ID already exists with role: ${existingUser.role}` }, { status: 409 });
      }
      return NextResponse.json({ message: "Username already taken" }, { status: 409 });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      email,
      mobile,
      username,
      password: hashedPassword,
      isVerified: true, // Auto-verify
      role: "startup",
    });

    await user.save();

    return NextResponse.json({ message: "Startup registered successfully!" }, { status: 201 });
  } catch (error: any) {
    console.error("Startup Signup Error:", error);
    return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
  }
}
