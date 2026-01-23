import { FileText, MessageSquare, GitBranch } from "lucide-react";

export default function WorkspaceSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {[FileText, MessageSquare, GitBranch].map((Icon, i) => (
          <div
            key={i}
            className="p-6 bg-white/5 border border-white/10 rounded-2xl"
          >
            <Icon className="w-10 h-10 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Workspace Tool</h3>
            <p className="text-gray-400">Built-in collaboration utilities</p>
          </div>
        ))}
      </div>
    </section>
  );
}
