import React, { useState } from "react";
import { Home, Folder, Users, Settings, Menu, X } from "lucide-react";
import NavItem from "./NavItem";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-indigo-600 text-white p-3 rounded-full shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 border-r border-white/10 px-6 py-6 flex flex-col justify-between bg-[#070810]
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
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
    </>
  );
}
