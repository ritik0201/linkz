import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import ChatMessage from "@/models/ChatMessage";

// GET: Fetch messages for a project
export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } },
) {
  try {
    await dbConnect();

    const messages = await ChatMessage.find({
      projectId: params.projectId,
    })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json(messages);
  } catch (error) {
    console.error("GET CHAT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}

// POST: Send a new message
export async function POST(
  req: NextRequest,
  { params }: { params: { projectId: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message } = await req.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const newMessage = await ChatMessage.create({
      projectId: params.projectId,
      senderId: session.user.id,
      senderName: session.user.name || "Anonymous",
      message,
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error("POST CHAT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
