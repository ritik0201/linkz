"use client";

import React from "react";
import { motion } from "framer-motion";
import { Rocket, Users, Shield, Globe } from "lucide-react";
import Link from "next/link";

const AboutPage = () => {
    const features = [
        {
            icon: <Rocket className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
            title: "For Startups",
            description: "Find the perfect co-founders, developers, and designers to bring your MVP to life. Showcase your vision to a community of builders."
        },
        {
            icon: <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
            title: "For Talent",
            description: "Discover projects that match your skills and passion. Join early-stage teams and make a significant impact from day one."
        },
        {
            icon: <Shield className="w-6 h-6 text-pink-600 dark:text-pink-400" />,
            title: "Verified Connections",
            description: "We ensure that both startups and professionals are verified, creating a safe and professional environment for collaboration."
        }
    ];

    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen pt-24 pb-12">
            {/* Hero Section */}
            <section className="container mx-auto px-4 md:px-6 mb-20">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center justify-center p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-full mb-6">
                            <span className="px-3 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                Our Mission
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-zinc-900 dark:text-zinc-100 tracking-tight">
                            Empowering the next generation of <br className="hidden md:block" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                                Innovation
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                            Linkz is the bridge between visionary founders and skilled professionals. We believe that the right team can turn any idea into reality.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="container mx-auto px-4 md:px-6 mb-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="p-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Story/Content Section */}
            <section className="container mx-auto px-4 md:px-6 mb-24">
                <div className="bg-zinc-900 dark:bg-white rounded-3xl overflow-hidden shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="p-12 flex flex-col justify-center">
                            <h2 className="text-3xl font-bold text-white dark:text-zinc-900 mb-6">
                                Why we built Linkz
                            </h2>
                            <p className="text-zinc-300 dark:text-zinc-600 mb-6 text-lg leading-relaxed">
                                We noticed a disconnect in the startup ecosystem. Founders struggled to find committed team members, while talented individuals found it hard to discover meaningful projects where they could have equity and impact.
                            </p>
                            <p className="text-zinc-300 dark:text-zinc-600 text-lg leading-relaxed">
                                Linkz solves this by creating a transparent, skill-based marketplace where connections are made based on shared vision and capability.
                            </p>
                        </div>
                        <div className="relative h-64 lg:h-auto bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
                            <Globe className="text-white/20 w-32 h-32 absolute" />
                            <div className="relative z-10 text-center p-6">
                                <div className="text-5xl font-bold text-white mb-2">1000+</div>
                                <div className="text-indigo-200">Connections Made</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 md:px-6 mb-12">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto"
                >
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
                        Ready to start your journey?
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-8">
                        Whether you're building the next unicorn or looking for your next big challenge, Linkz is the place to be.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link 
                            href="/startup/signin"
                            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            <Rocket size={20} />
                            Register Startup
                        </Link>
                        <Link 
                            href="/user/signin"
                            className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 rounded-xl font-semibold transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            <Users size={20} />
                            Join as Talent
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default AboutPage;