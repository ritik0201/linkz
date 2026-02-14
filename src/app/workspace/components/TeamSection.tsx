"use client";

import React, { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";

interface TeamMember {
  id: string;
  approved: boolean;
}

interface TeamSectionProps {
  projectSlug: string;
}

export default function TeamSection({ projectSlug }: TeamSectionProps) {
  const { data: session, status } = useSession();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMembers() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/workspace/team/${projectSlug}`, {
          credentials: "same-origin",
        });

        if (!res.ok) {
          console.error("Failed to fetch team:", res.status);
          setError("Failed to fetch team");
          return;
        }

        const data = await res.json();
        setMembers(data.members || []);
      } catch (err) {
        console.error("Error fetching team:", err);
        setError("Error fetching team");
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();
  }, [projectSlug]);

  async function handleAction(userId: string, action: "approve" | "remove") {
    // require client session before attempting the API call
    if (status === "loading") return;
    if (!session?.user) {
      setError("You must be signed in to manage team members");
      // open sign-in modal/page
      signIn();
      return;
    }

    try {
      const res = await fetch(`/api/workspace/team/${projectSlug}`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => null);
        console.error("Failed to update member", res.status, text);
        setError("Failed to update member");
        return;
      }

      setMembers((prev) =>
        prev.map((m) =>
          m.id === userId ? { ...m, approved: action === "approve" } : m,
        ),
      );
    } catch (err) {
      console.error("Error updating member:", err);
      setError("Error updating member");
    }
  }

  if (loading) return <p className="text-white/50">Loading team...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (members.length === 0)
    return <p className="text-white/50">No team members.</p>;

  return (
    <div className="space-y-3">
      {/* show sign-in hint when user is not authenticated */}
      {!session?.user && (
        <div className="p-3 rounded-lg bg-yellow-900/20 border border-yellow-600 text-yellow-300 text-sm flex items-center justify-between">
          <div>Sign in to approve or remove team members.</div>
          <button
            onClick={() => signIn()}
            className="px-3 py-1 bg-yellow-600/80 hover:bg-yellow-500 rounded text-xs"
          >
            Sign in
          </button>
        </div>
      )}

      {members.map((m) => (
        <div
          key={m.id}
          className="flex justify-between items-center bg-[#0B0D16] p-3 rounded-lg border border-white/10"
        >
          <p className="text-white">{m.id}</p>

          {!session?.user ? (
            <button
              onClick={() => signIn()}
              className="bg-zinc-700/30 px-3 py-1 rounded text-white text-sm cursor-pointer disabled:opacity-60"
            >
              Sign in to manage
            </button>
          ) : !m.approved ? (
            <button
              onClick={() => handleAction(m.id, "approve")}
              className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-white text-sm"
            >
              Approve
            </button>
          ) : (
            <button
              onClick={() => handleAction(m.id, "remove")}
              className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-white text-sm"
            >
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
