import React from "react";
import { Users, Rocket, IndianRupee, Activity, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Active Startups",
      value: "56",
      change: "+3.2%",
      trend: "up",
      icon: Rocket,
      color: "text-purple-600 bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Total Revenue",
      value: "₹45.2K",
      change: "+8.1%",
      trend: "up",
      icon: IndianRupee,
      color: "text-green-600 bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Active Tenders",
      value: "12",
      change: "-2.4%",
      trend: "down",
      icon: Activity,
      color: "text-orange-600 bg-orange-100 dark:bg-orange-900/20",
    },
  ];

  const recentActivity = [
    {
      user: "Rahul Sharma",
      action: "Created a new startup profile",
      time: "2 hours ago",
      initials: "RS",
    },
    {
      user: "Priya Patel",
      action: "Submitted a tender proposal",
      time: "4 hours ago",
      initials: "PP",
    },
    {
      user: "Amit Kumar",
      action: "Verified email address",
      time: "1 day ago",
      initials: "AK",
    },
    {
      user: "TechSolutions Pvt",
      action: "Updated company details",
      time: "1 day ago",
      initials: "TS",
    },
  ];

  return (
    <div className="space-y-3">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Dashboard Overview
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Welcome back, Admin. Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend === 'up' && <TrendingUp size={16} />}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {stat.title}
                </h3>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
        <div className="px-4 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Recent Activity
          </h3>
        </div>
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {recentActivity.map((activity, index) => (
            <div key={index} className="px-4 py-4 flex items-center gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                {activity.initials}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {activity.user}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {activity.action}
                </p>
              </div>
              <span className="text-xs text-zinc-400">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            View All Activity &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}