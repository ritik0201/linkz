"use client";

import React from "react";

import { Bell, CheckCircle, MessageSquare, Users, User, Clock, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col transition-colors duration-300">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Profile Section */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28 space-y-6">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-col items-center text-center">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 p-1 mb-4">
                                <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
                                    <User size={40} className="text-zinc-400" />
                                </div>
                            </div>
                            <div className="absolute bottom-4 right-0 w-6 h-6 bg-green-500 border-4 border-white dark:border-zinc-900 rounded-full"></div>
                        </div>
                        <h3 className="font-bold text-xl text-zinc-900 dark:text-zinc-100">Shiwangi Tiwari</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Product Designer</p>

                        <div className="w-full mt-8 space-y-4">
                            <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                                <span className="text-sm text-zinc-600 dark:text-zinc-400">Workspaces</span>
                                <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                                <span className="text-sm text-zinc-600 dark:text-zinc-400">Tasks</span>
                                <span className="font-bold text-indigo-600 dark:text-indigo-400">12</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                                <span className="text-sm text-zinc-600 dark:text-zinc-400">Unread</span>
                                <span className="font-bold text-red-500">{notifications.filter((n) => n.unread).length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </aside>

          {/* CENTER: Notifications */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                    <Bell size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Notifications</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Stay updated with your workspace</p>
                </div>
              </div>

              <button
                onClick={markAllAsRead}
                className="text-sm px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors font-medium"
              >
                Mark all as read
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {["all", "mentions", "invites"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium capitalize transition-all whitespace-nowrap ${
                    filter === tab
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                      : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 hover:text-indigo-500"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((n) => {
                            const Icon = ICON_MAP[n.type] || Bell;
                            return (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={n.id}
                                onClick={() => handleNavigation(n.type, n.id)}
                                className={`group relative flex gap-4 p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                                n.unread
                                    ? "bg-white dark:bg-zinc-900 border-indigo-200 dark:border-indigo-900/50 shadow-sm"
                                    : "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 opacity-75 hover:opacity-100"
                                }`}
                            >
                                <div
                                className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                                    n.unread
                                    ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"
                                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                                }`}
                                >
                                <Icon size={20} />
                                </div>

                                <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                    <h2 className={`font-semibold text-base truncate pr-4 ${n.unread ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-700 dark:text-zinc-300'}`}>
                                    {n.title}
                                    </h2>
                                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 whitespace-nowrap">
                                        <Clock size={12} />
                                        {n.time}
                                    </div>
                                </div>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                                    {n.message}
                                </p>
                                </div>

                                {n.unread && (
                                <span className="absolute top-5 right-5 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-100 dark:ring-indigo-900/30" />
                                )}
                            </motion.div>
                            );
                        })
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }}
                            className="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800"
                        >
                            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bell size={24} className="text-zinc-400" />
                            </div>
                            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">No notifications</h3>
                            <p className="text-zinc-500 dark:text-zinc-400">You're all caught up!</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
          </div>

          {/* RIGHT: Context / Suggestions */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28 space-y-6">
                <div className="bg-linear-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles size={20} className="text-indigo-200" />
                        <h3 className="font-bold text-lg">Quick Actions</h3>
                    </div>
                    <div className="space-y-3">
                        <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium backdrop-blur-sm border border-white/10">
                            <span>Create Workspace</span>
                            <ArrowRight size={16} className="opacity-70" />
                        </button>
                        <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium backdrop-blur-sm border border-white/10">
                            <span>View Tasks</span>
                            <ArrowRight size={16} className="opacity-70" />
                        </button>
                        <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium backdrop-blur-sm border border-white/10">
                            <span>Open Chat</span>
                            <ArrowRight size={16} className="opacity-70" />
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-4 text-sm uppercase tracking-wider">Suggested for you</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                <Users size={18} className="text-zinc-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Join "DevOps"</p>
                                <p className="text-xs text-zinc-500">Recommended based on your skills</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </aside>
        </div>
      </main>
      
    </div>
  );
}
