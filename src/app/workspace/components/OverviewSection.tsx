"use client";

import StatsGrid from "./StatsGrid";
import ProgressOverview from "./ProgressOverview";

interface OverviewSectionProps {
  projectId: string;
}

export default function OverviewSection({ projectId }: OverviewSectionProps) {
  const project = {
    name: "AI Task Manager",
    description: "A collaborative AI-powered task management platform.",
    status: "Active",
    progress: 65,
  };

  const stats = [
    { label: "Team Members", value: 4 },
    { label: "Total Logs", value: 18 },
    { label: "Last Activity", value: "2h ago" },
  ];

  return (
    <div className="space-y-6">
      {/* Project Info */}
      <div className="border border-white/10 bg-[#0B0D16] rounded-xl p-6">
        <h3 className="text-lg font-semibold">{project.name}</h3>
        <p className="text-white/70 mt-2">{project.description}</p>
        <span className="inline-block mt-3 text-sm px-3 py-1 rounded-full bg-green-500/10 text-green-400">
          {project.status}
        </span>
      </div>

      {/* Stats */}
      <StatsGrid stats={stats} />

      {/* Progress */}
      <ProgressOverview progress={project.progress} />
    </div>
  );
}
