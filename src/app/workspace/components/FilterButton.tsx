export default function FilterButton({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  return (
    <button
      className={`px-4 py-1.5 rounded-full border text-sm transition ${
        active
          ? "bg-blue-600 text-white border-blue-600"
          : "border-white/10 text-white/60 hover:bg-white/5"
      }`}
    >
      {label}
    </button>
  );
}
