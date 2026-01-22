import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendOtpEmail } from "@/lib/sendOtp";

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
      if (existingUser.isVerified) {
        if (existingUser.email === email) {
          return NextResponse.json({ message: `Email ID already exists with role: ${existingUser.role}` }, { status: 409 });
        }
        return NextResponse.json({ message: "Username already taken" }, { status: 409 });
      } else {
        // Resend OTP for unverified user
        if (existingUser.email === email) {
          const otp = Math.floor(100000 + Math.random() * 900000).toString();
          const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
          const hashedPassword = await bcrypt.hash(password, 10);

          existingUser.otp = otp;
          existingUser.otpExpires = otpExpires;
          existingUser.password = hashedPassword;
          existingUser.fullName = fullName;
          existingUser.username = username;
          existingUser.mobile = mobile;
          
          await existingUser.save();
          await sendOtpEmail(email, otp);
          
          return NextResponse.json({ message: "OTP resent. Please verify your email." }, { status: 201 });
        }
        return NextResponse.json({ message: "Username already taken" }, { status: 409 });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = new User({
      fullName,
      email,
      mobile,
      username,
      password: hashedPassword,
      isVerified: false,
      role: "startup",
      otp,
      otpExpires,
    });

    await user.save();
    await sendOtpEmail(email, otp);

    return NextResponse.json({ message: "Startup registered successfully! OTP sent to email." }, { status: 201 });
  } catch (error: any) {
    console.error("Startup Signup Error:", error);
    return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
  }
}
