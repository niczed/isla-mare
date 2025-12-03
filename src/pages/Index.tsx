import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { MissionVision } from "@/components/MissionVision";
import { About } from "@/components/About";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <MissionVision />
      <About />
      <Footer />
    </div>
  );
};

export default Index;
