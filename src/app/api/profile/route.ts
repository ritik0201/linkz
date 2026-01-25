import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Profile from "@/models/Profile";
import User from "@/models/User";
import { isValidObjectId } from "mongoose";

export async function GET(req: Request) {
  await dbConnect();

  // Use searchParams to get query parameters
  const { searchParams } = new URL(req.url);
  const queryUserId = searchParams.get("userid");

  try {
    // 1. Handle Public Profile Fetch (by userid query param)
    if (queryUserId) {
      let userResult: any = await User.findOne({ username: queryUserId }).select("fullName email username profileImage role mobile");

      if (!userResult && isValidObjectId(queryUserId)) {
        userResult = await User.findById(queryUserId).select("fullName email username profileImage role mobile");
      }

      if (!userResult) {
        userResult = await User.findOne({ email: queryUserId }).select("fullName email username profileImage role mobile");
      }

      if (!userResult) {
        const escapedUserId = queryUserId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        userResult = await User.findOne({ email: { $regex: new RegExp(`^${escapedUserId}@`, 'i') } }).select("fullName email username profileImage role mobile");
      }

      if (!userResult) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }

      const profile = await Profile.findOne({ user: userResult._id }).populate({
        path: "user",
        model: User,
        select: "fullName email username profileImage role mobile",
      });

      if (!profile) {
        return NextResponse.json({
          success: true,
          data: {
            user: userResult,
            headline: "",
            bio: "",
            location: "",
            profilePicture: "",
            links: [],
            skills: [],
            certificates: [],
            education: [],
            experience: [],
          }
        }, { status: 200 });
      }

      return NextResponse.json({ success: true, data: profile }, { status: 200 });
    }

    // 2. Handle Private Profile Fetch (Session-based)
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = (session.user as any)._id;
    const profile = await Profile.findOne({ user: userId }).populate({
      path: "user",
      model: User,
      select: "fullName email username profileImage role mobile",
    });

    if (!profile) {
      const userResult = await User.findById(userId).select("fullName email username profileImage role mobile");
      return NextResponse.json({
        success: true,
        data: {
          user: userResult,
          headline: "",
          bio: "",
          location: "",
          profilePicture: "",
          links: [],
          skills: [],
          certificates: [],
          education: [],
          experience: [],
        }
      }, { status: 200 });
    }

    return NextResponse.json({ success: true, data: profile }, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  await dbConnect();

  try {
    const userId = (session.user as any)._id;
    const body = await req.json();
    
    // Extract mobile to update User model
    // Also extract user and _id to prevent updating them in Profile
    const { mobile, user, _id, username, ...profileUpdates } = body;

    // 1. Update User model (for mobile)
    let dbUser;
    if (mobile !== undefined) {
      dbUser = await User.findByIdAndUpdate(userId, { mobile }, { new: true }).select("username");
    } else {
      dbUser = await User.findById(userId).select("username");
    }

    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!dbUser.username) {
      return NextResponse.json(
        { success: false, message: "User has no username" },
        { status: 400 }
      );
    }

    // 2. Update Profile model
    // Use $set with the remaining body fields to perform a partial update
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: { ...profileUpdates, username: dbUser.username } },
      { new: true, upsert: true, setDefaultsOnInsert: true, strict: false }
    ).populate({
      path: "user",
      model: User,
      select: "fullName email username profileImage role mobile",
    });

    return NextResponse.json({ success: true, data: updatedProfile }, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}