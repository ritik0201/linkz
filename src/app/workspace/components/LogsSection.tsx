"use client";

import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";

interface LogsSectionProps {
  projectId: string;
}

export interface LogsSectionHandle {
  fetchLogs: () => void;
}

interface WorkLog {
  _id: string;
  title: string;
  description?: string;
  userId: { name?: string } | string;
  createdAt: string;
}

const LogsSection = forwardRef<LogsSectionHandle, LogsSectionProps>(
  ({ projectId }, ref) => {
    const [logs, setLogs] = useState<WorkLog[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/workspace/logs/${projectId}`);
        const data = await res.json();
        setLogs(data.logs || []);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      } finally {
        setLoading(false);
      }
    };

    useImperativeHandle(ref, () => ({ fetchLogs }));

    useEffect(() => {
      fetchLogs();
    }, [projectId]);

    return (
      <div className="space-y-3 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {loading ? (
          <div className="text-white/50 text-sm text-center">
            Loading logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="text-white/50 text-sm text-center">No logs yet.</div>
        ) : (
          logs.map((log) => (
            <div
              key={log._id}
              className="border border-white/10 p-3 rounded-lg bg-white/5"
            >
              <div className="text-white/80 font-medium">{log.title}</div>
              {log.description && (
                <div className="text-white/50 text-sm mt-1">
                  {log.description}
                </div>
              )}
              <div className="text-white/40 text-xs mt-1">
                {typeof log.userId === "object" && log.userId.name
                  ? log.userId.name
                  : "Unknown User"}{" "}
                • {new Date(log.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    );
  },
);

LogsSection.displayName = "LogsSection";

export default LogsSection;
