# WheelsDoc AutoCare - Navigation Guide

## Navigation Structure

The application now has a complete navigation system with a Home page and seamless transitions between all views.

## Pages & Views

### 1. **Home Page** (`/components/shared/HomePage.tsx`)
   - Landing page for the application
   - Shows company branding and features
   - **When NOT logged in:**
     - "Sign In" button → Login Page
     - "Get Started" button → Signup Page
   - **When logged in:**
     - Shows welcome message with user name
     - "Go to Dashboard" button → User's Dashboard
     - "Logout" button → Logs out and stays on home

### 2. **Login Page** (`/components/auth/LoginPage.tsx`)
   - Sign in form
   - "Back to Home" button → Home Page
   - "Don't have an account? Sign up" link → Signup Page
   - "Check Existing Database" button → Database Check Page
   - **After successful login:** Automatically redirects to Dashboard

### 3. **Signup Page** (`/components/auth/SignupPage.tsx`)
   - Registration form
   - "Back to Home" button → Home Page
   - "Already have an account? Sign in" link → Login Page
   - **After successful signup:** Redirects to Login Page

### 4. **Dashboard Pages**
   - **Customer Dashboard** (`/components/customer/CustomerDashboard.tsx`)
   - **Employee Dashboard** (`/components/employee/EmployeeDashboard.tsx`)
   - **Admin Dashboard** (`/components/admin/AdminDashboard.tsx`)
   
   **All dashboards have:**
   - Header with "Home" button → Home Page
   - User dropdown menu with:
     - User name and email
     - User role
     - "Logout" button → Logs out and redirects to Home

### 5. **Database Check Page** (`/components/shared/DatabaseCheckPage.tsx`)
   - Database diagnostic tool
   - "Back" button → Login Page

## Navigation Flow

```
┌─────────────┐
│  Home Page  │
└──────┬──────┘
       │
       ├─────► Login ────► Dashboard ◄──┐
       │         │            │          │
       │         └────────────┼──────────┘
       │                      │
       └─────► Signup ────────┤
                               │
                    ┌──────────▼──────────┐
                    │   Logout (Home)     │
                    └─────────────────────┘
```

## Auto-Navigation Features

1. **After Login:** Automatically redirects to the appropriate dashboard based on user role
2. **After Logout:** Automatically redirects to Home Page
3. **After Signup:** Redirects to Login Page so user can sign in

## Header Component

The `Header` component is used in all dashboard pages and includes:

- **Logo and Company Name:** WheelsDoc AutoCare
- **Home Button:** Navigate back to home page
- **User Dropdown:**
  - Display user name, email, and role
  - Logout button

## User Experience

### For New Users:
1. Start at Home Page
2. Click "Get Started" → Signup
3. After signup → Login
4. After login → Dashboard (based on role)

### For Returning Users:
1. Start at Home Page
2. Click "Sign In" → Login
3. After login → Dashboard (based on role)

### For Logged-In Users:
1. Already at Dashboard (session persisted)
2. Can navigate to Home via "Home" button
3. Can logout via user dropdown

## Buttons Summary

| Page | Button | Action |
|------|--------|--------|
| **Home (Not Logged In)** | Sign In | → Login Page |
| **Home (Not Logged In)** | Get Started | → Signup Page |
| **Home (Logged In)** | Go to Dashboard | → User Dashboard |
| **Home (Logged In)** | Logout | Logout & Stay on Home |
| **Login** | Back to Home | → Home Page |
| **Login** | Check Database | → Database Check |
| **Login** | Don't have account? | → Signup Page |
| **Signup** | Back to Home | → Home Page |
| **Signup** | Have account? | → Login Page |
| **Dashboard Header** | Home | → Home Page |
| **Dashboard Header** | Logout (dropdown) | Logout & → Home |
| **Database Check** | Back | → Login Page |

## Technical Implementation

### App.tsx View Management
```typescript
type View = 'home' | 'login' | 'signup' | 'dashboard' | 'database-check';
const [currentView, setCurrentView] = useState<View>('home');
```

### Auto-Navigation Hooks
- **Login Success:** useEffect detects auth change and navigates to dashboard
- **Logout:** useEffect detects auth loss and navigates to home

### Props Pattern
All navigation is handled via callback props:
- `onGoHome={() => setCurrentView('home')}`
- `onLogin={() => setCurrentView('login')}`
- `onSignup={() => setCurrentView('signup')}`
- `onDashboard={() => setCurrentView('dashboard')}`

## Session Persistence

The application uses localStorage to persist user sessions:
- User remains logged in across page refreshes
- Session is maintained until explicit logout
- On app load, if user is authenticated, they start at Home with option to go to Dashboard

## Mobile Responsiveness

All pages are fully responsive and work on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

The navigation remains accessible and user-friendly across all screen sizes.
