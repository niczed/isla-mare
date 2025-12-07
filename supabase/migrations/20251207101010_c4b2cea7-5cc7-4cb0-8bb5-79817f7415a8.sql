-- Add ewallet_number column to bookings table for storing e-wallet/GCash numbers
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS ewallet_number text;