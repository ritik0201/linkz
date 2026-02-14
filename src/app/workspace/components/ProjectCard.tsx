"use client";

import { useRouter } from "next/navigation";
import Badge from "./Badge";

export default function ProjectCard({
  projectId,
  status,
  category,
  title,
  desc,
  progress,
  tags,
  members,
}: {
  projectId: string;
  status: string;
  category: string;
  title: string;
  desc: string;
  progress: number;
  tags: string[];
  members: string[];
}) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/workspace/${projectId}`)}
      className="border border-white/10 rounded-2xl p-6 bg-[#0B0D16]
                 hover:border-blue-500/30 transition cursor-pointer"
    >
      <div className="flex gap-2 mb-3">
        <Badge label={status} />
        <Badge label={category} />
      </div>

      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-white/50 text-sm mb-4">{desc}</p>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1 text-white/60">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full">
          <div
            className="h-2 bg-blue-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {members.map((m) => (
          <div
            key={m}
            className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-xs"
          >
            {m}
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {tags.map((t) => (
          <span
            key={t}
            className="px-3 py-1 bg-white/10 rounded-full text-xs text-blue-300"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
