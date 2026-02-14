import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Task from "@/models/Task"; // create this if you don’t have it
import { createWorkLog } from "@/lib/createWorkLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description } = await req.json();
  await dbConnect();

  const task = await Task.create({
    projectId: params.projectId,
    userId: session.user.id,
    title,
    description,
  });

  // Create log automatically
  await createWorkLog({
    projectId: params.projectId,
    title: `Added a new task: ${title}`,
    description: description || "",
  });

  return NextResponse.json({ task });
}
