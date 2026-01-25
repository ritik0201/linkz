import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Profile from "@/models/Profile";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        // @ts-ignore
        const currentUserId = session.user._id;

        if (!currentUserId) {
            return NextResponse.json({ error: "User ID not found in session" }, { status: 401 });
        }

        const body = await req.json();
        const { targetUserId } = body;

        if (!targetUserId) {
            return NextResponse.json({ error: "Target user ID is required" }, { status: 400 });
        }

        if (currentUserId === targetUserId) {
            return NextResponse.json({ error: "You cannot follow yourself" }, { status: 400 });
        }

        let currentUserProfile = await Profile.findOne({ user: currentUserId });
        const targetUserProfile = await Profile.findOne({ user: targetUserId });

        if (!targetUserProfile) {
            return NextResponse.json({ error: "Target user profile not found" }, { status: 404 });
        }

        if (!currentUserProfile) {
            // Create a default profile for the current user if it doesn't exist
            try {
                currentUserProfile = await Profile.create({
                    user: currentUserId,
                    links: [],
                    skills: [],
                    certificates: [],
                    education: [],
                    experience: [],
                    followers: [],
                    following: []
                });
            } catch (createError) {
                console.error("Failed to create default profile for follower:", createError);
                return NextResponse.json({ error: "Current user profile not found and could not be created" }, { status: 500 });
            }
        }

        // Check if already following (convert ObjectId to string for comparison)
        const isFollowing = currentUserProfile.following.some((id: any) => id.toString() === targetUserId);

        if (isFollowing) {
            // Unfollow
            await Profile.updateOne({ user: currentUserId }, { $pull: { following: targetUserId } });
            await Profile.updateOne({ user: targetUserId }, { $pull: { followers: currentUserId } });
        } else {
            // Follow
            await Profile.updateOne({ user: currentUserId }, { $addToSet: { following: targetUserId } });
            await Profile.updateOne({ user: targetUserId }, { $addToSet: { followers: currentUserId } });
        }

        return NextResponse.json({ success: true, isFollowing: !isFollowing });
    } catch (error: any) {
        console.error("Follow API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}