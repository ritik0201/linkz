import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Workspace from "@/models/workspace";
import ProjectOrResearch from "@/models/projectOrResearch";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

const getPriorityWeight = (priority: string = "medium") => {
  const weights: { [key: string]: number } = { high: 20, medium: 10, low: 5 };
  return weights[priority] || 10;
};

export async function GET(
  req: Request,
  context: { params: Promise<{ postId: string }> },
) {
  try {
    await dbConnect();
    const { postId } = await context.params;
    const projectId = postId;

    // Fetch project to get team members
    const project: any = await ProjectOrResearch.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Resolve team members (usernames or IDs) to User IDs
    let memberIds: string[] = [];
    if (project.teamMembers && Array.isArray(project.teamMembers)) {
      const validObjectIds = project.teamMembers.filter((m: any) =>
        /^[0-9a-fA-F]{24}$/.test(m.toString()),
      );

      const users = await User.find({
        $or: [
          { username: { $in: project.teamMembers } },
          { _id: { $in: validObjectIds } },
        ],
      }).select("_id");
      memberIds = users.map((u) => u._id.toString());
    }
    if (project.userId) {
      memberIds.push(project.userId.toString());
    }

    // Deduplicate
    memberIds = [...new Set(memberIds)];

    let workspace = await Workspace.findOne({ projectId });

    if (!workspace) {
      workspace = await Workspace.create({
        name: project.topic,
        description: project.description,
        projectId: project._id,
        createdBy: project.userId,
        members: memberIds,
        tasks: [],
        meetings: [],
      });
    } else {
      // Sync members: Add any missing team members to the workspace
      await Workspace.updateOne(
        { _id: workspace._id },
        { $addToSet: { members: { $each: memberIds } } },
      );
    }

    const populatedWorkspace = await Workspace.findById(workspace._id)
      .populate({
        path: "members",
        select: "fullName username profileImage email",
        strictPopulate: false,
      })
      .populate({
        path: "tasks.assignedTo",
        select: "fullName username profileImage",
        strictPopulate: false,
      })
      .populate({
        path: "meetings.createdBy",
        select: "fullName username profileImage",
        strictPopulate: false,
      })
      .populate({
        path: "createdBy",
        select: "fullName username profileImage",
        strictPopulate: false,
      })
      .populate({ path: "projectId", strictPopulate: false });

    if (!populatedWorkspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 },
      );
    }

    const totalWeight = populatedWorkspace.tasks.reduce(
      (acc: number, t: any) => acc + getPriorityWeight(t.priority),
      0,
    );
    const completedWeight = populatedWorkspace.tasks
      .filter((t: any) => t.status === "completed")
      .reduce((acc: number, t: any) => acc + getPriorityWeight(t.priority), 0);
    const progress =
      totalWeight === 0 ? 0 : Math.round((completedWeight / totalWeight) * 100);
    const workspaceData = { ...populatedWorkspace.toObject(), progress };

    return NextResponse.json({ workspace: workspaceData }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching workspace:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ postId: string }> },
) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // @ts-ignore
    const currentUserId = session.user._id;
    const { postId } = await context.params;
    const projectId = postId;
    const body = await req.json();
    const { action, task, taskId, status } = body;

    const workspace = await Workspace.findOne({ projectId });
    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 },
      );
    }

    if (action === "add_task") {
      workspace.tasks.push(task);
    } else if (action === "add_meeting" && body.meeting) {
      // Verify ownership: Only project owner can schedule meetings
      const project = await ProjectOrResearch.findById(projectId);
      if (!project) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 },
        );
      }
      if (project.userId.toString() !== currentUserId.toString()) {
        return NextResponse.json(
          { error: "Only project owner can schedule meetings" },
          { status: 403 },
        );
      }

      if (!workspace.meetings) {
        workspace.meetings = [] as any;
      }
      // Ensure createdBy is set to the current user (owner)
      const meetingData = { ...body.meeting, createdBy: currentUserId };
      workspace.meetings.push(meetingData);
    } else if (action === "update_task_status") {
      const taskItem = workspace.tasks.id(taskId);
      if (taskItem) {
        taskItem.status = status;
      }
    } else if (action === "delete_task") {
      workspace.tasks.pull({ _id: taskId });
    }

    await workspace.save();

    const populatedWorkspace = await Workspace.findById(workspace._id)
      .populate({
        path: "members",
        select: "fullName username profileImage email",
        strictPopulate: false,
      })
      .populate({
        path: "tasks.assignedTo",
        select: "fullName username profileImage",
        strictPopulate: false,
      })
      .populate({
        path: "meetings.createdBy",
        select: "fullName username profileImage",
        strictPopulate: false,
      })
      .populate({
        path: "createdBy",
        select: "fullName username profileImage",
        strictPopulate: false,
      })
      .populate({ path: "projectId", strictPopulate: false });

    if (!populatedWorkspace) {
      return NextResponse.json(
        { error: "Workspace not found after update" },
        { status: 404 },
      );
    }

    const totalWeight = populatedWorkspace.tasks.reduce(
      (acc: number, t: any) => acc + getPriorityWeight(t.priority),
      0,
    );
    const completedWeight = populatedWorkspace.tasks
      .filter((t: any) => t.status === "completed")
      .reduce((acc: number, t: any) => acc + getPriorityWeight(t.priority), 0);
    const progress =
      totalWeight === 0 ? 0 : Math.round((completedWeight / totalWeight) * 100);
    const workspaceData = { ...populatedWorkspace.toObject(), progress };

    return NextResponse.json({ workspace: workspaceData }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating workspace:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ postId: string }> },
) {
  try {
    await dbConnect();
    const { postId } = await context.params;
    const projectId = postId;
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const project = await ProjectOrResearch.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const existingWorkspace = await Workspace.findOne({ projectId });
    if (existingWorkspace) {
      return NextResponse.json(
        { error: "Workspace already exists", workspace: existingWorkspace },
        { status: 409 },
      );
    }

    const newWorkspace = await Workspace.create({
      name: project.topic,
      description: project.description,
      projectId: project._id,
      createdBy: userId,
      members: [userId],
      tasks: [],
      meetings: [],
    });

    return NextResponse.json(
      { message: "Workspace created", workspace: newWorkspace },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
