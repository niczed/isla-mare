import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Calendar, RefreshCw, Search, Plus, Pencil, Trash2, Filter, Mail, Lock, Check, Eye } from "lucide-react";
import { format } from "date-fns";

// Room data for walk-in selection
const ROOMS = [
  {
    title: "Deluxe Overwater Villa",
    description: "Experience ultimate luxury in our overwater villa with direct ocean access and private sundeck.",
    price: "$450/night",
    image: "/deluxe-villa.jpg",
    capacity: 2,
    amenities: ["Ocean Access", "Private Sundeck", "King Bed", "WiFi", "Mini Bar"],
  },
  {
    title: "Beach Bungalow",
    description: "Cozy beachfront accommodation with traditional tropical design and stunning sunset views.",
    price: "$280/night",
    image: "/beach-bungalow.jpg",
    capacity: 4,
    amenities: ["Beachfront", "Sunset Views", "Queen Beds", "WiFi", "AC"],
  },
  {
    title: "Ocean Suite",
    description: "Spacious suite with panoramic ocean views, modern amenities, and private balcony.",
    price: "$350/night",
    image: "/ocean-suite.jpg",
    capacity: 3,
    amenities: ["Ocean Views", "Private Balcony", "King Bed", "WiFi", "Jacuzzi"],
  },
];

const ADD_ONS = [
  { id: "massage", label: "In-room massage", price: "₱800/hour" },
  { id: "cabana", label: "All-day cabana rental", price: "₱1,000" },
  { id: "bonfire", label: "Bonfire setup (night)", price: "₱1,200" },
  { id: "gym", label: "Gym use and shower", price: "₱600" },
  { id: "checkin", label: "Early check-in / late check-out", price: "₱1,000–₱2,000" },
  { id: "decoration", label: "Room decoration", price: "₱1,500–₱3,000" },
  { id: "extrabed", label: "Extra bed or mattress", price: "₱800–₱1,000/night" },
  { id: "transfer", label: "Airport/van transfers", price: "₱2,500–₱3,500" },
  { id: "laundry", label: "Laundry service", price: "Based on weight" },
];

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  check_in: string;
  check_out: string;
  guests: number;
  status: string;
  created_at: string;
  room_type: string | null;
  room_price: string | null;
  booking_type: string | null;
  payment_method: string | null;
  payment_status: string | null;
  add_ons: string[] | null;
  special_requests: string | null;
  ewallet_number: string | null;
}

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading, isAdmin, signIn, signOut } = useAuth();
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  
  // Walk-in Modal State
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [walkInData, setWalkInData] = useState({
    name: "",
    email: "",
    phone: "",
    check_in: "",
    check_out: "",
    guests: 1,
    room_type: "",
    payment_method: "",
    add_ons: [] as string[],
  });
  const [selectedWalkInRoom, setSelectedWalkInRoom] = useState<typeof ROOMS[0] | null>(null);
  
  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  
  // View Booking Modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);
  
  // Delete Confirmation
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Handle admin login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      await signIn(loginEmail, loginPassword);
      toast({ title: "Signed in successfully" });
    } catch (error: any) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    }
    setIsLoggingIn(false);
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchBookings();
    }
  }, [user, isAdmin]);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, filterType, filterPaymentStatus, filterDate]);

  const fetchBookings = async () => {
    setLoadingBookings(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setBookings(data || []);
    }
    setLoadingBookings(false);
  };

  const filterBookings = () => {
    let filtered = [...bookings];
    
    if (searchTerm) {
      filtered = filtered.filter(b => 
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.phone.includes(searchTerm) ||
        b.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterType !== "all") {
      filtered = filtered.filter(b => (b.booking_type || "online") === filterType);
    }
    
    if (filterPaymentStatus !== "all") {
      filtered = filtered.filter(b => (b.payment_status || "pending") === filterPaymentStatus);
    }
    
    if (filterDate) {
      filtered = filtered.filter(b => b.check_in === filterDate);
    }
    
    setFilteredBookings(filtered);
  };

  const updateBooking = async (id: string, updates: Partial<Booking>) => {
    const { error } = await supabase.from("bookings").update(updates).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Updated", description: "Booking updated successfully" });
      fetchBookings();
    }
  };

  const confirmPayment = async (id: string) => {
    const { error } = await supabase.from("bookings").update({ 
      payment_status: "paid",
      status: "confirmed"
    }).eq("id", id);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Payment Confirmed", description: "Booking has been marked as paid" });
      fetchBookings();
    }
  };

  const deleteBooking = async (id: string) => {
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Booking deleted successfully" });
      fetchBookings();
    }
    setShowDeleteDialog(false);
    setDeletingId(null);
  };

  const toggleWalkInAddOn = (id: string) => {
    setWalkInData(prev => ({
      ...prev,
      add_ons: prev.add_ons.includes(id)
        ? prev.add_ons.filter(a => a !== id)
        : [...prev.add_ons, id]
    }));
  };

  const addWalkIn = async () => {
    if (!walkInData.name || !walkInData.phone || !walkInData.check_in || !walkInData.check_out || !walkInData.room_type) {
      toast({ title: "Error", description: "Please fill in required fields including room type", variant: "destructive" });
      return;
    }

    const selectedRoom = ROOMS.find(r => r.title === walkInData.room_type);
    const addOnLabels = walkInData.add_ons.map(id => ADD_ONS.find(a => a.id === id)?.label).filter(Boolean);

    const { error } = await supabase.from("bookings").insert({
      name: walkInData.name,
      email: walkInData.email || `walkin_${Date.now()}@islamare.com`,
      phone: walkInData.phone,
      check_in: walkInData.check_in,
      check_out: walkInData.check_out,
      guests: walkInData.guests,
      room_type: walkInData.room_type,
      room_price: selectedRoom?.price || "",
      booking_type: "walkin",
      payment_method: walkInData.payment_method,
      payment_status: walkInData.payment_method ? "paid" : "pending",
      status: walkInData.payment_method ? "confirmed" : "pending",
      add_ons: addOnLabels,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Walk-in booking added" });
      setShowWalkInModal(false);
      setWalkInData({ name: "", email: "", phone: "", check_in: "", check_out: "", guests: 1, room_type: "", payment_method: "", add_ons: [] });
      setSelectedWalkInRoom(null);
      fetchBookings();
    }
  };

  const getPaymentStatusBadge = (status: string | null) => {
    if (!status || status === "pending") {
      return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">Pending</Badge>;
    }
    if (status === "paid") {
      return <Badge className="bg-green-500 text-white hover:bg-green-600">Paid</Badge>;
    }
    if (status === "failed") {
      return <Badge variant="destructive">Failed</Badge>;
    }
    return <Badge variant="secondary">{status}</Badge>;
  };

  const getBookingTypeBadge = (type: string | null) => {
    if (type === "walkin") {
      return <Badge variant="outline" className="border-orange-500 text-orange-500">Walk-In</Badge>;
    }
    return <Badge variant="outline" className="border-primary text-primary">Online</Badge>;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Not logged in - show login form
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <p className="text-muted-foreground text-sm">Sign in to access the admin dashboard</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Hello@islamare.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            {user && !isAdmin && (
              <div className="mt-4 p-3 bg-destructive/10 rounded-lg text-center">
                <p className="text-sm text-destructive">You don't have admin privileges.</p>
                <Button variant="link" size="sm" onClick={signOut} className="text-destructive">
                  Sign out and try another account
                </Button>
              </div>
            )}
            <div className="mt-4 text-center">
              <Button variant="ghost" onClick={() => navigate("/")}>
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchBookings}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={() => setShowWalkInModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Walk-In
            </Button>
            <Button variant="ghost" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{bookings.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Online Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {bookings.filter((b) => (b.booking_type || "online") === "online").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Walk-Ins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">
                {bookings.filter((b) => b.booking_type === "walkin").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {bookings.filter((b) => b.payment_status === "paid").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, phone, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Booking Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="walkin">Walk-In</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPaymentStatus} onValueChange={setFilterPaymentStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-[150px]"
              />
              {(searchTerm || filterType !== "all" || filterPaymentStatus !== "all" || filterDate) && (
                <Button variant="ghost" onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                  setFilterPaymentStatus("all");
                  setFilterDate("");
                }}>
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              All Reservations ({filteredBookings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingBookings ? (
              <p className="text-center py-8 text-muted-foreground">Loading bookings...</p>
            ) : filteredBookings.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No bookings found</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Room Type</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Add-Ons</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.name}</p>
                            <p className="text-xs text-muted-foreground">{booking.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-sm">{booking.room_type || "—"}</span>
                          {booking.room_price && (
                            <p className="text-xs text-muted-foreground">{booking.room_price}</p>
                          )}
                        </TableCell>
                        <TableCell>{getBookingTypeBadge(booking.booking_type)}</TableCell>
                        <TableCell>
                          <div className="text-sm whitespace-nowrap">
                            {format(new Date(booking.check_in), "MMM dd")} → {format(new Date(booking.check_out), "MMM dd")}
                          </div>
                        </TableCell>
                        <TableCell>
                          {booking.add_ons && booking.add_ons.length > 0 ? (
                            <div className="max-w-[150px]">
                              <p className="text-xs text-muted-foreground truncate" title={booking.add_ons.join(", ")}>
                                {booking.add_ons.slice(0, 2).join(", ")}
                                {booking.add_ons.length > 2 && ` +${booking.add_ons.length - 2}`}
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">None</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {getPaymentStatusBadge(booking.payment_status)}
                            {booking.payment_status !== "paid" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 text-xs border-green-500 text-green-600 hover:bg-green-50"
                                onClick={() => confirmPayment(booking.id)}
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Confirm
                              </Button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={booking.status || "pending"}
                            onValueChange={(value) => updateBooking(booking.id, { status: value })}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setViewingBooking(booking);
                                setShowViewModal(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingBooking(booking);
                                setShowEditModal(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => {
                                setDeletingId(booking.id);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Walk-In Modal */}
        <Dialog open={showWalkInModal} onOpenChange={setShowWalkInModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Walk-In Booking</DialogTitle>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left - Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Customer Name *</Label>
                    <Input
                      value={walkInData.name}
                      onChange={(e) => setWalkInData({ ...walkInData, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone *</Label>
                    <Input
                      value={walkInData.phone}
                      onChange={(e) => setWalkInData({ ...walkInData, phone: e.target.value })}
                      placeholder="+63 9XX XXX XXXX"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email (Optional)</Label>
                  <Input
                    value={walkInData.email}
                    onChange={(e) => setWalkInData({ ...walkInData, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Check-In *</Label>
                    <Input
                      type="date"
                      value={walkInData.check_in}
                      onChange={(e) => setWalkInData({ ...walkInData, check_in: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Check-Out *</Label>
                    <Input
                      type="date"
                      value={walkInData.check_out}
                      onChange={(e) => setWalkInData({ ...walkInData, check_out: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Guests</Label>
                    <Input
                      type="number"
                      min={1}
                      value={walkInData.guests}
                      onChange={(e) => setWalkInData({ ...walkInData, guests: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Room Type *</Label>
                    <Select 
                      value={walkInData.room_type} 
                      onValueChange={(v) => {
                        setWalkInData({ ...walkInData, room_type: v });
                        setSelectedWalkInRoom(ROOMS.find(r => r.title === v) || null);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select room" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROOMS.map(room => (
                          <SelectItem key={room.title} value={room.title}>
                            {room.title} - {room.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select value={walkInData.payment_method} onValueChange={(v) => setWalkInData({ ...walkInData, payment_method: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="gcash">GCash</SelectItem>
                      <SelectItem value="maya">Maya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Add-ons */}
                <div className="space-y-2">
                  <Label>Add-Ons (Optional)</Label>
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                    {ADD_ONS.map(addon => (
                      <div key={addon.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`walkin-${addon.id}`}
                          checked={walkInData.add_ons.includes(addon.id)}
                          onCheckedChange={() => toggleWalkInAddOn(addon.id)}
                        />
                        <label htmlFor={`walkin-${addon.id}`} className="text-sm cursor-pointer flex-1">
                          {addon.label} <span className="text-muted-foreground">({addon.price})</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right - Room Preview */}
              <div className="space-y-4">
                {selectedWalkInRoom ? (
                  <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                    <img
                      src={selectedWalkInRoom.image}
                      alt={selectedWalkInRoom.title}
                      className="w-full h-40 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                    <div>
                      <h3 className="font-bold text-lg">{selectedWalkInRoom.title}</h3>
                      <p className="text-primary font-semibold">{selectedWalkInRoom.price}</p>
                      <p className="text-sm text-muted-foreground mt-2">{selectedWalkInRoom.description}</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm mb-2">Amenities:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedWalkInRoom.amenities.map((amenity, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">{amenity}</Badge>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Capacity: Up to {selectedWalkInRoom.capacity} guests</p>
                  </div>
                ) : (
                  <div className="bg-muted/30 rounded-lg p-8 text-center text-muted-foreground">
                    Select a room to see details
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowWalkInModal(false)}>Cancel</Button>
              <Button onClick={addWalkIn}>Add Booking</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Booking Modal */}
        <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
            </DialogHeader>
            {viewingBooking && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="font-medium">{viewingBooking.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact</p>
                    <p className="font-medium">{viewingBooking.phone}</p>
                    <p className="text-sm text-muted-foreground">{viewingBooking.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Room Type</p>
                    <p className="font-medium">{viewingBooking.room_type || "—"}</p>
                    <p className="text-sm text-primary">{viewingBooking.room_price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dates</p>
                    <p className="font-medium">
                      {format(new Date(viewingBooking.check_in), "MMM dd, yyyy")} → {format(new Date(viewingBooking.check_out), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Guests</p>
                    <p className="font-medium">{viewingBooking.guests}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Booking Type</p>
                    {getBookingTypeBadge(viewingBooking.booking_type)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Status</p>
                    {getPaymentStatusBadge(viewingBooking.payment_status)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-medium capitalize">{viewingBooking.payment_method || "—"}</p>
                  </div>
                </div>
                {viewingBooking.ewallet_number && (
                  <div>
                    <p className="text-sm text-muted-foreground">E-Wallet Number</p>
                    <p className="font-medium">{viewingBooking.ewallet_number}</p>
                  </div>
                )}
                {viewingBooking.add_ons && viewingBooking.add_ons.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Add-Ons</p>
                    <div className="flex flex-wrap gap-2">
                      {viewingBooking.add_ons.map((addon, idx) => (
                        <Badge key={idx} variant="secondary">{addon}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {viewingBooking.special_requests && (
                  <div>
                    <p className="text-sm text-muted-foreground">Special Requests</p>
                    <p className="text-sm">{viewingBooking.special_requests}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setShowViewModal(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Booking</DialogTitle>
            </DialogHeader>
            {editingBooking && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Customer Name</Label>
                    <Input
                      value={editingBooking.name}
                      onChange={(e) => setEditingBooking({ ...editingBooking, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={editingBooking.phone}
                      onChange={(e) => setEditingBooking({ ...editingBooking, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={editingBooking.email}
                    onChange={(e) => setEditingBooking({ ...editingBooking, email: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Check-In</Label>
                    <Input
                      type="date"
                      value={editingBooking.check_in}
                      onChange={(e) => setEditingBooking({ ...editingBooking, check_in: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Check-Out</Label>
                    <Input
                      type="date"
                      value={editingBooking.check_out}
                      onChange={(e) => setEditingBooking({ ...editingBooking, check_out: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Payment Status</Label>
                    <Select
                      value={editingBooking.payment_status || "pending"}
                      onValueChange={(v) => setEditingBooking({ ...editingBooking, payment_status: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Booking Status</Label>
                    <Select
                      value={editingBooking.status || "pending"}
                      onValueChange={(v) => setEditingBooking({ ...editingBooking, status: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
              <Button onClick={() => {
                if (editingBooking) {
                  updateBooking(editingBooking.id, editingBooking);
                  setShowEditModal(false);
                }
              }}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this booking? This action cannot be undone.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => deletingId && deleteBooking(deletingId)}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Admin;