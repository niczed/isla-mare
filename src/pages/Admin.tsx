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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Calendar, RefreshCw, Search, Plus, Pencil, Trash2, Filter, LogIn } from "lucide-react";
import { format } from "date-fns";

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
}

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading, isAdmin, signOut } = useAuth();
  
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
  });
  
  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  
  // Delete Confirmation
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(b => 
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.phone.includes(searchTerm) ||
        b.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Booking type filter
    if (filterType !== "all") {
      filtered = filtered.filter(b => (b.booking_type || "online") === filterType);
    }
    
    // Payment status filter
    if (filterPaymentStatus !== "all") {
      filtered = filtered.filter(b => (b.payment_status || "pending") === filterPaymentStatus);
    }
    
    // Date filter
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

  const addWalkIn = async () => {
    if (!walkInData.name || !walkInData.phone || !walkInData.check_in || !walkInData.check_out) {
      toast({ title: "Error", description: "Please fill in required fields", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("bookings").insert({
      name: walkInData.name,
      email: walkInData.email || `walkin_${Date.now()}@islamare.com`,
      phone: walkInData.phone,
      check_in: walkInData.check_in,
      check_out: walkInData.check_out,
      guests: walkInData.guests,
      room_type: walkInData.room_type,
      booking_type: "walkin",
      payment_method: walkInData.payment_method,
      payment_status: "paid",
      status: "confirmed",
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Walk-in booking added" });
      setShowWalkInModal(false);
      setWalkInData({ name: "", email: "", phone: "", check_in: "", check_out: "", guests: 1, room_type: "", payment_method: "" });
      fetchBookings();
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      confirmed: "default",
      cancelled: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const getPaymentStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="secondary">pending</Badge>;
    const colors: Record<string, string> = {
      paid: "bg-green-500",
      pending: "bg-yellow-500",
      failed: "bg-red-500",
    };
    return <Badge className={`${colors[status] || "bg-gray-500"} text-white`}>{status}</Badge>;
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

  // Not logged in - show login prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Admin Access Required</h1>
        <p className="text-muted-foreground">Please sign in to access the admin dashboard.</p>
        <Button onClick={() => navigate("/auth")}>
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
        <Button variant="ghost" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </div>
    );
  }

  // User logged in but not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
        <p className="text-muted-foreground">You don't have admin privileges to access this page.</p>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => navigate("/")}>
            Back to Home
          </Button>
          <Button variant="outline" onClick={signOut}>
            Sign Out
          </Button>
        </div>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {bookings.filter((b) => b.status === "confirmed").length}
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
                  <SelectItem value="failed">Failed</SelectItem>
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
                      <TableHead>Contact</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Dates</TableHead>
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
                            <p className="text-xs text-muted-foreground">{booking.room_type || "—"}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{booking.email}</div>
                            <div className="text-muted-foreground">{booking.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getBookingTypeBadge(booking.booking_type)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{format(new Date(booking.check_in), "MMM dd")}</div>
                            <div className="text-muted-foreground">to {format(new Date(booking.check_out), "MMM dd")}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {getPaymentStatusBadge(booking.payment_status)}
                            <p className="text-xs text-muted-foreground">{booking.payment_method || "—"}</p>
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
                          <div className="flex gap-2">
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Walk-In Booking</DialogTitle>
            </DialogHeader>
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
                  <Label>Room Type</Label>
                  <Input
                    value={walkInData.room_type}
                    onChange={(e) => setWalkInData({ ...walkInData, room_type: e.target.value })}
                    placeholder="e.g., Tropical Nest"
                  />
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowWalkInModal(false)}>Cancel</Button>
              <Button onClick={addWalkIn}>Add Booking</Button>
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