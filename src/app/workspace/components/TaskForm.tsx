"use client";

import React, { useState } from "react";
import { createWorkLog } from "@/lib/createWorkLog";

interface TaskFormProps {
  projectId: string;
  onTaskAdded?: () => void; // callback to refetch logs
}

export default function TaskForm({ projectId, onTaskAdded }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      // 1️⃣ Save task to DB (if you have a Tasks collection)
      // Example: await fetch(`/api/workspace/tasks/${projectId}`, { method: "POST", body: JSON.stringify({ title }) });

      // 2️⃣ Create log entry
      await createWorkLog({
        projectId,
        title: `Added a new task: ${title}`,
        description: "Task added via TaskForm",
      });

      // 3️⃣ Clear input
      setTitle("");

      // 4️⃣ Notify parent to refetch logs
      if (onTaskAdded) onTaskAdded();
    } catch (err) {
      console.error("Failed to add task:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-center mt-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task title..."
        className="flex-1 bg-[#0B0D16] border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading}
        className={`bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg text-sm font-medium transition ${
          loading ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}
