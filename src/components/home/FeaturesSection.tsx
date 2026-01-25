"use client";

import React from "react";
import { Users, Briefcase, GitBranch, MessageSquare } from "lucide-react";

const features = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "Profile-Based Matching",
    description:
      "Create detailed profiles showcasing your skills to attract collaborators",
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "Smart Project Discovery",
    description: "Find niche-specific projects that match your skills",
  },
  {
    icon: <GitBranch className="w-6 h-6" />,
    title: "Version Control Logs",
    description: "Track progress with version-controlled logs",
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Integrated Communication",
    description: "Built-in chat and file sharing to keep your team connected",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Why Choose CollabX?</h2>
        <p className="text-xl text-gray-400">
          A social platform designed for professional collaboration
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-blue-500/50 transition-all hover:shadow-xl cursor-pointer"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
