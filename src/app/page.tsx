import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import WorkspaceSection from "@/components/home/WorkspaceSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <WorkspaceSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
}
