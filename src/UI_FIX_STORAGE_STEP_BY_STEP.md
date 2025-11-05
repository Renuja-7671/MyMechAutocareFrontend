# 🔧 UI-Based Fix for Vehicle Images (No SQL Required)

If you prefer using the Supabase UI instead of SQL, follow these steps:

## Part 1: Add Database Columns (Required)

Unfortunately, this MUST be done via SQL. It's quick:

1. Open **Supabase Dashboard**
2. Click **SQL Editor** (left sidebar)
3. Paste this and click **Run**:

```sql
ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS exterior_image_1 TEXT,
ADD COLUMN IF NOT EXISTS exterior_image_2 TEXT,
ADD COLUMN IF NOT EXISTS interior_image TEXT;
```

✅ Done! Now proceed to Part 2.

---

## Part 2: Fix Storage Policies (UI Method)

### Step 1: Go to Storage
1. Open **Supabase Dashboard**
2. Click **Storage** (left sidebar)
3. Find the **vehicle-images** bucket
   - If it doesn't exist, click **New bucket**:
     - Name: `vehicle-images`
     - Public: **OFF** (keep it private)
     - Click **Save**

### Step 2: Delete Existing Policies (If Any)
1. Click on the **vehicle-images** bucket
2. Click the **Policies** tab at the top
3. If you see ANY policies listed, delete them all:
   - Click the **...** menu on each policy
   - Select **Delete policy**
   - Confirm deletion
4. Now you should have a clean slate (no policies)

### Step 3: Create New Policies

#### Option A: Quick Setup (Recommended)
1. Still in the **Policies** tab
2. Click **New Policy** button
3. Select **"Get started quickly"**
4. Choose **"Allow access to authenticated users only"**
5. This creates ALL needed policies at once!
6. Click **Save**
7. ✅ **Done!** Skip to "Test It" section below

#### Option B: Manual Setup (If Option A doesn't work)

Create 4 policies manually:

**Policy 1: Allow Upload**
1. Click **New Policy**
2. Choose **"For full customization"**
3. Fill in:
   - Policy Name: `Vehicle images insert policy`
   - Target roles: `authenticated`
   - Policy command: `INSERT`
   - USING expression: leave blank
   - WITH CHECK expression: `bucket_id = 'vehicle-images'`
4. Click **Review** → **Save policy**

**Policy 2: Allow Read**
1. Click **New Policy**
2. Choose **"For full customization"**
3. Fill in:
   - Policy Name: `Vehicle images select policy`
   - Target roles: `authenticated`
   - Policy command: `SELECT`
   - USING expression: `bucket_id = 'vehicle-images'`
   - WITH CHECK expression: leave blank
4. Click **Review** → **Save policy**

**Policy 3: Allow Update**
1. Click **New Policy**
2. Choose **"For full customization"**
3. Fill in:
   - Policy Name: `Vehicle images update policy`
   - Target roles: `authenticated`
   - Policy command: `UPDATE`
   - USING expression: `bucket_id = 'vehicle-images'`
   - WITH CHECK expression: `bucket_id = 'vehicle-images'`
4. Click **Review** → **Save policy**

**Policy 4: Allow Delete**
1. Click **New Policy**
2. Choose **"For full customization"**
3. Fill in:
   - Policy Name: `Vehicle images delete policy`
   - Target roles: `authenticated`
   - Policy command: `DELETE`
   - USING expression: `bucket_id = 'vehicle-images'`
   - WITH CHECK expression: leave blank
4. Click **Review** → **Save policy**

### Step 4: Verify
You should now see 4 policies listed in the Policies tab:
- ✅ Vehicle images insert policy (or similar name)
- ✅ Vehicle images select policy
- ✅ Vehicle images update policy
- ✅ Vehicle images delete policy

---

## Test It!

1. Go back to your WheelsDoc application
2. Log in as a customer
3. Go to **My Vehicles** tab
4. Click **Add New Vehicle**
5. Fill in vehicle details
6. Upload some images:
   - Click "Upload Exterior Images" (add 1 or 2)
   - Click "Upload Interior Image" (add 1)
7. Click **Add Vehicle**
8. ✅ It should work without errors!
9. Click **View Images** on the vehicle card to see your photos

---

## Still Not Working?

### Check Your Login
- Make sure you're actually logged in
- Open browser DevTools (F12)
- Go to **Console** tab
- Look for error messages
- Check **Application** → **Local Storage** → should see user data

### Check Bucket Name
- Make sure bucket is named exactly: `vehicle-images` (lowercase, with dash)
- Case-sensitive!

### Check File
- File must be an image (jpg, png, gif, etc.)
- File must be under 5MB
- Try a very small image first (< 100KB)

### Nuclear Option: SQL Method
If UI method doesn't work, use the SQL script:
- See `FIX_STORAGE_POLICIES_NOW.sql`
- Copy entire script
- Paste in SQL Editor
- Run it
- Should definitely work

---

## What Each Policy Does

**INSERT Policy**: Allows users to upload new images
**SELECT Policy**: Allows users to view/download images  
**UPDATE Policy**: Allows users to replace images
**DELETE Policy**: Allows users to remove images

All require authentication = secure! 🔒

---

## Screenshots Guide

### Finding Storage:
```
Dashboard → [Storage icon] Storage
```

### Finding Policies Tab:
```
Storage → vehicle-images → [Policies] tab (top navigation)
```

### Creating Policy:
```
Policies tab → [New Policy] button → Choose template or customize
```

### Verifying Policies:
```
Policies tab → Should see list of 4 policies with checkmarks ✓
```

---

## Success Indicators

✅ **In Supabase:**
- Bucket `vehicle-images` exists
- Bucket is **Private** (not public)
- Policies tab shows 4 policies
- Each policy targets `authenticated` role

✅ **In Your App:**
- Can upload images without console errors
- Can view images in dialog
- Images load properly with signed URLs

✅ **In Browser Console:**
- No "row-level security policy" errors
- No "bucket not found" errors
- May see success logs from image uploads

---

## Quick Troubleshooting

| Error | Solution |
|-------|----------|
| "new row violates RLS policy" | Policies not created or wrong bucket name |
| "Bucket not found" | Create bucket named `vehicle-images` |
| "Invalid file type" | Use jpg, png, or gif images |
| "File too large" | Use images under 5MB |
| Images won't display | Check network tab for 403/404 errors |
| Upload button does nothing | Check browser console for JS errors |

---

## Need More Help?

1. Check browser console (F12) for specific errors
2. Check Supabase Dashboard → Logs for server errors
3. Verify you're logged in (check localStorage)
4. Try with a different image file
5. Try the SQL method: `FIX_STORAGE_POLICIES_NOW.sql`

**The SQL method is more reliable than UI for complex policies!**
