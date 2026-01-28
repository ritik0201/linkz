"use client";

import React from "react";
import { User, Shield, Bell, Lock, Eye, Mail, Trash2, ChevronRight } from "lucide-react";

export default function SettingsPage() {
    const settingsSections = [
        {
            title: "Profile Information",
            icon: <User size={20} className="text-indigo-400" />,
            items: [
                { label: "Personal Info", description: "Name, bio, and profile picture", link: "#" },
                { label: "Experience", description: "Update your work history and skills", link: "#" }
            ]
        },
        {
            title: "Account & Security",
            icon: <Lock size={20} className="text-indigo-400" />,
            items: [
                { label: "Email Address", description: "Manage your primary email", link: "#" },
                { label: "Password", description: "Change your password", link: "#" },
                { label: "Two-Factor Auth", description: "Add an extra layer of security", link: "#" }
            ]
        },
        {
            title: "Privacy & Visibility",
            icon: <Eye size={20} className="text-indigo-400" />,
            items: [
                { label: "Profile Visibility", description: "Control who sees your profile", link: "#" },
                { label: "Interested Status", description: "Show/hide your interests on projects", link: "#" }
            ]
        },
        {
            title: "Notifications",
            icon: <Bell size={20} className="text-indigo-400" />,
            items: [
                { label: "Email Notifications", description: "Choose what we send you", link: "#" },
                { label: "Push Notifications", description: "Manage browser alerts", link: "#" }
            ]
        },
    ];

    return (
        <main className="min-h-screen bg-black pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Settings & Privacy</h1>
                    <p className="text-zinc-400">Manage your account settings and set your privacy preferences.</p>
                </div>

                <div className="grid gap-6">
                    {settingsSections.map((section, idx) => (
                        <div key={idx} className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/30 flex items-center gap-3">
                                {section.icon}
                                <h2 className="text-lg font-bold text-white">{section.title}</h2>
                            </div>
                            <div className="divide-y divide-zinc-800">
                                {section.items.map((item, itemIdx) => (
                                    <button
                                        key={itemIdx}
                                        className="w-full flex items-center justify-between p-6 hover:bg-zinc-800/50 transition-colors text-left group"
                                    >
                                        <div>
                                            <p className="text-white font-medium group-hover:text-indigo-400 transition-colors">{item.label}</p>
                                            <p className="text-sm text-zinc-500 mt-0.5">{item.description}</p>
                                        </div>
                                        <ChevronRight size={18} className="text-zinc-600 group-hover:text-white transition-colors" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="mt-6 p-6 bg-red-500/5 border border-red-500/20 rounded-2xl">
                        <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                            <Trash2 size={18} />
                            Danger Zone
                        </h3>
                        <p className="text-sm text-zinc-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                        <button className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-colors">
                            Deactivate Account
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}