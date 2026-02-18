"use client";

import React, { useEffect, useState } from "react";
import { X, Loader2, UserMinus } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface NetworkUser {
    _id: string;
    fullName: string;
    username: string;
    profileImage?: string;
    headline?: string;
}

interface NetworkModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: "followers" | "following";
    username: string; // The username of the profile being viewed
}

const NetworkModal: React.FC<NetworkModalProps> = ({ isOpen, onClose, type, username }) => {
    const { data: session } = useSession();
    const [users, setUsers] = useState<NetworkUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Check if the current logged-in user is viewing their own profile
    const isOwnProfile = session?.user?.username === username;

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen, type, username]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/profile/network?username=${username}&type=${type}`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch network:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnfollow = async (targetUserId: string) => {
        if (!isOwnProfile || type !== "following") return;

        setActionLoading(targetUserId);
        try {
            const res = await fetch("/api/profile/follow", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetUserId }),
            });

            if (res.ok) {
                // Remove the user from the list locally
                setUsers((prev) => prev.filter((u) => u._id !== targetUserId));
            }
        } catch (error) {
            console.error("Failed to unfollow:", error);
        } finally {
            setActionLoading(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#2b2b2b] rounded-2xl w-full max-w-md border border-zinc-700 shadow-2xl flex flex-col max-h-[80vh]">
                <div className="flex justify-between items-center p-4 border-b border-zinc-700">
                    <h2 className="text-xl font-bold text-white capitalize">{type}</h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-2 overflow-y-auto flex-1 custom-scrollbar">
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="animate-spin text-indigo-500" size={32} />
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center p-8 text-zinc-500">
                            No {type} found.
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {users.map((user) => (
                                <div key={user._id} className="flex items-center justify-between p-3 hover:bg-zinc-800/50 rounded-lg transition-colors group">
                                    <Link href={`/user/${user.username}`} className="flex items-center gap-3 flex-1 min-w-0">
                                        <img
                                            src={user.profileImage || "/user.png"}
                                            alt={user.fullName}
                                            className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                                        />
                                        <div className="min-w-0">
                                            <p className="font-semibold text-white truncate">{user.fullName}</p>
                                            <p className="text-xs text-zinc-400 truncate">@{user.username}</p>
                                        </div>
                                    </Link>

                                    {isOwnProfile && type === "following" && (
                                        <button
                                            onClick={() => handleUnfollow(user._id)}
                                            disabled={actionLoading === user._id}
                                            className="text-zinc-500 hover:text-red-400 p-2 rounded-full hover:bg-red-500/10 transition-colors"
                                            title="Unfollow"
                                        >
                                            {actionLoading === user._id ? (
                                                <Loader2 size={18} className="animate-spin" />
                                            ) : (
                                                <UserMinus size={18} />
                                            )}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NetworkModal;
