import { Palmtree, Heart, Sparkles, Waves, UtensilsCrossed, Dumbbell, Wifi, Clock, Leaf, Phone, Globe, Mail, MapPin } from "lucide-react";

export const About = () => {
  const services = [
    { icon: Palmtree, title: "Comfortable Rooms", desc: "Clean, cozy, and air-conditioned rooms for solo travelers, couples, and families." },
    { icon: Waves, title: "Swimming Pool", desc: "A relaxing pool for adults and kids to enjoy." },
    { icon: Waves, title: "Beach Access", desc: "Just steps away from the shore — perfect for swimming, sunbathing, or relaxing." },
    { icon: UtensilsCrossed, title: "Pearl and Pine", desc: "Tasty local and American dishes, plus refreshing drinks by the sea." },
    { icon: Sparkles, title: "Aurèa Spa", desc: "Feel relaxed with our in-room or beachfront massage options." },
    { icon: Wifi, title: "Free Wi-Fi", desc: "Stay connected while you unwind." },
    { icon: Clock, title: "24/7 Front Desk", desc: "Friendly staff ready to help you anytime." },
    { icon: Leaf, title: "Eco-Friendly", desc: "We care for nature through clean energy, reduced plastic use, and beach clean-ups." },
  ];

  const facilities = [
    { title: "Pool", desc: "A refreshing oasis with clear waters, lounge chairs, and a kiddie pool." },
    { title: "Beach", desc: "A pristine white-sand beach with calm waters, ideal for swimming and water activities." },
    { title: "Restaurant", desc: "Enjoy local and international dishes served fresh in a cozy setting." },
    { title: "Gym", desc: "A modern fitness center with complete equipment for your daily workout routine." },
    { title: "Spa", desc: "Relax and rejuvenate with soothing massages and wellness treatments." },
  ];

  return (
    <section className="bg-gradient-to-b from-background to-secondary/30 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        {/* About Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            About Our Resort
          </h2>
          <p className="font-script text-3xl text-primary md:text-4xl">
            Paradise Awaits
          </p>
        </div>

        {/* Main Description */}
        <div className="text-center mb-16">
          <p className="text-lg leading-relaxed text-muted-foreground md:text-xl max-w-4xl mx-auto">
            Isla Maré Resort is a peaceful island getaway with a Maldives vibe, where you can relax, 
            enjoy nature, and feel at home. We offer cozy rooms, friendly service, and a quiet place to unwind.
            Whether you're spending time with loved ones or taking a break for yourself, 
            Isla Maré is the perfect place to enjoy the beauty of island life in comfort and peace.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-3 mb-16">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Palmtree className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Tropical Paradise</h3>
            <p className="text-muted-foreground">
              Surrounded by crystal-clear turquoise waters and pristine white sand beaches
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <Heart className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Warm Hospitality</h3>
            <p className="text-muted-foreground">
              Friendly staff dedicated to making your stay comfortable and memorable
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Luxury Comfort</h3>
            <p className="text-muted-foreground">
              Modern amenities and elegant design in every room and villa
            </p>
          </div>
        </div>

        {/* Our Services */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-foreground text-center mb-8">Our Services</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <div 
                key={index}
                className="p-4 rounded-xl bg-card border border-border/50 hover:shadow-lg transition-all"
              >
                <service.icon className="h-8 w-8 text-primary mb-3" />
                <h4 className="font-semibold text-foreground mb-1">{service.title}</h4>
                <p className="text-sm text-muted-foreground">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Facilities */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-foreground text-center mb-8">Our Facilities</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {facilities.map((facility, index) => (
              <div 
                key={index}
                className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center hover:bg-primary/10 transition-all"
              >
                <h4 className="font-semibold text-foreground mb-2">{facility.title}</h4>
                <p className="text-xs text-muted-foreground">{facility.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pearl and Pine & Aurèa Spa */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="p-6 rounded-2xl bg-card border border-border/50">
            <UtensilsCrossed className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-3">Pearl and Pine Restaurant</h3>
            <p className="text-muted-foreground">
              Pearl and Pine is a cozy seaside restaurant offering a delightful mix of local and American flavors. 
              Enjoy fresh, flavorful dishes and refreshing drinks while taking in the relaxing ocean view — 
              the perfect spot to dine, unwind, and savor the island vibe.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border/50">
            <Sparkles className="h-10 w-10 text-accent mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-3">Aurèa Spa</h3>
            <p className="text-muted-foreground">
              Aurèa Spa offers the ultimate relaxation experience with soothing in-room or beachfront massages. 
              Let the gentle sea breeze and expert touch melt your stress away for a truly rejuvenating island escape.
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
          <div className="text-center mb-6">
            <p className="text-lg italic text-muted-foreground mb-4">
              "Discover your perfect island escape at Isla Maré Resort — where comfort meets nature and unforgettable memories are waiting. 
              Book your stay today, and let the island's magic renew your soul."
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-foreground">
              <Phone className="h-4 w-4 text-primary" />
              <span>+63 934-137-2634</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Globe className="h-4 w-4 text-primary" />
              <span>www.islamare.com</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Mail className="h-4 w-4 text-primary" />
              <span>Hello@islamare.com</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Barangay Bacungan, Sitio Tagkawayanan, Puerto Princesa City, Palawan 5300</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};