import { Users, Briefcase, GitBranch, MessageSquare } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Profile-Based Matching",
    desc: "Showcase skills, projects, and expertise",
  },
  {
    icon: Briefcase,
    title: "Project Discovery",
    desc: "Find work aligned with your interests",
  },
  {
    icon: GitBranch,
    title: "Version Logs",
    desc: "Track progress like Git commits",
  },
  {
    icon: MessageSquare,
    title: "Team Communication",
    desc: "Chat and share resources in one place",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f, i) => (
          <div
            key={i}
            className="p-6 bg-white/5 border border-white/10 rounded-2xl"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <f.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
