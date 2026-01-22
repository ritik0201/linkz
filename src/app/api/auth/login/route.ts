import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { sendOtpEmail } from "@/lib/sendOtp";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, role } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (role && user.role !== role) {
      return NextResponse.json({ message: `Invalid role. This email is associated with a ${user.role} account.` }, { status: 403 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendOtpEmail(email, otp);

    return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Login OTP Error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}