// ProjectHeader.tsx
import Badge from "../components/Badge";

export default function ProjectHeader() {
  return (
    <div className="flex justify-between items-start">
      <div>
        <div className="flex gap-2 mb-2">
          <Badge label="active" />
          <Badge label="startup" />
        </div>

        <h1 className="text-3xl font-bold">AI-Powered Task Manager</h1>
        <p className="text-white/60 mt-1">
          A smart task management app with AI-driven prioritization
        </p>
      </div>

      <div className="flex gap-3">
        <button className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10">
          Join Project
        </button>
        <button className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500">
          Add Contribution
        </button>
      </div>
    </div>
  );
}
