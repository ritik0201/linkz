import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { sendOtpEmail } from "@/lib/sendOtp";
import { NextRequest, NextResponse } from "next/server";

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
    } = body;

   

    if (!fullName || !email || !username) {
      return NextResponse.json({ message: "Full name, email and username are required" }, { status: 400 });
    }
    // this is testing phase
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    
    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json({ message: `Email ID already exists with role: ${existingUser.role}` }, { status: 409 });
      }
      return NextResponse.json({ message: "Username already taken" }, { status: 409 });
    }


    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const user = new User({
      fullName,
      email,
      mobile,
      username,
      isVerified: false,
      role: "startup",
    });

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendOtpEmail(email, otp);
    return NextResponse.json({ message: "OTP sent successfully!" }, { status: 200 });
  } catch (error: any) {
    console.error("Startup Signup Error:", error);
    return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
  }
}
