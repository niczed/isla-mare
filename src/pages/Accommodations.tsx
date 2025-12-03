import { useState } from "react";
import { Navbar } from "@/components/Navbar";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Wifi, Waves } from "lucide-react";
import { BookingModal } from "@/components/BookingModal";
import deluxeVilla from "@/assets/deluxe-villa.jpg";
import beachBungalow from "@/assets/beach-bungalow.jpg";
import oceanSuite from "@/assets/ocean-suite.jpg";

interface Room {
  title: string;
  description: string;
  price: string;
  image: string;
  capacity: number;
}

const rooms: Room[] = [
  {
    title: "Deluxe Overwater Villa",
    description: "Experience ultimate luxury in our overwater villa with direct ocean access and private sundeck.",
    price: "$450/night",
    image: deluxeVilla,
    capacity: 2,
  },
  {
    title: "Beach Bungalow",
    description: "Cozy beachfront accommodation with traditional tropical design and stunning sunset views.",
    price: "$280/night",
    image: beachBungalow,
    capacity: 4,
  },
  {
    title: "Ocean Suite",
    description: "Spacious suite with panoramic ocean views, modern amenities, and private balcony.",
    price: "$350/night",
    image: oceanSuite,
    capacity: 3,
  },
];

const Accommodations = () => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-tropical px-4 py-16">
          <div className="mx-auto max-w-6xl text-center">
            <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl animate-fade-in">
              Our Accommodations
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Choose from our selection of beautifully designed rooms and villas, each offering a unique tropical experience.
            </p>
          </div>
        </section>

        {/* Rooms Grid */}
        <section className="px-4 py-16 bg-background">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room, index) => (
                <div
                  key={room.title}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card 
                    className="group overflow-hidden border-border/50 bg-card shadow-[0_4px_20px_-2px_hsl(187,50%,50%,0.15)] transition-all hover:scale-[1.02] hover:shadow-[0_8px_32px_-4px_hsl(187,100%,42%,0.25)] cursor-pointer"
                    onClick={() => handleRoomSelect(room)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={room.image}
                        alt={room.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute right-4 top-4 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-lg">
                        {room.price}
                      </div>
                    </div>
                    <CardContent className="space-y-4 p-6">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">{room.title}</h3>
                        <p className="mt-2 text-muted-foreground">{room.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{room.capacity} guests</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Wifi className="h-4 w-4" />
                          <span>Free WiFi</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Waves className="h-4 w-4" />
                          <span>Ocean View</span>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-primary text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg"
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
