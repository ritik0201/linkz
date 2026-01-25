"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Globe, Users, Rocket, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";

const ServicesPage = () => {
    const services = [
        {
            icon: <Zap className="w-6 h-6 text-yellow-500" />,
            title: "Smart Matching",
            description: "Our AI-driven algorithm connects startups with the perfect co-founders and early employees based on skills, vision, and values."
        },
        {
            icon: <ShieldCheck className="w-6 h-6 text-green-500" />,
            title: "Verified Profiles",
            description: "We rigorously verify both startups and professionals to ensure a safe, high-quality ecosystem for collaboration."
        },
        {
            icon: <Globe className="w-6 h-6 text-blue-500" />,
            title: "Global Reach",
            description: "Access a worldwide network of talent and innovation. Build your team remotely or find local partners."
        },
        {
            icon: <Rocket className="w-6 h-6 text-indigo-500" />,
            title: "Launchpad Support",
            description: "Get resources, templates, and guides for equity splitting, contracts, and MVP launches."
        },
        {
            icon: <Users className="w-6 h-6 text-purple-500" />,
            title: "Community Events",
            description: "Participate in exclusive hackathons, pitch days, and networking mixers to grow your connections."
        },
        {
            icon: <MessageSquare className="w-6 h-6 text-pink-500" />,
            title: "Direct Messaging",
            description: "Seamless, real-time communication tools built directly into the platform to speed up hiring."
        }
    ];

    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen pt-24 pb-12">
            {/* Hero */}
            <section className="container mx-auto px-4 md:px-6 mb-20">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-zinc-900 dark:text-zinc-100 tracking-tight">
                            Services that drive <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                                Growth & Connection
                            </span>
                        </h1>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                            Comprehensive tools and features designed to bridge the gap between visionary ideas and execution.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="container mx-auto px-4 md:px-6 mb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="p-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all hover:-translate-y-1 group"
                        >
                            <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
                                {service.title}
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="container mx-auto px-4 md:px-6">
                <div className="bg-indigo-600 rounded-3xl p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-white mb-6">Ready to leverage these tools?</h2>
                        <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
                            Join thousands of founders and professionals building the future together.
                        </p>
                        <Link 
                            href="/user/signin"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors"
                        >
                            Get Started Now
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ServicesPage;
