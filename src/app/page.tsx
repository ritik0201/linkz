"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Rocket, Users, Target, Shield, Loader2, PlusCircle, MapPin, Briefcase, Hash, Calendar, Info } from "lucide-react";
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
    profilePicture?: string;
  };
  likes: string[];
  interested?: string[];
  comments: {
    userId: {
      _id: string;
      fullName: string;
      username: string;
      profileImage?: string;
      profilePicture?: string;
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
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);
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
      if (!res.ok) {
        throw new Error(`Failed to fetch feed: ${res.status}`);
      }
      const data = await res.json();
      if (data.currentUserProfile) {
        setCurrentUserProfile(data.currentUserProfile);
      }
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
    const displayUser = currentUserProfile ? {
      ...session.user,
      ...currentUserProfile,
      image: currentUserProfile.profilePicture || currentUserProfile.profileImage || (session.user as any).image,
      name: currentUserProfile.fullName || (session.user as any).name,
    } : session.user;

    return (
      <main className="min-h-screen bg-black">
        {/* <Navbar /> */}
        <div className="container mx-auto pt-24 pb-12 px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar - User Profile */}
            <div className="hidden lg:block lg:col-span-3 sticky top-24 self-start">
              <FeedProfileCard user={displayUser} />
              <CommunityCard user={displayUser} />
            </div>

            {/* Main Feed */}
            <div className="lg:col-span-6 space-y-6">
              {/* Create Post Button */}
              <div className="bg-[#2b2b2b] p-4 rounded-2xl shadow-lg border border-zinc-700/50 flex items-center gap-4">
                <img 
                  // @ts-ignore
                  src={displayUser.image || displayUser.profileImage || "/user.png"} 
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
                        commentsCount: item.comments?.length || 0,
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
              <NewsCard posts={items} />
              <FooterLinks />
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
              _id: displayUser._id || (session.user as any)._id || (session.user as any).id,
              // @ts-ignore
              name: displayUser.fullName || displayUser.name || (session.user as any).name,
              // @ts-ignore
              avatar: displayUser.profilePicture || displayUser.profileImage || displayUser.image,
              // @ts-ignore
              headline: displayUser.headline || (session.user as any).role || "User"
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
      {/* <Navbar /> */}
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
      {/* <Footer /> */}
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
    <div className="p-6 pt-0 text-center">
      <img
        className="w-20 h-20 rounded-full border-4 border-[#2b2b2b] object-cover mx-auto -mt-10 mb-4"
        src={user.image || user.profilePicture || user.profileImage || "/user.png"}
        alt={user.name}
      />
      <div>
        <h2 className="text-xl font-bold text-white">{user.name || user.fullName}</h2>
        <p className="text-zinc-400 text-sm mt-1">@{user.username}</p>
        <p className="text-zinc-300 text-sm mt-3 line-clamp-2">{user.headline || "No headline yet."}</p>
      </div>
      <div className="mt-6 pt-4 border-t border-zinc-700/50 flex justify-around text-sm">
        <div className="text-center">
          <p className="text-zinc-400">Followers</p>
          <p className="text-white font-bold">{user.followersCount || user.followers?.length || 0}</p>
        </div>
        <div className="text-center">
          <p className="text-zinc-400">Following</p>
          <p className="text-white font-bold">{user.followingCount || user.following?.length || 0}</p>
        </div>
        <div className="text-center">
          <p className="text-zinc-400">Projects</p>
          <p className="text-white font-bold">{user.projectsCount ?? 0}</p>
        </div>
      </div>
      <Link href={`/user/${user.username}`} className="mt-6 block w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-sm font-medium">
        View Profile
      </Link>
    </div>
  </div>
);

const SuggestionItem = ({ user, onFollow }: { user: any; onFollow: () => void }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = async () => {
    setIsFollowing(true);
    try {
      const res = await fetch("/api/profile/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: user._id }),
      });
      if (res.ok) {
        onFollow();
      } else {
        console.error("Failed to follow user");
        const errorData = await res.json();
        console.error("Failed to follow user:", errorData.error || res.statusText);
      }
    } catch (error) {
      console.error("Error following user:", error);
    } finally {
      setIsFollowing(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Link href={`/user/${user.username}`}>
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={user.profilePicture || user.profileImage || user.image || user.avatar || "/user.png"}
          alt={user.fullName}
        />
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/user/${user.username}`} className="hover:underline">
          <p className="font-bold text-white text-sm truncate">{user.fullName}</p>
        </Link>
        <p className="text-xs text-zinc-400 truncate">{user.headline || "New to Linkz"}</p>
      </div>
      <button
        onClick={handleFollow}
        disabled={isFollowing}
        className="text-sm font-bold rounded-full px-3 py-1 transition-colors flex items-center gap-1 text-indigo-400 border border-indigo-400 hover:bg-indigo-900/50 disabled:opacity-50"
      >
        {isFollowing ? <Loader2 size={14} className="animate-spin" /> : <PlusCircle size={14} />}
        {isFollowing ? "" : "Follow"}
      </button>
    </div>
  );
};

const CommunityCard = ({ user }: { user: any }) => (
  <div className="bg-[#2b2b2b] rounded-2xl overflow-hidden shadow-lg border border-zinc-700/50 mt-4 p-3">
    <div className="space-y-3">
      <div>
        <h3 className="text-xs font-bold text-white mb-2">Your Topics</h3>
        <ul className="space-y-1">
          {(user?.skills?.length ? user.skills.slice(0, 5) : ["webdevelopment", "react", "javascript"]).map((tag: string, i: number) => (
            <li key={i} className="flex items-center gap-2 text-zinc-400 hover:text-white text-xs cursor-pointer">
              <Hash size={12} /> <span className="truncate">{tag}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-zinc-700/50 pt-3">
        <h3 className="text-xs font-bold text-indigo-400 mb-2 hover:underline cursor-pointer">Groups</h3>
        <ul className="space-y-1">
           <li className="flex items-center gap-2 text-zinc-400 hover:text-white text-xs cursor-pointer">
            <Users size={12} /> <span>Startup Founders</span>
          </li>
        </ul>
      </div>
    </div>
    <div className="mt-3 pt-3 border-t border-zinc-700/50 text-center">
      <button className="text-xs font-bold text-zinc-400 hover:text-white transition-colors">Discover more</button>
    </div>
  </div>
);

const NewsCard = ({ posts }: { posts: FeedItem[] }) => {
  const trending = posts
    .filter(p => p.topic || p.content)
    .sort((a, b) => ((b.likes?.length || 0) + (b.comments?.length || 0)) - ((a.likes?.length || 0) + (a.comments?.length || 0)))
    .slice(0, 3);

  return (
    <div className="bg-[#2b2b2b] rounded-2xl overflow-hidden shadow-lg border border-zinc-700/50 mt-4 p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-bold text-white">Trending</h3>
        <Info size={14} className="text-zinc-400" />
      </div>
      <ul className="space-y-3">
        {trending.length > 0 ? trending.map((news, i) => (
          <li key={i} className="cursor-pointer group">
            <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                <h4 className="text-xs font-bold text-zinc-200 group-hover:text-indigo-400 group-hover:underline truncate">
                  {news.topic || news.content.substring(0, 25) + (news.content.length > 25 ? "..." : "")}
                </h4>
            </div>
            <p className="text-[10px] text-zinc-500 pl-3.5 mt-0.5">
              {new Date(news.createdAt).toLocaleDateString()} • {(news.likes?.length || 0) + (news.comments?.length || 0)} engaged
            </p>
          </li>
        )) : (
          <li className="text-xs text-zinc-500">No trending topics yet.</li>
        )}
      </ul>
      <button className="mt-3 text-xs font-medium text-zinc-400 hover:text-white flex items-center gap-1">
        Show more <ArrowRight size={12} />
      </button>
    </div>
  );
};

const FooterLinks = () => (
    <div className="mt-6 text-center px-4">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-zinc-500">
            {["About", "Accessibility", "Help Center", "Privacy & Terms", "Ad Choices", "Advertising", "Business Services", "Get the Linkz app", "More"].map((link) => (
                <Link key={link} href="#" className="hover:text-indigo-400 hover:underline">{link}</Link>
            ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-1 text-xs text-zinc-400">
            <span className="font-bold text-indigo-500">Linkz</span>
            <span>© 2024</span>
        </div>
    </div>
);

const SuggestionsCard = () => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/suggestions");
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  return (
    <div className="bg-[#2b2b2b] p-5 rounded-2xl shadow-lg border border-zinc-700/50">
      <h3 className="text-lg font-bold text-white mb-4">Suggested for you</h3>
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-zinc-700"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-zinc-700 rounded w-3/4"></div>
              <div className="h-2 bg-zinc-700 rounded w-1/2"></div>
            </div>
          </div>
        ) : suggestions.length > 0 ? (
          suggestions.map((user) => (
            <SuggestionItem key={user._id} user={user} onFollow={fetchSuggestions} />
          ))
        ) : (
          <p className="text-sm text-zinc-500 text-center py-4">No new suggestions.</p>
        )}
      </div>
      <button 
        onClick={fetchSuggestions} 
        className="mt-6 w-full py-2 text-indigo-400 text-sm font-medium hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-colors"
      >
        More suggestions
      </button>
    </div>
  );
};
