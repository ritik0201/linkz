"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Rocket,
  Users,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Star,
  ThumbsUp,
  Search,
  ChevronRight,
  Plus,
  Loader2,
  Lock
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import "./dashboard.css";

export default function StartupDashboard() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [marketplaceProjects, setMarketplaceProjects] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'marketplace'>('overview');
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalInterested: 0,
    totalLikes: 0,
    teamSize: 0
  });

  useEffect(() => {
    if (status === "authenticated") {
      fetchDashboardData();
    }
  }, [status]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // @ts-ignore
      const userId = session?.user?._id || session?.user?.id;

      // Fetch my projects
      const myRes = await fetch(`/api/auth/ProjectOrResearch?userid=${userId}`);
      const myData = await myRes.json();
      const projects = myData.data || [];
      setMyProjects(projects);

      // Fetch all projects for marketplace (excluding mine)
      const allRes = await fetch("/api/posts");
      const allData = await allRes.json();
      const allFeed = allData.data || [];
      const marketplace = allFeed.filter((item: any) =>
        item.type === 'project' && item.userId?._id !== userId
      );
      setMarketplaceProjects(marketplace);

      // Calculate Stats
      const totalLikes = projects.reduce((acc: number, p: any) => acc + (p.likes?.length || 0), 0);
      const totalInterested = projects.reduce((acc: number, p: any) => acc + (p.interested?.length || 0), 0);
      const teamSize = projects.reduce((acc: number, p: any) => acc + (p.teamMembers?.length || 0), 0);

      setStats({
        totalProjects: projects.length,
        totalInterested,
        totalLikes,
        teamSize
      });

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (postId: string, targetUser: string) => {
    try {
      const res = await fetch("/api/auth/ProjectOrResearch", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, action: "approve", targetUser }),
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Failed to approve user:", error);
    }
  };

  const handleBuyOrInterest = async (postId: string) => {
    // @ts-ignore
    const username = session?.user?.username;
    if (!username) return;

    try {
      const res = await fetch("/api/auth/ProjectOrResearch", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, action: "interested", username }),
      });
      if (res.ok) {
        fetchDashboardData();
        alert("Interest expressed successfully!");
      }
    } catch (error) {
      console.error("Failed to express interest:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    );
  }

  if (status === "unauthenticated" || (session?.user as any)?.role !== 'startup') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl max-w-md text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-zinc-400 mb-8">This dashboard is exclusively for startup verified accounts. Please sign in as a startup to continue.</p>
          <Link href="/startup/signin" className="w-full inline-block py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20">
            Sign In as Startup
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-zinc-300">
      <Navbar />

      <div className="container mx-auto pt-28 pb-20 px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-4 border border-indigo-500/20">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              Startup Console
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Welcome, <span className="gradient-text">{session?.user?.name || "Founder"}</span>
            </h1>
            <p className="mt-2 text-zinc-400 max-w-lg">
              Manage your technical roadmap, track candidate engagement, and discover breakthrough research.
            </p>
          </div>
          <Link href="/#create-post" className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20">
            <Plus size={20} />
            Post New Project
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Total Projects"
            value={stats.totalProjects}
            icon={<Rocket className="text-blue-400" />}
            change="+2 this week"
          />
          <StatCard
            title="Talent Interested"
            value={stats.totalInterested}
            icon={<Users className="text-purple-400" />}
            change="+5 new apps"
          />
          <StatCard
            title="Total Likes"
            value={stats.totalLikes}
            icon={<ThumbsUp className="text-pink-400" />}
            change="Strong engagement"
          />
          <StatCard
            title="Active Team"
            value={stats.teamSize}
            icon={<TrendingUp className="text-green-400" />}
            change="Growing fast"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-zinc-900/50 p-1 rounded-2xl border border-zinc-800/50 mb-8 w-fit">
          <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Overview" />
          <TabButton active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} label="My Projects" />
          <TabButton active={activeTab === 'marketplace'} onClick={() => setActiveTab('marketplace')} label="Discover Talent" />
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <SectionHeader title="Active Recruitment" subtitle="People interested in your current projects" />
                <div className="space-y-4">
                  {myProjects.some(p => p.interested?.length > 0) ? (
                    myProjects.flatMap(project =>
                      (project.interested || []).map((username: string) => (
                        <InterestedCard
                          key={`${project._id}-${username}`}
                          username={username}
                          projectTitle={project.topic}
                          onApprove={() => handleApprove(project._id, username)}
                        />
                      ))
                    )
                  ) : (
                    <EmptyState
                      icon={<Users size={40} />}
                      title="No current applicants"
                      description="Share your projects to the feed to attract top developers."
                    />
                  )}
                </div>
              </div>
              <div className="space-y-8">
                <SectionHeader title="Market Highlights" subtitle="Top research in your niche" />
                <div className="space-y-4">
                  {marketplaceProjects.slice(0, 3).map(p => (
                    <MarketMiniCard key={p._id} project={p} />
                  ))}
                  <button onClick={() => setActiveTab('marketplace')} className="w-full py-3 text-sm font-medium text-indigo-400 hover:text-indigo-300 border border-zinc-800 rounded-xl hover:bg-zinc-800/50 transition-all">
                    Explore All Marketplace
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProjects.length > 0 ? (
                myProjects.map(p => (
                  <ProjectCard key={p._id} project={p} isOwner={true} />
                ))
              ) : (
                <div className="col-span-full">
                  <EmptyState
                    icon={<Briefcase size={40} />}
                    title="No projects yet"
                    description="Start by posting your startup's technical projects or research needs."
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'marketplace' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <SectionHeader title="Technical Marketplace" subtitle="Discover breakthrough research and projects from global talent" />
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    type="text"
                    placeholder="Search by tech stack..."
                    className="pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 transition-all w-full md:w-64"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketplaceProjects.map(p => (
                  <ProjectCard
                    key={p._id}
                    project={p}
                    isOwner={false}
                    onAction={() => handleBuyOrInterest(p._id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

// Sub-components
const StatCard = ({ title, value, icon, change }: any) => (
  <div className="glass-panel p-6 rounded-3xl stat-card">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-zinc-800/50 rounded-2xl">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <span className="text-zinc-500 text-xs font-medium">{change}</span>
    </div>
    <p className="text-zinc-400 text-sm font-medium">{title}</p>
    <p className="text-3xl font-bold text-white mt-1 tabular-nums">{value}</p>
  </div>
);

const TabButton = ({ active, onClick, label }: any) => (
  <button
    onClick={onClick}
    className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${active
        ? "bg-zinc-800 text-white shadow-lg"
        : "text-zinc-500 hover:text-zinc-300"
      }`}
  >
    {label}
  </button>
);

const SectionHeader = ({ title, subtitle }: any) => (
  <div>
    <h2 className="text-xl font-bold text-white">{title}</h2>
    <p className="text-sm text-zinc-500">{subtitle}</p>
  </div>
);

const ProjectCard = ({ project, isOwner, onAction }: any) => (
  <div className="glass-panel rounded-3xl overflow-hidden group border border-zinc-800 hover:border-zinc-700 transition-all">
    <div className="h-40 overflow-hidden relative">
      <img src={project.image || project.coverImage} alt={project.topic} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold text-indigo-400 border border-white/10">
        {project.category}
      </div>
    </div>
    <div className="p-5">
      <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{project.topic}</h3>
      <p className="text-sm text-zinc-400 line-clamp-2 mb-4 h-10">
        {project.description || project.content}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 text-zinc-500">
            <ThumbsUp size={14} />
            <span className="text-xs font-medium">{project.likes?.length || 0}</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-500">
            <MessageSquare size={14} />
            <span className="text-xs font-medium">{project.comments?.length || 0}</span>
          </div>
        </div>
        {!isOwner && (
          <button
            onClick={onAction}
            className="px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-xl text-xs font-bold transition-all border border-indigo-500/20"
          >
            Interested / Buy
          </button>
        )}
      </div>
    </div>
  </div>
);

const InterestedCard = ({ username, projectTitle, onApprove }: any) => (
  <div className="flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl hover:bg-zinc-800/30 transition-all">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
        {username.charAt(0).toUpperCase()}
      </div>
      <div>
        <h4 className="font-bold text-white">@{username}</h4>
        <p className="text-xs text-zinc-500">Interested in: <span className="text-indigo-400">{projectTitle}</span></p>
      </div>
    </div>
    <div className="flex gap-2">
      <Link href={`/user/${username}`} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-all">
        <ExternalLink size={18} />
      </Link>
      <button
        onClick={onApprove}
        className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white rounded-xl text-xs font-bold transition-all border border-green-500/20"
      >
        <CheckCircle2 size={16} />
        Approve
      </button>
    </div>
  </div>
);

const MarketMiniCard = ({ project }: any) => (
  <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-zinc-900/50 transition-all border border-transparent hover:border-zinc-800 group">
    <img src={project.image || project.coverImage} className="w-14 h-14 rounded-xl object-cover shrink-0" />
    <div className="min-w-0">
      <h4 className="text-sm font-bold text-white truncate">{project.topic}</h4>
      <div className="flex items-center gap-3 mt-1">
        <span className="text-[10px] text-zinc-500 uppercase font-bold">{project.category}</span>
        <div className="flex items-center gap-1 text-zinc-500">
          <Star size={10} className="text-yellow-500 fill-yellow-500" />
          <span className="text-[10px]">{project.interested?.length || 0}</span>
        </div>
      </div>
    </div>
    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
      <ChevronRight size={16} className="text-indigo-400" />
    </div>
  </div>
);

const EmptyState = ({ icon, title, description }: any) => (
  <div className="flex flex-col items-center justify-center p-12 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-3xl text-center">
    <div className="text-zinc-600 mb-4">{icon}</div>
    <h3 className="text-white font-bold mb-1">{title}</h3>
    <p className="text-sm text-zinc-500 max-w-xs">{description}</p>
  </div>
);