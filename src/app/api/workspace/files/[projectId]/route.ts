import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UploadedFile from "@/models/UploadedFile"; // create this model
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

  const { filename, fileUrl } = await req.json();
  await dbConnect();

  const file = await UploadedFile.create({
    projectId: params.projectId,
    userId: session.user.id,
    filename,
    fileUrl,
  });

  // Create log
  await createWorkLog({
    projectId: params.projectId,
    title: `Uploaded file: ${filename}`,
  });

  return NextResponse.json({ file });
}
