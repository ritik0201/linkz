import React from "react";
import Link from "next/link";
import { ArrowRight, Target, BarChart, Users } from "lucide-react";

const AdvertisingPage = () => {
    return (
        <main className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-24 max-w-6xl">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                        Advertise with CollaBharat
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        Reach a highly engaged audience of startups, founders, and skilled professionals.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-[#2b2b2b] p-8 rounded-2xl border border-zinc-700">
                        <Target className="w-12 h-12 text-indigo-500 mb-6" />
                        <h3 className="text-2xl font-bold mb-4">Precise Targeting</h3>
                        <p className="text-zinc-400">
                            Target mainly based on skills, roles, industries, and interests to reach the exact talent or decision-makers you need.
                        </p>
                    </div>
                    <div className="bg-[#2b2b2b] p-8 rounded-2xl border border-zinc-700">
                        <Users className="w-12 h-12 text-purple-500 mb-6" />
                        <h3 className="text-2xl font-bold mb-4">Premium Audience</h3>
                        <p className="text-zinc-400">
                            Engage with a verified community of ambitious professionals and high-growth startups.
                        </p>
                    </div>
                    <div className="bg-[#2b2b2b] p-8 rounded-2xl border border-zinc-700">
                        <BarChart className="w-12 h-12 text-pink-500 mb-6" />
                        <h3 className="text-2xl font-bold mb-4">Measurable Results</h3>
                        <p className="text-zinc-400">
                            Track your campaigns with detailed analytics and insights to optimize your ROI.
                        </p>
                    </div>
                </div>

                <div className="text-center">
                    <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-lg transition-all hover:scale-105">
                        Start Advertising <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default AdvertisingPage;
