"use client";

import StatBox from "./StatBox";

interface Stat {
  label: string;
  value: string | number;
}

interface StatsGridProps {
  stats?: Stat[]; // 👈 optional on purpose
}

export default function StatsGrid({ stats = [] }: StatsGridProps) {
  // ✅ Guard clause (extra safety)
  if (!Array.isArray(stats) || stats.length === 0) {
    return (
      <div className="text-white/40 text-sm">No statistics available.</div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <StatBox key={index} label={stat.label} value={stat.value} />
      ))}
    </div>
  );
}
