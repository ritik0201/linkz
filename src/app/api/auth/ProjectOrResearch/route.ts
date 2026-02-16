import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProjectOrResearch from "@/models/projectOrResearch";
import User from "@/models/User";

// GET handler for fetching posts by user or team membership
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get("userid");
    const teamMemberParam = searchParams.get("teamMember");

    let query: any = {};

    if (userIdParam) {
      const user = await User.findOne({ username: userIdParam }).select("_id");
      if (user) {
        query.userId = user._id;
      } else {
        return NextResponse.json({ success: true, data: [] });
      }
    }

    // Find posts where the user is listed as a team member
    if (teamMemberParam) {
      query.teamMembers = teamMemberParam;
    }

    const posts = await ProjectOrResearch.find(query)
      .populate("userId", "fullName username profileImage headline")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: posts });
  } catch (error: any) {
    console.error("Error fetching projects/research:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST handler for creating a new post
export async function POST(req: Request) {
    try {
        await dbConnect();
        const formData = await req.formData();
        
        const postData: any = {};
        formData.forEach((value, key) => {
            postData[key] = value;
        });

        const newPost = await ProjectOrResearch.create(postData);
        return NextResponse.json({ success: true, data: newPost }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// PATCH handler for likes/interested
export async function PATCH(req: Request) {
    try {
        await dbConnect();
        const { postId, action, username } = await req.json();

        if (!postId || !action || !username) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        const fieldToUpdate = action === 'like' ? 'likes' : 'interested';
        const post = await ProjectOrResearch.findById(postId);

        if (!post) {
            return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
        }

        const list = post[fieldToUpdate] || [];
        const userIndex = list.indexOf(username);

        if (userIndex > -1) {
            list.splice(userIndex, 1); // Unlike or uninterested
        } else {
            list.push(username); // Like or interested
        }

        post[fieldToUpdate] = list;
        await post.save();

        return NextResponse.json({ success: true, data: post });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// DELETE handler for deleting a post
export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const postId = searchParams.get("postId");

        if (!postId) {
            return NextResponse.json({ success: false, error: "Post ID is required" }, { status: 400 });
        }

        await ProjectOrResearch.findByIdAndDelete(postId);

        return NextResponse.json({ success: true, message: "Post deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}