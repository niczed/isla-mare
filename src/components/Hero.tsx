import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-resort.jpg";

export const Hero = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate("/booking");
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <div className="animate-fade-in space-y-6">
          <h1 className="text-5xl font-bold tracking-wider text-white md:text-7xl">
            ISLA MARÉ
          </h1>
          <p className="font-script text-6xl text-primary md:text-8xl">
            Resort
          </p>
          <p className="mx-auto max-w-2xl text-lg text-white/90 md:text-xl">
            "Where Every Stay Feels Like the Maldives."
          </p>
          <Button
            size="lg"
            onClick={handleBookNow}
            className="mt-8 bg-primary px-8 py-6 text-lg font-semibold text-primary-foreground shadow-[0_8px_30px_rgb(0,188,212,0.4)] transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-[0_12px_40px_rgb(0,188,212,0.5)]"
          >
            BOOK NOW
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <div className="h-12 w-px bg-white/50" />
      </div>
    </section>
  );
};
