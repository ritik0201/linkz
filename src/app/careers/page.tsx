"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Heart, Globe, Zap, Users, Coffee, Smile, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const benefits = [
    { icon: <Globe size={24} />, title: "Remote First", desc: "Work from anywhere in the world. We believe in talent, not geography." },
    { icon: <Heart size={24} />, title: "Comprehensive Health", desc: "Full medical, dental, and vision coverage for you and your dependents." },
    { icon: <Zap size={24} />, title: "High Impact", desc: "Work on challenges that matter. Your code will shape the future of startups." },
    { icon: <Coffee size={24} />, title: "Flexible Hours", desc: "We focus on output, not hours. Manage your time the way it works for you." },
    { icon: <Users size={24} />, title: "Team Retreats", desc: "Twice a year, we fly the whole team to an exotic location to bond and strategize." },
    { icon: <Smile size={24} />, title: "Learning Budget", desc: "$2,000 annual stipend for courses, conferences, and books." },
];

const positions = [
    { title: "Senior Full Stack Engineer", department: "Engineering", location: "Remote", type: "Full-time" },
    { title: "Product Designer", department: "Design", location: "Remote", type: "Full-time" },
    { title: "Growth Marketing Manager", department: "Marketing", location: "New York / Remote", type: "Full-time" },
    { title: "Developer Advocate", department: "Community", location: "London / Remote", type: "Full-time" },
];

const CareersPage = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
                </div>
                
                <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6">
                            We are hiring!
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                            Build the Future of <br />
                            <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                                Collaboration
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10">
                            Join a team of dreamers and doers. We're bridging the gap between ambitious startups and world-class talent.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a href="#positions" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold transition-all shadow-lg shadow-indigo-500/25">
                                View Openings
                            </a>
                            <Link href="/about" className="px-8 py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-full font-semibold transition-all">
                                Our Culture
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Values / Benefits Section */}
            <section className="py-20 bg-zinc-50 dark:bg-zinc-900/50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Why Join Linkz?</h2>
                        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                            We take care of our people so they can take care of the product. Here are just a few reasons to join our mission.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-colors group"
                            >
                                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    {benefit.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Unique "Life at Linkz" Section */}
            <section className="py-20 overflow-hidden">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-1/2 space-y-8">
                            <h2 className="text-3xl md:text-4xl font-bold">
                                More than just a <br />
                                <span className="text-indigo-600 dark:text-indigo-400">Workplace</span>
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
                                At Linkz, we foster a culture of radical transparency and continuous growth. We believe that the best ideas can come from anywhere, and we empower every team member to take ownership.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Weekly knowledge sharing sessions",
                                    "Open salary and equity policy",
                                    "Contribution to open source projects",
                                    "Diverse and inclusive environment"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                                        <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="lg:w-1/2 relative">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4 mt-8">
                                    <div className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded-2xl overflow-hidden">
                                        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" alt="Team" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded-2xl overflow-hidden">
                                        <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80" alt="Office" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded-2xl overflow-hidden">
                                        <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80" alt="Meeting" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded-2xl overflow-hidden">
                                        <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80" alt="Work" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section id="positions" className="py-20 bg-zinc-50 dark:bg-zinc-900/50">
                <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
                        <p className="text-zinc-600 dark:text-zinc-400">
                            Come do the best work of your life.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {positions.map((job, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-4"
                            >
                                <div>
                                    <h3 className="text-lg font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        {job.title}
                                    </h3>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                                        <span className="flex items-center gap-1"><Briefcase size={14} /> {job.department}</span>
                                        <span className="flex items-center gap-1"><Globe size={14} /> {job.location}</span>
                                        <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs border border-zinc-200 dark:border-zinc-700">{job.type}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                                    Apply Now <ArrowRight size={16} />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                            Don't see a role that fits?
                        </p>
                        <a href="mailto:careers@linkz.com" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                            Email us your resume &rarr;
                        </a>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="bg-indigo-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
                        
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Ready to make an impact?</h2>
                        <p className="text-indigo-100 max-w-2xl mx-auto mb-8 relative z-10">
                            Join us in building the platform that powers the next generation of startups.
                        </p>
                        <button className="px-8 py-3 bg-white text-indigo-600 rounded-full font-bold hover:bg-indigo-50 transition-colors relative z-10">
                            See All Jobs
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CareersPage;
