import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendOtpEmail } from "@/lib/sendOtp";

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
      if (existingUser.isVerified) {
        return NextResponse.json({ message: "User already exists with this email" }, { status: 400 });
      } else {
        // Resend OTP for unverified user
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        const hashedPassword = await bcrypt.hash(password, 10);

        existingUser.otp = otp;
        existingUser.otpExpires = otpExpires;
        existingUser.password = hashedPassword;
        existingUser.fullName = fullName;
        existingUser.username = username;
        
        await existingUser.save();
        await sendOtpEmail(email, otp);
        
        return NextResponse.json({ message: "OTP resent. Please verify your email." }, { status: 201 });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = new User({
      fullName,
      email,
      mobile,
      username,
      password: hashedPassword,
      isVerified: false,
      role: 'user',
      otp,
      otpExpires,
    });

    await user.save();
    await sendOtpEmail(email, otp);

    return NextResponse.json({ message: "User created successfully! OTP sent to email." }, { status: 201 });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
