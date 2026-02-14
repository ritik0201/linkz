import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Project from "@/models/projectOrResearch";
import { createWorkLog } from "@/lib/createWorkLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// =====================
// GET: Fetch team members
// =====================
export async function GET(
  req: Request,
  { params }: { params: { projectSlug: string } },
) {
  try {
    await dbConnect();

    const project = await Project.findOne({
      slug: params.projectSlug,
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const members = project.teamMembers.map((id: string) => ({
      id,
      approved: project.approvedMembers.includes(id),
    }));

    return NextResponse.json({ members });
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 },
    );
  }
}

// =====================
// POST: Approve or remove member
// =====================
export async function POST(
  req: Request,
  { params }: { params: { projectSlug: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      if (process.env.NODE_ENV !== "production") {
        // helpful dev-only diagnostic when API returns 401
        console.warn(
          "Unauthorized request to /api/workspace/team/:projectSlug — no session. cookies:",
          req.headers.get("cookie"),
        );
      }
      return NextResponse.json(
        { error: "Unauthorized - no session" },
        { status: 401 },
      );
    }

    const { action, userId } = await req.json();

    await dbConnect();

    const project = await Project.findOne({
      slug: params.projectSlug,
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (action === "approve") {
      if (!project.approvedMembers.includes(userId)) {
        project.approvedMembers.push(userId);
      }
    }

    if (action === "remove") {
      project.approvedMembers = project.approvedMembers.filter(
        (id: string) => id !== userId,
      );
    }

    await project.save();

    await createWorkLog({
      projectId: project._id.toString(),
      title:
        action === "approve" ? "Approved team member" : "Removed team member",
    });

    return NextResponse.json({
      members: project.teamMembers.map((id: string) => ({
        id,
        approved: project.approvedMembers.includes(id),
      })),
    });
  } catch (error) {
    console.error("Error updating team:", error);
    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 },
    );
  }
}
