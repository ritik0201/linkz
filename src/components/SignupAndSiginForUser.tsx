"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Github } from "lucide-react";
import Link from "next/link";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const SignupAndSiginForUser = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [verificationStep, setVerificationStep] = useState(false);
    const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
    const [loginOtpSent, setLoginOtpSent] = useState(false);
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        username: "",
        password: "",
        otp: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Better handler requiring name attributes on inputs
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
                            body: JSON.stringify({ email: formData.email, role: "user" }),
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
                            requiredRole: "user",
                        });
                        if (result?.error) setError(result.error);
                        else router.push("/user/dashboard");
                    }
                } else {
                    // Password Login
                    const result = await signIn("credentials", {
                        redirect: false,
                        email: formData.email,
                        password: formData.password,
                        requiredRole: "user",
                    });
                    if (result?.error) setError(result.error);
                    else router.push("/user/dashboard");
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
                    const res = await fetch("/api/auth/signup", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            fullName: formData.fullName,
                            email: formData.email,
                            username: formData.username,
                            password: formData.password,
                        }),
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(data.message || "Something went wrong");
                    }

                    // alert("Account created successfully! Please sign in.");
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
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                    {/* Header */}
                    <div className="px-8 pt-8 pb-4 text-center">
                        <motion.h2
                            key={isLogin ? "login-title" : verificationStep ? "verify-title" : "signup-title"}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-3xl font-bold text-zinc-900 dark:text-zinc-100"
                        >
                            {isLogin ? "Welcome Back" : verificationStep ? "Verify Email" : "Create Account"}
                        </motion.h2>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                            {isLogin
                                ? "Enter your credentials to access your account"
                                : verificationStep
                                    ? `Enter the code sent to ${formData.email}`
                                    : "Join us today and start your journey"}
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
                                Sign Up
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
                                                Full Name
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                                                    <User size={18} />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleInputChange}
                                                    className="block w-full pl-10 pr-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white"
                                                    placeholder="John Doe"
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
                                                    placeholder="johndoe123"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {((!isLogin && !verificationStep) || (isLogin && (loginMethod === 'password' || (loginMethod === 'otp' && !loginOtpSent)))) && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                                Email Address
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
                                                    placeholder="john@example.com"
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
                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Processing..." : isLogin ? (loginMethod === 'otp' && !loginOtpSent ? "Send OTP" : "Sign In") : verificationStep ? "Verify Email" : "Create Account"}
                                    {!loading && <ArrowRight size={18} />}
                                </button>
                            </motion.form>
                        </AnimatePresence>

                        <div className="mt-8 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-zinc-200 dark:border-zinc-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white dark:bg-zinc-900 text-zinc-500">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center gap-2 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    Google
                                </span>
                            </button>
                            <button className="flex items-center justify-center gap-2 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                <Github size={20} className="text-zinc-900 dark:text-white" />
                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    GitHub
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupAndSiginForUser;
