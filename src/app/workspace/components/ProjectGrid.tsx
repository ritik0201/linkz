import ProjectCard from "./ProjectCard";

export default function ProjectGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <ProjectCard
        status="active"
        category="startup"
        title="AI-Powered Task Manager"
        desc="A smart task management app with AI-driven prioritization"
        progress={65}
        tags={["AI", "Productivity", "SaaS"]}
        members={["SC", "MJ", "ED"]}
      />

      <ProjectCard
        status="planning"
        category="ecommerce"
        title="Sustainable Fashion Marketplace"
        desc="E-commerce platform for eco-friendly fashion brands"
        progress={25}
        tags={["E-commerce", "Sustainability", "Fashion"]}
        members={["AR", "LW"]}
      />

      <ProjectCard
        status="active"
        category="business"
        title="Remote Team Collaboration Suite"
        desc="All-in-one workspace for distributed teams"
        progress={45}
        tags={["SaaS", "Remote Work", "Collaboration"]}
        members={["DP", "RG", "TA", "+1"]}
      />
    </div>
  );
}
