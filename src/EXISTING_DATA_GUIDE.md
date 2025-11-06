# Using WheelsDoc AutoCare with Existing Data

Great! You can absolutely use your existing data with WheelsDoc AutoCare. This guide will help you connect the application to your current database.

## ✅ Prerequisites

Your database should already have:
- ✅ Tables created (users, customers, employees, vehicles, appointments, etc.)
- ✅ Some data in the tables
- ✅ Row Level Security (RLS) configured or disabled

## 🔍 Step 1: Verify Database Compatibility

### Check Your Schema

1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/xexytspqnbmhihvifkzb
2. Go to **Database** → **Tables**
3. Verify you have these core tables:
   - `users`
   - `customers`
   - `employees`
   - `vehicles`
   - `services`
   - `appointments`

### Run the Diagnostic Tool

Add this to your App.tsx temporarily to check your database:

```tsx
import { DatabaseStatus } from './components/shared/DatabaseStatus';

// Add this component somewhere in your app
<DatabaseStatus />
```

This will show you:
- Which tables exist
- How many records in each table
- Any structural issues
- Recommendations

## 🔐 Step 2: Handle Authentication

### If Your Passwords Are Plain Text

The app will automatically detect and handle plain text passwords. However, for security, you should migrate to bcrypt:

```sql
-- Example migration script (run in Supabase SQL Editor)
-- This will update all passwords to bcrypt hashes
-- WARNING: This is just an example - adjust based on your needs

CREATE OR REPLACE FUNCTION migrate_passwords_to_bcrypt() 
RETURNS void AS $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN SELECT id, password_hash FROM users
  LOOP
    -- Only migrate if not already bcrypt
    IF NOT user_record.password_hash ~ '^\$2[aby]\$' THEN
      -- You'll need to handle this based on your current password format
      -- For now, you might want to force users to reset passwords
      UPDATE users 
      SET password_hash = 'NEEDS_RESET' 
      WHERE id = user_record.id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
```

### If Your Passwords Are Already Bcrypt

Perfect! The app will work out of the box.

## 👤 Step 3: Test Login with Existing Users

### Find an Existing User

Run this query in Supabase SQL Editor:

```sql
-- Get a sample user
SELECT 
  u.id,
  u.email,
  u.role,
  c.first_name,
  c.last_name
FROM users u
LEFT JOIN customers c ON u.id = c.user_id
WHERE u.role = 'customer'
LIMIT 1;
```

### Try Logging In

1. Open AutoServe Pro
2. Click "Sign In"
3. Enter the email from your database
4. Enter the password (if you know it)

### If Login Fails

**Issue: "Invalid email or password"**
- Check if the email exists: `SELECT * FROM users WHERE email = 'your@email.com'`
- Verify password format in database
- Check console for detailed error messages

**Issue: "Account is inactive"**
- Update the user: `UPDATE users SET is_active = true WHERE email = 'your@email.com'`

## 🔧 Step 4: Verify Data Relationships

### Check Customer Profiles

Make sure customers have profiles:

```sql
-- Find customers without profiles
SELECT u.id, u.email, u.role
FROM users u
LEFT JOIN customers c ON u.id = c.user_id
WHERE u.role = 'customer' AND c.id IS NULL;
```

If you find any, create profiles:

```sql
-- Create missing customer profile
INSERT INTO customers (user_id, first_name, last_name)
VALUES (USER_ID_HERE, 'First', 'Last');
```

### Check Employee Profiles

```sql
-- Find employees without profiles
SELECT u.id, u.email, u.role
FROM users u
LEFT JOIN employees e ON u.id = e.user_id
WHERE u.role = 'employee' AND e.id IS NULL;
```

Create if needed:

```sql
-- Create missing employee profile
INSERT INTO employees (user_id, first_name, last_name, hire_date)
VALUES (USER_ID_HERE, 'First', 'Last', CURRENT_DATE);
```

## 📊 Step 5: Verify Service Data

### Check Services Catalog

```sql
-- View your services
SELECT id, name, category, base_price, is_active
FROM services
WHERE is_active = true;
```

If you don't have services, you can add them:

```sql
-- Add basic services
INSERT INTO services (name, description, category, estimated_duration, base_price, is_active) VALUES
  ('Oil Change', 'Regular oil and filter change', 'Maintenance', 30, 49.99, true),
  ('Brake Service', 'Brake pad replacement', 'Brakes', 90, 299.99, true),
  ('Tire Rotation', 'Rotate and balance tires', 'Tires', 45, 79.99, true);
```

## 🚗 Step 6: Test Customer Features

### As a Customer User:

1. **Login** with an existing customer account
2. **View Vehicles** - Should show vehicles from `vehicles` table
3. **View Appointments** - Should show appointments from `appointments` table
4. **Add New Vehicle** - Test creating new vehicle
5. **Book Appointment** - Test creating new appointment

### If Vehicles Don't Show:

```sql
-- Check customer_id matches
SELECT 
  v.*,
  c.user_id
FROM vehicles v
JOIN customers c ON v.customer_id = c.id
WHERE c.user_id = YOUR_USER_ID;
```

## 👷 Step 7: Test Employee Features

### As an Employee User:

1. **Login** with an existing employee account
2. **View Assigned Services** - Should show service logs
3. **Log Time** - Test creating time log
4. **Update Status** - Test updating service status

### If No Services Show:

Employees see services through `service_logs` table. You might need to create assignments:

```sql
-- Check service logs for employee
SELECT sl.*, a.*, e.first_name
FROM service_logs sl
JOIN appointments a ON sl.appointment_id = a.id
JOIN employees e ON sl.employee_id = e.id
WHERE e.user_id = YOUR_USER_ID;
```

## 👨‍💼 Step 8: Test Admin Features

### As an Admin User:

1. **Login** with admin account
2. **View Dashboard** - Should show statistics
3. **Manage Users** - View all users
4. **Manage Services** - View and assign appointments
5. **View Reports** - Generate reports

### Create Admin User if Needed:

```sql
-- Create admin user
INSERT INTO users (email, password_hash, role, is_active)
VALUES ('admin@autoserve.com', '$2a$10$SAMPLE_HASH_HERE', 'admin', true);

-- Note: Admin users don't need customer/employee profiles
```

## 🔍 Step 9: Check Row Level Security (RLS)

### If You Get "Permission Denied" Errors:

Option 1 - Disable RLS temporarily for testing:

```sql
-- Disable RLS on all tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
-- ... etc for other tables
```

Option 2 - Fix RLS policies (recommended):

Check the `/database-schema.sql` file for proper RLS policies and apply them.

## 🐛 Common Issues & Solutions

### Issue: Can't See Any Data

**Solution:**
1. Check RLS is disabled or policies are correct
2. Verify you're logged in as the right user
3. Check foreign key relationships
4. Look at browser console for errors

### Issue: "customer_id" Not Found

**Solution:**
The app expects `customer_id` (not `customerId`). Check your column names:

```sql
-- Check column names
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'vehicles';
```

### Issue: IDs Don't Match

**Solution:**
Make sure you're using integer IDs (not UUIDs). The Prisma schema uses `SERIAL` (auto-increment integers).

### Issue: Appointments Don't Show Service Name

**Solution:**
Link appointments to services:

```sql
-- Update appointments to have service_id
UPDATE appointments a
SET service_id = s.id
FROM services s
WHERE s.name = 'Oil Change' -- or match based on your logic
AND a.service_id IS NULL;
```

## 📝 Quick Checklist

Before using the app with existing data:

- [ ] All tables exist with correct names
- [ ] Users have `password_hash` column
- [ ] Customers have `user_id` linking to users
- [ ] Employees have `user_id` linking to users
- [ ] Vehicles have `customer_id` linking to customers
- [ ] Appointments have `customer_id` and `vehicle_id`
- [ ] Services catalog is populated
- [ ] At least one user account you can log in with
- [ ] RLS is either disabled or properly configured
- [ ] Foreign key relationships are valid

## 🔄 Migration Helpers

### Reset a User's Password

```sql
-- Set a known password (plain text - for testing only)
UPDATE users 
SET password_hash = 'password123'
WHERE email = 'test@example.com';
```

### Create Test Data Relationships

```sql
-- Link existing appointment to service
UPDATE appointments
SET service_id = (SELECT id FROM services WHERE name = 'Oil Change' LIMIT 1)
WHERE service_id IS NULL;
```

## 🚀 Production Recommendations

Once everything works:

1. **Migrate passwords to bcrypt** - Use proper password hashing
2. **Enable RLS** - Set up proper Row Level Security
3. **Add indexes** - For better performance
4. **Set up backups** - Regular database backups
5. **Add validation** - Ensure data integrity
6. **Monitor logs** - Track errors and issues

## 📞 Getting Help

If you encounter issues:

1. **Check browser console** - Look for JavaScript errors
2. **Check Supabase logs** - View API errors in dashboard
3. **Run diagnostic tool** - Use `<DatabaseStatus />` component
4. **Verify schema** - Compare with `/database-schema.sql`
5. **Test queries manually** - Run SQL in Supabase SQL Editor

---

Your existing data is valuable! The app is designed to work with it. Just verify the structure matches and you'll be up and running. 🎉
