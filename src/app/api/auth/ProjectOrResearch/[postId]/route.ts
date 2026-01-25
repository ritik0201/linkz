import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProjectOrResearch from "@/models/projectOrResearch";
import User from "@/models/User";

export async function GET(req: Request, props: { params: Promise<{ postId: string }> }) {
  try {
    await dbConnect();
    const params = await props.params;
    const { postId } = params;

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const project = await ProjectOrResearch.findById(postId)
      .populate({ path: "userId", model: User, select: "fullName username profileImage headline" });

    if (!project) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: project }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}