"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Menu, X, Rocket, User, ArrowRight, LogOut, LayoutDashboard,
    Search, Home, Bell, MessageSquare, Briefcase, Settings, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [placeholder, setPlaceholder] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [userAvatar, setUserAvatar] = useState("");

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);

        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const words = ["Search users...", "Find projects...", "Discover research..."];
        const i = loopNum % words.length;
        const fullText = words[i];

        let speed = isDeleting ? 50 : 150;

        if (!isDeleting && placeholder === fullText) {
            speed = 2000;
        } else if (isDeleting && placeholder === "") {
            speed = 500;
        }

        const timer = setTimeout(() => {
            if (!isDeleting && placeholder === fullText) {
                setIsDeleting(true);
            } else if (isDeleting && placeholder === "") {
                setIsDeleting(false);
                setLoopNum((prev) => prev + 1);
            } else {
                setPlaceholder((prev) => (isDeleting ? prev.slice(0, -1) : fullText.slice(0, prev.length + 1)));
            }
        }, speed);

        return () => clearTimeout(timer);
    }, [placeholder, isDeleting, loopNum]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.trim()) {
                try {
                    const res = await fetch(`/api/search?q=${searchQuery}`);
                    if (res.ok) {
                        const data = await res.json();
                        setSearchResults(data.data || []);
                    }
                } catch (error) {
                    console.error("Search error:", error);
                }
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    useEffect(() => {
        if (session?.user) {
            // @ts-ignore
            const username = session.user.username;
            if (username) {
                fetch(`/api/profile?userid=${username}`)
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.data) {
                            setUserAvatar(data.data.profilePicture || data.data.user?.profileImage || data.data.user?.image);
                        }
                    })
                    .catch((err) => console.error("Failed to fetch user avatar", err));
            }
        }
    }, [session]);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            router.push(`/user/${searchQuery.trim()}`);
            setSearchQuery("");
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md shadow-lg border-b border-zinc-200 dark:border-zinc-800 py-2"
                : "bg-black/20 backdrop-blur-sm py-4 border-b border-white/10"
                }`}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between h-8">
                    {/* Left Side: Logo */}
                    <Link href="/" className="flex items-center gap-2 group shrink-0">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                            <Rocket size={20} />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-violet-400 hidden sm:block">
                            CollabX
                        </span>
                    </Link>

                    {/* Center/Right Side */}
                    <div className="flex items-center gap-1 md:gap-6 flex-1 justify-end">

                        {/* Search Bar */}
                        <div className="relative hidden md:block w-full max-w-md mx-4" ref={searchRef}>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={16} className="text-zinc-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-zinc-700 rounded-full leading-5 bg-zinc-900/50 text-zinc-300 placeholder-zinc-500 focus:outline-none focus:bg-zinc-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-colors"
                                placeholder={placeholder}
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowResults(true);
                                }}
                                onFocus={() => setShowResults(true)}
                                onKeyDown={handleSearch}
                            />
                            <AnimatePresence>
                                {showResults && searchQuery.trim().length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-zinc-700 rounded-xl shadow-2xl overflow-hidden z-50"
                                    >
                                        {searchResults.length > 0 ? (
                                            <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                                {searchResults.map((user) => (
                                                    <Link
                                                        key={user._id}
                                                        href={`/user/${user.username}`}
                                                        className="flex items-center gap-3 p-3 hover:bg-zinc-800 transition-colors border-b border-zinc-800 last:border-0"
                                                        onClick={() => {
                                                            setShowResults(false);
                                                            setSearchQuery("");
                                                        }}
                                                    >
                                                        <img
                                                            src={user.profileImage || user.profilePicture || user.image || user.avatar || "/user.png"}
                                                            alt={user.fullName}
                                                            className="w-8 h-8 rounded-full object-cover"
                                                        />
                                                        <div>
                                                            <p className="text-white text-sm font-bold truncate">{user.fullName}</p>
                                                            <p className="text-zinc-400 text-xs truncate">@{user.username}</p>
                                                            {user.headline && <p className="text-zinc-500 text-xs mt-1 truncate">{user.headline}</p>}
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-4 text-center text-zinc-500 text-sm">
                                                No results found.
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Navigation Icons */}
                        <div className="flex items-center gap-1 md:gap-4">
                            <Link href="/" className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors relative group">
                                <Home size={22} />
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Home</span>
                            </Link>
                            <Link href="/services" className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors relative group hidden sm:block">
                                <Briefcase size={22} />
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Services</span>
                            </Link>
                            <Link href="/messages" className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors relative group hidden sm:block">
                                <MessageSquare size={22} />
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Messages</span>
                            </Link>
                            <Link href="/notifications" className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors relative group">
                                <Bell size={22} />
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Notifications</span>
                            </Link>
                        </div>

                        {/* Profile Dropdown */}
                        {session ? (
                            <div className="relative ml-1 md:ml-2" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 focus:outline-none"
                                >
                                    <img
                                        className="h-8 w-8 md:h-9 md:w-9 rounded-full object-cover border-2 border-transparent hover:border-indigo-500 transition-colors"
                                        src={userAvatar || (session.user as any).image || (session.user as any).profileImage || "/user.png"}
                                        alt="User Profile"
                                    />
                                </button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.1 }}
                                            className="absolute right-0 mt-3 w-72 bg-[#1a1a1a] border border-zinc-700 rounded-xl shadow-2xl overflow-hidden z-50"
                                        >
                                            <div className="p-4 border-b border-zinc-700">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <img
                                                        className="h-12 w-12 rounded-full object-cover"
                                                        src={userAvatar || (session.user as any).image || (session.user as any).profileImage || "/user.png"}
                                                        alt="User"
                                                    />
                                                    <div className="overflow-hidden">
                                                        <h3 className="text-white font-bold truncate">{(session.user as any).name || (session.user as any).fullName}</h3>
                                                        <p className="text-zinc-400 text-xs truncate">{(session.user as any).email}</p>
                                                    </div>
                                                </div>
                                                <Link
                                                    href={`/user/${(session.user as any).username}`}
                                                    className="block w-full text-center py-1.5 border border-indigo-500 text-indigo-400 rounded-full text-sm font-medium hover:bg-indigo-500/10 transition-colors"
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    View Profile
                                                </Link>
                                            </div>

                                            <div className="py-2">
                                                <div className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Account</div>
                                                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors" onClick={() => setIsProfileOpen(false)}>
                                                    <LayoutDashboard size={16} /> Dashboard
                                                </Link>
                                                <Link href="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors" onClick={() => setIsProfileOpen(false)}>
                                                    <Settings size={16} /> Settings & Privacy
                                                </Link>
                                                <Link href="/help" className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors" onClick={() => setIsProfileOpen(false)}>
                                                    <HelpCircle size={16} /> Help Center
                                                </Link>
                                            </div>

                                            <div className="py-2 border-t border-zinc-700">
                                                <div className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Manage</div>
                                                <Link href="/about" className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors" onClick={() => setIsProfileOpen(false)}>
                                                    About
                                                </Link>
                                                <Link href="/services" className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors" onClick={() => setIsProfileOpen(false)}>
                                                    Services
                                                </Link>
                                            </div>

                                            <div className="p-2 border-t border-zinc-700">
                                                <button
                                                    onClick={() => signOut({ callbackUrl: '/' })}
                                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                                                >
                                                    <LogOut size={16} /> Sign Out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 ml-4">
                                <Link href="/user/signin" className="text-zinc-300 hover:text-white font-medium text-sm transition-colors">Sign In</Link>
                                <Link href="/user/signin" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full font-medium text-sm transition-colors">Join Now</Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden ml-1 text-zinc-300 p-1"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-[#1a1a1a] border-b border-zinc-800 overflow-hidden"
                    >
                        <div className="px-4 py-4 space-y-4">
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-3 text-zinc-500" />
                                <input
                                    type="text"
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                                    placeholder={placeholder}
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setShowResults(true);
                                    }}
                                    onKeyDown={handleSearch}
                                />
                                {showResults && searchQuery.trim().length > 0 && (
                                    <div className="mt-2 bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden max-h-60 overflow-y-auto custom-scrollbar">
                                        {searchResults.length > 0 ? (
                                            searchResults.map((user) => (
                                                <Link
                                                    key={user._id}
                                                    href={`/user/${user.username}`}
                                                    className="flex items-center gap-3 p-3 hover:bg-zinc-800 transition-colors border-b border-zinc-800 last:border-0"
                                                    onClick={() => {
                                                        setIsMobileMenuOpen(false);
                                                        setSearchQuery("");
                                                        setShowResults(false);
                                                    }}
                                                >
                                                    <img
                                                        src={user.profileImage || user.profilePicture || user.image || user.avatar || "/user.png"}
                                                        alt={user.fullName}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                    <div>
                                                        <p className="text-white text-sm font-bold truncate">{user.fullName}</p>
                                                        <p className="text-zinc-400 text-xs truncate">@{user.username}</p>
                                                        {user.headline && <p className="text-zinc-500 text-xs mt-1 truncate">{user.headline}</p>}
                                                    </div>
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="p-3 text-center text-zinc-500 text-xs">
                                                No results found.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                <Link href="/" className="flex flex-col items-center gap-1 p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Home size={20} /> <span className="text-[10px]">Home</span>
                                </Link>
                                <Link href="/services" className="flex flex-col items-center gap-1 p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Briefcase size={20} /> <span className="text-[10px]">Services</span>
                                </Link>
                                <Link href="/messages" className="flex flex-col items-center gap-1 p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                                    <MessageSquare size={20} /> <span className="text-[10px]">Messages</span>
                                </Link>
                                <Link href="/notifications" className="flex flex-col items-center gap-1 p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Bell size={20} /> <span className="text-[10px]">Alerts</span>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
