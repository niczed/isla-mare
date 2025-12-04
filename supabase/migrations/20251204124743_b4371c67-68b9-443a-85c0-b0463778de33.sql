-- Drop the existing insert policy that requires auth
DROP POLICY IF EXISTS "Users can create their own bookings" ON public.bookings;

-- Create new policy to allow anyone to create bookings
CREATE POLICY "Anyone can create bookings"
ON public.bookings
FOR INSERT
WITH CHECK (true);