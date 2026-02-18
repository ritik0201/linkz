import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Profile from "@/models/Profile";
import User from "@/models/User";
import { isValidObjectId } from "mongoose";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username");
        const type = searchParams.get("type"); // 'followers' | 'following'

        if (!username || !type || !["followers", "following"].includes(type)) {
            return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
        }

        // Find the user first to get their ID
        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const profile = await Profile.findOne({ user: user._id }).populate({
            path: type,
            model: User,
            select: "fullName username profileImage headline role"
        });

        if (!profile) {
            return NextResponse.json({ data: [] });
        }

        return NextResponse.json({ data: profile[type as "followers" | "following"] || [] });

    } catch (error: any) {
        console.error("Network API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
