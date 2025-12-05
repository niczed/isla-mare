import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, CreditCard, Wallet, Gift, Shield, CheckCircle } from "lucide-react";

const PAYMENT_METHODS = [
  { 
    id: "card", 
    label: "Credit/Debit Card", 
    icon: CreditCard,
    description: "Visa, Mastercard, JCB"
  },
  { 
    id: "paypal", 
    label: "PayPal", 
    icon: Wallet,
    description: "Pay securely with PayPal"
  },
  { 
    id: "clicktopay", 
    label: "Click to Pay", 
    icon: Shield,
    description: "Fast checkout with saved cards"
  },
  { 
    id: "giftcard", 
    label: "Gift Card", 
    icon: Gift,
    description: "Redeem your gift card"
  },
];

const EWALLETS = [
  { id: "gcash", label: "GCash", color: "bg-green-500" },
  { id: "maya", label: "Maya", color: "bg-purple-500" },
  { id: "grabpay", label: "GrabPay", color: "bg-green-600" },
  { id: "shopeepay", label: "ShopeePay", color: "bg-orange-500" },
];

const Payment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedEwallet, setSelectedEwallet] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  
  const [giftCardCode, setGiftCardCode] = useState("");

  useEffect(() => {
    const data = searchParams.get("data");
    if (data) {
      try {
        const parsed = JSON.parse(decodeURIComponent(data));
        setBookingData(parsed);
      } catch (e) {
        toast({
          title: "Error",
          description: "Invalid booking data. Please try again.",
          variant: "destructive",
        });
        navigate("/accommodations");
      }
    }
  }, [searchParams, navigate, toast]);

  const handlePayment = async () => {
    if (!paymentMethod && !selectedEwallet) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method.",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === "card") {
      if (!cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
        toast({
          title: "Card Details Required",
          description: "Please fill in all card details.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsProcessing(true);

    const finalPaymentMethod = selectedEwallet || paymentMethod;

    const { error } = await supabase.from("bookings").insert({
      name: bookingData.name,
      email: bookingData.email,
      phone: bookingData.phone,
      check_in: bookingData.checkIn,
      check_out: bookingData.checkOut,
      guests: bookingData.guests,
      room_type: bookingData.roomType,
      room_price: bookingData.roomPrice,
      add_ons: bookingData.addOns,
      special_requests: bookingData.specialRequests,
      booking_type: "online",
      payment_method: finalPaymentMethod,
      payment_status: "paid",
      status: "confirmed",
    });

    setIsProcessing(false);

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Payment Successful!",
      description: "Your booking has been confirmed. Check your email for details.",
    });

    navigate("/accommodations");
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Loading booking details...</p>
        <Button variant="outline" onClick={() => navigate("/accommodations")}>
          Back to Accommodations
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/accommodations")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Accommodations
        </Button>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Payment Methods */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Select Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Payment Methods */}
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => {
                    setPaymentMethod(value);
                    setSelectedEwallet("");
                  }}
                  className="space-y-3"
                >
                  {PAYMENT_METHODS.map((method) => (
                    <div
                      key={method.id}
                      className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        paymentMethod === method.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => {
                        setPaymentMethod(method.id);
                        setSelectedEwallet("");
                      }}
                    >
                      <RadioGroupItem value={method.id} id={method.id} />
                      <method.icon className="h-6 w-6 text-primary" />
                      <div className="flex-1">
                        <Label htmlFor={method.id} className="text-base font-medium cursor-pointer">
                          {method.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>

                {/* Card Details Form */}
                {paymentMethod === "card" && (
                  <div className="space-y-4 p-4 bg-muted/30 rounded-lg animate-in slide-in-from-top-2">
                    <div className="space-y-2">
                      <Label>Card Number</Label>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.cardNumber}
                        onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Expiry Date</Label>
                        <Input
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>CVV</Label>
                        <Input
                          placeholder="123"
                          type="password"
                          maxLength={4}
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Cardholder Name</Label>
                      <Input
                        placeholder="John Doe"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* Gift Card Input */}
                {paymentMethod === "giftcard" && (
                  <div className="space-y-4 p-4 bg-muted/30 rounded-lg animate-in slide-in-from-top-2">
                    <div className="space-y-2">
                      <Label>Gift Card Code</Label>
                      <Input
                        placeholder="Enter your gift card code"
                        value={giftCardCode}
                        onChange={(e) => setGiftCardCode(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <Separator />

                {/* E-Wallets */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-primary" />
                    E-Wallets
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {EWALLETS.map((ewallet) => (
                      <button
                        key={ewallet.id}
                        onClick={() => {
                          setSelectedEwallet(ewallet.id);
                          setPaymentMethod("");
                        }}
                        className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                          selectedEwallet === ewallet.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className={`w-10 h-10 ${ewallet.color} rounded-full flex items-center justify-center text-white font-bold text-xs`}>
                          {ewallet.label.charAt(0)}
                        </div>
                        <span className="font-medium">{ewallet.label}</span>
                        {selectedEwallet === ewallet.id && (
                          <CheckCircle className="h-5 w-5 text-primary ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-lg">{bookingData.roomType}</p>
                  <p className="text-sm text-muted-foreground">{bookingData.roomPrice}</p>
                </div>
                
                <Separator />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guest</span>
                    <span>{bookingData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-in</span>
                    <span>{bookingData.checkIn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-out</span>
                    <span>{bookingData.checkOut}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guests</span>
                    <span>{bookingData.guests}</span>
                  </div>
                </div>

                {bookingData.addOns && bookingData.addOns.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-2">Add-Ons</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {bookingData.addOns.map((addon: string, idx: number) => (
                          <li key={idx}>• {addon}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                <Separator />

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Complete Payment"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  <Shield className="h-3 w-3 inline mr-1" />
                  Your payment is secure and encrypted
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;