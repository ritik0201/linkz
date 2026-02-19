import React from "react";
import Link from "next/link";
import { Building2, Globe, ShieldCheck } from "lucide-react";

const BusinessServicesPage = () => {
    return (
        <main className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-24 max-w-6xl">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-6 text-white">
                        Business Solutions
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        Scale your team, manage your workforce, and grow your business with CollaBharat Enterprise.
                    </p>
                </div>

                <div className="space-y-12">
                    <div className="flex flex-col md:flex-row gap-8 items-center bg-[#2b2b2b] p-8 rounded-3xl border border-zinc-700">
                        <div className="md:w-1/2">
                            <div className="w-12 h-12 bg-indigo-900/50 rounded-xl flex items-center justify-center text-indigo-400 mb-6">
                                <Building2 size={24} />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Talent Solutions</h2>
                            <p className="text-zinc-400 mb-6 text-lg">
                                Find and hire the right people faster. Access our complete database of verified professionals.
                            </p>
                            <Link href="/hire-talent" className="text-indigo-400 font-bold hover:underline">Learn more</Link>
                        </div>
                        <div className="md:w-1/2 h-64 bg-zinc-800 rounded-2xl w-full"></div>
                    </div>

                    <div className="flex flex-col md:flex-row-reverse gap-8 items-center bg-[#2b2b2b] p-8 rounded-3xl border border-zinc-700">
                        <div className="md:w-1/2">
                            <div className="w-12 h-12 bg-purple-900/50 rounded-xl flex items-center justify-center text-purple-400 mb-6">
                                <Globe size={24} />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Marketing Solutions</h2>
                            <p className="text-zinc-400 mb-6 text-lg">
                                Build your brand and reach decision-makers. Showcase your company culture to attract top talent.
                            </p>
                            <Link href="/advertising" className="text-purple-400 font-bold hover:underline">Learn more</Link>
                        </div>
                        <div className="md:w-1/2 h-64 bg-zinc-800 rounded-2xl w-full"></div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default BusinessServicesPage;
