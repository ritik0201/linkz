import Link from "next/link";
import { ArrowRight, Rocket, Users, Target, Shield } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white dark:bg-zinc-950 selection:bg-indigo-500/30 overflow-hidden">
      {/* ===== INLINE ANIMATIONS (VISUAL ONLY) ===== */}
      <style>{`
        @keyframes bubbleFloat {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(60px, -80px) scale(1.05); }
          100% { transform: translate(0, 0) scale(1); }
        }

        @keyframes rainFall {
          0% { transform: translateY(-120%); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: translateY(120vh); opacity: 0; }
        }

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* ===== ANIMATED BACKGROUND ===== */}
      <AnimatedBubbles />
      <AnimatedRain />

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
              <span
                className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400"
                style={{
                  backgroundSize: "300% 300%",
                  animation: "gradientMove 8s ease infinite",
                }}
              >
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
                Hire Talent <ArrowRight size={20} />
              </Link>

              <Link
                href="/user/signin"
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-indigo-600 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-500 rounded-xl font-bold text-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Find Work <Users size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-zinc-50/50 dark:bg-zinc-900/50 relative">
        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard icon={<Rocket size={32} />} title="Fast Matching" description="AI-powered matching in hours." />
          <FeatureCard icon={<Shield size={32} />} title="Verified Talent" description="Rigorously vetted developers." />
          <FeatureCard icon={<Target size={32} />} title="Startup Focused" description="Built for high-growth teams." />
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* ===== VISUAL ONLY COMPONENTS ===== */

const AnimatedBubbles = () => (
  <div className="absolute inset-0 -z-20 pointer-events-none overflow-hidden">
    {[...Array(7)].map((_, i) => (
      <span
        key={i}
        className="absolute rounded-full bg-indigo-500/10 blur-[120px]"
        style={{
          width: `${320 + i * 120}px`,
          height: `${320 + i * 120}px`,
          left: `${(i * 17) % 100}%`,
          top: `${(i * 21) % 100}%`,
          animation: `bubbleFloat ${28 + i * 6}s ease-in-out infinite`,
        }}
      />
    ))}
  </div>
);

const AnimatedRain = () => (
  <div className="absolute inset-0 -z-20 pointer-events-none overflow-hidden">
    {[...Array(90)].map((_, i) => (
      <span
        key={i}
        className="absolute top-0 w-px h-28 bg-gradient-to-b from-transparent via-indigo-400/30 to-transparent"
        style={{
          left: `${(i * 6) % 100}%`,
          animation: `rainFall ${1.8 + (i % 5) * 0.4}s linear infinite`,
          animationDelay: `${i * 0.1}s`,
        }}
      />
    ))}
  </div>
);

const FeatureCard = ({ icon, title, description }: any) => (
  <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1">
    <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">{title}</h3>
    <p className="text-zinc-600 dark:text-zinc-400">{description}</p>
  </div>
);
