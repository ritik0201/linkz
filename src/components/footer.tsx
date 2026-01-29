"use client";

import React from "react";
import Link from "next/link";
import { Twitter, Linkedin, Instagram, Github, Heart } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 group">
                            <img src="/logo.png" alt="CollaBhart Logo" className="w-8 h-8 rounded-lg shadow-lg group-hover:scale-110 transition-transform" />
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                                CollaBharat
                            </span>
                        </Link>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                            Connecting talent with opportunity. The platform that bridges the gap between ambitious startups and skilled professionals.
                        </p>
                        <div className="flex items-center gap-4">
                            <SocialLink icon={<Twitter size={18} />} href="https://x.com/CollabB47119" />
                            <SocialLink icon={<Linkedin size={18} />} href="https://www.linkedin.com/in/collab-bharat/" />
                            <SocialLink icon={<Instagram size={18} />} href="https://www.instagram.com/collabbharat0/" />
                            <SocialLink icon={<Github size={18} />} href="https://github.com/collabbharat" />
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-6">Platform</h3>
                        <ul className="space-y-3">
                            <FooterLink href="/find-work">Find Work</FooterLink>
                            <FooterLink href="/hire-talent">Hire Talent</FooterLink>
                            <FooterLink href="/success-stories">Success Stories</FooterLink>
                            <FooterLink href="/pricing">Pricing</FooterLink>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-6">Resources</h3>
                        <ul className="space-y-3">
                            <FooterLink href="/blog">Blog</FooterLink>
                            <FooterLink href="/help">Help Center</FooterLink>
                            <FooterLink href="/guidelines">Guidelines</FooterLink>
                            <FooterLink href="/events">Events</FooterLink>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-6">Company</h3>
                        <ul className="space-y-3">
                            <FooterLink href="/about">About Us</FooterLink>
                            <FooterLink href="/careers">Careers</FooterLink>
                            <FooterLink href="/privacy">Privacy Policy</FooterLink>
                            <FooterLink href="/terms">Terms of Service</FooterLink>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        &copy; {new Date().getFullYear()} Linkz Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
                        <span>Made with</span>
                        <Heart size={14} className="text-red-500 fill-red-500" />
                        <span>by the Linkz Team</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const SocialLink = ({ icon, href }: { icon: React.ReactNode; href: string }) => (
    <Link
        href={href}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all"
    >
        {icon}
    </Link>
);

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <li>
        <Link
            href={href}
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
            {children}
        </Link>
    </li>
);

export default Footer;
