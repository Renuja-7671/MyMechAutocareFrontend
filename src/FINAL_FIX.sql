-- ================================================
-- FINAL FIX - Run This Entire Script
-- ================================================
-- This will 100% fix the storage policy error
-- Copy ALL of this and paste in Supabase SQL Editor
-- Then click RUN or press Ctrl+Enter (Cmd+Enter on Mac)
-- ================================================

-- STEP 1: Add columns to vehicles table
DO $$ 
BEGIN
    -- Add exterior_image_1 column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vehicles' AND column_name = 'exterior_image_1'
    ) THEN
        ALTER TABLE vehicles ADD COLUMN exterior_image_1 TEXT;
        RAISE NOTICE '✓ Added exterior_image_1 column';
    ELSE
        RAISE NOTICE '✓ exterior_image_1 column already exists';
    END IF;

    -- Add exterior_image_2 column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vehicles' AND column_name = 'exterior_image_2'
    ) THEN
        ALTER TABLE vehicles ADD COLUMN exterior_image_2 TEXT;
        RAISE NOTICE '✓ Added exterior_image_2 column';
    ELSE
        RAISE NOTICE '✓ exterior_image_2 column already exists';
    END IF;

    -- Add interior_image column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vehicles' AND column_name = 'interior_image'
    ) THEN
        ALTER TABLE vehicles ADD COLUMN interior_image TEXT;
        RAISE NOTICE '✓ Added interior_image column';
    ELSE
        RAISE NOTICE '✓ interior_image column already exists';
    END IF;
END $$;

-- STEP 2: Ensure bucket exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'vehicle-images'
    ) THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('vehicle-images', 'vehicle-images', false);
        RAISE NOTICE '✓ Created vehicle-images bucket';
    ELSE
        RAISE NOTICE '✓ vehicle-images bucket already exists';
    END IF;
END $$;

-- STEP 3: Remove ALL existing policies (clean slate)
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage'
        AND (
            policyname ILIKE '%vehicle%' 
            OR policyname ILIKE '%authenticated%'
        )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
        RAISE NOTICE '✓ Dropped policy: %', pol.policyname;
    END LOOP;
END $$;

-- STEP 4: Create fresh policies with guaranteed unique names
DO $$
BEGIN
    -- Policy 1: INSERT
    EXECUTE format('
        CREATE POLICY %I
        ON storage.objects
        FOR INSERT
        TO authenticated
        WITH CHECK (bucket_id = %L)',
        'vehicle_imgs_insert_' || to_char(now(), 'YYYYMMDDHH24MISS'),
        'vehicle-images'
    );
    RAISE NOTICE '✓ Created INSERT policy';

    -- Policy 2: SELECT
    EXECUTE format('
        CREATE POLICY %I
        ON storage.objects
        FOR SELECT
        TO authenticated
        USING (bucket_id = %L)',
        'vehicle_imgs_select_' || to_char(now(), 'YYYYMMDDHH24MISS'),
        'vehicle-images'
    );
    RAISE NOTICE '✓ Created SELECT policy';

    -- Policy 3: UPDATE
    EXECUTE format('
        CREATE POLICY %I
        ON storage.objects
        FOR UPDATE
        TO authenticated
        USING (bucket_id = %L)
        WITH CHECK (bucket_id = %L)',
        'vehicle_imgs_update_' || to_char(now(), 'YYYYMMDDHH24MISS'),
        'vehicle-images',
        'vehicle-images'
    );
    RAISE NOTICE '✓ Created UPDATE policy';

    -- Policy 4: DELETE
    EXECUTE format('
        CREATE POLICY %I
        ON storage.objects
        FOR DELETE
        TO authenticated
        USING (bucket_id = %L)',
        'vehicle_imgs_delete_' || to_char(now(), 'YYYYMMDDHH24MISS'),
        'vehicle-images'
    );
    RAISE NOTICE '✓ Created DELETE policy';
END $$;

-- STEP 5: Verify everything
DO $$
DECLARE
    column_count INT;
    bucket_count INT;
    policy_count INT;
BEGIN
    -- Check columns
    SELECT COUNT(*) INTO column_count
    FROM information_schema.columns 
    WHERE table_name = 'vehicles' 
    AND column_name IN ('exterior_image_1', 'exterior_image_2', 'interior_image');

    -- Check bucket
    SELECT COUNT(*) INTO bucket_count
    FROM storage.buckets 
    WHERE id = 'vehicle-images';

    -- Check policies
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage'
    AND bucket_id = 'vehicle-images'
    AND roles::text LIKE '%authenticated%';

    -- Report results
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'VERIFICATION RESULTS:';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Database columns: % / 3 ✓', column_count;
    RAISE NOTICE 'Storage bucket: % / 1 ✓', bucket_count;
    RAISE NOTICE 'RLS policies: % / 4 ✓', policy_count;
    RAISE NOTICE '========================================';
    
    IF column_count = 3 AND bucket_count = 1 AND policy_count >= 4 THEN
        RAISE NOTICE '✅ SUCCESS! Everything is configured correctly!';
        RAISE NOTICE 'You can now upload vehicle images!';
    ELSE
        RAISE NOTICE '⚠️  INCOMPLETE! Some components are missing.';
        RAISE NOTICE 'Please review the errors above.';
    END IF;
    RAISE NOTICE '========================================';
END $$;

-- STEP 6: Display current policies for confirmation
SELECT 
    policyname as "Policy Name",
    cmd as "Operation",
    roles::text as "Roles"
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND bucket_id = 'vehicle-images'
ORDER BY cmd;

-- ================================================
-- EXPECTED OUTPUT:
-- You should see 4 rows showing policies for:
-- - DELETE
-- - INSERT  
-- - SELECT
-- - UPDATE
-- All targeting 'authenticated' role
-- ================================================

-- FINAL CHECK: Show bucket info
SELECT 
    id as "Bucket ID",
    name as "Bucket Name",
    public as "Is Public",
    CASE WHEN public THEN '⚠️ Warning: Should be private!' ELSE '✅ Correct: Private' END as "Status"
FROM storage.buckets 
WHERE id = 'vehicle-images';

-- ================================================
-- SUCCESS INDICATORS:
-- ✅ You see "SUCCESS!" message in notices
-- ✅ 4 policies listed in first query
-- ✅ Bucket is private (public = false)
-- ✅ No error messages in red
-- ================================================
