"use client";

import React from "react";

import { Bell, CheckCircle, MessageSquare, Users, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ICON_MAP = {
  invite: Users,
  message: MessageSquare,
  update: CheckCircle,
};

type NotificationType = keyof typeof ICON_MAP;

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "invite",
      title: "Workspace Invite",
      message: "You were invited to join the Design Team workspace.",
      time: "2 min ago",
      unread: true,
    },
    {
      id: 2,
      type: "message",
      title: "New Message",
      message: "Arjun commented on your task: Landing Page UI.",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      type: "update",
      title: "Task Updated",
      message: 'Your task "API Integration" was marked as completed.',
      time: "Yesterday",
      unread: false,
    },
  ]);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "mentions") return n.type === "message";
    if (filter === "invites") return n.type === "invite";
    return true;
  });

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleNavigation = (type: NotificationType, id: number) => {
    if (type === "invite") router.push("/workspace");
    if (type === "message") router.push("/chat");
    if (type === "update") router.push("/tasks");

    setTimeout(() => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
      );
    }, 0);
  };

  return (
    <div className="min-h-screen bg-[#05060A] text-white px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_300px] gap-6">
        {/* LEFT: Profile Section */}
        <aside className="hidden lg:block bg-[#0B0E1A] border border-[#1E2235] rounded-2xl p-6 h-fit">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
              <User size={36} className="text-blue-400" />
            </div>
            <h3 className="font-semibold text-lg">Shiwangi Tiwari</h3>
            <p className="text-sm text-gray-400">Product Designer</p>

            <div className="w-full mt-6 space-y-3 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Workspaces</span>
                <span className="text-blue-400">4</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Tasks</span>
                <span className="text-blue-400">12</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Unread</span>
                <span className="text-red-400">
                  {notifications.filter((n) => n.unread).length}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* CENTER: Notifications */}
        <main>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Bell className="text-red-500" size={28} />
              <h1 className="text-2xl font-semibold">Notifications</h1>
            </div>

            <button
              onClick={markAllAsRead}
              className="text-sm px-4 py-2 rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500/25 transition"
            >
              Mark all as read
            </button>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
            {["all", "mentions", "invites"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-xl text-sm capitalize transition border ${
                  filter === tab
                    ? "bg-blue-500/15 border-blue-500/40 text-blue-400"
                    : "border-[#1E2235] text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-3 sm:space-y-4">
            {filteredNotifications.map((n) => {
              const Icon = ICON_MAP[n.type] || Bell;
              return (
                <div
                  key={n.id}
                  onClick={() => handleNavigation(n.type, n.id)}
                  className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
                    n.unread
                      ? "bg-[#0B0E1A] border-[#1E2235] hover:border-red-500/60"
                      : "bg-[#070812] border-[#14172A] opacity-80"
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl ${
                      n.unread
                        ? "bg-red-500/15 text-red-400"
                        : "bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    <Icon size={20} />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h2 className="font-medium text-sm sm:text-base">
                        {n.title}
                      </h2>
                      <span className="text-xs text-gray-400">{n.time}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 mt-1">
                      {n.message}
                    </p>
                  </div>

                  {n.unread && (
                    <span className="w-2 h-2 mt-2 rounded-full bg-red-500" />
                  )}
                </div>
              );
            })}
          </div>
        </main>

        {/* RIGHT: Context / Suggestions */}
        <aside className="hidden lg:block bg-[#0B0E1A] border border-[#1E2235] rounded-2xl p-6 h-fit">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3 text-sm">
            <button className="w-full text-left px-4 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 transition">
              Create Workspace
            </button>
            <button className="w-full text-left px-4 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 transition">
              View Tasks
            </button>
            <button className="w-full text-left px-4 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 transition">
              Open Chat
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
