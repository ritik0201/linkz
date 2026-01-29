import React from 'react';
import { CheckCircle, Search, Zap, Star, ArrowRight, Users, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: <Search className="text-indigo-400" size={32} />,
    title: "Smart Matching",
    description: "Our AI-driven algorithm connects you with candidates who have the exact skills and experience you need."
  },
  {
    icon: <ShieldCheck className="text-indigo-400" size={32} />,
    title: "Vetted Professionals",
    description: "Every profile is verified. We ensure you only meet serious, high-quality talent ready to work."
  },
  {
    icon: <Zap className="text-indigo-400" size={32} />,
    title: "Fast Hiring",
    description: "Reduce your time-to-hire by up to 50%. Post a job and start interviewing candidates within hours."
  }
];

const HireTalentPage = () => {
  return (
    <div className="bg-zinc-900 text-white min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/80 via-zinc-900/90 to-zinc-900"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
            <Star size={14} className="fill-indigo-400" /> #1 Platform for Startup Talent
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Build Your <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-violet-400">Dream Team</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Access a global network of top-tier developers, designers, and innovators ready to help your startup scale.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/startup/dashboard" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
              Post a Job for Free <ArrowRight size={20} />
            </Link>
            <Link href="/pricing" className="w-full sm:w-auto px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold text-lg transition-all border border-zinc-700">
              View Pricing
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 bg-zinc-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Hire on CollabX?</h2>
            <p className="text-zinc-400">We make recruitment simple, efficient, and effective.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-indigo-500/30 transition-colors">
                <div className="w-14 h-14 bg-zinc-800 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Talent Categories */}
      <div className="py-20 border-t border-zinc-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">Explore Top Talent</h2>
              <p className="text-zinc-400">Browse professionals by category.</p>
            </div>
            <Link href="/find-talent" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 font-medium">
              View All Categories <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Full Stack Developers', 'UI/UX Designers', 'Data Scientists', 'Product Managers', 'DevOps Engineers', 'Mobile Developers', 'Blockchain Experts', 'AI Researchers'].map((category) => (
              <div key={category} className="group bg-[#1c1c1c] p-6 rounded-xl border border-zinc-800 hover:border-indigo-500 cursor-pointer transition-all">
                <h3 className="font-semibold text-zinc-200 group-hover:text-white">{category}</h3>
                <p className="text-sm text-zinc-500 mt-2 group-hover:text-indigo-400 transition-colors">1,200+ profiles</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-linear-to-r from-indigo-900/50 to-violet-900/50 border border-indigo-500/30 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl"></div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Ready to scale your team?</h2>
            <p className="text-xl text-zinc-300 mb-10 max-w-2xl mx-auto relative z-10">
              Join thousands of startups building the future with CollabX talent.
            </p>
            <button className="bg-white text-indigo-900 hover:bg-zinc-100 px-10 py-4 rounded-xl font-bold text-lg transition-colors relative z-10">
              Start Hiring Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HireTalentPage;
