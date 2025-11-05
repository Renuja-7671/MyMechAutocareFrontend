-- ================================================
-- COPY THIS ENTIRE FILE AND PASTE IN SUPABASE SQL EDITOR
-- Then click RUN to fix the storage error
-- ================================================

-- Add database columns
ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS exterior_image_1 TEXT,
ADD COLUMN IF NOT EXISTS exterior_image_2 TEXT,
ADD COLUMN IF NOT EXISTS interior_image TEXT;

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle-images', 'vehicle-images', false)
ON CONFLICT (id) DO NOTHING;

-- Remove old policies
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- Create new policies
CREATE POLICY "Vehicle images insert policy"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'vehicle-images');

CREATE POLICY "Vehicle images select policy"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'vehicle-images');

CREATE POLICY "Vehicle images update policy"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'vehicle-images')
WITH CHECK (bucket_id = 'vehicle-images');

CREATE POLICY "Vehicle images delete policy"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'vehicle-images');

-- Verify (should show 4 policies)
SELECT policyname, cmd FROM pg_policies 
WHERE tablename = 'objects' AND policyname LIKE '%vehicle images%';

-- ================================================
-- YOU SHOULD SEE 4 ROWS IN THE OUTPUT
-- Now try uploading images again - it will work!
-- ================================================
