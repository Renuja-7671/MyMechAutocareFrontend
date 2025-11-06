# Employee Assignment Debugging Guide

## Issue
"Employee not found" error when assigning employees to services, even though the employee exists in the database.

## Root Cause Analysis
The issue occurs due to potential mismatches between:
- **User ID** (from `users` table)
- **Employee ID** (from `employees` table)

When an employee is assigned, the system needs the `employees.id`, NOT the `users.id`.

## Fixes Implemented

### 1. **Enhanced Data Handling in `getAllUsers()`** (`/lib/supabase-api.ts`)
- Added handling for both array and object return types from Supabase joins
- Fixed employee/customer data extraction to handle edge cases
- Now correctly maps `employees.id` to `employeeId` field

```typescript
// Handle employee data (could be object or array)
const employeeData = Array.isArray(user.employee) ? user.employee[0] : user.employee;
if (employeeData) {
  employeeId = employeeData.id; // This is employees.id, not users.id
}
```

### 2. **Improved Employee Selection** (`/components/admin/ServiceManagement.tsx`)
- Added validation to ensure only valid employee IDs are used
- Disabled selection for users without employee profiles
- Added visual indicators for missing employee profiles

```typescript
<SelectItem 
  value={employee.employeeId ? employee.employeeId.toString() : ''}
  disabled={!employee.employeeId}
>
  {employee.name} ({employee.email})
  {!employee.employeeId && ' - No Employee Profile'}
</SelectItem>
```

### 3. **Enhanced Logging** (Multiple files)
Added comprehensive console logging to track the data flow:
- When employees are loaded
- When an employee is selected
- When assignment is attempted
- Employee lookup results

### 4. **Employee Debug Page** (`/components/admin/EmployeeDebugPage.tsx`)
Created a diagnostic tool accessible from Admin Dashboard → Debug tab.

## How to Debug

### Step 1: Access the Debug Page
1. Login as an admin user
2. Navigate to Admin Dashboard
3. Click the **Debug** tab (with bug icon)

### Step 2: Analyze the Data
The debug page shows three sections:

#### Section 1: Users Table (role = employee)
Shows all users with the employee role. Note their User IDs.

#### Section 2: Employees Table
Shows all employee records. Note the:
- **ID** (highlighted in yellow) - This is the employee ID needed for assignment
- **User ID** - This links to the users table

#### Section 3: Mapping Analysis
Shows which users have corresponding employee profiles:
- ✓ Green = User has employee profile (good)
- ✗ Red = User is missing employee profile (problem)

### Step 3: Fix Missing Employee Profiles
If a user with role='employee' is missing an employee profile:

```sql
-- Check if user exists but employee profile is missing
SELECT u.id, u.email, e.id as employee_id 
FROM users u 
LEFT JOIN employees e ON u.id = e.user_id 
WHERE u.role = 'employee';

-- If employee_id is NULL, create the missing profile
INSERT INTO employees (user_id, first_name, last_name, phone, hire_date, updated_at)
VALUES (
  <user_id>, 
  'First', 
  'Last', 
  'phone_number',
  CURRENT_DATE,
  CURRENT_TIMESTAMP
);
```

### Step 4: Verify in Console
After attempting assignment, check browser console for logs:
- "Loaded employees:" - Shows all employees with their IDs
- "Opening assign dialog:" - Shows selected service and employee
- "Assigning employee:" - Shows the IDs being sent to the API
- "Employee lookup result:" - Shows if employee was found in database

## Common Issues and Solutions

### Issue 1: Employee ID is null/undefined
**Symptom:** SelectItem shows "No Employee Profile"
**Solution:** Create missing employee record in database

### Issue 2: Wrong ID being passed
**Symptom:** Console shows User ID instead of Employee ID
**Solution:** Check that `employeeId` field is properly set in getAllUsers()

### Issue 3: Employee exists but still not found
**Symptom:** Database has record, but API returns "not found"
**Solution:** 
- Check if employee record's `user_id` matches the user's `id`
- Verify no duplicate or orphaned records
- Run the mapping analysis in debug page

### Issue 4: Array vs Object confusion
**Symptom:** Errors about "cannot read property of undefined"
**Solution:** The fix handles both array and object returns from Supabase

## Testing Checklist

1. ✅ Login as admin
2. ✅ Go to Debug tab and verify:
   - All employee users have corresponding employee records
   - Employee IDs are different from User IDs
   - Mapping shows green checkmarks for all
3. ✅ Go to Service Management tab
4. ✅ Click "Assign" on any service
5. ✅ Verify dropdown shows employees without "No Employee Profile"
6. ✅ Select an employee
7. ✅ Open browser console (F12)
8. ✅ Click "Assign Employee"
9. ✅ Verify success message appears
10. ✅ Check console logs show correct employee ID

## Data Integrity Check

Run this query to ensure data consistency:

```sql
-- Find users with employee role but no employee profile
SELECT u.id, u.email, u.role
FROM users u
LEFT JOIN employees e ON u.id = e.user_id
WHERE u.role = 'employee' AND e.id IS NULL;

-- Find orphaned employee records (no user)
SELECT e.id, e.first_name, e.last_name, e.user_id
FROM employees e
LEFT JOIN users u ON e.user_id = u.id
WHERE u.id IS NULL;

-- Count mismatches
SELECT 
  (SELECT COUNT(*) FROM users WHERE role = 'employee') as users_with_employee_role,
  (SELECT COUNT(*) FROM employees) as employee_records;
```

## Prevention
To prevent this issue in the future:
1. Always create employee profile immediately after creating user with role='employee'
2. Use database constraints to enforce referential integrity
3. Implement checks in signup/user creation flows
4. Use the Debug page regularly to verify data integrity

## Additional Notes
- The system now handles both bcrypt-hashed and plain-text passwords for testing
- All timestamps are properly set on inserts and updates
- Foreign key constraints are properly handled
