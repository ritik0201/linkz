"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layout,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  MoreVertical,
  ArrowLeft,
  Loader2,
  Users,
  Link as LinkIcon,
  Image as ImageIcon,
  Trophy,
  Star,
  Video,
  Activity,
  AlertCircle,
} from "lucide-react";

interface Member {
  _id: string;
  fullName: string;
  username: string;
  profileImage?: string;
}

interface Task {
  _id: string;
  title: string;
  description?: string;
  assignedTo: string | Member; // ID or Populated Member
  status: "pending" | "in-progress" | "completed";
  dueDate?: string;
  qualityRating?: number;
  peerFeedback?: number;
  priority: "low" | "medium" | "high";
}

interface Meeting {
  _id: string;
  title: string;
  date: string;
  link: string;
  createdBy: Member;
}

interface ProjectData {
  _id: string;
  topic: string;
  description: string;
  coverImage?: string;
  link?: string;
  userId: string;
}

interface WorkspaceData {
  _id: string;
  name: string;
  description: string;
  members: Member[];
  tasks: Task[];
  meetings: Meeting[];
  projectId: ProjectData;
}

const WorkspacePage = () => {
  const params = useParams();
  const postId = params.postId as string;
  // const username = params.username as string; // Available if needed for navigation/breadcrumbs

  const { data: session } = useSession();
  const router = useRouter();
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
  const [loading, setLoading] = useState(true);

  // New Task State
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // New Meeting State
  const [newMeetingTitle, setNewMeetingTitle] = useState("");
  const [newMeetingDate, setNewMeetingDate] = useState("");
  const [newMeetingLink, setNewMeetingLink] = useState("");
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);

  const currentUserId = (session?.user as any)?._id as string | undefined;

  const isOwner =
    session?.user && (session.user as any)._id === workspace?.projectId?.userId;

  const fetchWorkspace = async () => {
    if (!postId) return;
    try {
      const res = await fetch(
        `/api/auth/ProjectOrResearch/${postId}/workspace`,
        { cache: "no-store" },
      );
      if (res.ok) {
        const data = await res.json();
        setWorkspace(data.workspace);
      } else {
        setWorkspace(null);
      }
    } catch (error) {
      console.error("Failed to fetch workspace", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspace();
  }, [postId]);

  const getPriorityWeight = (priority: string = "medium") => {
    const weights: { [key: string]: number } = { high: 20, medium: 10, low: 5 };
    return weights[priority] || 10;
  };

  const handleAddTask = async () => {
    if (!newTaskTitle || !newTaskAssignee) return;
    try {
      const res = await fetch(
        `/api/auth/ProjectOrResearch/${postId}/workspace`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "add_task",
            task: {
              title: newTaskTitle,
              description: newTaskDesc,
              assignedTo: newTaskAssignee,
              dueDate: newTaskDate,
              status: "pending",
              priority: newTaskPriority,
            },
          }),
        },
      );
      if (res.ok) {
        setIsTaskModalOpen(false);
        setNewTaskTitle("");
        setNewTaskDesc("");
        setNewTaskPriority("medium");
        fetchWorkspace();
      }
    } catch (error) {
      console.error("Error adding task", error);
    }
  };

  const handleAddMeeting = async () => {
    if (!newMeetingTitle || !newMeetingDate || !newMeetingLink) return;
    try {
      if (!currentUserId) {
        console.error("User ID missing from session");
        return;
      }

      const res = await fetch(
        `/api/auth/ProjectOrResearch/${postId}/workspace`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "add_meeting",
            meeting: {
              title: newMeetingTitle,
              date: newMeetingDate,
              link: newMeetingLink,
              createdBy: currentUserId,
            },
          }),
        },
      );
      if (res.ok) {
        setIsMeetingModalOpen(false);
        setNewMeetingTitle("");
        setNewMeetingDate("");
        setNewMeetingLink("");
        fetchWorkspace();
      }
    } catch (error) {
      console.error("Error adding meeting", error);
    }
  };

  const calculateReputation = (memberId: string) => {
    if (!workspace) return 0;
    const memberTasks = workspace.tasks.filter((t) => {
      const assigneeId =
        typeof t.assignedTo === "object"
          ? (t.assignedTo as Member)._id
          : (t.assignedTo as string);
      return assigneeId === memberId;
    });

    const completedTasks = memberTasks.filter((t) => t.status === "completed");

    // Formula: (Tasks Done x Weight) + (Quality Rating x Peer Feedback) + (Consistency x Frequency)
    const tasksDone = completedTasks.length;
    const tasksScore = completedTasks.reduce(
      (acc, t) => acc + getPriorityWeight(t.priority),
      0,
    );

    const totalQuality = completedTasks.reduce(
      (sum, t) => sum + (t.qualityRating || 0),
      0,
    );
    const qualityRating =
      tasksDone > 0 && totalQuality > 0 ? totalQuality / tasksDone : 4.5; // Default to 4.5 if no ratings yet

    const totalFeedback = completedTasks.reduce(
      (sum, t) => sum + (t.peerFeedback || 0),
      0,
    );
    const peerFeedback =
      tasksDone > 0 && totalFeedback > 0 ? totalFeedback / tasksDone : 1.2; // Default to 1.2 if no feedback yet

    const consistency = tasksDone > 0 ? 5 : 0; // Bonus for having activity
    const frequency = 1;

    return tasksScore + qualityRating * peerFeedback + consistency * frequency;
  };

  const calculateProjectHealth = () => {
    if (!workspace || workspace.tasks.length === 0) {
      return {
        status: "Not Started",
        color: "text-zinc-500",
        bgColor: "bg-zinc-900",
        borderColor: "border-zinc-800",
        reason: "No tasks created yet.",
      };
    }

    const totalTasks = workspace.tasks.length;
    const completedTasks = workspace.tasks.filter(
      (t) => t.status === "completed",
    ).length;
    const overdueTasks = workspace.tasks.filter((t) => {
      return (
        t.status !== "completed" && t.dueDate && new Date(t.dueDate) < new Date()
      );
    }).length;

    const completionRate = (completedTasks / totalTasks) * 100;

    if (overdueTasks > 0) {
      return {
        status: "At Risk",
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20",
        reason: `${overdueTasks} task${overdueTasks > 1 ? "s" : ""} overdue.`,
      };
    }

    if (completionRate < 30 && totalTasks > 3) {
      return {
        status: "Needs Attention",
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/20",
        reason: "Low task completion velocity.",
      };
    }

    if (completedTasks === totalTasks) {
      return {
        status: "Completed",
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/20",
        reason: "All tasks completed.",
      };
    }

    return {
      status: "On Track",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      reason: "Project progressing smoothly.",
    };
  };

  const calculateMemberProgress = (memberId: string) => {
    if (!workspace) return 0;
    const memberTasks = workspace.tasks.filter((t) => {
      const assigneeId =
        typeof t.assignedTo === "object"
          ? (t.assignedTo as Member)._id
          : (t.assignedTo as string);
      return assigneeId === memberId;
    });

    if (memberTasks.length === 0) return 0;

    const totalWeight = memberTasks.reduce(
      (acc, t) => acc + getPriorityWeight(t.priority),
      0,
    );
    const completedWeight = memberTasks
      .filter((t) => t.status === "completed")
      .reduce((acc, t) => acc + getPriorityWeight(t.priority), 0);
    return totalWeight === 0
      ? 0
      : Math.round((completedWeight / totalWeight) * 100);
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    // Restrict "approve" (completing tasks) for low reputation users
    if (newStatus === "completed") {
      const userScore = currentUserId ? calculateReputation(currentUserId) : 0;
      const APPROVAL_THRESHOLD = 20; // Minimum score required to approve

      if (!isOwner && userScore < APPROVAL_THRESHOLD) {
        alert(
          `Reputation Score (${userScore.toFixed(1)}) is too low to approve tasks. You need ${APPROVAL_THRESHOLD} points.`,
        );
        return;
      }
    }

    try {
      // Optimistic update
      setWorkspace((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          tasks: prev.tasks.map((t) =>
            t._id === taskId ? { ...t, status: newStatus as any } : t,
          ),
        };
      });

      await fetch(`/api/auth/ProjectOrResearch/${postId}/workspace`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_task_status",
          taskId,
          status: newStatus,
        }),
      });
    } catch (error) {
      console.error("Error updating task", error);
      fetchWorkspace(); // Revert on error
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-6">
        <div className="p-6 rounded-full bg-zinc-900 border border-zinc-800">
          <Layout size={48} className="text-zinc-500" />
        </div>
        <h1 className="text-2xl font-bold">Loading Workspace...</h1>
      </div>
    );
  }

  const health = calculateProjectHealth();
  const currentUserProgress = currentUserId ? calculateMemberProgress(currentUserId) : 0;

  const getMemberDetails = (id: string) =>
    workspace.members.find((m) => m._id === id);

  const TaskColumn = ({ title, status, icon: Icon, color }: any) => (
    <div className="flex-1 min-w-75 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-4 flex flex-col gap-4">
      <div
        className={`flex items-center gap-2 pb-3 border-b border-zinc-800 ${color}`}
      >
        <Icon size={18} />
        <h3 className="font-bold text-sm uppercase tracking-wider">{title}</h3>
        <span className="ml-auto text-xs bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-400">
          {workspace.tasks.filter((t) => t.status === status).length}
        </span>
      </div>
      <div className="flex flex-col gap-3 overflow-y-auto max-h-[60vh] custom-scrollbar pr-1">
        {workspace.tasks
          .filter((t) => t.status === status)
          .map((task) => {
            const assignee =
              typeof task.assignedTo === "object"
                ? (task.assignedTo as Member)
                : getMemberDetails(task.assignedTo as string);

            return (
              <motion.div
                layoutId={task._id}
                key={task._id}
                className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl hover:border-zinc-700 transition-colors group relative"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-zinc-200 text-sm leading-snug">
                    {task.title}
                  </h4>
                  <div className="relative">
                    <select
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                      value={task.status}
                      onChange={(e) =>
                        updateTaskStatus(task._id, e.target.value)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <MoreVertical
                      size={16}
                      className="text-zinc-500 hover:text-white cursor-pointer"
                    />
                  </div>
                </div>
                {task.description && (
                  <p className="text-xs text-zinc-500 mb-3 line-clamp-2">
                    {task.description}
                  </p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    {assignee ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={assignee.profileImage || "/user.png"}
                          alt={assignee.username}
                          className="w-6 h-6 rounded-full border border-zinc-700"
                          title={assignee.fullName}
                        />
                        <span className="text-xs text-zinc-400 truncate max-w-25">
                          {assignee.fullName}
                        </span>
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                        <Users size={12} className="text-zinc-500" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
      </div>
      {status === "pending" && isOwner && (
        <button
          onClick={() => setIsTaskModalOpen(true)}
          className="w-full py-2 border border-dashed border-zinc-700 rounded-xl text-zinc-500 text-sm hover:text-white hover:border-zinc-500 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add Task
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-10 px-4 md:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-500 hover:text-white mb-4 transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Back to Project
        </button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {workspace.projectId?.topic || workspace.name}
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
              {workspace.projectId?.description || workspace.description}
            </p>

            {/* Project Details */}
            <div className="flex items-center gap-4 mt-4">
              {workspace.projectId?.link && (
                <a
                  href={workspace.projectId.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-xs bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20 transition-colors"
                >
                  <LinkIcon size={12} /> Project Link
                </a>
              )}
              {workspace.projectId?.coverImage && (
                <div className="flex items-center gap-2 text-zinc-400 text-xs bg-zinc-800/50 px-3 py-1.5 rounded-full border border-zinc-700/50">
                  <ImageIcon size={12} /> Has Cover Image
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center -space-x-2">
            <span className="text-xs text-zinc-500 mr-3 font-medium uppercase tracking-wider hidden sm:inline">
              Team
            </span>
            {workspace.members.slice(0, 5).map((m, index) => (
              <img
                key={`${m._id}-${index}`}
                src={m.profileImage || "/user.png"}
                alt={m.username}
                className="w-10 h-10 rounded-full border-2 border-black object-cover"
                title={m.fullName}
              />
            ))}
            {workspace.members.length > 5 && (
              <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-black flex items-center justify-center text-zinc-400 font-bold text-xs">
                +{workspace.members.length - 5}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Health Monitor */}
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <Activity size={24} className="text-pink-500" /> Project Health Monitor
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Card */}
          <div
            className={`p-5 rounded-xl border ${health.borderColor} ${health.bgColor} flex flex-col justify-between`}
          >
            <div>
              <h3 className="text-zinc-400 text-xs uppercase font-bold tracking-wider mb-1">
                Current Status
              </h3>
              <span className={`text-2xl font-bold ${health.color}`}>
                {health.status}
              </span>
            </div>
            <p className="text-zinc-400 text-sm mt-2">{health.reason}</p>
          </div>

          {/* Metrics Card */}
          <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
            <h3 className="text-zinc-400 text-xs uppercase font-bold tracking-wider mb-3">
              Task Velocity
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-300">Completion Rate</span>
                <span className="text-sm font-bold text-white">
                  {Math.round(
                    ((workspace?.tasks.filter((t) => t.status === "completed")
                      .length || 0) /
                      (workspace?.tasks.length || 1)) *
                      100,
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-1.5">
                <div
                  className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round(
                      ((workspace?.tasks.filter((t) => t.status === "completed")
                        .length || 0) /
                        (workspace?.tasks.length || 1)) *
                        100,
                    )}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-zinc-500 pt-1">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>{" "}
                  {workspace?.tasks.filter((t) => t.status === "completed").length} Done
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>{" "}
                  {workspace?.tasks.filter((t) => t.status === "in-progress").length} In Prog
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-zinc-500"></div>{" "}
                  {workspace?.tasks.filter((t) => t.status === "pending").length} Pending
                </span>
              </div>
            </div>
          </div>

          {/* Overdue Card */}
          <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col">
            <h3 className="text-zinc-400 text-xs uppercase font-bold tracking-wider mb-3">
              Attention Needed
            </h3>
            <div className="flex-1 flex flex-col justify-center">
              {(() => {
                const overdue =
                  workspace?.tasks.filter(
                    (t) =>
                      t.status !== "completed" &&
                      t.dueDate &&
                      new Date(t.dueDate) < new Date(),
                  ) || [];
                if (overdue.length === 0) {
                  return (
                    <div className="flex items-center gap-2 text-emerald-500">
                      <CheckCircle2 size={20} />
                      <span className="font-medium">No overdue tasks</span>
                    </div>
                  );
                }
                return (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-red-500 mb-2">
                      <AlertCircle size={20} />
                      <span className="font-medium">
                        {overdue.length} Overdue Task
                        {overdue.length > 1 ? "s" : ""}
                      </span>
                    </div>
                    {overdue.slice(0, 2).map((t) => (
                      <div
                        key={t._id}
                        className="text-xs text-zinc-400 truncate pl-7 border-l border-zinc-800"
                      >
                        {t.title}
                      </div>
                    ))}
                    {overdue.length > 2 && (
                      <div className="text-xs text-zinc-500 pl-7">
                        +{overdue.length - 2} more
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Team Members List */}
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <Users size={24} className="text-indigo-400" /> Team Members
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {workspace.members.map((member, index) => {
            const progress = calculateMemberProgress(member._id);
            return (
              <div
                key={`${member._id}-${index}`}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-4 hover:border-zinc-700 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={member.profileImage || "/user.png"}
                    alt={member.fullName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-zinc-700 group-hover:border-indigo-500 transition-colors"
                  />
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-white truncate">
                      {member.fullName}
                    </h3>
                    <p className="text-sm text-zinc-400 truncate">
                      @{member.username}
                    </p>
                  </div>
                </div>

                <div className="w-full">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                      Task Progress
                    </span>
                    <span className="text-xs text-indigo-400 font-bold">
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          {/* {isOwner && (
            <button className="bg-zinc-900/50 border border-dashed border-zinc-700 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-indigo-500 hover:text-indigo-400 text-zinc-500 transition-all duration-300">
              <Plus size={24} />
              <span className="text-sm font-medium">Add Member</span>
            </button>
          )} */}
        </div>
      </div>

      {/* Meetings Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Video size={24} className="text-red-500" /> Scheduled Meetings
          </h2>
          {isOwner && (
            <button
              onClick={() => setIsMeetingModalOpen(true)}
              className="flex items-center gap-2 text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-full transition-colors text-zinc-300"
            >
              <Plus size={14} /> Schedule Meeting
            </button>
          )}
        </div>

        {workspace.meetings && workspace.meetings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspace.meetings
              .sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime(),
              )
              .map((meeting) => (
                <div
                  key={meeting._id}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-4 hover:border-zinc-700 transition-all shadow-sm group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-white text-lg leading-tight">
                        {meeting.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-zinc-500">Host:</span>
                        <div className="flex items-center gap-1.5 bg-zinc-800/50 px-2 py-1 rounded-full">
                          <img
                            src={meeting.createdBy?.profileImage || "/user.png"}
                            alt={meeting.createdBy?.username || "User"}
                            className="w-4 h-4 rounded-full object-cover"
                          />
                          <span className="text-xs text-zinc-300 font-medium">
                            {meeting.createdBy?.fullName || "Unknown"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-indigo-500/10 p-2 rounded-lg">
                      <Video size={20} className="text-indigo-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black border border-zinc-800 rounded-lg p-2 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                        Date
                      </span>
                      <span className="text-sm text-zinc-200 font-medium">
                        {new Date(meeting.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="bg-black border border-zinc-800 rounded-lg p-2 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                        Time
                      </span>
                      <span className="text-sm text-zinc-200 font-medium">
                        {new Date(meeting.date).toLocaleTimeString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto pt-2">
                    {!isOwner && currentUserProgress < 25 ? (
                      <button
                        disabled
                        className="flex items-center justify-center gap-2 w-full bg-zinc-800 text-zinc-500 font-bold py-2.5 rounded-lg cursor-not-allowed text-sm"
                        title="You need at least 25% task progress to join meetings."
                      >
                        Locked ({currentUserProgress}%) <LinkIcon size={14} />
                      </button>
                    ) : (
                      <a
                        href={meeting.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-white text-black hover:bg-zinc-200 font-bold py-2.5 rounded-lg transition-colors text-sm"
                      >
                        Join Meeting <LinkIcon size={14} />
                      </a>
                    )}
                    {(isOwner || currentUserProgress >= 25) && (
                      <p className="text-[10px] text-zinc-600 text-center mt-2 truncate font-mono select-all cursor-text">
                        {meeting.link}
                      </p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-zinc-500 text-sm italic">
            No meetings scheduled yet.
          </div>
        )}
      </div>

      {/* Reputation Leaderboard */}
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <Trophy size={24} className="text-yellow-500" /> Reputation
          Leaderboard
        </h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex flex-col gap-3">
            {workspace.members
              // Filter unique members to avoid duplicates in leaderboard
              .filter(
                (m, index, self) =>
                  index === self.findIndex((t) => t._id === m._id),
              )
              .map((m) => ({
                ...m,
                score: calculateReputation(m._id),
                progress: calculateMemberProgress(m._id),
              }))
              .sort((a, b) => {
                const scoreDiff = b.score - a.score;
                if (scoreDiff !== 0) return scoreDiff;
                return b.progress - a.progress;
              })
              .map((member, index) => (
                <div
                  key={`leaderboard-${member._id}`}
                  className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-zinc-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 flex items-center justify-center font-bold text-zinc-500">
                      #{index + 1}
                    </div>
                    <img
                      src={member.profileImage || "/user.png"}
                      alt={member.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-zinc-200">
                      {member.fullName}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                        Progress
                      </span>
                      <span
                        className={`text-xs font-bold ${member.progress === 100 ? "text-green-400" : "text-indigo-400"}`}
                      >
                        {member.progress}%
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1 min-w-15">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                        Score
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Star
                          size={14}
                          className="text-yellow-500 fill-yellow-500"
                        />
                        <span className="text-sm font-bold text-white">
                          {member.score.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 overflow-x-auto pb-4">
        <TaskColumn
          title="To Do"
          status="pending"
          icon={Circle}
          color="text-zinc-400"
        />
        <TaskColumn
          title="In Progress"
          status="in-progress"
          icon={Clock}
          color="text-indigo-400"
        />
        <TaskColumn
          title="Completed"
          status="completed"
          icon={CheckCircle2}
          color="text-green-400"
        />
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {isTaskModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <h2 className="text-xl font-bold mb-4">Add New Task</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Task Title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none"
                />
                <textarea
                  placeholder="Description (optional)"
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none h-24 resize-none"
                />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none text-zinc-400"
                  >
                    <option value="">Assign to...</option>
                    {workspace.members.map((m, index) => (
                      <option key={`${m._id}-${index}`} value={m._id}>
                        {m.fullName}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={newTaskDate}
                    onChange={(e) => setNewTaskDate(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none text-zinc-400"
                  />
                </div>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none text-zinc-400"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setIsTaskModalOpen(false)}
                    className="flex-1 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddTask}
                    className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-sm font-medium transition-colors"
                  >
                    Create Task
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Meeting Modal */}
      <AnimatePresence>
        {isMeetingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <h2 className="text-xl font-bold mb-4">Schedule New Meeting</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Meeting Title"
                  value={newMeetingTitle}
                  onChange={(e) => setNewMeetingTitle(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none"
                />
                <input
                  type="datetime-local"
                  value={newMeetingDate}
                  onChange={(e) => setNewMeetingDate(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none text-zinc-400"
                />
                <input
                  type="text"
                  placeholder="Meeting Link (Zoom, Google Meet, etc.)"
                  value={newMeetingLink}
                  onChange={(e) => setNewMeetingLink(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none"
                />
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setIsMeetingModalOpen(false)}
                    className="flex-1 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddMeeting}
                    className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-sm font-medium transition-colors"
                  >
                    Schedule
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkspacePage;
