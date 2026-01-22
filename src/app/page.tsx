import Link from "next/link";
import { ArrowRight, Rocket, Users, Target, Shield } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              The Future of Startup Hiring
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Connect with <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400">
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

        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors group">
    <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">{title}</h3>
    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
      {description}
    </p>
  </div>
);
