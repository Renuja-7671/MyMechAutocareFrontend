-- ================================================
-- Add Image Columns to Vehicles Table
-- ================================================
-- This script adds columns to store vehicle image paths
-- Run this in Supabase SQL Editor
-- ================================================

-- Add image columns to vehicles table
ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS exterior_image_1 TEXT,
ADD COLUMN IF NOT EXISTS exterior_image_2 TEXT,
ADD COLUMN IF NOT EXISTS interior_image TEXT;

-- Add comments for documentation
COMMENT ON COLUMN vehicles.exterior_image_1 IS 'Storage path for first exterior vehicle image';
COMMENT ON COLUMN vehicles.exterior_image_2 IS 'Storage path for second exterior vehicle image';
COMMENT ON COLUMN vehicles.interior_image IS 'Storage path for interior vehicle image';

-- Verify the columns were added
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'vehicles' 
  AND column_name LIKE '%image%'
ORDER BY ordinal_position;

-- ================================================
-- Expected Output:
-- You should see 3 new columns:
-- 1. exterior_image_1 (TEXT, nullable)
-- 2. exterior_image_2 (TEXT, nullable)
-- 3. interior_image (TEXT, nullable)
-- ================================================
