import { Plus } from "lucide-react";

export default function Header() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">Welcome back!</h1>
        <p className="text-white/60 text-sm md:text-base">
          Manage your collaborative projects and contributions
        </p>
      </div>

      <button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 text-sm md:text-base font-medium">
        <Plus size={18} />
        New Project
      </button>
    </div>
  );
}
