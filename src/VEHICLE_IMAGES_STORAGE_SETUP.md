# Vehicle Images Storage Setup Guide

## Issue
You're getting the error: `StorageApiError: new row violates row-level security policy`

This happens because the `vehicle-images` bucket has Row-Level Security (RLS) enabled but no policies have been created to allow users to upload or view images.

## Solution - Set Up RLS Policies in Supabase

Follow these steps to configure the proper storage policies:

### Step 1: Access Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click on the **vehicle-images** bucket (or create it if it doesn't exist)

### Step 2: Create the Bucket (if needed)
If the `vehicle-images` bucket doesn't exist:
1. Click **"New bucket"**
2. Name it: `vehicle-images`
3. **IMPORTANT**: Make it **Private** (not public)
4. Enable **File size limit**: 5 MB
5. Allowed MIME types: `image/*`
6. Click **Save**

### Step 3: Configure RLS Policies

Click on the **Policies** tab for the `vehicle-images` bucket, then create the following policies:

#### Policy 1: Allow Authenticated Users to Upload Images
**Policy Name**: `Allow authenticated uploads`
**Allowed operation**: INSERT
**Policy definition**:
```sql
(auth.role() = 'authenticated')
```

**Using the UI**:
1. Click **"New Policy"**
2. Choose **"For full customization"** or **"Create policy"**
3. Policy name: `Allow authenticated uploads`
4. Target roles: Leave blank or select `authenticated`
5. Operation: Check **INSERT**
6. Policy definition:
```sql
(auth.role() = 'authenticated')
```
7. Click **Review** then **Save policy**

#### Policy 2: Allow Authenticated Users to View Images
**Policy Name**: `Allow authenticated reads`
**Allowed operation**: SELECT
**Policy definition**:
```sql
(auth.role() = 'authenticated')
```

**Using the UI**:
1. Click **"New Policy"**
2. Policy name: `Allow authenticated reads`
3. Operation: Check **SELECT**
4. Policy definition:
```sql
(auth.role() = 'authenticated')
```
5. Click **Review** then **Save policy**

#### Policy 3: Allow Users to Update Their Vehicle Images (Optional)
**Policy Name**: `Allow authenticated updates`
**Allowed operation**: UPDATE
**Policy definition**:
```sql
(auth.role() = 'authenticated')
```

**Using the UI**:
1. Click **"New Policy"**
2. Policy name: `Allow authenticated updates`
3. Operation: Check **UPDATE**
4. Policy definition:
```sql
(auth.role() = 'authenticated')
```
5. Click **Review** then **Save policy**

#### Policy 4: Allow Users to Delete Their Vehicle Images (Optional)
**Policy Name**: `Allow authenticated deletes`
**Allowed operation**: DELETE
**Policy definition**:
```sql
(auth.role() = 'authenticated')
```

**Using the UI**:
1. Click **"New Policy"**
2. Policy name: `Allow authenticated deletes`
3. Operation: Check **DELETE**
4. Policy definition:
```sql
(auth.role() = 'authenticated')
```
5. Click **Review** then **Save policy**

### Alternative: SQL Script Method

If you prefer to use SQL, you can run these commands in the **SQL Editor**:

```sql
-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle-images', 'vehicle-images', false)
ON CONFLICT (id) DO NOTHING;

-- Policy 1: Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'vehicle-images');

-- Policy 2: Allow authenticated users to view
CREATE POLICY "Allow authenticated reads"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'vehicle-images');

-- Policy 3: Allow authenticated users to update
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'vehicle-images')
WITH CHECK (bucket_id = 'vehicle-images');

-- Policy 4: Allow authenticated users to delete
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'vehicle-images');
```

### Step 4: Verify Setup

After creating the policies:
1. Go back to your application
2. Try adding a vehicle with images
3. The upload should now work without errors

### Troubleshooting

**If you still get errors:**

1. **Check Authentication**: Make sure users are properly authenticated
   - The upload happens after login
   - Check localStorage for user session

2. **Check Bucket Name**: Ensure it's exactly `vehicle-images` (case-sensitive)

3. **Check File Size**: Images must be under 5MB

4. **Check File Type**: Only image files are allowed (jpg, png, gif, etc.)

5. **View Policies**: In Supabase Dashboard → Storage → vehicle-images → Policies
   - Make sure all 4 policies are listed and enabled

6. **Check Supabase Connection**: Verify your Supabase credentials in `/utils/supabase/info.tsx`

### Security Notes

**Why Private Bucket?**
- Vehicle images contain potentially sensitive customer information
- We use signed URLs (1-hour expiry) to provide temporary access
- Only authenticated users (customers, employees, admins) can view images
- This prevents unauthorized public access

**Image Naming Convention**:
- Format: `{vehicleId}_exterior_{number}_{timestamp}.{ext}`
- Example: `123_exterior_1_1699123456789.jpg`
- This ensures unique filenames and easy organization

**Access Control**:
- Customers: Can upload images for their vehicles
- Employees: Can view images for assigned services
- Admins: Can view all vehicle images
- All access requires authentication

### Testing

After setup, test the following:

1. **Customer Upload**:
   - Log in as a customer
   - Add a new vehicle
   - Upload 2 exterior and 1 interior image
   - Verify images appear in Supabase Storage

2. **Customer View**:
   - Click "View Images" on a vehicle card
   - Verify all images display correctly

3. **Employee View**:
   - Log in as an employee
   - View assigned services
   - Check vehicle images display (feature to be added)

4. **Admin View**:
   - Log in as admin
   - View services
   - Check vehicle images display (feature to be added)

## Quick Fix Summary

**Fastest Solution**:
1. Go to Supabase Dashboard → Storage → vehicle-images → Policies
2. Click **"New Policy"** → **"Get started quickly"** → **"Allow full access to authenticated users"**
3. This creates all needed policies at once
4. Done! Try uploading again.

## Need Help?

If you continue to experience issues:
1. Check the browser console for detailed error messages
2. Verify your Supabase project URL and anon key
3. Ensure RLS is enabled on the bucket
4. Check that policies are active (not disabled)
