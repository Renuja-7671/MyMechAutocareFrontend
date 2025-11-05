# WheelsDoc AutoCare - Supabase Setup Guide

Your WheelsDoc AutoCare application is now connected to Supabase with the complete Prisma schema! Follow these steps to complete the setup.

## ✅ Already Connected

Your Supabase project details:
- **Project ID**: xexytspqnbmhihvifkzb
- **Project URL**: https://xexytspqnbmhihvifkzb.supabase.co

## 🗄️ Database Setup

### Step 1: Run the Database Schema

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/xexytspqnbmhihvifkzb
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `/database-schema.sql`
5. Paste it into the SQL editor
6. Click **Run** to execute the schema

This will create all necessary tables:

**Core Tables:**
- `users` - Base user accounts with authentication
- `customers` - Customer profile details
- `employees` - Employee profile details
- `vehicles` - Customer vehicles
- `services` - Service catalog (Oil Change, Brake Service, etc.)

**Operations Tables:**
- `appointments` - Appointment bookings
- `projects` - Custom modification requests
- `service_logs` - Time tracking for appointments
- `project_logs` - Time tracking for projects

**Inventory & Parts:**
- `parts` - Parts inventory
- `service_parts` - Parts used in services/projects

**Communication & Tracking:**
- `feedback` - Customer reviews and ratings
- `notifications` - User notifications
- `messages` - Internal messaging system
- `audit_logs` - System audit trail

### Step 2: Verify Sample Data

The schema includes sample data:
- **10 Services** (Oil Change, Brake Service, Tire Rotation, etc.)
- **10 Parts** (Oil Filter, Brake Pads, Battery, etc.)

You can verify this by running:
```sql
SELECT * FROM services;
SELECT * FROM parts;
```

## 👤 Create Your First Admin User

### Step 1: Create Admin Account

1. Open your WheelsDoc AutoCare application
2. Click "Sign Up"
3. Fill in the form:
   - Name: Admin User
   - Email: admin@autoserve.com
   - Phone: +1234567890
   - Account Type: **Admin**
   - Password: Choose a secure password
4. Click "Sign Up"

### Step 2: Verify in Database

Go to **Table Editor** in Supabase and check:
- `users` table - should have your admin user
- The user's role should be 'admin'

## 🧪 Testing the Application

### Test Admin Flow

1. Log in as admin (admin@autoserve.com)
2. You should see the Admin Dashboard with:
   - Dashboard statistics
   - User management
   - Service management
   - Appointment management
   - Reports

### Test Customer Flow

1. **Sign Up as Customer**:
   - Click "Sign Up"
   - Choose "Customer" as account type
   - Complete registration

2. **Add a Vehicle**:
   - Go to "My Vehicles" tab
   - Click "Add Vehicle"
   - Fill in: Make, Model, Year, License Plate
   - Save

3. **Book an Appointment**:
   - Go to "Appointments" tab
   - Click "Book Appointment"
   - Select your vehicle
   - Choose a service (Oil Change, Brake Service, etc.)
   - Pick date and time
   - Submit

4. **Request Modification**:
   - Go to "Modifications" tab
   - Click "Request Modification"
   - Select vehicle
   - Describe the modification
   - Enter estimated budget
   - Submit

5. **Check Service Progress**:
   - Go to "Service Progress" tab
   - View status of your appointments

### Test Employee Flow

1. **Create Employee Account**:
   - Sign up with "Employee" role

2. **Admin Assigns Service**:
   - Log in as admin
   - Go to "Service Management"
   - Find an appointment
   - Assign it to the employee

3. **Employee Logs Time**:
   - Log in as employee
   - Go to "Assigned Services"
   - Click "Log Time" on a service
   - Enter hours worked and description
   - Submit

4. **Employee Updates Status**:
   - Click "Update Status"
   - Change status (In Progress, Completed, etc.)
   - Add notes
   - Submit

## 🔐 Row Level Security (RLS)

The database has comprehensive RLS policies already configured:

### Customer Policies:
- Can only view/manage their own vehicles
- Can only see their own appointments and projects
- Can create feedback for their own services

### Employee Policies:
- Can view all appointments and services
- Can only create service logs for themselves
- Can update status of assigned services

### Admin Policies:
- Full access to all data (users, services, appointments, etc.)

## 📊 Database Schema Highlights

### User System:
```
users (base auth)
  ├── customers (customer details)
  └── employees (employee details)
```

### Service Flow:
```
appointments
  ├── service_logs (time tracking by employees)
  └── feedback (customer reviews)
```

### Modification Flow:
```
projects (custom modifications)
  ├── project_logs (time tracking)
  └── feedback (customer reviews)
```

### Parts Tracking:
```
parts (inventory)
  └── service_parts (usage in services/projects)
```

## 🚀 Advanced Features

### 1. Parts Inventory Management

View available parts:
```sql
SELECT * FROM parts WHERE quantity_in_stock > 0;
```

Track low stock:
```sql
SELECT * FROM parts WHERE quantity_in_stock <= reorder_level;
```

### 2. Time Tracking Reports

Total hours by employee:
```sql
SELECT 
  e.first_name || ' ' || e.last_name as employee_name,
  SUM(sl.hours_worked) as total_hours
FROM employees e
JOIN service_logs sl ON e.id = sl.employee_id
GROUP BY e.id, employee_name;
```

### 3. Customer Feedback Analysis

Average ratings:
```sql
SELECT 
  AVG(rating) as average_rating,
  COUNT(*) as total_reviews
FROM feedback
WHERE rating IS NOT NULL;
```

### 4. Appointment Analytics

Appointments by status:
```sql
SELECT status, COUNT(*) as count
FROM appointments
GROUP BY status;
```

## 🔄 Real-Time Updates (Optional)

Enable real-time features for live updates:

1. Go to **Database** → **Replication**
2. Enable replication for:
   - `appointments`
   - `service_logs`
   - `notifications`

3. Add to your components:
```typescript
import { supabase } from './lib/supabase-client';

useEffect(() => {
  const subscription = supabase
    .channel('appointments-channel')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'appointments' },
      (payload) => {
        console.log('Appointment updated:', payload);
        // Refresh your data
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, []);
```

## 🐛 Troubleshooting

### "Not authenticated" errors
- Clear browser localStorage
- Sign out and sign in again
- Check if user exists in both `users` and `customers`/`employees` tables

### Can't see data
- Verify RLS policies are enabled
- Check user role is correct
- Make sure foreign keys are valid

### Sign up not working
- Check browser console for errors
- Verify email is unique
- Check password meets requirements

### bcrypt errors
The app uses bcrypt for password hashing. The Supabase environment includes bcryptjs automatically.

## 📚 Database Relationships

```
User (1) ──> (1) Customer ──> (many) Vehicles
                                      └──> (many) Appointments
                                      └──> (many) Projects

User (1) ──> (1) Employee ──> (many) ServiceLogs
                             └─���> (many) ProjectLogs

Service (1) ──> (many) Appointments

Appointment (1) ──> (many) ServiceLogs
                  └──> (many) Feedback

Project (1) ──> (many) ProjectLogs
              └──> (many) Feedback

Part (1) ──> (many) ServiceParts
```

## 🎯 Key Features Implemented

✅ **Authentication System** - Secure login/signup with bcrypt password hashing
✅ **Role-Based Access Control** - Customer, Employee, Admin roles
✅ **Vehicle Management** - Track customer vehicles
✅ **Appointment System** - Book and manage service appointments
✅ **Custom Modifications** - Project management for custom work
✅ **Time Tracking** - Service logs and project logs
✅ **Parts Inventory** - Track parts and usage
✅ **Feedback System** - Customer reviews and ratings
✅ **Notifications** - User notification system
✅ **Messaging** - Internal messaging between users
✅ **Audit Logging** - Track all system changes

## 🚀 Production Checklist

Before deploying to production:

- [ ] Change default admin password
- [ ] Review and test all RLS policies
- [ ] Set up database backups
- [ ] Configure CORS settings
- [ ] Add rate limiting
- [ ] Set up monitoring and logging
- [ ] Enable 2FA for admin accounts
- [ ] Set up email notifications
- [ ] Configure SSL certificates
- [ ] Test all user flows end-to-end

## 🆘 Need Help?

If you encounter issues:
1. Check the browser console for error messages
2. Check Supabase logs in the dashboard
3. Verify database schema matches expected structure
4. Test RLS policies with different user roles
5. Check the `/SUPABASE_MIGRATION.md` file for detailed API mappings

---

Your WheelsDoc AutoCare application is now fully integrated with Supabase using your Prisma schema! 🎉

**Next Steps:**
1. Run the SQL schema in Supabase
2. Create your first admin user
3. Test all features
4. Customize for your needs
