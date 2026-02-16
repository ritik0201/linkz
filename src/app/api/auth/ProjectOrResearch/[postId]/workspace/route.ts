import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Workspace from "@/models/workspace";
import ProjectOrResearch from "@/models/projectOrResearch";
import User from "@/models/User";

export async function GET(
  req: Request,
  context: { params: Promise<{ postId: string }> }
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

    // Resolve team members (usernames) to User IDs
    let memberIds: any[] = [];
    if (project.teamMembers && Array.isArray(project.teamMembers)) {
      const users = await User.find({ username: { $in: project.teamMembers } }).select("_id");
      memberIds = users.map((u) => u._id);
    }
    if (project.userId) {
      memberIds.push(project.userId);
    }

    let workspace = await Workspace.findOne({ projectId });

    if (!workspace) {
      workspace = await Workspace.create({
        name: project.topic,
        description: project.description,
        projectId: project._id,
        createdBy: project.userId,
        members: [...new Set(memberIds)],
        tasks: [],
      });
    } else {
      // Sync members: Add any missing team members to the workspace
      await Workspace.updateOne(
        { _id: workspace._id },
        { $addToSet: { members: { $each: memberIds } } }
      );
    }

    const populatedWorkspace = await Workspace.findById(workspace._id)
      .populate("members", "fullName username profileImage email")
      .populate("tasks.assignedTo", "fullName username profileImage")
      .populate("createdBy", "fullName username profileImage")
      .populate("projectId");

    return NextResponse.json({ workspace: populatedWorkspace }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching workspace:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    await dbConnect();
    const { postId } = await context.params;
    const projectId = postId;
    const body = await req.json();
    const { action, task, taskId, status } = body;

    const workspace = await Workspace.findOne({ projectId });
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    if (action === "add_task") {
      workspace.tasks.push(task);
    } else if (action === "update_task_status") {
      const taskItem = workspace.tasks.id(taskId);
      if (taskItem) {
        taskItem.status = status;
      }
    } else if (action === "delete_task") {
      workspace.tasks.pull({ _id: taskId });
    }

    await workspace.save();
    return NextResponse.json({ workspace }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ postId: string }> }
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
        { status: 400 }
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
        { status: 409 }
      );
    }

    const newWorkspace = await Workspace.create({
      name: project.topic,
      description: project.description,
      projectId: project._id,
      createdBy: userId,
      members: [userId],
      tasks: [],
    });

    return NextResponse.json({ message: "Workspace created", workspace: newWorkspace }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}