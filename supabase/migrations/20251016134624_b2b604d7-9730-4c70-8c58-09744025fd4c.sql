-- Add stats columns to waitlist table
ALTER TABLE public.waitlist
ADD COLUMN session_start TIMESTAMP WITH TIME ZONE,
ADD COLUMN clicks_saved INTEGER DEFAULT 0,
ADD COLUMN untraveled_pixels INTEGER DEFAULT 0,
ADD COLUMN discarded_suggestions INTEGER DEFAULT 0,
ADD COLUMN total_clicks INTEGER DEFAULT 0,
ADD COLUMN space_bar_presses INTEGER DEFAULT 0,
ADD COLUMN physically_traveled_pixels INTEGER DEFAULT 0,
ADD COLUMN savings_travel_percent INTEGER DEFAULT 0,
ADD COLUMN savings_clicks_percent INTEGER DEFAULT 0;