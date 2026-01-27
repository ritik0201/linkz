export default function StatBox({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="border border-white/10 rounded-xl p-6 bg-[#0B0D16]">
      <div className="text-2xl font-semibold text-blue-400">{value}</div>
      <div className="text-white/50 text-sm">{label}</div>
    </div>
  );
}
