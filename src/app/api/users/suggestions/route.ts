import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Profile from "@/models/Profile";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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

        const suggestions = await User.aggregate([
            {
                $match: {
                    _id: { $nin: [...followingIds, currentUserId] }
                }
            },
            { $sample: { size: 5 } }, // Fetch 5 random users
            {
                $lookup: {
                    from: 'profiles',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'profileInfo'
                }
            },
            {
                $unwind: {
                    path: '$profileInfo',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    fullName: 1,
                    username: 1,
                    profileImage: 1,
                    profilePicture: '$profileInfo.profilePicture',
                    headline: '$profileInfo.headline'
                }
            }
        ]);

        return NextResponse.json({ data: suggestions }, { status: 200 });

    } catch (error: any) {
        console.error("Error fetching suggestions:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
