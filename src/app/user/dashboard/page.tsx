"use client";

import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          Welcome to your Dashboard
        </h1>
        {session?.user?.fullName && (
          <p className="mt-4 text-xl text-zinc-600 dark:text-zinc-400">
            Hello, {session.user.fullName}!
          </p>
        )}
        <p className="mt-2 text-zinc-500 dark:text-zinc-500">
          This is your personal space. More features coming soon!
        </p>
        <div className="mt-8">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold shadow-lg shadow-red-500/30 transition-all hover:-translate-y-0.5"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}