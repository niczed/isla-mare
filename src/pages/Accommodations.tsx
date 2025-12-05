import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Wifi, Waves, Tv, UtensilsCrossed, Bath, Coffee, TreePine, Dumbbell, Sparkles, Bed, AirVent, Sofa, ArrowLeft } from "lucide-react";
import { BookingModal } from "@/components/BookingModal";
import deluxeVilla from "@/assets/deluxe-villa.jpg";
import beachBungalow from "@/assets/beach-bungalow.jpg";
import oceanSuite from "@/assets/ocean-suite.jpg";

interface Room {
  title: string;
  description: string;
  price: string;
  priceNum: number;
  image: string;
  capacity: number;
  targetAudience: string;
  amenities: string[];
}

const rooms: Room[] = [
  {
    title: "Tropical Nest",
    description: "Spacious and relaxing — great for bonding moments with the whole family.",
    price: "₱25,000/night",
    priceNum: 25000,
    image: deluxeVilla,
    capacity: 6,
    targetAudience: "For family groups (up to 6 pax)",
    amenities: [
      "2 queen beds + sofa bed",
      "Air-conditioning",
      "Living area with cable TV",
      "Kitchenette with basic utensils",
      "Dining table for 6",
      "Private bathroom",
      "Free breakfast for 4",
      "Veranda with garden view",
      "Free Wi-Fi",
      "Pool Access"
    ]
  },
  {
    title: "Coral Bay Cottage",
    description: "A cozy beachfront cottage perfect for two. Ideal for romantic getaways.",
    price: "₱16,000/night",
    priceNum: 16000,
    image: beachBungalow,
    capacity: 2,
    targetAudience: "Good for couples",
    amenities: [
      "Queen-size bed",
      "Air-conditioning",
      "Private veranda with sea view",
      "Hot & cold shower",
      "Complimentary breakfast for 2",
      "Free Wi-Fi",
      "Mini fridge",
      "Pool Access"
    ]
  },
  {
    title: "The Green Haven",
    description: "Simple, clean, and peaceful — ideal for solo travelers or digital nomads.",
    price: "₱10,000/night",
    priceNum: 10000,
    image: oceanSuite,
    capacity: 1,
    targetAudience: "Solo room",
    amenities: [
      "Single bed",
      "Air-conditioning",
      "Work desk",
      "Private bathroom",
      "Free Wi-Fi",
      "Garden access",
      "Complimentary bottled water",
      "Pool Access"
    ]
  },
  {
    title: "Day Use Package",
    description: "Perfect for those who want to experience the resort without an overnight stay.",
    price: "₱2,500/pax",
    priceNum: 2500,
    image: deluxeVilla,
    capacity: 10,
    targetAudience: "Day visitors",
    amenities: [
      "Access from 8:00 AM to 5:00 PM",
      "Welcome drink",
      "Use of pool and beachfront facilities",
      "Towel & locker rental",
      "Set lunch with drinks"
    ]
  },
  {
    title: "Couple's Getaway Package",
    description: "A romantic escape for two with special inclusions to make your stay memorable.",
    price: "₱28,750/couple (2 nights)",
    priceNum: 28750,
    image: beachBungalow,
    capacity: 2,
    targetAudience: "Couples seeking romance",
    amenities: [
      "Deluxe room accommodation (2 nights)",
      "Romantic dinner by the beach",
      "Breakfast for 2",
      "Welcome drinks",
      "Access to swimming pool, gym, and beach area"
    ]
  },
  {
    title: "Family Staycation Package",
    description: "Create lasting memories with your loved ones in our family-friendly package.",
    price: "₱46,250/family (2 nights)",
    priceNum: 46250,
    image: deluxeVilla,
    capacity: 4,
    targetAudience: "Family of 4",
    amenities: [
      "Family room for 2 nights",
      "Daily breakfast for 4",
      "Use of beach cabana",
      "Access to playground, pool, and beachfront",
      "Complimentary snacks on arrival"
    ]
  },
  {
    title: "Wellness & Relax Package",
    description: "Rejuvenate your mind, body, and soul with our wellness-focused package.",
    price: "₱4,500/person (1 night)",
    priceNum: 4500,
    image: oceanSuite,
    capacity: 1,
    targetAudience: "Wellness seekers",
    amenities: [
      "Garden-view room accommodation",
      "Healthy welcome drink (green juice or smoothie)",
      "1-hour massage",
      "Breakfast and light healthy dinner",
      "Access to pool, beach, and meditation garden"
    ]
  },
  {
    title: "Premium Ocean Villa",
    description: "Experience ultimate luxury with panoramic ocean views and premium amenities.",
    price: "₱35,000/night",
    priceNum: 35000,
    image: oceanSuite,
    capacity: 4,
    targetAudience: "Luxury seekers",
    amenities: [
      "King-size bed + extra beds",
      "Air-conditioning",
      "Private infinity pool",
      "Butler service",
      "Gourmet breakfast included",
      "Free Wi-Fi",
      "Premium toiletries",
      "Ocean-view balcony"
    ]
  }
];

const Accommodations = () => {
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
    setModalOpen(true);
  };

  const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase();
    if (lower.includes("bed")) return <Bed className="h-3 w-3" />;
    if (lower.includes("air")) return <AirVent className="h-3 w-3" />;
    if (lower.includes("tv") || lower.includes("living")) return <Tv className="h-3 w-3" />;
    if (lower.includes("kitchen") || lower.includes("breakfast") || lower.includes("lunch") || lower.includes("dinner")) return <UtensilsCrossed className="h-3 w-3" />;
    if (lower.includes("bathroom") || lower.includes("shower")) return <Bath className="h-3 w-3" />;
    if (lower.includes("wi-fi")) return <Wifi className="h-3 w-3" />;
    if (lower.includes("pool") || lower.includes("beach")) return <Waves className="h-3 w-3" />;
    if (lower.includes("garden") || lower.includes("veranda")) return <TreePine className="h-3 w-3" />;
    if (lower.includes("gym")) return <Dumbbell className="h-3 w-3" />;
    if (lower.includes("massage") || lower.includes("spa")) return <Sparkles className="h-3 w-3" />;
    if (lower.includes("sofa")) return <Sofa className="h-3 w-3" />;
    if (lower.includes("drink") || lower.includes("coffee")) return <Coffee className="h-3 w-3" />;
    return <Sparkles className="h-3 w-3" />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-tropical px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="mb-6 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <div className="text-center">
              <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl animate-fade-in">
                Our Accommodations
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: "0.1s" }}>
                Choose from our selection of beautifully designed rooms and villas, each offering a unique tropical experience.
              </p>
            </div>
          </div>
        </section>

        {/* Rooms Grid */}
        <section className="px-4 py-16 bg-background">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {rooms.map((room, index) => (
                <div
                  key={room.title}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Card 
                    className="group overflow-hidden border-border/50 bg-card shadow-[0_4px_20px_-2px_hsl(187,50%,50%,0.15)] transition-all hover:scale-[1.02] hover:shadow-[0_8px_32px_-4px_hsl(187,100%,42%,0.25)] cursor-pointer h-full flex flex-col"
                    onClick={() => handleRoomSelect(room)}
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={room.image}
                        alt={room.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute right-2 top-2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-lg">
                        {room.price}
                      </div>
                      <div className="absolute left-2 top-2 rounded-full bg-secondary/90 px-2 py-1 text-xs text-secondary-foreground">
                        {room.targetAudience}
                      </div>
                    </div>
                    <CardContent className="flex-1 flex flex-col space-y-3 p-4">
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{room.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{room.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{room.capacity} {room.capacity === 1 ? 'guest' : 'guests'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Wifi className="h-3 w-3" />
                          <span>Free WiFi</span>
                        </div>
                      </div>

                      {/* Amenities Preview */}
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.slice(0, 4).map((amenity, idx) => (
                          <span 
                            key={idx}
                            className="inline-flex items-center gap-1 text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full"
                          >
                            {getAmenityIcon(amenity)}
                            <span className="truncate max-w-[80px]">{amenity.split(' ').slice(0, 2).join(' ')}</span>
                          </span>
                        ))}
                        {room.amenities.length > 4 && (
                          <span className="text-xs text-primary font-medium">+{room.amenities.length - 4} more</span>
                        )}
                      </div>

                      <Button
                        className="w-full mt-auto bg-primary text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg text-sm"
                      >
                        Book Now
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <BookingModal
        room={selectedRoom} 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
      />
    </div>
  );
};

export default Accommodations;