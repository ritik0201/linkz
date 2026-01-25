"use client";

import React from "react";

const useCases = [
  { title: "Students", desc: "Group projects & assignments", emoji: "🎓" },
  { title: "Hackathon Teams", desc: "Fast-paced collaborations", emoji: "⚡" },
  { title: "Freelancers", desc: "Remote project work", emoji: "💼" },
  { title: "Startups", desc: "Early-stage team building", emoji: "🚀" },
];

export default function UseCasesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 text-white">Perfect For</h2>
        <p className="text-xl text-gray-400">
          Built for modern collaborative teams
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {useCases.map((use, idx) => (
          <div
            key={idx}
            className="text-center p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
          >
            <div className="text-5xl mb-4">{use.emoji}</div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              {use.title}
            </h3>
            <p className="text-gray-400 text-sm">{use.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
