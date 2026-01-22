"use client";

import React from "react";
import Link from "next/link";
import { Rocket, Twitter, Linkedin, Instagram, Github, Heart } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                <Rocket size={20} />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                                Linkz
                            </span>
                        </Link>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                            Connecting talent with opportunity. The platform that bridges the gap between ambitious startups and skilled professionals.
                        </p>
                        <div className="flex items-center gap-4">
                            <SocialLink icon={<Twitter size={18} />} href="#" />
                            <SocialLink icon={<Linkedin size={18} />} href="#" />
                            <SocialLink icon={<Instagram size={18} />} href="#" />
                            <SocialLink icon={<Github size={18} />} href="#" />
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-6">Platform</h3>
                        <ul className="space-y-3">
                            <FooterLink href="#">Find Work</FooterLink>
                            <FooterLink href="#">Hire Talent</FooterLink>
                            <FooterLink href="#">Success Stories</FooterLink>
                            <FooterLink href="#">Pricing</FooterLink>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-6">Resources</h3>
                        <ul className="space-y-3">
                            <FooterLink href="#">Blog</FooterLink>
                            <FooterLink href="#">Help Center</FooterLink>
                            <FooterLink href="#">Guidelines</FooterLink>
                            <FooterLink href="#">Events</FooterLink>
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
