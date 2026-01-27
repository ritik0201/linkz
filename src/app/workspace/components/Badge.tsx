export default function Badge({ label }: { label: string }) {
  return (
    <span className="px-3 py-1 rounded-full text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20">
      {label}
    </span>
  );
}
