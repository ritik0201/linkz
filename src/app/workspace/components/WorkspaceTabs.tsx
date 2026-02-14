// WorkspaceTabs.tsx
const tabs = ["Logs", "Overview", "Contributions", "Roles", "Team", "Activity"];

export default function WorkspaceTabs() {
  return (
    <div className="flex gap-2 bg-white/5 p-2 rounded-full">
      {tabs.map((tab, i) => (
        <button
          key={tab}
          className={`px-4 py-2 rounded-full text-sm ${
            i === 0 ? "bg-white text-black" : "text-white/60 hover:text-white"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
