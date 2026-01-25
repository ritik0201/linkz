"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Rocket, User, ArrowRight, LogOut, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/About" },
        { name: "Services", href: "/services" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md shadow-lg border-b border-zinc-200 dark:border-zinc-800 py-3"
                : "bg-transparent py-5"
                }`}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-indigo-500/20 shadow-lg group-hover:scale-110 transition-transform overflow-hidden">
                            <img src="/logo.jpg" alt="Linkz Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                            Linkz
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        {session ? (
                            <>
                                <Link
                                    href={(session.user as any).role === 'startup' ? "/startup/dashboard" : "/dashboard"}
                                    className="flex items-center gap-2 px-4 py-2 text-zinc-600 dark:text-zinc-400 font-medium hover:text-indigo-600 transition-colors"
                                >
                                    <LayoutDashboard size={18} />
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-full font-semibold transition-all border-none cursor-pointer"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/user/signin"
                                    className="flex items-center gap-2 px-4 py-2 text-zinc-600 dark:text-zinc-400 font-medium hover:text-indigo-600 transition-colors"
                                >
                                    <User size={18} />
                                    User
                                </Link>
                                <Link
                                    href="/startup/signin"
                                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
                                >
                                    Startup
                                    <ArrowRight size={18} />
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-zinc-600 dark:text-zinc-400 border-none bg-transparent"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-lg font-medium text-zinc-600 dark:text-zinc-400"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <hr className="border-zinc-200 dark:border-zinc-800" />
                            {session ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-2 text-lg font-medium text-zinc-600 dark:text-zinc-400"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <LayoutDashboard size={20} />
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => { signOut({ callbackUrl: '/' }); setIsOpen(false); }}
                                        className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl font-bold border-none"
                                    >
                                        <LogOut size={20} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/user/signin"
                                        className="flex items-center gap-2 text-lg font-medium text-zinc-600 dark:text-zinc-400"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <User size={20} />
                                        User Sign In
                                    </Link>
                                    <Link
                                        href="/startup/signin"
                                        className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Startup Portal
                                        <ArrowRight size={20} />
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
