import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Profile from "@/models/Profile";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        // @ts-ignore
        const currentUserId = new mongoose.Types.ObjectId(session.user._id);

        const currentUserProfile = await Profile.findOne({ user: currentUserId }).select('following').lean();
        const followingIds = currentUserProfile ? currentUserProfile.following : [];

        const suggestions = await Profile.aggregate([
            {
                $match: {
                    user: { $nin: [...followingIds, currentUserId] }
                }
            },
            { $sample: { size: 1 } }, // Fetch 1 random user
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            {
                $unwind: '$userInfo'
            },
            {
                $project: {
                    _id: '$userInfo._id',
                    fullName: '$userInfo.fullName',
                    username: '$userInfo.username',
                    profileImage: '$userInfo.profileImage',
                    profilePicture: '$profilePicture',
                    headline: '$headline'
                }
            }
        ]);

        return NextResponse.json({ data: suggestions }, { status: 200 });

    } catch (error: any) {
        console.error("Error fetching suggestions:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
