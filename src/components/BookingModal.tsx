import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import { CalendarIcon, Users, Wifi, Waves, User, Mail, Phone, Sparkles, CreditCard, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ADD_ONS = [
  { id: "massage", label: "In-room massage", price: "₱800/hour" },
  { id: "cabana", label: "All-day cabana rental", price: "₱1,000" },
  { id: "bonfire", label: "Bonfire setup (night)", price: "₱1,200 (up to 6 pax)" },
  { id: "gym", label: "Gym use and shower", price: "₱600" },
  { id: "checkin", label: "Early check-in / late check-out", price: "₱1,000–₱2,000" },
  { id: "decoration", label: "Room decoration (honeymoon, birthday, etc.)", price: "₱1,500–₱3,000" },
  { id: "extrabed", label: "Extra bed or mattress", price: "₱800–₱1,000/night" },
  { id: "transfer", label: "Airport or van transfers", price: "₱2,500–₱3,500 roundtrip" },
  { id: "laundry", label: "Laundry service", price: "Based on weight/item" },
];

const PAYMENT_METHODS = [
  { id: "gcash", label: "GCash", icon: "💚" },
  { id: "maya", label: "Maya (PayMaya)", icon: "💜" },
  { id: "grabpay", label: "GrabPay", icon: "💛" },
  { id: "shopeepay", label: "ShopeePay", icon: "🧡" },
  { id: "bpi", label: "BPI Online", icon: "🏦" },
  { id: "bdo", label: "BDO Online", icon: "🏦" },
  { id: "unionbank", label: "UnionBank", icon: "🏦" },
  { id: "creditcard", label: "Credit/Debit Card", icon: "💳" },
  { id: "paypal", label: "PayPal", icon: "🌐" },
  { id: "cash", label: "Cash on Arrival", icon: "💵" },
];

interface Room {
  title: string;
  description: string;
  price: string;
  image: string;
  capacity: number;
  amenities?: string[];
  targetAudience?: string;
}

interface BookingModalProps {
  room: Room | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BookingModal = ({ room, open, onOpenChange }: BookingModalProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: 1,
    specialRequests: "",
  });
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkIn || !checkOut) {
      toast({
        title: "Dates Required",
        description: "Please select check-in and check-out dates.",
        variant: "destructive",
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Generate a unique booking ID for guests without accounts
    const guestBookingId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const { error } = await supabase.from("bookings").insert({
      user_id: guestBookingId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      check_in: format(checkIn, "yyyy-MM-dd"),
      check_out: format(checkOut, "yyyy-MM-dd"),
      guests: formData.guests,
    });

    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Booking Confirmed!",
      description: `Your stay at ${room?.title} has been booked successfully. We will contact you shortly.`,
    });

    onOpenChange(false);
    setFormData({ name: "", email: "", phone: "", guests: 1, specialRequests: "" });
    setCheckIn(undefined);
    setCheckOut(undefined);
    setSelectedAddOns([]);
    setPaymentMethod("");
  };

  if (!room) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-foreground">
            Book Your Paradise Stay
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Left Side - Booking Form */}
          <div className="p-6 border-r border-border/50">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  Contact Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+63 9XX XXX XXXX"
                  required
                  className="bg-background"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    Check-in Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkIn && "text-muted-foreground"
                        )}
                      >
                        {checkIn ? format(checkIn, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkIn}
                        onSelect={setCheckIn}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    Check-out Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkOut && "text-muted-foreground"
                        )}
                      >
                        {checkOut ? format(checkOut, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkOut}
                        onSelect={setCheckOut}
                        disabled={(date) => date < (checkIn || new Date())}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="guests" className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Number of Guests
                </Label>
                <Input
                  id="guests"
                  name="guests"
                  type="number"
                  min={1}
                  max={room.capacity}
                  value={formData.guests}
                  onChange={handleChange}
                  className="bg-background"
                />
              </div>

              {/* Add-Ons Section */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Add-Ons (Optional)
                </Label>
                <div className="space-y-2 max-h-32 overflow-y-auto pr-2 border rounded-lg p-2 bg-muted/20">
                  {ADD_ONS.map((addon) => (
                    <div
                      key={addon.id}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        id={addon.id}
                        checked={selectedAddOns.includes(addon.id)}
                        onCheckedChange={() => toggleAddOn(addon.id)}
                      />
                      <label
                        htmlFor={addon.id}
                        className="flex-1 text-sm cursor-pointer"
                      >
                        <span className="text-foreground">{addon.label}</span>
                        <span className="text-muted-foreground ml-2">({addon.price})</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-primary" />
                  Payment Method
                </Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map((method) => (
                    <div key={method.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label htmlFor={method.id} className="flex items-center gap-2 cursor-pointer text-sm">
                        <span>{method.icon}</span>
                        <span>{method.label}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                <Textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  placeholder="Any special requirements or preferences..."
                  rows={2}
                  className="bg-background resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Submit Booking"}
              </Button>
            </form>
          </div>

          {/* Right Side - Room Preview */}
          <div className="p-6 bg-muted/30">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-xl">
                <img
                  src={room.image}
                  alt={room.title}
                  className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              <div>
                <h3 className="text-xl font-bold text-foreground">{room.title}</h3>
                {room.targetAudience && (
                  <span className="inline-block mt-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {room.targetAudience}
                  </span>
                )}
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                  {room.description}
                </p>
              </div>

              <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-primary/10">
                <span className="text-sm text-muted-foreground">Price</span>
                <span className="text-xl font-bold text-primary">{room.price}</span>
              </div>

              {/* Amenities */}
              {room.amenities && room.amenities.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Amenities</h4>
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-2">
                    {room.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Sparkles className="h-3 w-3 text-primary flex-shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Default Amenities if none provided */}
              {(!room.amenities || room.amenities.length === 0) && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Key Amenities</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4 text-primary" />
                      <span>Up to {room.capacity} guests</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Wifi className="h-4 w-4 text-primary" />
                      <span>Free WiFi</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Waves className="h-4 w-4 text-primary" />
                      <span>Ocean View</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4 text-primary" />
                      <span>24/7 Service</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};