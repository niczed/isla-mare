-- Make user_id nullable and add new fields for enhanced booking system
ALTER TABLE public.bookings 
  ALTER COLUMN user_id DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS room_type text,
  ADD COLUMN IF NOT EXISTS room_price text,
  ADD COLUMN IF NOT EXISTS add_ons text[],
  ADD COLUMN IF NOT EXISTS special_requests text,
  ADD COLUMN IF NOT EXISTS booking_type text DEFAULT 'online',
  ADD COLUMN IF NOT EXISTS payment_method text,
  ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending';

-- Update existing RLS policy for insert to handle nullable user_id
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
CREATE POLICY "Anyone can create bookings" 
  ON public.bookings 
  FOR INSERT 
  WITH CHECK (true);