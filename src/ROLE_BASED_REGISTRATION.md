# Role-Based Registration Guide

## Overview
The WheelsDoc AutoCare system now implements proper role-based user registration with the following rules:

## Registration Rules

### Public Signup (Customer Registration)
- **Access**: Available to anyone via the public signup form
- **Location**: `/components/auth/SignupPage.tsx`
- **Role**: Automatically set to `customer`
- **Fields Required**:
  - Full Name
  - Email
  - Phone Number
  - Password
  - Confirm Password

**Important**: The public signup form NO LONGER allows role selection. All public registrations create customer accounts only.

### Employee Registration (Admin Only)
- **Access**: Only available to System Administrators
- **Location**: Admin Dashboard → User Management → "Add Employee" button
- **Role**: Automatically set to `employee`
- **Fields Required**:
  - First Name
  - Last Name
  - Email
  - Phone Number
  - Position (Technician, Senior Technician, Mechanic, Service Advisor, Manager)
  - Password
  - Confirm Password

## Implementation Details

### Changes Made

#### 1. SignupPage.tsx
- Removed role selector dropdown
- Removed `role` from form state
- Hardcoded role as `customer` in API call
- Updated to match new color scheme with dark mode support

#### 2. UserManagement.tsx (Admin Portal)
- Added "Add Employee" button in header
- Created new `AddEmployeeDialog` component
- Added form validation for employee creation
- Implemented employee creation flow
- Added loading states and error handling

#### 3. supabase-api.ts
- Added `adminAPI.addEmployee()` function
- Handles user creation with `employee` role
- Creates employee profile in employees table
- Includes rollback on failure
- Password hashing with bcrypt

## How to Use

### For Customers
1. Navigate to the signup page
2. Fill in all required fields
3. Submit the form
4. Account is created as a **Customer**
5. Sign in using credentials

### For Admins (Adding Employees)
1. Sign in as an administrator
2. Navigate to Admin Dashboard
3. Click on "User Management"
4. Click "Add Employee" button
5. Fill in employee details:
   - Name
   - Contact information
   - Position
   - Password
6. Click "Add Employee"
7. Employee can now sign in with provided credentials

## Security Features

- Passwords are hashed using bcrypt
- Minimum password length: 6 characters
- Password confirmation required
- Email validation
- Role is enforced server-side (cannot be manipulated from client)
- Only admins can create employee accounts

## Database Schema

### Users Table
- Stores authentication information
- Role field: `customer`, `employee`, or `admin`

### Customers Table
- Linked to users table via `user_id`
- Stores customer-specific information

### Employees Table
- Linked to users table via `user_id`
- Stores employee-specific information
- Includes position and hire date

## API Endpoints

### Public Registration
```typescript
authAPI.signup({
  email: string,
  password: string,
  name: string,
  phone: string,
  role: 'customer' // Always customer for public signup
})
```

### Admin - Add Employee
```typescript
adminAPI.addEmployee({
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone: string,
  position?: string
})
```

## Testing

### Test Customer Registration
1. Go to signup page
2. Complete the form
3. Verify account is created with customer role
4. Sign in and verify customer dashboard access

### Test Employee Creation (Admin)
1. Sign in as admin
2. Navigate to User Management
3. Click "Add Employee"
4. Fill in employee information
5. Submit form
6. Verify employee appears in user list
7. Sign out and sign in as the new employee
8. Verify employee dashboard access

## Notes

- Admins can still change user roles via the "Update Role" feature
- Admins cannot be created through the UI (must be created via database)
- Employee deletion is possible through the User Management interface
- All registration processes include proper error handling and validation
