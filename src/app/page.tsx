"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Rocket, Users, Target, Shield, Loader2, PlusCircle, MapPin, Briefcase } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CreatePostModal from "@/components/CreatePostModal";
import { useSession } from "next-auth/react";
import PosterCard from "@/components/PosterCard";

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
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [usersMap, setUsersMap] = useState<Record<string, any>>({});

  useEffect(() => {
    if (status === "authenticated") {
      fetchFeed();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const fetchFeed = async () => {
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      if (data.data) {
        const posts = data.data;
        const map: Record<string, any> = {};
        
        // Build usersMap and normalize post data for PosterCard
        posts.forEach((p: any) => {
          if (p.userId) map[p.userId.username] = p.userId;
          p.comments?.forEach((c: any) => {
            if (c.userId) map[c.userId.username] = c.userId;
            c.username = c.userId?.username; // Ensure username exists for PosterCard lookup
          });
        });
        
        setUsersMap(map);
        setItems(shuffleArray(posts));
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

  const handleCommentSubmit = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    const text = commentTexts[postId];
    if (!session?.user || !text?.trim()) return;
    
    // @ts-ignore
    const username = session.user.username;

    try {
      const res = await fetch("/api/auth/ProjectOrResearch", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, username, action: "comment", text }),
      });
      const data = await res.json();
      if (data.data) {
        // Update the specific post in the list
        setItems(prev => prev.map(item => {
            if (item._id === postId) {
                // Ensure comments have username for PosterCard
                const updatedPost = data.data;
                updatedPost.comments?.forEach((c: any) => {
                    c.username = c.username || c.userId?.username;
                });
                return { ...item, ...updatedPost };
            }
            return item;
        }));
        setCommentTexts(prev => ({ ...prev, [postId]: "" }));
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  const handleInteraction = async (postId: string, action: 'like' | 'interested') => {
    // @ts-ignore
    if (!session?.user?.username) return;
    // @ts-ignore
    const userIdentifier = session.user.username;

    setItems(prevItems => prevItems.map(item => {
      if (item._id === postId) {
        const list = action === 'like' ? item.likes : (item.interested || []);
        const isActive = list.includes(userIdentifier);
        const newList = isActive 
          ? list.filter((u: string) => u !== userIdentifier)
          : [...list, userIdentifier];
        
        return {
          ...item,
          [action === 'like' ? 'likes' : 'interested']: newList
        };
      }
      return item;
    }));

    try {
      await fetch('/api/auth/ProjectOrResearch', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, action, username: userIdentifier }),
      });
    } catch (error) {
      console.error("Failed to update interaction", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  // Logged In View
  if (session) {
    return (
      <main className="min-h-screen bg-black">
        <Navbar />
        <div className="container mx-auto pt-24 pb-12 px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar - User Profile */}
            <div className="hidden lg:block lg:col-span-3 sticky top-24 self-start">
              <FeedProfileCard user={session.user} />
            </div>

            {/* Main Feed */}
            <div className="lg:col-span-6 space-y-6">
              {/* Create Post Button */}
              <div className="bg-[#2b2b2b] p-4 rounded-2xl shadow-lg border border-zinc-700/50 flex items-center gap-4">
                <img 
                  // @ts-ignore
                  src={session.user.image || session.user.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fDE?q=80&w=1780&auto=format&fit=crop"} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex-1 text-left bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 px-6 py-3 rounded-full transition-all border border-zinc-700/50 font-medium"
                >
                  Share a project or research...
                </button>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="animate-spin text-indigo-600" size={40} />
                  <p className="text-zinc-500">Loading feed...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-20 bg-[#2b2b2b] rounded-2xl border border-zinc-700/50">
                  <p className="text-gray-400">No updates yet. Be the first to share your work!</p>
                </div>
              ) : (
                items.map((item) => (
                  <PosterCard
                    key={item._id}
                    post={{
                        ...item,
                        description: item.content, // Map content to description for PosterCard
                        coverImage: item.image,    // Map image to coverImage for PosterCard
                    }}
                    commentText={commentTexts[item._id] || ""}
                    setCommentText={(text) => setCommentTexts(prev => ({ ...prev, [item._id]: text }))}
                    handleCommentSubmit={(e) => handleCommentSubmit(e, item._id)}
                    usersMap={usersMap}
                    onLike={() => handleInteraction(item._id, 'like')}
                    onInterested={() => handleInteraction(item._id, 'interested')}
                    currentUser={session?.user}
                  />
                ))
              )}
            </div>

            {/* Right Sidebar - Suggestions */}
            <div className="hidden lg:block lg:col-span-3 sticky top-24 self-start">
              <SuggestionsCard />
            </div>
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
    <main className="min-h-screen bg-black">
      <Navbar />
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/30 text-indigo-400 text-sm font-medium mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              The Future of Startup Hiring
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
              Connect with <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400">
                World-Class Talent
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
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
                className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-gray-700 text-gray-900 hover:border-indigo-500 hover:text-indigo-500 rounded-xl font-bold text-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
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
      <section className="py-24 bg-gray-900">
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
  <div className="bg-black p-8 rounded-2xl border border-gray-700 hover:border-indigo-500 transition-colors group">
    <div className="w-14 h-14 bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed">
      {description}
    </p>
  </div>
);

const FeedProfileCard = ({ user }: { user: any }) => (
  <div className="bg-[#2b2b2b] rounded-2xl overflow-hidden shadow-lg border border-zinc-700/50">
    <div className="h-20 bg-linear-to-r from-indigo-600 to-violet-600"></div>
    <div className="p-6 pt-0 relative text-center">
      <div className="absolute -top-10 left-1/2 -translate-x-1/2">
        <img
          className="w-20 h-20 rounded-full border-4 border-[#2b2b2b] object-cover"
          src={user.image || user.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fDE?q=80&w=1780&auto=format&fit=crop"}
          alt={user.name}
        />
      </div>
      <div className="mt-12">
        <h2 className="text-xl font-bold text-white">{user.name || user.fullName}</h2>
        <p className="text-zinc-400 text-sm mt-1">@{user.username}</p>
        <p className="text-zinc-300 text-sm mt-3 line-clamp-2">{user.headline || "No headline yet."}</p>
      </div>
      <div className="mt-6 pt-4 border-t border-zinc-700/50 flex justify-between text-sm">
        <div className="text-center">
          <p className="text-zinc-400">Views</p>
          <p className="text-white font-bold">1.2k</p>
        </div>
        <div className="text-center">
          <p className="text-zinc-400">Projects</p>
          <p className="text-white font-bold">8</p>
        </div>
      </div>
      <Link href={`/user/${user.username}`} className="mt-6 block w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-sm font-medium">
        View Profile
      </Link>
    </div>
  </div>
);

const SuggestionsCard = () => (
  <div className="bg-[#2b2b2b] p-5 rounded-2xl shadow-lg border border-zinc-700/50">
    <h3 className="text-lg font-bold text-white mb-4">Suggested for you</h3>
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-700 animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-zinc-700 rounded w-3/4 animate-pulse"></div>
            <div className="h-2 bg-zinc-700 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
    <button className="mt-4 w-full text-indigo-400 text-sm font-medium hover:underline">View all suggestions</button>
  </div>
);
