"use client";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatsGrid from "./components/StatsGrid";
import SearchBar from "./components/SearchBar";
import Filters from "./components/Filters";
import ProjectGrid from "./components/ProjectGrid";

export default function WorkspaceDashboard() {
  return (
    <div className="min-h-screen bg-[#05060A] flex flex-col lg:flex-row text-white">
      <Sidebar />

      <main className="flex-1 px-4 md:px-10 py-10 md:py-20">
        <Header />
        <StatsGrid />
        <SearchBar />
        <Filters />
        <ProjectGrid />
      </main>
    </div>
  );
}
