import React from 'react';
import { Search, MapPin, Clock, DollarSign, Briefcase, Filter, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const jobs = [
  {
    id: 1,
    title: "Senior Full Stack Developer",
    company: "TechNova",
    type: "Full-time",
    location: "Remote",
    salary: "$120k - $150k",
    posted: "2 days ago",
    tags: ["React", "Node.js", "TypeScript"],
    logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?q=80&w=2071&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "AI Research Scientist",
    company: "DeepMind X",
    type: "Contract",
    location: "London, UK",
    salary: "$80/hr",
    posted: "5 hours ago",
    tags: ["Python", "PyTorch", "Machine Learning"],
    logo: "https://images.unsplash.com/photo-1550525811-e5869dd03032?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Product Designer",
    company: "Creative Flow",
    type: "Part-time",
    location: "Remote",
    salary: "$60k - $80k",
    posted: "1 day ago",
    tags: ["Figma", "UI/UX", "Prototyping"],
    logo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Blockchain Engineer",
    company: "CryptoSecure",
    type: "Full-time",
    location: "New York, NY",
    salary: "$140k - $180k",
    posted: "3 days ago",
    tags: ["Solidity", "Rust", "Web3"],
    logo: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=1974&auto=format&fit=crop"
  }
];

const FindWorkPage = () => {
  return (
    <div className="bg-zinc-900 text-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-zinc-950 border-b border-zinc-800 pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-violet-400 mb-6">
            Find Your Next Game-Changing Project
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10">
            Browse thousands of job openings from innovative startups and established tech giants.
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-zinc-900 p-2 rounded-2xl border border-zinc-700 flex flex-col md:flex-row gap-2 shadow-2xl">
            <div className="flex-1 flex items-center px-4 bg-zinc-800/50 rounded-xl">
              <Search className="text-zinc-500 mr-3" size={20} />
              <input type="text" placeholder="Job title, keywords, or company" className="w-full bg-transparent py-3 focus:outline-none text-white placeholder-zinc-500" />
            </div>
            <div className="flex-1 flex items-center px-4 bg-zinc-800/50 rounded-xl border-t md:border-t-0 md:border-l border-zinc-700/50">
              <MapPin className="text-zinc-500 mr-3" size={20} />
              <input type="text" placeholder="City, state, or 'Remote'" className="w-full bg-transparent py-3 focus:outline-none text-white placeholder-zinc-500" />
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-12 flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-1/4 space-y-8">
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Filter size={18} /> Filters</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-zinc-400 hover:text-white cursor-pointer"><input type="checkbox" className="rounded border-zinc-700 bg-zinc-800 text-indigo-600" /> Full-time</label>
              <label className="flex items-center gap-2 text-zinc-400 hover:text-white cursor-pointer"><input type="checkbox" className="rounded border-zinc-700 bg-zinc-800 text-indigo-600" /> Contract</label>
              <label className="flex items-center gap-2 text-zinc-400 hover:text-white cursor-pointer"><input type="checkbox" className="rounded border-zinc-700 bg-zinc-800 text-indigo-600" /> Remote</label>
              <label className="flex items-center gap-2 text-zinc-400 hover:text-white cursor-pointer"><input type="checkbox" className="rounded border-zinc-700 bg-zinc-800 text-indigo-600" /> Freelance</label>
            </div>
          </div>
        </aside>

        {/* Job List */}
        <main className="lg:w-3/4 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Latest Opportunities</h2>
            <span className="text-zinc-500 text-sm">Showing {jobs.length} jobs</span>
          </div>

          {jobs.map((job) => (
            <div key={job.id} className="bg-[#1c1c1c] border border-zinc-800 hover:border-indigo-500/50 rounded-xl p-6 transition-all hover:shadow-lg hover:shadow-indigo-500/10 group">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <img src={job.logo} alt={job.company} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1 w-full">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{job.title}</h3>
                      <p className="text-zinc-400 font-medium">{job.company}</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {job.type}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-zinc-500 mb-4">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                    <span className="flex items-center gap-1"><DollarSign size={14} /> {job.salary}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {job.posted}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {job.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-xs rounded-md border border-indigo-500/20">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="w-full md:w-auto flex md:flex-col justify-end gap-2 mt-4 md:mt-0">
                   <button className="w-full md:w-auto px-6 py-2 bg-white text-black hover:bg-zinc-200 font-semibold rounded-lg transition-colors">Apply Now</button>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-8 flex justify-center">
             <button className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors font-medium">
                Load More Jobs <ArrowRight size={16} />
             </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FindWorkPage;
