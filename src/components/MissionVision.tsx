import { Target, Eye } from "lucide-react";

export const MissionVision = () => {
  return (
    <section className="bg-gradient-to-r from-primary/5 via-background to-accent/5 px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground md:text-5xl mb-4">
            Our Purpose
          </h2>
          <p className="text-muted-foreground text-lg">
            Guiding our commitment to exceptional hospitality
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="p-8 rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Target className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              At Isla Maré Resort, our mission is to offer an unforgettable island experience that blends 
              luxury, authenticity, and sustainability. We are committed to providing exceptional service, 
              creating lasting memories, and preserving the natural beauty of our island paradise for 
              generations to come.
            </p>
          </div>

          {/* Vision */}
          <div className="p-8 rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                <Eye className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Our Vision</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              To be the premier island destination in the Philippines, renowned for our Maldives-inspired 
              luxury, warm Filipino hospitality, and commitment to sustainable tourism. We envision 
              Isla Maré as a sanctuary where guests reconnect with nature and create cherished memories 
              with their loved ones.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};