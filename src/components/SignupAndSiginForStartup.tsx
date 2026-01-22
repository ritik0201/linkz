"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Building2, ArrowRight, Globe, User } from "lucide-react";
import Link from "next/link";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const SignupAndSiginForStartup = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [verificationStep, setVerificationStep] = useState(false);
    const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
    const [loginOtpSent, setLoginOtpSent] = useState(false);
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: "", // Company Name
        email: "",
        username: "",
        password: "",
        website: "",
        otp: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isLogin) {
                if (loginMethod === 'otp') {
                    if (!loginOtpSent) {
                        // Send OTP
                        const res = await fetch("/api/auth/login", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email: formData.email, role: "startup" }),
                        });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.message || "Failed to send OTP");
                        
                        setLoginOtpSent(true);
                        alert("OTP sent successfully!");
                    } else {
                        // Verify OTP Login
                        const result = await signIn("credentials", {
                            redirect: false,
                            email: formData.email,
                            otp: formData.otp,
                            requiredRole: "startup",
                        });
                        if (result?.error) setError(result.error);
                        else router.push("/startup/dashboard");
                    }
                } else {
                    // Password Login
                    const result = await signIn("credentials", {
                        redirect: false,
                        email: formData.email,
                        password: formData.password,
                        requiredRole: "startup",
                    });
    
                    if (result?.error) {
                        setError(result.error);
                    } else {
                        router.push("/startup/dashboard");
                    }
                }
            } else {
                if (verificationStep) {
                    // Verify OTP
                    const res = await fetch("/api/auth/verify-otp", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: formData.email,
                            otp: formData.otp,
                        }),
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(data.message || "Verification failed");
                    }

                    alert("Email verified successfully! Please sign in.");
                    setVerificationStep(false);
                    setIsLogin(true);
                    setFormData({ ...formData, otp: "" });
                } else {
                    // Signup
                    const res = await fetch("/api/auth/startup-signup", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            fullName: formData.fullName, // Using Company Name as Full Name
                            email: formData.email,
                            username: formData.username,
                            password: formData.password,
                            // website: formData.website // Backend doesn't support this yet in User model, skipping
                        }),
                    });
    
                    const data = await res.json();
    
                    if (!res.ok) {
                        throw new Error(data.message || "Something went wrong");
                    }
    
                    // alert("Startup registered successfully! Please sign in.");
                    setVerificationStep(true);
                }
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 relative">
                    {/* Decorative Background Element */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                    {/* Header */}
                    <div className="px-8 pt-8 pb-4 text-center">
                        <div className="mx-auto w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                            <Building2 size={24} />
                        </div>
                        <motion.h2
                            key={isLogin ? "login-title" : verificationStep ? "verify-title" : "signup-title"}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-3xl font-bold text-zinc-900 dark:text-zinc-100"
                        >
                            {isLogin ? "Startup Portal" : verificationStep ? "Verify Email" : "Register Startup"}
                        </motion.h2>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                            {isLogin
                                ? "Access your dashboard and manage your projects"
                                : verificationStep
                                ? `Enter the code sent to ${formData.email}`
                                : "Join the ecosystem and showcase your innovation"}
                        </p>
                    </div>

                    {/* Toggle */}
                    <div className="px-8 pb-6">
                        <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
                            <button
                                onClick={() => {
                                    setIsLogin(true);
                                    setVerificationStep(false);
                                    setLoginMethod('password');
                                    setLoginOtpSent(false);
                                }}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${isLogin
                                    ? "bg-white dark:bg-zinc-700 text-indigo-600 shadow-sm"
                                    : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
                                    }`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => {
                                    setIsLogin(false);
                                    setVerificationStep(false);
                                    setLoginMethod('password');
                                    setLoginOtpSent(false);
                                }}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${!isLogin
                                    ? "bg-white dark:bg-zinc-700 text-indigo-600 shadow-sm"
                                    : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
                                    }`}
                            >
                                Apply Now
                            </button>
                        </div>
                    </div>

                    {/* Login Method Toggle */}
                    {isLogin && (
                        <div className="px-8 pb-4 flex justify-center">
                            <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => { setLoginMethod('password'); setLoginOtpSent(false); setError(""); }}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${loginMethod === 'password' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-400'}`}
                                >
                                    Password
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setLoginMethod('otp'); setLoginOtpSent(false); setError(""); }}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${loginMethod === 'otp' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-400'}`}
                                >
                                    OTP
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <div className="px-8 pb-8">
                        <AnimatePresence mode="wait">
                            <motion.form
                                key={isLogin ? "login-form" : verificationStep ? "verify-form" : "signup-form"}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                                onSubmit={handleSubmit}
                            >
                                {error && (
                                    <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                        {error}
                                    </div>
                                )}
                                {!isLogin && !verificationStep && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                                Company Name
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                                                    <Building2 size={18} />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleInputChange}
                                                    className="block w-full pl-10 pr-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white"
                                                    placeholder="Acme Inc."
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                                Username
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                                                    <User size={18} />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="username"
                                                    value={formData.username}
                                                    onChange={handleInputChange}
                                                    className="block w-full pl-10 pr-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white"
                                                    placeholder="acme_startup"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                                Website (Optional)
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                                                    <Globe size={18} />
                                                </div>
                                                <input
                                                    type="url"
                                                    name="website"
                                                    value={formData.website}
                                                    onChange={handleInputChange}
                                                    className="block w-full pl-10 pr-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white"
                                                    placeholder="https://acme.com"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {((!isLogin && !verificationStep) || (isLogin && (loginMethod === 'password' || (loginMethod === 'otp' && !loginOtpSent)))) && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                                Work Email
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                                                    <Mail size={18} />
                                                </div>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="block w-full pl-10 pr-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white"
                                                    placeholder="founder@acme.com"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {((!isLogin && !verificationStep) || (isLogin && loginMethod === 'password')) && (
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                                Password
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                                                    <Lock size={18} />
                                                </div>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    className="block w-full pl-10 pr-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white"
                                                    placeholder="••••••••"
                                                    required
                                                />
                                            </div>
                                        </div>
                                )}

                                {((!isLogin && verificationStep) || (isLogin && loginMethod === 'otp' && loginOtpSent)) && (
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                            Verification Code
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                                                <Lock size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                name="otp"
                                                value={formData.otp}
                                                onChange={handleInputChange}
                                                className="block w-full pl-10 pr-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white"
                                                placeholder="123456"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                {isLogin && (
                                    <div className="flex justify-end">
                                        <Link
                                            href="#"
                                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900 text-white font-semibold rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Processing..." : isLogin ? (loginMethod === 'otp' && !loginOtpSent ? "Send OTP" : "Access Dashboard") : verificationStep ? "Verify Email" : "Register Startup"}
                                    {!loading && <ArrowRight size={18} />}
                                </button>
                            </motion.form>
                        </AnimatePresence>

                        <div className="mt-6 text-center">
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                By continuing, you agree to our{" "}
                                <Link href="/terms" className="underline hover:text-zinc-800 dark:hover:text-zinc-200">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy" className="underline hover:text-zinc-800 dark:hover:text-zinc-200">
                                    Privacy Policy
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupAndSiginForStartup;
