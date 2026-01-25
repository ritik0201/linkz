import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Profile from "@/models/Profile";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { usernames } = await req.json();
    
    if (!usernames || !Array.isArray(usernames) || usernames.length === 0) {
      return NextResponse.json({ users: [] });
    }

    const users = await User.find({ username: { $in: usernames } })
      .select("_id email username fullName profileImage");

    const userIds = users.map(u => u._id);
    
    const profiles = await Profile.find({ user: { $in: userIds } })
      .select("user profilePicture headline");

    const mergedUsers = users.map(user => {
      const profile = profiles.find(p => p.user.toString() === user._id.toString());
      return {
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        profileImage: profile?.profilePicture || user.profileImage,
        headline: profile?.headline
      };
    });
      
    return NextResponse.json({ users: mergedUsers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}