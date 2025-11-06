# WheelsDoc AutoCare - Automobile Service Management System

A comprehensive automobile service management system built with React.js frontend and Supabase backend, designed to work with your Prisma schema.

## 🚨 IMPORTANT: Vehicle Images Setup Required

**If you're getting storage errors when uploading vehicle images:**

👉 **[START HERE: Fix Vehicle Images Error](./START_HERE_FIX_IMAGES.md)** ⭐

Quick fix (30 seconds):
1. Open Supabase Dashboard → SQL Editor
2. Run the script from `FINAL_FIX.sql`
3. Done! Images will work.

[See all storage documentation →](./README_STORAGE_FIX.md)

---

## 🎉 NEW: Works with Your Existing Data!

**WheelsDoc AutoCare now connects directly to your existing Supabase database!** No need to recreate data or migrate - just connect and go!

### Quick Start with Existing Data

1. **Check Your Database**
   - Open the app
   - Click "Check Existing Database" on login page
   - Review the diagnostic report

2. **Login with Existing User**
   - Use any email from your `users` table
   - The app handles bcrypt or plain text passwords automatically

3. **Start Using**
   - All your existing data works out of the box
   - Vehicles, appointments, services, etc. will display automatically

📖 **Read this first:** [`README_EXISTING_DATA.md`](./README_EXISTING_DATA.md) - Complete guide for using existing data

## 🧭 Navigation & Pages

WheelsDoc AutoCare now features a complete navigation system with informational pages:

- **Home Page:** Landing page with modern pill-shaped navbar, features and call-to-action buttons
- **Services Page:** Comprehensive showcase of all automotive services offered
- **About Page:** Company mission, values, statistics, and what sets us apart
- **Features Page:** Detailed overview of all 12 platform capabilities
- **Contact Page:** Contact form and company contact information
- **Login/Signup:** Authentication pages with "Back to Home" buttons
- **Dashboards:** Role-based dashboards with "Home" button and logout dropdown
- **Auto-Navigation:** Seamless transitions between pages after login/logout

See [NAVIGATION_GUIDE.md](./NAVIGATION_GUIDE.md) for navigation flow and [PAGES_NAVIGATION.md](./PAGES_NAVIGATION.md) for detailed page information.

## 🚀 System Overview

**WheelsDoc AutoCare** is a modern, role-based service management platform with three distinct user roles:

### 👤 User Roles

1. **Customer**
   - Secure login & signup
   - Real-time service progress tracking
   - Book appointments for vehicle services
   - Request custom vehicle modifications
   - AI chatbot for checking available service slots
   - Mobile-responsive dashboard

2. **Employee**
   - Secure authentication
   - Log work hours against services
   - Update service status and progress
   - View assigned services
   - Track upcoming appointments
   - Monitor workload

3. **Admin (Service Station Owner)**
   - Oversee all system activities
   - User management (CRUD operations)
   - Service assignment to employees
   - Appointment management
   - Business reports and analytics
   - Dashboard with key metrics

## 📁 Project Structure

```
/
├── App.tsx                          # Main application entry point
├── lib/
│   ├── supabase-api.ts              # Supabase API service layer
│   ├── supabase-client.ts           # Supabase client configuration
│   ├── data-compatibility.ts        # Existing data compatibility helpers
│   ├── database-diagnostic.ts       # Database diagnostic tools
│   └── auth-context.tsx             # Authentication context
├── components/
│   ├── auth/
│   │   ├── LoginPage.tsx           # Login interface
│   │   └── SignupPage.tsx          # User registration
│   ├── customer/
│   │   ├── CustomerDashboard.tsx   # Customer main dashboard
│   │   ├── BookAppointmentDialog.tsx
│   │   ├── RequestModificationDialog.tsx
│   │   ├── AddVehicleDialog.tsx
│   │   └── ServiceChatbot.tsx      # AI chatbot for slot checking
│   ├── employee/
│   │   ├── EmployeeDashboard.tsx   # Employee main dashboard
│   │   ├── LogTimeDialog.tsx       # Time logging interface
│   │   └── UpdateStatusDialog.tsx  # Service status updates
│   ├── admin/
│   │   ├── AdminDashboard.tsx      # Admin main dashboard
│   │   ├── UserManagement.tsx      # User CRUD operations
│   │   ├��─ ServiceManagement.tsx   # Service oversight
│   │   ├── AppointmentManagement.tsx
│   │   └── ReportsView.tsx         # Business analytics
│   ├── shared/
│   │   ├── Header.tsx              # Common header component
│   │   ├── DatabaseStatus.tsx      # Database status checker
│   │   └── DatabaseCheckPage.tsx   # Database diagnostic page
│   └── ui/                         # ShadCN UI components
├── database-schema.sql              # Complete database schema
└── Documentation/
    ├── README_EXISTING_DATA.md      # 👈 START HERE for existing data
    ├── EXISTING_DATA_GUIDE.md       # Detailed guide for existing data
    ├── COMMON_QUERIES.md            # Useful SQL queries
    ├── SUPABASE_SETUP.md            # Setup guide
    └── SUPABASE_MIGRATION.md        # Schema details
```

## 📚 Documentation Files

| File | Purpose | When to Use |
|------|---------|-------------|
| **[`README_EXISTING_DATA.md`](./README_EXISTING_DATA.md)** | Quick start with existing data | **START HERE** if you have data |
| **[`EXISTING_DATA_GUIDE.md`](./EXISTING_DATA_GUIDE.md)** | Detailed troubleshooting | When you encounter issues |
| **[`COMMON_QUERIES.md`](./COMMON_QUERIES.md)** | SQL query reference | When you need to fix data |
| **[`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)** | Fresh database setup | When starting from scratch |
| **[`SUPABASE_MIGRATION.md`](./SUPABASE_MIGRATION.md)** | Technical schema details | For developers |

## 🗄️ Database Schema

The application uses your Prisma schema with 15 tables:

### Core Tables
- **users** - User authentication and roles
- **customers** - Customer profile details
- **employees** - Employee profile details
- **vehicles** - Customer vehicles
- **services** - Service catalog

### Operations Tables
- **appointments** - Service bookings
- **projects** - Custom modification requests
- **service_logs** - Time tracking for appointments
- **project_logs** - Time tracking for projects

### Additional Tables
- **parts** - Parts inventory
- **service_parts** - Parts usage tracking
- **feedback** - Customer reviews
- **notifications** - User notifications
- **messages** - Internal messaging
- **audit_logs** - System audit trail

## 🔧 Supabase Integration

### Connected Database
- **Project ID**: `xexytspqnbmhihvifkzb`
- **URL**: `https://xexytspqnbmhihvifkzb.supabase.co`

### Features
- ✅ Direct database access (no Express.js needed)
- ✅ Built-in authentication
- ✅ Row Level Security (RLS)
- ✅ Real-time capabilities ready
- ✅ Automatic API generation

## 🎨 Features

### Customer Features
- ✅ Secure authentication
- ✅ Vehicle management
- ✅ Service progress tracking with real-time updates
- ✅ Appointment booking
- ✅ Modification requests
- ✅ AI chatbot for slot availability
- ✅ Mobile-responsive design

### Employee Features
- ✅ Service assignment view
- ✅ Time logging with hours tracking
- ✅ Status updates
- ✅ Appointment calendar
- ✅ Workload tracking

### Admin Features
- ✅ User management (Create, Read, Update, Delete)
- �� Service oversight and assignment
- ✅ Appointment monitoring
- ✅ Business analytics and reports
- ✅ Dashboard with key metrics

### Built-in Diagnostic Tools
- ✅ Database structure checker
- ✅ Data integrity validator
- ✅ Compatibility analyzer
- ✅ Visual status dashboard

## 🚀 Getting Started

### Option 1: Use Your Existing Data (Recommended)

1. **Check Database Compatibility**
   ```bash
   # Open the app and click "Check Existing Database"
   # Or add <DatabaseStatus /> to any component
   ```

2. **Verify Your Data**
   - Check that tables exist
   - Verify row counts
   - Review any issues found
   - Follow recommendations

3. **Login**
   - Use existing user credentials
   - Password auto-detection (bcrypt or plain text)
   - Start using immediately

4. **Fix Issues (if any)**
   - See [`EXISTING_DATA_GUIDE.md`](./EXISTING_DATA_GUIDE.md)
   - Use queries from [`COMMON_QUERIES.md`](./COMMON_QUERIES.md)

### Option 2: Start Fresh

1. **Run Database Schema**
   - Go to Supabase SQL Editor
   - Copy and run `database-schema.sql`
   - Creates all tables with sample data

2. **Create First User**
   - Sign up through the app
   - Or use SQL to create admin user

3. **Add Your Data**
   - Services, vehicles, appointments
   - Through the UI or SQL

## 🔐 Security

### Authentication
- Password hashing with bcrypt
- Session management
- Role-based access control

### Row Level Security (RLS)
- Customers see only their data
- Employees see assigned work
- Admins have full access
- Database-level enforcement

### Data Protection
- Input validation
- SQL injection prevention
- Secure API calls
- CORS configured

## 📱 Responsive Design

Works seamlessly on:
- **Desktop** (1024px and above)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

## 🛠️ Common Tasks

### Check Database Status
```typescript
import { DatabaseStatus } from './components/shared/DatabaseStatus';

// Add to your component
<DatabaseStatus />
```

### Find Users in Your Database
```sql
SELECT email, role FROM users LIMIT 10;
```

### Create Missing Profile
```sql
-- For customer
INSERT INTO customers (user_id, first_name, last_name)
VALUES (1, 'John', 'Doe');

-- For employee
INSERT INTO employees (user_id, first_name, last_name, hire_date)
VALUES (2, 'Jane', 'Smith', CURRENT_DATE);
```

### Reset Password (Testing)
```sql
UPDATE users 
SET password_hash = 'test123'
WHERE email = 'user@example.com';
```

More queries in [`COMMON_QUERIES.md`](./COMMON_QUERIES.md)

## 🐛 Troubleshooting

### Login Issues
1. Check user exists: `SELECT * FROM users WHERE email = '...'`
2. Verify is_active: `UPDATE users SET is_active = true WHERE ...`
3. Check profile exists (customers/employees table)
4. Try resetting password

### No Data Shows
1. Check RLS policies (disable temporarily for testing)
2. Verify foreign key relationships
3. Check customer/employee profiles exist
4. Review browser console errors

### Permission Denied
1. Disable RLS temporarily: `ALTER TABLE users DISABLE ROW LEVEL SECURITY`
2. Or apply proper RLS policies from `database-schema.sql`

Full troubleshooting guide: [`EXISTING_DATA_GUIDE.md`](./EXISTING_DATA_GUIDE.md)

## 🔄 Database Diagnostic

The app includes built-in diagnostic tools:

**Features:**
- ✅ Check all tables exist
- ✅ Count records in each table
- ✅ Detect missing profiles
- ✅ Find orphaned records
- ✅ Verify password format
- ✅ Get recommendations

**Access:**
- Login page → "Check Existing Database" button
- Or add `<DatabaseStatus />` component anywhere

## 📊 Sample Data

The `database-schema.sql` includes:

**10 Services:**
- Oil Change, Brake Service, Tire Rotation
- Engine Diagnostic, Transmission Service
- AC Service, Alignment, Battery
- Custom Paint, Performance Tuning

**10 Parts:**
- Oil Filter, Air Filter, Brake Pads
- Spark Plugs, Battery, Motor Oil
- And more...

## 🎯 Next Steps

1. **Verify your data** - Run diagnostic tool
2. **Test login** - Use existing user
3. **Check features** - Test each role
4. **Fix issues** - Use provided guides
5. **Customize** - Add your branding
6. **Deploy** - Go to production

## 💡 Pro Tips

1. **Always backup** before making changes
2. **Use transactions** for important updates
3. **Check browser console** for detailed errors
4. **Test with one user** before rolling out
5. **Review RLS policies** before production

## 🤝 Support

**Having issues?**
1. Check browser console (F12)
2. Run database diagnostic tool
3. Review [`EXISTING_DATA_GUIDE.md`](./EXISTING_DATA_GUIDE.md)
4. Check Supabase logs in dashboard
5. Try common queries from [`COMMON_QUERIES.md`](./COMMON_QUERIES.md)

## 📝 Tech Stack

- **Frontend**: React + TypeScript
- **UI**: Tailwind CSS + ShadCN
- **Backend**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth + bcrypt
- **State**: React Context API
- **Icons**: Lucide React

## ✨ Key Advantages

1. **Works with existing data** - No migration needed
2. **Flexible authentication** - Handles various password formats
3. **Built-in diagnostics** - Easy troubleshooting
4. **Complete documentation** - Guides for every scenario
5. **Production ready** - Security and performance built-in

---

## 🚀 Quick Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/xexytspqnbmhihvifkzb
- **Existing Data Guide**: [`README_EXISTING_DATA.md`](./README_EXISTING_DATA.md)
- **SQL Queries**: [`COMMON_QUERIES.md`](./COMMON_QUERIES.md)
- **Setup Guide**: [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)

---

Built with ❤️ using React, TypeScript, Tailwind CSS, and Supabase

**Ready to use with your existing data!** 🎉
