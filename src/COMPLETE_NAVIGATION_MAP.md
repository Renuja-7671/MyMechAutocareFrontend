# Complete Navigation Map - WheelsDoc AutoCare

## All Pages Overview

### Public Pages (Accessible Without Login)
1. **Home Page** - Landing page with hero section and features
2. **Services Page** - All automotive services offered
3. **About Page** - Company information and values
4. **Features Page** - Platform capabilities showcase
5. **Contact Page** - Contact form and information
6. **Login Page** - User authentication
7. **Signup Page** - New user registration
8. **Database Check Page** - Diagnostic tool for existing data

### Protected Pages (Require Login)
9. **Customer Dashboard** - For customers (role: 'customer')
10. **Employee Dashboard** - For employees (role: 'employee')
11. **Admin Dashboard** - For administrators (role: 'admin')

---

## Complete Navigation Flow Chart

```
┌──────────────────────────────────────────────────────────────────┐
│                         HOME PAGE                                 │
│  [Logo] Services | About | Features | Contact  [Sign In] [Get Started]  │
└────────┬─────────────────────────────────────────────────────────┘
         │
         ├─[Services]────────► SERVICES PAGE
         │                    └─[Logo]─────► HOME
         │                    └─[Sign In]──► LOGIN
         │                    └─[Get Started]► SIGNUP
         │
         ├─[About]──────────► ABOUT PAGE
         │                    └─[Logo]─────► HOME
         │                    └─[Sign In]──► LOGIN
         │                    └─[Get Started]► SIGNUP
         │
         ├─[Features]───────► FEATURES PAGE
         │                    └─[Logo]─────► HOME
         │                    └─[Sign In]──► LOGIN
         │                    └─[Get Started]► SIGNUP
         │
         ├─[Contact]────────► CONTACT PAGE
         │                    └─[Logo]─────► HOME
         │                    └─[Sign In]──► LOGIN
         │                    └─[Get Started]► SIGNUP
         │
         ├─[Sign In]────────► LOGIN PAGE
         │                    ├─[Back to Home]─► HOME
         │                    ├─[Sign Up Link]► SIGNUP
         │                    ├─[Check Database]► DATABASE CHECK
         │                    └─[Success]─────► DASHBOARD (auto)
         │
         └─[Get Started]────► SIGNUP PAGE
                              ├─[Back to Home]─► HOME
                              ├─[Sign In Link]► LOGIN
                              └─[Success]─────► LOGIN (then DASHBOARD)

┌──────────────────────────────────────────────────────────────────┐
│                    DASHBOARD (After Login)                        │
│  [Logo] [WheelsDoc AutoCare]          [Home] [User Menu ▼]      │
└────────┬─────────────────────────────────────────────────────────┘
         │
         ├─[Home Button]────────────► HOME PAGE
         │
         └─[User Menu]
            └─[Logout]──────────────► HOME PAGE (with logout)

┌──────────────────────────────────────────────────────────────────┐
│                   ROLE-BASED DASHBOARDS                           │
└──────────────────────────────────────────────────────────────────┘

If role = 'customer'  ──► CUSTOMER DASHBOARD
                          ├─ My Vehicles
                          ├─ Active Services
                          ├─ Appointments
                          ├─ Service History
                          ├─ AI Chatbot
                          └─ Request Modification

If role = 'employee'  ──► EMPLOYEE DASHBOARD
                          ├─ Assigned Services
                          ├─ My Appointments
                          ├─ Log Time
                          └─ Update Service Status

If role = 'admin'     ──► ADMIN DASHBOARD
                          ├─ User Management
                          ├─ Service Management
                          ├─ Appointment Management
                          └─ Reports & Analytics
```

---

## Navigation Button Reference

### Home Page Navbar (Not Logged In)

| Button | Action | Destination |
|--------|--------|-------------|
| Logo (WheelsDoc AutoCare) | - | Current Page |
| Services | Navigate | Services Page |
| About | Navigate | About Page |
| Features | Navigate | Features Page |
| Contact | Navigate | Contact Page |
| Sign In | Navigate | Login Page |
| Get Started | Navigate | Signup Page |

### Home Page Navbar (Logged In)

| Button | Action | Destination |
|--------|--------|-------------|
| Logo (WheelsDoc AutoCare) | - | Current Page |
| Dashboard | Navigate | User's Dashboard |
| Logout | Logout & Navigate | Home Page |

### All Information Pages (Services, About, Features, Contact)

| Button | Action | Destination |
|--------|--------|-------------|
| Logo (WheelsDoc AutoCare) | Navigate | Home Page |
| Sign In | Navigate | Login Page |
| Get Started | Navigate | Signup Page |

### Login Page

| Button | Action | Destination |
|--------|--------|-------------|
| Back to Home | Navigate | Home Page |
| Sign Up Link | Navigate | Signup Page |
| Check Existing Database | Navigate | Database Check Page |
| Submit Login | Authenticate & Navigate | Dashboard (auto) |

### Signup Page

| Button | Action | Destination |
|--------|--------|-------------|
| Back to Home | Navigate | Home Page |
| Sign In Link | Navigate | Login Page |
| Submit Signup | Create Account & Navigate | Login Page |

### All Dashboards (Customer, Employee, Admin)

| Button | Action | Destination |
|--------|--------|-------------|
| Home (in header) | Navigate | Home Page |
| User Menu → Logout | Logout & Navigate | Home Page |

### Database Check Page

| Button | Action | Destination |
|--------|--------|-------------|
| Back | Navigate | Login Page |

---

## Auto-Navigation Events

The application automatically navigates in these scenarios:

| Event | Auto-Navigation |
|-------|-----------------|
| Successful Login | Login Page → Dashboard |
| Successful Logout | Dashboard → Home Page |
| Successful Signup | Signup Page → Login Page |
| Session Detected on Load | Home Page (user can access dashboard) |

---

## Page Access Control

### Public Access (No Login Required)
- ✅ Home Page
- ✅ Services Page
- ✅ About Page
- ✅ Features Page
- ✅ Contact Page
- ✅ Login Page
- ✅ Signup Page
- ✅ Database Check Page

### Protected Access (Login Required)
- 🔒 Customer Dashboard (role: 'customer')
- 🔒 Employee Dashboard (role: 'employee')
- 🔒 Admin Dashboard (role: 'admin')

---

## Mobile Navigation

On mobile devices (< 768px):
- Navbar buttons may wrap or condense
- All functionality remains accessible
- Touch-optimized button sizes
- Responsive card layouts
- Hamburger menu (if needed in future)

---

## URL Structure (View-Based Routing)

The application uses view-based routing with these states:

| View State | Page Displayed |
|------------|----------------|
| 'home' | Home Page |
| 'services' | Services Page |
| 'about' | About Page |
| 'features' | Features Page |
| 'contact' | Contact Page |
| 'login' | Login Page |
| 'signup' | Signup Page |
| 'dashboard' | Customer/Employee/Admin Dashboard (based on role) |
| 'database-check' | Database Check Page |

---

## Navigation Shortcuts

### Quick Access to Key Functions

**From Anywhere:**
- Click Logo → Home Page

**From Information Pages:**
- Sign In → Login (1 click)
- Get Started → Signup (1 click)

**From Auth Pages:**
- Back to Home → Home Page (1 click)

**From Dashboards:**
- Home Button → Home Page (1 click)
- User Menu → Logout → Home (2 clicks)

---

## Session Persistence

- ✅ User session stored in localStorage
- ✅ Remains logged in across page refreshes
- ✅ Can navigate freely while logged in
- ✅ Logout clears session and returns to home

---

## Summary

**Total Pages:** 11 pages
- **Public:** 8 pages (Home, Services, About, Features, Contact, Login, Signup, Database Check)
- **Protected:** 3 dashboards (Customer, Employee, Admin)

**Navigation Types:**
- Navbar links (4 info pages)
- Auth buttons (Sign In, Get Started)
- Logo navigation (return to home)
- Action buttons (Home, Logout)
- Auto-navigation (login, logout, signup)

**User Experience:**
- Consistent navigation across all pages
- Clear visual hierarchy
- Modern pill-shaped navbar design
- Responsive on all devices
- Fast transitions
- Intuitive flow

---

**The navigation system is now complete and production-ready!** 🎉
