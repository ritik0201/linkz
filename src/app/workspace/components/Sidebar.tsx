import { Home, Folder, Users, Settings } from "lucide-react";
import NavItem from "./NavItem";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-white/10 px-6 py-6 flex flex-col justify-between bg-[#070810]">
      <div>
        <div className="flex items-center gap-2 text-xl font-semibold mb-10 text-blue-400">
          <span className="inline-block w-6 h-6 border border-blue-500 rounded" />
          CollabSphere
        </div>

        <nav className="space-y-2">
          <NavItem icon={<Home size={18} />} label="Dashboard" active />
          <NavItem icon={<Folder size={18} />} label="All Projects" />
          <NavItem icon={<Users size={18} />} label="Contributors" />
        </nav>
      </div>

      <NavItem icon={<Settings size={18} />} label="Settings" />
    </aside>
  );
}
