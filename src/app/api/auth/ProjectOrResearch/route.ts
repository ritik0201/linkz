import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProjectOrResearch from "@/models/projectOrResearch";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { userId, topic, coverImage, teamMembers, description, category, link } = body;

    if (!userId || !topic || !coverImage) {
      return NextResponse.json(
        { error: "Missing required fields: userId, topic, or coverImage" },
        { status: 400 }
      );
    }

    const newEntry = await ProjectOrResearch.create({
      userId,
      topic,
      coverImage,
      teamMembers,
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
    const data = await ProjectOrResearch.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
