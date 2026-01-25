// src/app/page.tsx
"use client";

import React from "react";

// UI Components
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// Homepage Sections
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import WorkspaceSection from "@/components/home/WorkspaceSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CTASection from "@/components/home/CTASection";

// If you want, you can also create a UseCasesSection later
// import UseCasesSection from "@/components/home/UseCasesSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Workspace Section */}
      <WorkspaceSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
