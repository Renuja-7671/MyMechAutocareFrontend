-- ================================================
-- DEFINITIVE FIX for Vehicle Images Storage
-- ================================================
-- Copy this ENTIRE script and run it in Supabase SQL Editor
-- This will fix the "row-level security policy" error
-- ================================================

-- Step 1: Add columns to vehicles table
ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS exterior_image_1 TEXT,
ADD COLUMN IF NOT EXISTS exterior_image_2 TEXT,
ADD COLUMN IF NOT EXISTS interior_image TEXT;

-- Step 2: Ensure bucket exists (if not already created)
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle-images', 'vehicle-images', false)
ON CONFLICT (id) DO NOTHING;

-- Step 3: Drop ALL existing policies for this bucket to start fresh
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload vehicle images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can read vehicle images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update vehicle images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete vehicle images" ON storage.objects;
DROP POLICY IF EXISTS "Vehicle images insert policy" ON storage.objects;
DROP POLICY IF EXISTS "Vehicle images select policy" ON storage.objects;
DROP POLICY IF EXISTS "Vehicle images update policy" ON storage.objects;
DROP POLICY IF EXISTS "Vehicle images delete policy" ON storage.objects;

-- Step 4: Create NEW policies with unique names
CREATE POLICY "Vehicle images insert policy"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'vehicle-images');

CREATE POLICY "Vehicle images select policy"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'vehicle-images');

CREATE POLICY "Vehicle images update policy"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'vehicle-images')
WITH CHECK (bucket_id = 'vehicle-images');

CREATE POLICY "Vehicle images delete policy"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'vehicle-images');

-- Step 5: Verify policies were created successfully
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd as operation
FROM pg_policies 
WHERE tablename = 'objects' 
  AND policyname LIKE '%vehicle images%'
ORDER BY policyname;

-- ================================================
-- YOU SHOULD SEE 4 ROWS IN THE OUTPUT:
-- 1. Vehicle images delete policy (DELETE)
-- 2. Vehicle images insert policy (INSERT)
-- 3. Vehicle images select policy (SELECT)
-- 4. Vehicle images update policy (UPDATE)
-- ================================================

-- Step 6: Double-check bucket configuration
SELECT id, name, public 
FROM storage.buckets 
WHERE id = 'vehicle-images';

-- ================================================
-- OUTPUT SHOULD SHOW:
-- id: vehicle-images
-- name: vehicle-images
-- public: false
-- ================================================
