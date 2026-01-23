import { User } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
        <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-purple-400 to-pink-400">
          Connect. Collaborate. Create.
        </span>
      </h1>

      <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
        A social workspace where talent meets opportunity and ideas turn into
        reality.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <div className="px-8 py-4 bg-blue-600 rounded-lg text-lg flex items-center gap-2">
          <User className="w-5 h-5" />
          Create Profile
        </div>
        <div className="px-8 py-4 bg-white/5 border border-white/10 rounded-lg text-lg">
          Explore Projects
        </div>
      </div>
    </section>
  );
}
