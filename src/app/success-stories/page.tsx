import React from 'react';
import { Quote, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const stories = [
  {
    company: "FinTech Solutions",
    title: "Scaling from MVP to Series A in 6 Months",
    description: "How a small team of founders used CollabX to find the perfect lead engineer and UI designer to build their prototype.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2132&auto=format&fit=crop",
    quote: "CollabX didn't just give us resumes; it gave us partners who believed in our vision.",
    author: "Sarah Jenkins, CEO"
  },
  {
    company: "GreenEarth AI",
    title: "Revolutionizing Agriculture with Remote Talent",
    description: "Connecting with a data scientist from Brazil and a hardware engineer from Germany allowed GreenEarth to solve a critical crop monitoring challenge.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop",
    quote: "The quality of talent on this platform is unmatched. We built a world-class team without borders.",
    author: "David Chen, CTO"
  },
  {
    company: "HealthSync",
    title: "Building a HIPAA-Compliant App Fast",
    description: "Facing a tight deadline, HealthSync hired three specialized developers through CollabX and delivered their app 2 weeks ahead of schedule.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop",
    quote: "Speed and security were our top priorities. CollabX delivered on both fronts.",
    author: "Dr. Emily Ross, Founder"
  }
];

const SuccessStoriesPage = () => {
  return (
    <div className="bg-zinc-900 text-white min-h-screen">
      <div className="bg-zinc-950 pt-32 pb-20 border-b border-zinc-800">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-violet-400 mb-6">
            Success Stories
          </h1>
          <p className="text-lg text-zinc-400 max-w-3xl mx-auto">
            See how innovative companies and talented professionals are achieving the extraordinary together on CollabX.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-20">
        <div className="space-y-24">
          {stories.map((story, index) => (
            <div key={index} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}>
              {/* Image Side */}
              <div className="w-full lg:w-1/2">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 group">
                  <div className="absolute inset-0 bg-indigo-600/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src={story.image} alt={story.company} className="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-700" />
                </div>
              </div>

              {/* Content Side */}
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-1 w-12 bg-indigo-500 rounded-full"></div>
                  <span className="text-indigo-400 font-semibold tracking-wide uppercase text-sm">{story.company}</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">{story.title}</h2>
                <p className="text-zinc-400 text-lg leading-relaxed">{story.description}</p>
                
                <div className="bg-zinc-800/50 p-6 rounded-xl border-l-4 border-indigo-500 mt-6">
                  <Quote className="text-indigo-400 mb-3 opacity-50" size={24} />
                  <p className="italic text-zinc-300 mb-4 text-lg">"{story.quote}"</p>
                  <p className="font-bold text-white text-sm">— {story.author}</p>
                </div>

                <div className="pt-4">
                  <Link href="#" className="inline-flex items-center gap-2 text-white font-semibold hover:text-indigo-400 transition-colors group">
                    Read Full Case Study <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-[#1c1c1c] border-t border-zinc-800 py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to write your own success story?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/hire-talent">
              <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold transition-colors">
                Hire Talent
              </button>
            </Link>
            <Link href="/find-work">
              <button className="px-8 py-3 bg-transparent border border-zinc-600 hover:bg-zinc-800 text-white rounded-full font-semibold transition-colors">
                Find Work
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessStoriesPage;
