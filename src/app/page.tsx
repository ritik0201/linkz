import Link from "next/link";
import { ArrowRight, Rocket, Users, Target, Shield } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 selection:bg-indigo-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-4 border border-indigo-100 dark:border-indigo-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              The Future of Startup Hiring
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Connect with <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400 animate-gradient bg-300%">
                World-Class Talent
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Linkz bridges the gap between ambitious startups and exceptional developers. Build your dream team today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/startup/signin"
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-indigo-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Hire Talent
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/user/signin"
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-indigo-600 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-500 rounded-xl font-bold text-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Find Work
                <Users size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Background Gradients & Bubbles */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          {/* Bubbles */}
          <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse mix-blend-multiply dark:mix-blend-screen"></div>
          <div className="absolute top-[10%] right-[-10%] w-[35rem] h-[35rem] bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-700 mix-blend-multiply dark:mix-blend-screen"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[45rem] h-[45rem] bg-pink-500/10 rounded-full blur-[100px] animate-pulse delay-1000 mix-blend-multiply dark:mix-blend-screen"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-zinc-50/50 dark:bg-zinc-900/50 relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Rocket size={32} />}
              title="Fast Matching"
              description="Our AI-driven algorithms connect you with the perfect candidates in hours, not weeks."
            />
            <FeatureCard
              icon={<Shield size={32} />}
              title="Verified Talent"
              description="Every candidate passes a rigorous vetting process to ensure top-tier quality."
            />
            <FeatureCard
              icon={<Target size={32} />}
              title="Startup Focused"
              description="We understand the unique needs of high-growth startups and equity-based hiring."
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group hover:-translate-y-1">
    <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">{title}</h3>
    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
      {description}
    </p>
  </div>
);
