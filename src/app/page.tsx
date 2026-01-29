"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Rocket, Users, Target, Shield, Loader2, PlusCircle, MapPin, Briefcase, Hash, Calendar, Info } from "lucide-react";
import Navbar from "@/components/navbar";
// import Footer from "@/components/footer";
import CreatePostModal from "@/components/CreatePostModal";
import { useSession } from "next-auth/react";
import PosterCard from "@/components/PosterCard";

// --- START: Type Definitions ---
interface UserSummary {
  _id: string;
  fullName: string;
  username: string;
  profileImage?: string;
  profilePicture?: string;
  headline?: string;
  image?: string; // from session
  avatar?: string; // from session
}

interface Comment {
  userId: UserSummary;
  text: string;
  createdAt: string;
  username?: string; // Dynamically added for PosterCard
}

interface FeedItem {
  _id: string;
  type: 'post' | 'project';
  content: string;
  image?: string;
  topic?: string;
  category?: string;
  teamMembers?: string[];
  link?: string;
  userId: UserSummary;
  likes: string[];
  interested?: string[];
  comments: Comment[];
  createdAt: string;
}

interface CurrentUserProfile extends UserSummary {
  email: string | null;
  role?: string;
  mobile?: string;
  followers?: string[];
  following?: string[];
  followersCount?: number;
  followingCount?: number;
  projectsCount?: number;
  skills?: string[];
  name?: string; // from session
}

interface SessionUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  username?: string;
  _id?: string;
}

interface DisplayUser extends Omit<Partial<CurrentUserProfile>, 'image' | 'name'>, Omit<Partial<SessionUser>, 'image' | 'name'> {
  image?: string | null;
  name?: string | null;
}
// --- END: Type Definitions ---

const PostSkeleton = () => (
    <div className="bg-[#2b2b2b] p-4 sm:p-6 rounded-2xl shadow-lg border border-zinc-700/50 animate-pulse w-full">
        {/* Header */}
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-zinc-700"></div>
            <div className="space-y-2">
                <div className="h-4 bg-zinc-700 rounded w-32"></div>
                <div className="h-3 bg-zinc-700 rounded w-24"></div>
            </div>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-2">
            <div className="h-4 bg-zinc-700 rounded w-full"></div>
            <div className="h-4 bg-zinc-700 rounded w-5/6"></div>
        </div>

        {/* Image */}
        <div className="mt-4 aspect-video w-full bg-zinc-700 rounded-xl"></div>

        {/* Stats */}
        <div className="mt-4 flex justify-between items-center">
            <div className="h-4 bg-zinc-700 rounded w-16"></div>
            <div className="h-4 bg-zinc-700 rounded w-24"></div>
        </div>

        {/* Actions */}
        <div className="mt-2 pt-3 border-t border-zinc-700/50 flex gap-2">
            <div className="h-9 bg-zinc-700 rounded-lg w-full"></div>
            <div className="h-9 bg-zinc-700 rounded-lg w-full"></div>
            <div className="h-9 bg-zinc-700 rounded-lg w-full"></div>
            <div className="h-9 bg-zinc-700 rounded-lg w-full"></div>
        </div>
    </div>
);

export default function Home() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentUserProfile, setCurrentUserProfile] = useState<CurrentUserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [usersMap, setUsersMap] = useState<Record<string, UserSummary>>({});

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useCallback((node: HTMLElement | null) => {
    if (loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchFeed(page + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loadingMore, hasMore, page]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchFeed(1);
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  const fetchFeed = async (pageNum: number) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await fetch(`/api/posts?page=${pageNum}&limit=5`);
      if (!res.ok) {
        throw new Error(`Failed to fetch feed: ${res.status}`);
      }
      const data = await res.json();
      if (pageNum === 1 && data.currentUserProfile) {
        setCurrentUserProfile(data.currentUserProfile);
      }
      if (data.data) {
        const posts: FeedItem[] = data.data;
        const map: Record<string, UserSummary> = {};

        // Build usersMap and normalize post data for PosterCard
        posts.forEach((p: FeedItem) => {
          if (p.userId) map[p.userId.username] = p.userId;
          p.comments?.forEach((c: Comment) => {
            if (c.userId) map[c.userId.username] = c.userId;
            c.username = c.userId?.username; // Ensure username exists for PosterCard lookup
          });
        });

        setUsersMap(prev => ({ ...prev, ...map }));
        setItems(prev => {
          if (pageNum === 1) return posts;
          const existingIds = new Set(prev.map(item => item._id));
          const newPosts = posts.filter(item => !existingIds.has(item._id));
          return [...prev, ...newPosts];
        });
        setPage(pageNum);
        setHasMore(data.pagination.hasMore);
      }
    } catch (error) {
      console.error("Failed to fetch feed:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
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
        fetchFeed(1);
      }
    } catch (error) {
      console.error("Failed to create project:", error);
      throw error;
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    const sessionUser = session?.user as SessionUser;
    const text = commentTexts[postId];
    if (!sessionUser?.username || !text?.trim()) return;

    const username = sessionUser.username;

    try {
      const res = await fetch("/api/auth/ProjectOrResearch", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, username, action: "comment", text }),
      });
      if (!res.ok) throw new Error("Failed to post comment");
      const data = await res.json();
      if (data.data) {
        // Update the specific post in the list
        setItems(prev => prev.map(item => {
          if (item._id === postId) {
            // Ensure comments have username for PosterCard
            const updatedPost = data.data;
            updatedPost.comments?.forEach((c: Comment) => {
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
    const sessionUser = session?.user as SessionUser;
    if (!sessionUser?.username) return;
    const userIdentifier = sessionUser.username;

    const originalItems = [...items];
    
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
      const res = await fetch('/api/auth/ProjectOrResearch', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, action, username: userIdentifier }),
      });
      if (!res.ok) {
        // Revert on error
        setItems(originalItems);
      }
    } catch (error) {
      console.error("Failed to update interaction", error);
      setItems(originalItems);
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
    const sessionUser = session.user as SessionUser;
    const displayUser: DisplayUser = currentUserProfile ? {
      ...session.user,
      ...currentUserProfile,
      image: currentUserProfile.profilePicture || currentUserProfile.profileImage || sessionUser.image,
      name: currentUserProfile.fullName || sessionUser.name,
    } : sessionUser;

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
            <div className="lg:col-span-6 space-y-6 w-full max-w-2xl mx-auto">
              {/* Create Post Button */}
              <div className="bg-[#2b2b2b] p-4 rounded-2xl shadow-lg border border-zinc-700/50 flex items-center gap-4">
                <img
                  src={displayUser?.image || displayUser?.profileImage || "/user.png"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex-1 text-left bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 px-4 md:px-6 py-3 rounded-full transition-all border border-zinc-700/50 font-medium text-sm md:text-base"
                >
                  Share a project or research...
                </button>
              </div>

              {loading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => <PostSkeleton key={i} />)}
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
              <div ref={lastPostElementRef} />

              {loadingMore && (
                <div className="space-y-6 mt-6">
                  <PostSkeleton />
                </div>
              )}

              {!loading && !hasMore && items.length > 0 && (
                <div className="text-center py-10 text-zinc-500">
                  <p>You've reached the end!</p>
                </div>
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
              _id: displayUser?._id || "",
              name: displayUser?.fullName || displayUser?.name || "",
              avatar: displayUser?.profilePicture || displayUser?.profileImage || displayUser?.image || "/user.png",
              headline: displayUser?.headline || displayUser?.role || "User"
            }}
          />
        )}

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
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-white leading-tight">
              Connect with <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400">
                World-Class Talent
              </span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
              CollaBharat bridges the gap between ambitious startups and exceptional developers. Build your dream team today.
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
              icon={<img src="/logo.png" alt="Fast Matching" className="w-8 h-8" />}
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

const FeedProfileCard = ({ user }: { user: DisplayUser | null }) => (
  <div className="bg-[#2b2b2b] rounded-2xl overflow-hidden shadow-lg border border-zinc-700/50">
    <div className="h-20 bg-linear-to-r from-indigo-600 to-violet-600"></div>
    <div className="p-6 pt-0 text-center">
      <img
        className="w-20 h-20 rounded-full border-4 border-[#2b2b2b] object-cover mx-auto -mt-10 mb-4"
        src={user?.image || user?.profilePicture || user?.profileImage || "/user.png"}
        alt={user?.name || user?.fullName || "User"}
      />
      <div>
        <h2 className="text-xl font-bold text-white">{user?.name || user?.fullName}</h2>
        <p className="text-zinc-400 text-sm mt-1">@{user?.username}</p>
        <p className="text-zinc-300 text-sm mt-3 line-clamp-2">{user?.headline || "No headline yet."}</p>
      </div>
      <div className="mt-6 pt-4 border-t border-zinc-700/50 flex justify-around text-sm">
        <div className="text-center">
          <p className="text-zinc-400">Followers</p>
          <p className="text-white font-bold">{user?.followersCount ?? 0}</p>
        </div>
        <div className="text-center">
          <p className="text-zinc-400">Following</p>
          <p className="text-white font-bold">{user?.followingCount ?? 0}</p>
        </div>
        <div className="text-center">
          <p className="text-zinc-400">Projects</p>
          <p className="text-white font-bold">{user?.projectsCount ?? 0}</p>
        </div>
      </div>
      <Link href={user?.role === 'startup' ? "/startup/dashboard" : `/user/${user?.username}`} className="mt-6 block w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-sm font-medium">
        View Profile
      </Link>
    </div>
  </div>
);

const CommunityCard = ({ user }: { user: DisplayUser | null }) => (
  <div className="bg-[#2b2b2b] rounded-2xl overflow-hidden shadow-lg border border-zinc-700/50 mt-4 p-3">
    <div className="space-y-3">
      <div>
        <h3 className="text-xs font-bold text-white mb-2">Your Topics</h3>
        <ul className="space-y-1">
          {(user?.skills && user.skills.length > 0 ? user.skills.slice(0, 5) : ["webdevelopment", "react", "javascript"]).map((tag: string, i: number) => (
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
      {["About", "Accessibility", "Help Center", "Privacy & Terms", "Ad Choices", "Advertising", "Business Services", "Get the CollaBharat app", "More"].map((link) => (
        <Link key={link} href="#" className="hover:text-indigo-400 hover:underline">{link}</Link>
      ))}
    </div>
    <div className="mt-4 flex items-center justify-center gap-1 text-xs text-zinc-400">
      <img src="/logo.png" alt="CollaBharat Logo" className="w-5 h-5" />
      <span className="font-bold text-indigo-500">CollaBharat</span>
      <span>© 2024</span>
    </div>
  </div>
);

const SuggestionItem = ({ user, onFollow, isFollowing: initialIsFollowing }: { user: UserSummary; onFollow: () => void; isFollowing: boolean }) => {
  const { data: session } = useSession();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const handleFollowToggle = async () => {
    if (!session) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/profile/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: user._id }),
      });
      if (res.ok) {
        onFollow();
      } else {
        console.error("Failed to follow/unfollow user");
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-start gap-3">
      <Link href={`/user/${user.username}`}>
        <img
          className="w-12 h-12 rounded-full object-cover"
          src={user.profilePicture || user.profileImage || user.image || user.avatar || "/user.png"}
          alt={user.fullName}
        />
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/user/${user.username}`} className="hover:underline">
          <p className="font-bold text-white text-sm truncate">{user.fullName}</p>
        </Link>
        <p className="text-xs text-zinc-400 truncate">{user.headline || "New to CollaBharat"}</p>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={handleFollowToggle}
            disabled={isLoading}
            className={`flex items-center justify-center gap-1.5 w-24 text-xs font-bold py-1.5 rounded-full transition-colors disabled:opacity-50 ${
              isFollowing
                ? 'bg-zinc-700 hover:bg-zinc-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : (isFollowing ? 'Following' : 'Follow')}
          </button>
          <Link href={`/user/${user.username}`} className="flex items-center justify-center w-24 text-xs font-bold py-1.5 rounded-full transition-colors border border-zinc-500 text-zinc-300 hover:bg-zinc-700 hover:border-zinc-400">
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

const SuggestionsCard = () => {
  const { data: session } = useSession();
  const [suggestions, setSuggestions] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserFollowing, setCurrentUserFollowing] = useState<string[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [suggestionsRes, profileRes] = await Promise.all([
        fetch("/api/users/suggestions"),
        session?.user?.username ? fetch(`/api/profile?userid=${session.user.username}`) : Promise.resolve(null)
      ]);

      if (suggestionsRes.ok) {
        const suggestionsData = await suggestionsRes.json();
        const allSuggestions: UserSummary[] = suggestionsData.data || [];
        const sessionUser = session?.user as SessionUser;
        // Filter out the current user from the suggestions list
        const filteredSuggestions = allSuggestions.filter(
          (u) => u.username !== sessionUser?.username
        );
        setSuggestions(filteredSuggestions);
      }

      if (profileRes && profileRes.ok) {
        const profileData = await profileRes.json();
        setCurrentUserFollowing(profileData.data?.following || []);
      }

    } catch (error) {
      console.error("Failed to fetch data for suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  return (
    <div className="bg-[#2b2b2b] p-5 rounded-2xl shadow-lg border border-zinc-700/50">
      <h3 className="text-lg font-bold text-white mb-4">People you may know</h3>
      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-zinc-700"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-zinc-700 rounded w-3/4"></div>
                <div className="h-2 bg-zinc-700 rounded w-1/2"></div>
              </div>
            </div>
          ))
        ) : suggestions.length > 0 ? (
          suggestions.map((user) => (
            <SuggestionItem
              key={user._id}
              user={user}
              onFollow={fetchData}
              isFollowing={currentUserFollowing.includes(user._id)}
            />
          ))
        ) : (
          <p className="text-sm text-zinc-500 text-center py-4">No new suggestions.</p>
        )}
      </div>
      <button
        onClick={fetchData}
        className="mt-6 w-full py-2 text-indigo-400 text-sm font-medium hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-colors"
      >
        More suggestions
      </button>
    </div>
  );
};
