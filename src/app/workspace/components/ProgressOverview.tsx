"use client";

interface ProgressOverviewProps {
  progress: number;
}

export default function ProgressOverview({ progress }: ProgressOverviewProps) {
  return (
    <div className="border border-white/10 bg-[#0B0D16] rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-3">Progress</h3>

      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-white/60 mt-2">{progress}% completed</p>
    </div>
  );
}
