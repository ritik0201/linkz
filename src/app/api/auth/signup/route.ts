import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { sendOtpEmail } from "@/lib/sendOtp";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { fullName, email, mobile, username } = await req.json();

    if (!email || !username) {
      return NextResponse.json({ message: "Email and Username are required" }, { status: 400 });
    }

    // Check if username is taken by another user
    const existingUsername = await User.findOne({ username });
    if (existingUsername && existingUsername.email !== email) {
      return NextResponse.json({ message: "Username already taken" }, { status: 400 });
    }

    // Generate OTP and expiry time
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // valid for 5 minutes

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        fullName,
        email,
        mobile,
        username,
        isVerified: false,
        role: 'user',
      });
    } else if (!user.username) {
      user.username = username;
    }

    // Update OTP details
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP via email
    await sendOtpEmail(email, otp);

    return NextResponse.json({ message: "OTP sent successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
