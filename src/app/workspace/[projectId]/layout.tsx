import Link from "next/link";

const tabs = ["overview", "logs", "contributions", "team", "activity", "chat"];

export default function WorkspaceProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/10 bg-[#0B0D16] px-6 py-8">
        <h2 className="text-xl font-bold mb-8 text-blue-400">Workspace</h2>

        <nav className="space-y-2">
          {tabs.map((tab) => (
            <Link
              key={tab}
              href={`?tab=${tab}`}
              className="block rounded-lg px-4 py-2 capitalize text-white/70 hover:bg-white/10 hover:text-white transition"
            >
              {tab}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 px-10 py-8 overflow-y-auto">{children}</main>
    </div>
  );
}
