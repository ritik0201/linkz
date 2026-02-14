"use client";

import React, { useRef } from "react";
import { useSearchParams } from "next/navigation";

import ChatPanel from "../components/ChatPanel";
import LogsSection from "../components/LogsSection";
import TeamSection from "../components/TeamSection";
import OverviewSection from "../components/OverviewSection";
import TaskForm from "../components/TaskForm";
import FileUpload from "../components/FileUpload";

interface WorkspacePageProps {
  params: Promise<{ projectId: string }>;
}

export default function WorkspacePage({ params }: WorkspacePageProps) {
  // ✅ Unwrap params for Next.js 16+
  const { projectId } = React.use(params);

  const searchParams = useSearchParams();
  const activeTab =
    (searchParams.get("tab") as
      | "overview"
      | "logs"
      | "contributions"
      | "team"
      | "activity"
      | "chat") || "overview";

  // Ref to reload logs after task/file actions
  const logsRef = useRef<any>(null);
  function refetchLogs() {
    logsRef.current?.fetchLogs?.();
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Workspace</h1>
        <p className="text-white/50 mt-1">
          Project ID: <span className="text-blue-400">{projectId}</span>
        </p>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <Section title="Overview">
          <OverviewSection projectId={projectId} />
          <TaskForm projectId={projectId} onTaskAdded={() => refetchLogs()} />
          <FileUpload
            projectId={projectId}
            onFileUploaded={() => refetchLogs()}
          />
        </Section>
      )}

      {/* Logs Tab */}
      {activeTab === "logs" && (
        <Section title="Logs">
          <LogsSection ref={logsRef} projectId={projectId} />
        </Section>
      )}

      {/* Contributions Tab */}
      {activeTab === "contributions" && (
        <Section title="Contributions">
          Member contributions will go here.
        </Section>
      )}

      {/* Team Tab */}
      {activeTab === "team" && (
        <Section title="Team">
          <TeamSection projectSlug={projectId} />
        </Section>
      )}

      {/* Activity Tab */}
      {activeTab === "activity" && (
        <Section title="Activity">Recent activity feed will go here.</Section>
      )}

      {/* Chat Tab */}
      {activeTab === "chat" && <ChatPanel projectId={projectId} />}
    </div>
  );
}

// Reusable section wrapper to avoid <p> inside <p> issues
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-white/10 bg-[#0B0D16] rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="text-white/70 space-y-4">{children}</div>
    </div>
  );
}

