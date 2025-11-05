-- ================================================
-- Supabase Storage RLS Policies for Vehicle Images
-- ================================================
-- Run this script in Supabase SQL Editor to fix the
-- "new row violates row-level security policy" error
-- ================================================

-- Step 1: Create the vehicle-images bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'vehicle-images', 
  'vehicle-images', 
  false,  -- Private bucket
  5242880,  -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

-- Step 2: Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- Step 3: Create new RLS policies

-- Policy 1: Allow authenticated users to upload images
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'vehicle-images');

-- Policy 2: Allow authenticated users to view images
CREATE POLICY "Allow authenticated reads"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'vehicle-images');

-- Policy 3: Allow authenticated users to update images
CREATE POLICY "Allow authenticated updates"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'vehicle-images')
WITH CHECK (bucket_id = 'vehicle-images');

-- Policy 4: Allow authenticated users to delete images
CREATE POLICY "Allow authenticated deletes"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'vehicle-images');

-- Step 4: Verify the policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'objects' 
  AND policyname LIKE '%authenticated%'
ORDER BY policyname;

-- ================================================
-- Expected Output:
-- You should see 4 policies listed:
-- 1. Allow authenticated uploads (INSERT)
-- 2. Allow authenticated reads (SELECT)
-- 3. Allow authenticated updates (UPDATE)
-- 4. Allow authenticated deletes (DELETE)
-- ================================================

-- VERIFICATION QUERY
-- Run this to check bucket configuration
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE id = 'vehicle-images';
