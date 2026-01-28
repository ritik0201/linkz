"use client";

import React, { useState } from "react";
import { Search, HelpCircle, BookOpen, MessageCircle, Mail, Phone, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

export default function HelpCenter() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: "How do I create a project?",
            a: "To create a project, use the 'Share a project or research' button on the home feed or the 'New Project' button in your Workspace. Fill in the details, add a cover image, and hit share!"
        },
        {
            q: "How can I connect with startups?",
            a: "You can find startups in the Home feed or by searching for them. Once you find a startup's post or profile, you can click 'Interested' on their projects or send them a message directly if you have their contact info."
        },
        {
            q: "Is it free to use Linkz?",
            a: "Yes, Linkz offers a free tier for both developers and startups to connect and collaborate. We may offer premium features in the future to help you stand out even more."
        },
        {
            q: "How do I update my profile?",
            a: "Click on your profile picture in the navbar, select 'View Profile', and then look for the edit icons or 'Edit Profile' button to update your headline, bio, and skills."
        }
    ];

    return (
        <main className="min-h-screen bg-black pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Hero Search Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">How can we help?</h1>
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search for articles, guides, and more..."
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-indigo-500 transition-colors shadow-2xl"
                        />
                    </div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <QuickLink
                        icon={<BookOpen size={24} className="text-indigo-400" />}
                        title="Documentation"
                        desc="Learn how to use Linkz like a pro with our guides."
                    />
                    <QuickLink
                        icon={<MessageCircle size={24} className="text-indigo-400" />}
                        title="Community"
                        desc="Ask questions and share tips with other users."
                    />
                    <QuickLink
                        icon={<HelpCircle size={24} className="text-indigo-400" />}
                        title="Support"
                        desc="Get in touch with our team for technical help."
                    />
                </div>

                {/* FAQs */}
                <div className="bg-[#1a1a1a] border border-zinc-800 rounded-3xl p-8 md:p-10">
                    <h2 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="border-b border-zinc-800 last:border-0 pb-4 last:pb-0">
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full flex items-center justify-between py-4 text-left group"
                                >
                                    <span className="text-white font-medium group-hover:text-indigo-400 transition-colors">{faq.q}</span>
                                    {openFaq === idx ? <ChevronUp size={20} className="text-zinc-500" /> : <ChevronDown size={20} className="text-zinc-500" />}
                                </button>
                                {openFaq === idx && (
                                    <div className="pb-4 text-zinc-400 text-sm leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Section */}
                <div className="mt-16 text-center bg-linear-to-r from-indigo-950/30 to-violet-950/30 border border-indigo-500/20 rounded-3xl p-10">
                    <h2 className="text-2xl font-bold text-white mb-4">Still need help?</h2>
                    <p className="text-zinc-400 mb-8">Can't find what you're looking for? Our support team is here for you.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-colors">
                            <Mail size={18} /> Email Support
                        </button>
                        <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3 rounded-xl font-bold transition-colors">
                            <Phone size={18} /> Schedule a Call
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

function QuickLink({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="bg-[#1a1a1a] border border-zinc-800 p-6 rounded-2xl hover:border-indigo-500/50 transition-colors cursor-pointer group">
            <div className="mb-4">{icon}</div>
            <h3 className="text-white font-bold mb-2 group-hover:text-indigo-400 transition-colors">{title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
            <div className="mt-4 flex items-center gap-1 text-xs text-indigo-400 font-bold opacity-0 group-hover:opacity-100 transition-all">
                Learn more <ExternalLink size={12} />
            </div>
        </div>
    );
}