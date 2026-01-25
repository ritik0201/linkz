import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";
import User from "@/models/User";
import cloudinary from "@/lib/cloudinary";

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

import ProjectOrResearch from "@/models/projectOrResearch";

export async function GET() {
    try {
        await dbConnect();

        // Fetch Posts
        const posts = await Post.find({})
            .populate("userId", "fullName username profileImage")
            .populate("comments.userId", "fullName username profileImage")
            .lean();

        // Fetch ProjectOrResearch entries
        const projects = await ProjectOrResearch.find({})
            .populate("userId", "fullName username profileImage")
            .lean();

        // Normalize and combine
        const combinedFeed = [
            ...posts.map((p: any) => ({ ...p, type: 'post' })),
            ...projects.map((p: any) => ({
                ...p,
                type: 'project',
                content: p.topic + (p.description ? "\n\n" + p.description : ""),
                image: p.coverImage,
                comments: [] // Projects don't have comments in the current model
            }))
        ];

        // Sort by newest first
        combinedFeed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json({ data: combinedFeed }, { status: 200 });
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
