# 🚀 Quick Fix: Vehicle Images Upload Error

## Error You're Seeing
```
Error uploading exterior image: StorageApiError: new row violates row-level security policy
Error uploading interior image: StorageApiError: new row violates row-level security policy
```

## ⚡ Fastest Fix (2 minutes)

### Step 1: Add Image Columns to Vehicles Table
1. Open **Supabase Dashboard** → **SQL Editor**
2. Copy and paste this SQL:

```sql
ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS exterior_image_1 TEXT,
ADD COLUMN IF NOT EXISTS exterior_image_2 TEXT,
ADD COLUMN IF NOT EXISTS interior_image TEXT;
```

3. Click **Run** (or press Ctrl/Cmd + Enter)

### Step 2: Set Up Storage Policies
1. Still in **SQL Editor**, run this complete script:

```sql
-- Create bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('vehicle-images', 'vehicle-images', false, 5242880)
ON CONFLICT (id) DO NOTHING;

-- Create policies
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'vehicle-images');

CREATE POLICY "Allow authenticated reads" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'vehicle-images');

CREATE POLICY "Allow authenticated updates" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'vehicle-images');

CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'vehicle-images');
```

2. Click **Run**

### Step 3: Test
1. Go back to your application
2. Try adding a vehicle with images
3. ✅ It should work now!

---

## 🔧 Alternative Method (Using UI)

If you prefer clicking instead of SQL:

### For Storage Policies:
1. **Supabase Dashboard** → **Storage**
2. Find or create **vehicle-images** bucket
3. Click **Policies** tab
4. Click **New Policy** → **Get started quickly**
5. Select **"Allow access to authenticated users only"**
6. Click **Save**

### For Database Columns:
1. **Supabase Dashboard** → **Table Editor**
2. Select **vehicles** table
3. Click **+ Add Column** (3 times)
4. Add these columns:
   - Name: `exterior_image_1`, Type: `text`, nullable: ✓
   - Name: `exterior_image_2`, Type: `text`, nullable: ✓
   - Name: `interior_image`, Type: `text`, nullable: ✓
5. Click **Save** for each

---

## 📋 What This Does

**Database Changes:**
- Adds 3 columns to store image file paths in the vehicles table
- These store the Storage bucket file names (not URLs)

**Storage Policies:**
- Creates a private bucket for vehicle images
- Allows authenticated users to upload images
- Allows authenticated users to view images via signed URLs
- Prevents public access to sensitive vehicle photos

**Security:**
- Images are private (not publicly accessible)
- Only authenticated users can upload/view
- Signed URLs expire after 1 hour
- 5MB file size limit per image

---

## ✅ Verification

After running the scripts, verify setup:

### Check Database:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'vehicles' 
AND column_name LIKE '%image%';
```

Expected result: 3 rows showing the image columns

### Check Storage:
```sql
SELECT policyname 
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%authenticated%';
```

Expected result: 4 policies (uploads, reads, updates, deletes)

---

## 🎯 How It Works

1. **Customer adds vehicle** with images
2. **Images upload** to `vehicle-images` bucket in Supabase Storage
3. **File names stored** in vehicles table (e.g., `123_exterior_1_1699123456.jpg`)
4. **When viewing**, app requests signed URLs from Supabase
5. **Signed URLs** allow temporary (1 hour) access to private images
6. **Images display** in the VehicleImagesDialog component

---

## 🐛 Still Having Issues?

**Error: Bucket doesn't exist**
- Run the INSERT INTO storage.buckets command again
- Or manually create it in Dashboard → Storage → New Bucket

**Error: Columns already exist**
- That's fine! The `IF NOT EXISTS` prevents errors
- Your columns are already there

**Error: Policy already exists**
- Drop and recreate:
```sql
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
-- Then run CREATE POLICY again
```

**Images still won't upload**
- Check browser console for specific errors
- Verify you're logged in (check localStorage for 'user')
- Check file size (must be < 5MB)
- Check file type (must be image/*)

---

## 📖 More Details

For comprehensive documentation, see:
- `VEHICLE_IMAGES_STORAGE_SETUP.md` - Full setup guide
- `supabase-storage-policies.sql` - Complete SQL script
- `add-vehicle-image-columns.sql` - Database migration script

---

## Support

If you continue experiencing issues:
1. Check the browser console for detailed error messages
2. Verify your Supabase project URL and keys in `/utils/supabase/info.tsx`
3. Ensure you're logged in (uploads require authentication)
4. Try a smaller image file (< 1MB) to rule out size issues
