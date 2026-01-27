export default function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition ${
        active
          ? "bg-blue-500/10 text-blue-400 font-medium"
          : "text-white/60 hover:bg-white/5"
      }`}
    >
      {icon}
      {label}
    </div>
  );
}
