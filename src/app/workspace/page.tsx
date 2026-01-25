import React from 'react';
import { 
  Layout, 
  MessageSquare, 
  CheckSquare, 
  Folder, 
  Settings, 
  Search, 
  Bell, 
  Plus, 
  Users,
  Clock,
} from 'lucide-react';

export default function WorkspacePage() {
  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Layout className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">Linkz Work</span>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 mt-4 px-2">Menu</div>
          <NavItem icon={<Layout size={18} />} label="Dashboard" active />
          <NavItem icon={<CheckSquare size={18} />} label="My Tasks" />
          <NavItem icon={<MessageSquare size={18} />} label="Messages" badge="3" />
          <NavItem icon={<Folder size={18} />} label="Projects" />
          
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 mt-8 px-2">Team Members</div>
          <TeamMember name="Sarah Chen" status="online" />
          <TeamMember name="Alex Morgan" status="busy" />
          <TeamMember name="David Kim" status="offline" />
          <TeamMember name="Emily Watson" status="online" />
          
          <button className="flex items-center gap-3 px-2 py-2 w-full text-zinc-500 hover:text-indigo-600 transition-colors text-sm font-medium mt-4 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg justify-center hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-300">
            <Plus size={16} />
            <span>Invite Member</span>
          </button>
        </nav>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <button className="flex items-center gap-3 w-full px-2 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
            <Settings size={18} />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-xl font-bold hidden md:block">Dashboard</h1>
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                type="text" 
                placeholder="Search tasks, files, or messages..." 
                className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
            </button>
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm cursor-pointer"></div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            
            {/* Left Column (Stats & Tasks) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard title="Pending Tasks" value="12" icon={<CheckSquare className="text-indigo-500" />} trend="+2 this week" />
                <StatCard title="Active Projects" value="4" icon={<Folder className="text-purple-500" />} trend="On track" />
                <StatCard title="Team Members" value="8" icon={<Users className="text-pink-500" />} trend="+1 new" />
              </div>

              {/* Recent Projects */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold">Active Projects</h2>
                  <button className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                  <ProjectRow name="Website Redesign" progress={75} members={3} dueDate="2 days left" />
                  <ProjectRow name="Mobile App API" progress={30} members={5} dueDate="1 week left" />
                  <ProjectRow name="Marketing Campaign" progress={100} members={2} dueDate="Completed" status="done" />
                </div>
              </div>
            </div>

            {/* Right Column (Activity & Schedule) */}
            <div className="space-y-6">
              {/* Daily Standup Widget */}
              <div className="bg-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-indigo-500/20 group">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold mb-1">Daily Standup</h3>
                      <p className="text-indigo-100 text-sm">10:00 AM - 10:30 AM</p>
                    </div>
                    <span className="bg-white/20 px-2 py-1 rounded text-xs font-medium">Live</span>
                  </div>
                  <div className="flex -space-x-2 mb-6">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-indigo-600"></div>
                    ))}
                    <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-indigo-600 flex items-center justify-center text-xs">+4</div>
                  </div>
                  <button className="w-full bg-white text-indigo-600 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors shadow-sm">
                    Join Meeting
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-white/20 transition-all duration-500"></div>
              </div>

              {/* Activity Feed */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
                <h2 className="text-lg font-bold mb-4">Team Activity</h2>
                <div className="space-y-6">
                  <ActivityItem user="Sarah" action="commented on" target="Homepage Design" time="2m ago" />
                  <ActivityItem user="David" action="uploaded" target="Q3_Report.pdf" time="1h ago" />
                  <ActivityItem user="Alex" action="completed" target="Fix Login Bug" time="3h ago" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

// --- Helper Components ---

function NavItem({ icon, label, active = false, badge }: { icon: React.ReactNode, label: string, active?: boolean, badge?: string }) {
  return (
    <button className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      {badge && <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 text-xs px-2 py-0.5 rounded-full font-bold">{badge}</span>}
    </button>
  );
}

function TeamMember({ name, status }: { name: string, status: 'online' | 'busy' | 'offline' }) {
  const statusColors = { online: 'bg-green-500', busy: 'bg-red-500', offline: 'bg-zinc-400' };
  return (
    <div className="flex items-center gap-3 px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg cursor-pointer group transition-colors">
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-500">
          {name.charAt(0)}
        </div>
        <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-zinc-900 ${statusColors[status]}`}></div>
      </div>
      <span className="text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-indigo-600 transition-colors">{name}</span>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <span className="text-zinc-500 text-sm font-medium">{title}</span>
        <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg">{icon}</div>
      </div>
      <div className="text-2xl font-bold mb-1 text-zinc-900 dark:text-white">{value}</div>
      <div className="text-xs text-green-500 font-medium bg-green-50 dark:bg-green-900/20 inline-block px-2 py-0.5 rounded-full">{trend}</div>
    </div>
  );
}

function ProjectRow({ name, progress, members, dueDate, status }: { name: string, progress: number, members: number, dueDate: string, status?: 'done' }) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-colors border border-transparent hover:border-zinc-100 dark:hover:border-zinc-700 group">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${status === 'done' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'}`}>
          {status === 'done' ? <CheckSquare size={20} /> : <Folder size={20} />}
        </div>
        <div>
          <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{name}</h4>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Clock size={12} />
            <span>{dueDate}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:block w-24">
          <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${status === 'done' ? 'bg-green-500' : 'bg-indigo-500'}`} style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <div className="flex -space-x-2">
          {[...Array(members)].map((_, i) => (
            <div key={i} className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 border-2 border-white dark:border-zinc-900"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ user, action, target, time }: { user: string, action: string, target: string, time: string }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 flex items-center justify-center text-xs font-bold text-zinc-500">
        {user.charAt(0)}
      </div>
      <div>
        <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-snug">
          <span className="font-semibold">{user}</span> {action} <span className="font-medium text-indigo-600 dark:text-indigo-400">{target}</span>
        </p>
        <p className="text-xs text-zinc-400 mt-1">{time}</p>
      </div>
    </div>
  );
}