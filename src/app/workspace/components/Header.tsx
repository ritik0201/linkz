import { Plus } from "lucide-react";

export default function Header() {
  return (
    <div className="flex justify-between items-start mb-8">
      <div>
        <h1 className="text-3xl font-semibold">Welcome back!</h1>
        <p className="text-white/60">
          Manage your collaborative projects and contributions
        </p>
      </div>

      <button className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-red-600/20">
        <Plus size={18} />
        New Project
      </button>
    </div>
  );
}
