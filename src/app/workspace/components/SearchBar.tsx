import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-4 top-3 text-white/40" size={18} />
      <input
        className="w-full pl-12 pr-4 py-3 bg-[#0B0D16] rounded-lg outline-none border border-white/10 placeholder:text-white/40"
        placeholder="Search projects..."
      />
    </div>
  );
}
