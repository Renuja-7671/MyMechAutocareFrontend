// ================================================
// BROWSER CONSOLE CHECK
// ================================================
// Copy this entire file and paste in browser console (F12)
// It will check if storage is configured correctly
// ================================================

(async () => {
  console.log('🔍 Checking Vehicle Images Storage Configuration...\n');

  // Check if supabase is available
  if (typeof supabase === 'undefined') {
    console.error('❌ Supabase client not found. Make sure you\'re on the app page.');
    return;
  }

  let allPassed = true;

  // Check 1: Authentication
  console.log('1️⃣ Checking authentication...');
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (user) {
      console.log(`✅ Authenticated as: ${user.email}`);
    } else {
      console.error('❌ Not authenticated. Please log in first.');
      allPassed = false;
    }
  } catch (err) {
    console.error('❌ Auth check failed:', err.message);
    allPassed = false;
  }

  // Check 2: Bucket exists
  console.log('\n2️⃣ Checking vehicle-images bucket...');
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    const bucket = buckets?.find(b => b.id === 'vehicle-images');
    if (bucket) {
      console.log(`✅ Bucket exists: ${bucket.name}`);
      console.log(`   - Public: ${bucket.public ? '⚠️ YES (should be private)' : '✅ NO (correct)'}`);
    } else {
      console.error('❌ Bucket "vehicle-images" not found');
      console.error('   Fix: Run FINAL_FIX.sql in Supabase SQL Editor');
      allPassed = false;
    }
  } catch (err) {
    console.error('❌ Bucket check failed:', err.message);
    allPassed = false;
  }

  // Check 3: Upload test
  console.log('\n3️⃣ Testing upload permission...');
  try {
    const testFile = new File(['test'], `test_${Date.now()}.txt`, { type: 'text/plain' });
    const testFileName = `test_console_${Date.now()}.txt`;
    
    const { data, error } = await supabase.storage
      .from('vehicle-images')
      .upload(testFileName, testFile);

    if (error) {
      console.error('❌ Upload failed:', error.message);
      if (error.message.includes('row-level security')) {
        console.error('   Fix: Run FINAL_FIX.sql in Supabase SQL Editor');
      }
      allPassed = false;
    } else {
      console.log('✅ Upload successful - RLS policies are configured correctly');
      // Clean up
      await supabase.storage.from('vehicle-images').remove([testFileName]);
      console.log('   (Test file cleaned up)');
    }
  } catch (err) {
    console.error('❌ Upload test failed:', err.message);
    allPassed = false;
  }

  // Check 4: Database columns
  console.log('\n4️⃣ Checking database columns...');
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('exterior_image_1, exterior_image_2, interior_image')
      .limit(1);

    if (error) {
      console.error('❌ Image columns missing from vehicles table');
      console.error('   Fix: Run FINAL_FIX.sql in Supabase SQL Editor');
      allPassed = false;
    } else {
      console.log('✅ Image columns exist in vehicles table');
      console.log('   - exterior_image_1 ✓');
      console.log('   - exterior_image_2 ✓');
      console.log('   - interior_image ✓');
    }
  } catch (err) {
    console.error('❌ Column check failed:', err.message);
    allPassed = false;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  if (allPassed) {
    console.log('✅ ALL CHECKS PASSED!');
    console.log('Storage is configured correctly. You can upload vehicle images!');
  } else {
    console.log('❌ SOME CHECKS FAILED');
    console.log('Please run FINAL_FIX.sql in Supabase SQL Editor to fix the issues.');
    console.log('See START_HERE_FIX_IMAGES.md for instructions.');
  }
  console.log('='.repeat(50));
})();
