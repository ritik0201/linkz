import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Project from "@/models/projectOrResearch";
import { createWorkLog } from "@/lib/createWorkLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET: Fetch team members
export async function GET(
  req: Request,
  props: { params: Promise<{ projectId: string }> },
) {
  const params = await props.params;
  try {
    await dbConnect();

    const project = await Project.findById(params.projectId);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Return all members with approval status
    const members = project.teamMembers.map((id) => ({
      id,
      approved: project.approvedMembers.includes(id),
    }));

    return NextResponse.json({ members });
  } catch (err) {
    console.error("Error fetching team:", err);
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 },
    );
  }
}

// POST: Approve or remove a member
export async function POST(
  req: Request,
  props: { params: Promise<{ projectId: string }> },
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, userId } = await req.json();

    await dbConnect();
    const project = await Project.findById(params.projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (action === "approve") {
      if (!project.approvedMembers.includes(userId)) {
        project.approvedMembers.push(userId);
      }
    } else if (action === "remove") {
      project.approvedMembers = project.approvedMembers.filter(
        (id) => id !== userId,
      );
    }

    await project.save();

    // Optional: Create a work log
    await createWorkLog({
      projectId: params.projectId,
      title: `${action === "approve" ? "Approved" : "Removed"} team member`,
    });

    return NextResponse.json({
      members: project.teamMembers.map((id) => ({
        id,
        approved: project.approvedMembers.includes(id),
      })),
    });
  } catch (err) {
    console.error("Error updating team:", err);
    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 },
    );
  }
}
