import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ message: "User already verified" }, { status: 400 });
    }

    if (user.otp !== otp) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    if (!user.otpExpires || new Date() > user.otpExpires) {
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });
  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}