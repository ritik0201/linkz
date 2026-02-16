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
}

interface ProjectData {
  _id: string;
  topic: string;
  description: string;
  coverImage?: string;
  link?: string;
}

interface WorkspaceData {
  _id: string;
  name: string;
  description: string;
  members: Member[];
  tasks: Task[];
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
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const fetchWorkspace = async () => {
    if (!postId) return;
    try {
      const res = await fetch(`/api/auth/ProjectOrResearch/${postId}/workspace`);
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

  const handleAddTask = async () => {
    if (!newTaskTitle || !newTaskAssignee) return;
    try {
      const res = await fetch(`/api/auth/ProjectOrResearch/${postId}/workspace`, {
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
          },
        }),
      });
      if (res.ok) {
        setIsTaskModalOpen(false);
        setNewTaskTitle("");
        setNewTaskDesc("");
        fetchWorkspace();
      }
    } catch (error) {
      console.error("Error adding task", error);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      // Optimistic update
      setWorkspace((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          tasks: prev.tasks.map((t) =>
            t._id === taskId ? { ...t, status: newStatus as any } : t
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

  const getMemberDetails = (id: string) => workspace.members.find((m) => m._id === id);

  const TaskColumn = ({ title, status, icon: Icon, color }: any) => (
    <div className="flex-1 min-w-[300px] bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-4 flex flex-col gap-4">
      <div className={`flex items-center gap-2 pb-3 border-b border-zinc-800 ${color}`}>
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
            const assignee = typeof task.assignedTo === 'object' 
              ? (task.assignedTo as Member) 
              : getMemberDetails(task.assignedTo as string);

            return (
              <motion.div
                layoutId={task._id}
                key={task._id}
                className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl hover:border-zinc-700 transition-colors group relative"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-zinc-200 text-sm leading-snug">{task.title}</h4>
                  <div className="relative">
                    <select
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <MoreVertical size={16} className="text-zinc-500 hover:text-white cursor-pointer" />
                  </div>
                </div>
                {task.description && <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{task.description}</p>}
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
                        <span className="text-xs text-zinc-400 truncate max-w-[100px]">{assignee.fullName}</span>
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                        <Users size={12} className="text-zinc-500" />
                      </div>
                    )}
                    {task.dueDate && (
                      <div className="flex items-center gap-1 text-[10px] text-zinc-500 bg-zinc-800/50 px-1.5 py-0.5 rounded">
                        <Calendar size={10} />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
      </div>
      {status === "pending" && (
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
        <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-500 hover:text-white mb-4 transition-colors text-sm">
          <ArrowLeft size={16} /> Back to Project
        </button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {workspace.projectId?.topic || workspace.name}
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl">{workspace.projectId?.description || workspace.description}</p>
            
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
            <span className="text-xs text-zinc-500 mr-3 font-medium uppercase tracking-wider hidden sm:inline">Team</span>
            {workspace.members.slice(0, 5).map((m) => (
              <img
                key={m._id}
                src={m.profileImage || "/user.png"}
                alt={m.username}
                className="w-10 h-10 rounded-full border-2 border-black object-cover"
                title={m.fullName}
              />
            ))}
            {workspace.members.length > 5 && (
                 <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-black flex items-center justify-center text-zinc-400 font-bold text-xs">+{workspace.members.length - 5}</div>
            )}
          </div>

        </div>
      </div>

      {/* Team Members List */}
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3"><Users size={24} className="text-indigo-400" /> Team Members</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {workspace.members.map((member) => (
            <div key={member._id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-4 hover:border-zinc-700 transition-colors group">
              <img src={member.profileImage || '/user.png'} alt={member.fullName} className="w-12 h-12 rounded-full object-cover border-2 border-zinc-700 group-hover:border-indigo-500 transition-colors" />
              <div className="overflow-hidden">
                <h3 className="font-bold text-white truncate">{member.fullName}</h3>
                <p className="text-sm text-zinc-400 truncate">@{member.username}</p>
              </div>
            </div>
          ))}
           <button className="bg-zinc-900/50 border border-dashed border-zinc-700 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-indigo-500 hover:text-indigo-400 text-zinc-500 transition-all duration-300">
              <Plus size={24} />
              <span className="text-sm font-medium">Add Member</span>
            </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 overflow-x-auto pb-4">
        <TaskColumn title="To Do" status="pending" icon={Circle} color="text-zinc-400" />
        <TaskColumn title="In Progress" status="in-progress" icon={Clock} color="text-indigo-400" />
        <TaskColumn title="Completed" status="completed" icon={CheckCircle2} color="text-green-400" />
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
                    {workspace.members.map((m) => (
                      <option key={m._id} value={m._id}>{m.fullName}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={newTaskDate}
                    onChange={(e) => setNewTaskDate(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none text-zinc-400"
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setIsTaskModalOpen(false)} className="flex-1 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm font-medium transition-colors">Cancel</button>
                  <button onClick={handleAddTask} className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-sm font-medium transition-colors">Create Task</button>
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