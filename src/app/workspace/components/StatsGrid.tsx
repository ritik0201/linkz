import StatBox from "./StatBox";

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-4 gap-6 mb-8">
      <StatBox value="4" label="Total Projects" />
      <StatBox value="2" label="Active Projects" />
      <StatBox value="11" label="Total Contributors" />
      <StatBox value="11" label="Contributions" />
    </div>
  );
}
