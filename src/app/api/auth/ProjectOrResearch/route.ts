import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProjectOrResearch from "@/models/projectOrResearch";
import User from "@/models/User";
import Profile from "@/models/Profile";
import cloudinary from "@/lib/cloudinary";

// Helper to upload to Cloudinary
async function uploadToCloudinary(file: File): Promise<string> {
    const fileBuffer = await file.arrayBuffer();
    const mime = file.type;
    const encoding = 'base64';
    const base64Data = Buffer.from(fileBuffer).toString('base64');
    const fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;

    const result = await cloudinary.uploader.upload(fileUri, {
        folder: 'linkz_projects'
    });

    return result.secure_url;
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const userId = formData.get('userId') as string;
    const topic = formData.get('topic') as string;
    const coverImageFile = formData.get('coverImage') as File | null;
    const teamMembers = formData.get('teamMembers') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as "project" | "research";
    const link = formData.get('link') as string;

    if (!userId || !topic || !coverImageFile) {
      return NextResponse.json(
        { error: "Missing required fields: userId, topic, or coverImage" },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary
    const coverImageUrl = await uploadToCloudinary(coverImageFile);

    const slug = topic
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newEntry = await ProjectOrResearch.create({
      userId: userId,
      topic,
      slug,
      coverImage: coverImageUrl,
      teamMembers: teamMembers ? teamMembers.split(',').map(s => s.trim()) : [],
      description,
      category,
      link,
    });

    return NextResponse.json(
      { message: "Created successfully", data: newEntry },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating project/research:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get('userid');

    if (!userIdParam) {
      return NextResponse.json({ error: "userid is required" }, { status: 400 });
    }

    let user = await User.findOne({ username: userIdParam });
    if (!user && /^[0-9a-fA-F]{24}$/.test(userIdParam)) {
      user = await User.findById(userIdParam);
    }

    if (!user) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    // Fetch profile to get profilePicture
    const profile = await Profile.findOne({ user: user._id }).select("profilePicture");

    const posts = await ProjectOrResearch.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .populate({ path: "userId", model: User, select: "fullName username profileImage" })
      .lean();

    const data = posts.map((post: any) => {
      if (post.userId && profile?.profilePicture) {
        post.userId.profileImage = profile.profilePicture;
        post.userId.profilePicture = profile.profilePicture;
      }
      return post;
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { postId, username, action, targetUser, text } = body;

    if (!postId || !action) {
      return NextResponse.json({ error: "Missing required fields: postId or action" }, { status: 400 });
    }

    const project = await ProjectOrResearch.findById(postId);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Ensure slug exists before saving, as it is required by schema
    if (!project.slug) {
      project.slug = (project.topic || "untitled")
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    if (action === "like") {
      if (!username) return NextResponse.json({ error: "Username required for like" }, { status: 400 });
      if (!project.likes) project.likes = [];
      if (project.likes.includes(username)) {
        project.likes = project.likes.filter((u: string) => u !== username);
      } else {
        project.likes.push(username);
      }
    } else if (action === "interested") {
      if (!username) return NextResponse.json({ error: "Username required for interested" }, { status: 400 });
      if (!project.interested) project.interested = [];
      if (project.interested.includes(username)) {
        project.interested = project.interested.filter((u: string) => u !== username);
      } else {
        project.interested.push(username);
      }
    } else if (action === "approve") {
      if (!targetUser) return NextResponse.json({ error: "Target user required for approval" }, { status: 400 });
      
      if (!project.interested) project.interested = [];
      if (!project.teamMembers) project.teamMembers = [];

      // Remove from interested
      project.interested = project.interested.filter((u: string) => u !== targetUser);
      
      // Add to teamMembers
      if (!project.teamMembers.includes(targetUser)) {
        project.teamMembers.push(targetUser);
      }
    } else if (action === "comment") {
      if (!username || !text) return NextResponse.json({ error: "Username and text required for comment" }, { status: 400 });
      if (!project.comments) project.comments = [];
      project.comments.push({ username, text, createdAt: new Date() });
    }

    await project.save();
    return NextResponse.json({ message: "Updated successfully", data: project }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: "Missing postId" }, { status: 400 });
    }

    const deletedProject = await ProjectOrResearch.findByIdAndDelete(postId);

    if (!deletedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
