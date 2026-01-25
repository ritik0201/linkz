import {
  Users,
  Briefcase,
  Search,
  BookOpen,
  DollarSign,
  Globe,
} from "lucide-react";

const services = [
  {
    icon: <Users size={28} />,
    title: "Project Collaboration",
    description:
      "Work with like-minded people on real-world projects, hackathons, and startup ideas — all in one place.",
  },
  {
    icon: <Briefcase size={28} />,
    title: "Team Formation",
    description:
      "Find teammates based on skills, interests, and availability. Build teams that actually work.",
  },
  {
    icon: <Search size={28} />,
    title: "Skill-Based Matching",
    description:
      "Smart matching connects you with collaborators who complement your skills and goals.",
  },
  {
    icon: <BookOpen size={28} />,
    title: "Research & Project Showcase",
    description:
      "Upload, showcase, and explore research papers and projects with preview access.",
  },
  {
    icon: <DollarSign size={28} />,
    title: "Paid Knowledge Exchange",
    description:
      "Monetize your work by selling premium project access, research insights, or mentorship.",
  },
  {
    icon: <Globe size={28} />,
    title: "Opportunities Hub",
    description:
      "Discover internships, freelance gigs, and collaboration opportunities from around the world.",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          What CollabX Offers
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Everything you need to connect, collaborate, and create — built for
          students, developers, researchers, and creators.
        </p>
      </div>

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition"
          >
            <div className="text-yellow-400 mb-4">{service.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-400 text-sm">{service.description}</p>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div className="max-w-5xl mx-auto mt-24 text-center">
        <h2 className="text-3xl font-bold mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div>
            <h4 className="font-semibold mb-2">1. Create Your Profile</h4>
            <p className="text-gray-400 text-sm">
              Showcase your skills, interests, and what you’re looking to build.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">2. Find & Collaborate</h4>
            <p className="text-gray-400 text-sm">
              Join projects, form teams, or start something new.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">3. Build & Grow</h4>
            <p className="text-gray-400 text-sm">
              Publish work, earn opportunities, and grow your network.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto mt-24 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Collaborate?</h2>
        <p className="text-gray-400 mb-6">
          Join CollabX and start building meaningful projects today.
        </p>
        <button className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition">
          Get Started
        </button>
      </div>
    </div>
  );
}
