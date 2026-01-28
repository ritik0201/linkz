import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import User from "@/models/User";
import cloudinary from "@/lib/cloudinary";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Profile from "@/models/Profile";
import ProjectOrResearch from "@/models/projectOrResearch";

// Helper to upload to Cloudinary
async function uploadToCloudinary(file: File): Promise<string> {
    const fileBuffer = await file.arrayBuffer();
    const mime = file.type;
    const encoding = 'base64';
    const base64Data = Buffer.from(fileBuffer).toString('base64');
    const fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;

    const result = await cloudinary.uploader.upload(fileUri, {
        folder: 'linkz_posts'
    });

    return result.secure_url;
}

export async function POST(req: Request) {
    try {
        await dbConnect();

        const formData = await req.formData();
        const userId = formData.get('userId') as string;
        const content = formData.get('content') as string;
        const imageFile = formData.get('image') as File | null;

        if (!userId || !content) {
            return NextResponse.json(
                { error: "Missing required fields: userId or content" },
                { status: 400 }
            );
        }

        let imageUrl = "";
        if (imageFile) {
            imageUrl = await uploadToCloudinary(imageFile);
        }

        const newPost = await Post.create({
            userId,
            content,
            image: imageUrl,
        });

        // Populate user info before returning
        const populatedPost = await Post.findById(newPost._id).populate("userId", "fullName username profileImage");

        return NextResponse.json(
            { message: "Post created successfully", data: populatedPost },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error creating post:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '5', 10);
        const skip = (page - 1) * limit;

        const session = await getServerSession(authOptions);
        let currentUserProfile = null;

        // Only fetch current user profile on the first page load to avoid redundant fetches
        if (session?.user && page === 1) {
            // @ts-ignore
            const userId = (session.user as any)._id;
            if (userId) {
                const user = await User.findById(userId).select("fullName username profileImage").lean();
                const profile = await Profile.findOne({ user: userId }).select("profilePicture headline followers following location links experience").lean();
                const projectsCount = await ProjectOrResearch.countDocuments({ userId: userId });

                const latestExperience = profile?.experience
                    ?.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                    .find(e => e.current) || profile?.experience?.[0];

                currentUserProfile = {
                    ...user,
                    profileImage: user?.profileImage,
                    profilePicture: profile?.profilePicture,
                    headline: profile?.headline,
                    followersCount: profile?.followers?.length || 0,
                    followingCount: profile?.following?.length || 0,
                    projectsCount: projectsCount,
                    location: profile?.location,
                    links: profile?.links,
                    latestExperience: latestExperience,
                };
            }
        }

        // To implement pagination across two collections, we first get sorted IDs
        const postMetas = await Post.find({}, '_id createdAt').lean();
        const projectMetas = await ProjectOrResearch.find({}, '_id createdAt').lean();

        const combinedMetas = [
            ...postMetas.map(p => ({ ...p, type: 'post' })),
            ...projectMetas.map(p => ({ ...p, type: 'project' }))
        ];

        // Shuffle combinedMetas for random combination
        for (let i = combinedMetas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [combinedMetas[i], combinedMetas[j]] = [combinedMetas[j], combinedMetas[i]];
        }

        const totalItems = combinedMetas.length;
        const paginatedMetas = combinedMetas.slice(skip, skip + limit);

        const postIdsToFetch = paginatedMetas.filter(m => m.type === 'post').map(m => m._id);
        const projectIdsToFetch = paginatedMetas.filter(m => m.type === 'project').map(m => m._id);

        // Fetch full documents for the current page
        const posts = postIdsToFetch.length > 0 ? await Post.find({ _id: { $in: postIdsToFetch } })
            .populate("userId", "fullName username profileImage")
            .populate("comments.userId", "fullName username profileImage")
            .lean() : [];

        const projects = projectIdsToFetch.length > 0 ? await ProjectOrResearch.find({ _id: { $in: projectIdsToFetch } })
            .populate("userId", "fullName username profileImage")
            .lean() : [];

        // Collect user IDs and fetch profiles to get profile pictures
        // This is necessary to get the most up-to-date profile pictures for users in the feed
        const userIds = new Set<string>();
        const collectIds = (items: any[]) => {
            items.forEach(item => {
                if (item.userId?._id) userIds.add(item.userId._id.toString());
                if (item.comments) {
                    item.comments.forEach((c: any) => {
                        if (c.userId?._id) userIds.add(c.userId._id.toString());
                    });
                }
            });
        };
        collectIds(posts);
        collectIds(projects);

        const profiles = await Profile.find({ user: { $in: Array.from(userIds) } }).select('user profilePicture').lean();
        const profileMap: Record<string, string> = {};
        profiles.forEach((p: any) => {
            if (p.user) profileMap[p.user.toString()] = p.profilePicture;
        });

        const attachImages = (items: any[]) => {
            items.forEach(item => {
                if (item.userId?._id) {
                    const uid = item.userId._id.toString();
                    if (profileMap[uid]) {
                        // Polyfill both fields to ensure frontend compatibility
                        item.userId.profileImage = profileMap[uid];
                        item.userId.profilePicture = profileMap[uid];
                    }
                }
                if (item.comments) {
                    item.comments.forEach((c: any) => {
                        if (c.userId?._id) {
                            const uid = c.userId._id.toString();
                            if (profileMap[uid]) {
                                c.userId.profileImage = profileMap[uid];
                                c.userId.profilePicture = profileMap[uid];
                            }
                        }
                    });
                }
            });
        };
        attachImages(posts);
        attachImages(projects);

        // Normalize and combine
        const combinedFeed = [
            ...posts.map((p: any) => ({ ...p, type: 'post' })),
            ...projects.map((p: any) => ({
                ...p,
                type: 'project',
                content: p.topic + (p.description ? "\n\n" + p.description : ""),
                image: p.coverImage,
                // comments is already present in projects from the DB
            }))
        ];

        // Shuffle combinedFeed to mix posts and projects
        for (let i = combinedFeed.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [combinedFeed[i], combinedFeed[j]] = [combinedFeed[j], combinedFeed[i]];
        }

        return NextResponse.json({
            data: combinedFeed,
            currentUserProfile,
            pagination: {
                hasMore: skip + combinedFeed.length < totalItems
            }
        }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching feed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { postId, userId, action, text } = body;

        if (!postId || !userId || !action) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        if (action === "like") {
            const index = post.likes.indexOf(userId);
            if (index > -1) {
                post.likes.splice(index, 1);
            } else {
                post.likes.push(userId);
            }
        } else if (action === "comment") {
            if (!text) return NextResponse.json({ error: "Comment text required" }, { status: 400 });
            post.comments.push({ userId, text, createdAt: new Date() });
        }

        await post.save();
        const updatedPost = await Post.findById(postId)
            .populate("userId", "fullName username profileImage")
            .populate("comments.userId", "fullName username profileImage");

        return NextResponse.json({ message: "Updated successfully", data: updatedPost }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}