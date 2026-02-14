"use client";

interface StatBoxProps {
  label: string;
  value: string | number;
}

export default function StatBox({ label, value }: StatBoxProps) {
  return (
    <div className="border border-white/10 bg-[#0B0D16] rounded-xl p-4">
      <p className="text-white/60 text-sm">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}
