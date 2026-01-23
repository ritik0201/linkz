import { User, Search, Users, Zap } from "lucide-react";

const steps = [
  { step: "01", title: "Create Profile", icon: User },
  { step: "02", title: "Discover Projects", icon: Search },
  { step: "03", title: "Build Team", icon: Users },
  { step: "04", title: "Workspace Ready", icon: Zap },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((s, i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <div className="flex justify-between mb-4">
              <span className="text-5xl font-bold text-blue-400/20">
                {s.step}
              </span>
              <s.icon className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold">{s.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
