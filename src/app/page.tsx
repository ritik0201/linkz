"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Rocket,
  Users,
  Target,
  Shield,
  Heart,
  MessageCircle,
  Share2,
  Image as ImageIcon,
  Send,
  MoreHorizontal,
  ThumbsUp,
  Loader2,
  User as UserIcon,
  PlusCircle,
  Star
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CreatePostModal from "@/components/CreatePostModal";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

interface FeedItem {
  _id: string;
  type: 'post' | 'project';
  content: string;
  image?: string;
  topic?: string;
  category?: string;
  teamMembers?: string[];
  link?: string;
  userId: {
    _id: string;
    fullName: string;
    username: string;
    profileImage?: string;
  };
  likes: string[];
  interested?: string[];
  comments: {
    userId: {
      _id: string;
      fullName: string;
      username: string;
      profileImage?: string;
    };
    text: string;
    createdAt: string;
  }[];
  createdAt: string;
}

export default function Home() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      fetchFeed();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  const fetchFeed = async () => {
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      if (data.data) {
        setItems(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch feed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalSubmit = async (formData: FormData) => {
    try {
      const res = await fetch("/api/auth/ProjectOrResearch", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.data) {
        fetchFeed();
      }
    } catch (error) {
      console.error("Failed to create project:", error);
      throw error;
    }
  };

  const handleAction = async (postId: string, action: "like" | "interested", type: 'post' | 'project') => {
    if (!session?.user) return;
    // @ts-ignore
    const username = session.user.username;
    // @ts-ignore
    const userId = session.user._id || session.user.id;

    const apiPath = type === 'project' ? "/api/auth/ProjectOrResearch" : "/api/posts";
    const body = type === 'project'
      ? { postId, username, action }
      : { postId, userId, action };

    try {
      const res = await fetch(apiPath, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.data) {
        setItems(items.map(item => item._id === postId ? { ...data.data, type: item.type } : item));
      }
    } catch (error) {
      console.error(`Failed to ${action}:`, error);
    }
  };

  const handleComment = async (postId: string) => {
    if (!session?.user || !commentText.trim()) return;
    // @ts-ignore
    const userId = session.user._id || session.user.id;

    try {
      const res = await fetch("/api/posts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userId, action: "comment", text: commentText }),
      });
      const data = await res.json();
      if (data.data) {
        setItems(items.map(item => item._id === postId ? { ...data.data, type: item.type } : item));
        setCommentText("");
        setCommentingOn(null);
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  // Logged In View
  if (session) {
    return (
      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Navbar />
        <div className="container mx-auto pt-28 pb-12 px-4 max-w-6xl">
          {/* Header & Create Button */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Community Feed</h1>
              <p className="text-zinc-500 dark:text-zinc-400">Discover projects and updates from the Linkz community</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-indigo-500/20 transition-all border-none cursor-pointer"
            >
              <PlusCircle size={20} />
              Share Project or Research
            </button>
          </div>

          {/* Feed Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
                <p className="text-zinc-500">Loading feed...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <p className="text-zinc-500">No updates yet. Be the first to share your work!</p>
              </div>
            ) : (
              items.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${item.type === 'project'
                      ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                      : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                    }`}>
                    {item.type === 'project' ? <Rocket size={12} /> : <ImageIcon size={12} />}
                    {item.type === 'project' ? (item.category || 'Project') : 'Post'}
                  </div>

                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-100 dark:border-zinc-700/50">
                        {item.userId.profileImage ? (
                          <img src={item.userId.profileImage} alt={item.userId.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon className="text-zinc-400" size={20} />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm tracking-tight">{item.userId.fullName}</h4>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">@{item.userId.username} • {new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 border-none bg-transparent cursor-pointer">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>

                  <div className="px-4 pb-4 flex-grow">
                    {item.topic && <h3 className="font-bold text-lg mb-2 text-indigo-600 dark:text-indigo-400">{item.topic}</h3>}
                    <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm line-clamp-4">{item.content}</p>

                    {item.type === 'project' && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.teamMembers && item.teamMembers.length > 0 && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md text-[10px] text-zinc-500">
                            <Users size={12} /> {item.teamMembers.join(", ")}
                          </div>
                        )}
                        {item.link && (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 rounded-md text-[10px] text-indigo-500 hover:underline">
                            <Target size={12} /> View Project
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {item.image && (
                    <div className="aspect-video w-full overflow-hidden border-y border-zinc-50 dark:border-zinc-800/50">
                      <img src={item.image} alt="Content" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="px-4 py-3 flex items-center justify-between border-t border-zinc-50 dark:border-zinc-800/50">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleAction(item._id, "like", item.type)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all border-none bg-transparent cursor-pointer text-xs ${
                          // @ts-ignore
                          item.likes.includes(session.user._id || session.user.id) || item.likes.includes(session.user.username)
                            ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                            : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
                          }`}
                      >
                        <Heart size={16} fill={
                          // @ts-ignore
                          item.likes.includes(session.user._id || session.user.id) || item.likes.includes(session.user.username) ? "currentColor" : "none"} />
                        <span className="font-bold">{item.likes.length}</span>
                      </button>

                      {item.type === 'project' && (
                        <button
                          onClick={() => handleAction(item._id, "interested", item.type)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all border-none bg-transparent cursor-pointer text-xs ${
                            // @ts-ignore
                            item.interested?.includes(session.user.username)
                              ? "text-amber-600 bg-amber-50 dark:bg-amber-900/20"
                              : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
                            }`}
                        >
                          <Star size={16} fill={
                            // @ts-ignore
                            item.interested?.includes(session.user.username) ? "currentColor" : "none"
                          } />
                          <span className="font-bold">{item.interested?.length || 0}</span>
                        </button>
                      )}

                      {item.type === 'post' && (
                        <button
                          onClick={() => setCommentingOn(commentingOn === item._id ? null : item._id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 rounded-full transition-all border-none bg-transparent cursor-pointer text-xs"
                        >
                          <MessageCircle size={16} />
                          <span className="font-bold">{item.comments.length}</span>
                        </button>
                      )}
                    </div>

                    <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 rounded-full transition-all border-none bg-transparent cursor-pointer text-xs">
                      <Share2 size={16} />
                    </button>
                  </div>

                  <AnimatePresence>
                    {commentingOn === item._id && item.type === 'post' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4 overflow-hidden border-t border-zinc-50 dark:border-zinc-800/20"
                      >
                        <div className="pt-4 space-y-4">
                          <div className="flex gap-2">
                            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                              {session.user?.image ? (
                                <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                              ) : (
                                <UserIcon size={14} />
                              )}
                            </div>
                            <div className="flex-1 flex gap-2">
                              <input
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write a comment..."
                                className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full px-4 py-2 text-[11px] focus:outline-none focus:ring-1 focus:ring-indigo-500 border-none"
                                onKeyPress={(e) => e.key === 'Enter' && handleComment(item._id)}
                              />
                              <button
                                onClick={() => handleComment(item._id)}
                                className="text-indigo-600 font-bold text-[11px] px-2 border-none bg-transparent cursor-pointer"
                              >
                                Post
                              </button>
                            </div>
                          </div>

                          <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                            {item.comments.map((comment, idx) => (
                              <div key={idx} className="flex gap-3">
                                <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                                  {comment.userId.profileImage ? (
                                    <img src={comment.userId.profileImage} alt={comment.userId.fullName} className="w-full h-full object-cover" />
                                  ) : (
                                    <UserIcon size={12} />
                                  )}
                                </div>
                                <div className="bg-zinc-50 dark:bg-zinc-800/30 rounded-2xl px-3 py-2 flex-1">
                                  <h5 className="font-bold text-[9px] tracking-tight">{comment.userId.fullName}</h5>
                                  <p className="text-[11px] text-zinc-700 dark:text-zinc-300">{comment.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {session && (
          <CreatePostModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleModalSubmit}
            user={{
              // @ts-ignore
              _id: session.user._id || session.user.id,
              // @ts-ignore
              name: session.user.fullName || session.user.name,
              // @ts-ignore
              avatar: session.user.image || session.user.profileImage,
              // @ts-ignore
              headline: session.user.role || "User"
            }}
          />
        )}

        <Footer />
        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 10px; }
          .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; }
        `}</style>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <Navbar />
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              The Future of Startup Hiring
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Connect with <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400">
                World-Class Talent
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Linkz bridges the gap between ambitious startups and exceptional developers. Build your dream team today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/startup/signin"
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-indigo-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Hire Talent
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/user/signin"
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-indigo-600 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-500 rounded-xl font-bold text-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Find Work
                <Users size={20} />
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        </div>
      </section>
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Rocket size={32} />}
              title="Fast Matching"
              description="Our AI-driven algorithms connect you with the perfect candidates in hours, not weeks."
            />
            <FeatureCard
              icon={<Shield size={32} />}
              title="Verified Talent"
              description="Every candidate passes a rigorous vetting process to ensure top-tier quality."
            />
            <FeatureCard
              icon={<Target size={32} />}
              title="Startup Focused"
              description="We understand the unique needs of high-growth startups and equity-based hiring."
            />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors group">
    <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">{title}</h3>
    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
      {description}
    </p>
  </div>
);
