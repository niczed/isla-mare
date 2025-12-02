import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Rooms } from "@/components/Rooms";
import { About } from "@/components/About";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Rooms />
      <About />
      <Footer />
    </div>
  );
};

export default Index;
