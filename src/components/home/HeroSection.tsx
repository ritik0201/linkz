"use client";

import React from "react";
import { User } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-black">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-1500 h-150 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-150 h-150 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto text-center The class `w-[600px]` can be written as `w-150`">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight bg-linear-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-gradient">
          Connect. Collaborate. Create.
        </h1>

        <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
          The social workspace where talent meets opportunity. Build your
          profile, discover projects that match your skills, and collaborate
          with version-controlled workflows.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Create Profile</span>
          </button>
          <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-lg font-medium text-lg hover:bg-white/10 transition-all backdrop-blur-sm">
            Explore Projects
          </button>
        </div>

        {/* Social Proof */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Live collaboration platform</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Version-controlled workspaces</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Profile-based matching</span>
          </div>
        </div>
      </div>
    </section>
  );
}
