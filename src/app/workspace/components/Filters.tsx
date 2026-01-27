import FilterButton from "./FilterButton";

const statusFilters = ["All", "Active", "Planning", "Review", "Completed"];
const categoryFilters = [
  "All",
  "Startup",
  "Ecommerce",
  "Business",
  "Design",
  "Freelance",
];

export default function Filters() {
  return (
    <>
      <div className="flex gap-3 mb-4">
        {statusFilters.map((f) => (
          <FilterButton key={f} label={f} active={f === "All"} />
        ))}
      </div>

      <div className="flex gap-3 mb-8">
        {categoryFilters.map((f) => (
          <FilterButton key={f} label={f} active={f === "All"} />
        ))}
      </div>
    </>
  );
}
