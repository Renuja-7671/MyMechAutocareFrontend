# Common SQL Queries for WheelsDoc AutoCare

Quick reference for common database queries you might need when working with existing data.

## 🔍 Checking Data

### View All Users
```sql
SELECT 
  u.id,
  u.email,
  u.role,
  u.is_active,
  COALESCE(c.first_name || ' ' || c.last_name, e.first_name || ' ' || e.last_name, 'Admin') as name
FROM users u
LEFT JOIN customers c ON u.id = c.user_id
LEFT JOIN employees e ON u.id = e.user_id
ORDER BY u.created_at DESC;
```

### View Customers with Their Vehicles
```sql
SELECT 
  c.id as customer_id,
  c.first_name || ' ' || c.last_name as customer_name,
  u.email,
  COUNT(v.id) as vehicle_count,
  json_agg(json_build_object(
    'make', v.make,
    'model', v.model,
    'year', v.year
  )) FILTER (WHERE v.id IS NOT NULL) as vehicles
FROM customers c
JOIN users u ON c.user_id = u.id
LEFT JOIN vehicles v ON c.id = v.customer_id
GROUP BY c.id, customer_name, u.email
ORDER BY customer_name;
```

### View All Appointments with Details
```sql
SELECT 
  a.id,
  a.scheduled_date,
  a.status,
  c.first_name || ' ' || c.last_name as customer_name,
  v.year || ' ' || v.make || ' ' || v.model as vehicle,
  s.name as service_name,
  s.base_price
FROM appointments a
JOIN customers c ON a.customer_id = c.id
JOIN vehicles v ON a.vehicle_id = v.id
LEFT JOIN services s ON a.service_id = s.id
ORDER BY a.scheduled_date DESC
LIMIT 50;
```

### View Employee Workload
```sql
SELECT 
  e.id,
  e.first_name || ' ' || e.last_name as employee_name,
  e.department,
  COUNT(DISTINCT sl.appointment_id) as active_appointments,
  COALESCE(SUM(sl.hours_worked), 0) as total_hours_logged,
  COUNT(DISTINCT pl.project_id) as active_projects
FROM employees e
LEFT JOIN service_logs sl ON e.id = sl.employee_id AND sl.status != 'completed'
LEFT JOIN project_logs pl ON e.id = pl.employee_id
WHERE e.is_available = true
GROUP BY e.id, employee_name, e.department
ORDER BY employee_name;
```

## 🔧 Fixing Data Issues

### Find Users Without Profiles
```sql
-- Customers without profiles
SELECT u.id, u.email, 'customer' as missing_type
FROM users u
LEFT JOIN customers c ON u.id = c.user_id
WHERE u.role = 'customer' AND c.id IS NULL

UNION

-- Employees without profiles
SELECT u.id, u.email, 'employee' as missing_type
FROM users u
LEFT JOIN employees e ON u.id = e.user_id
WHERE u.role = 'employee' AND e.id IS NULL;
```

### Create Missing Customer Profile
```sql
-- Replace USER_ID, FIRST_NAME, LAST_NAME with actual values
INSERT INTO customers (user_id, first_name, last_name, phone)
VALUES (
  1,  -- USER_ID from users table
  'John',  -- First name
  'Doe',   -- Last name
  '555-0100'  -- Phone (optional)
);
```

### Create Missing Employee Profile
```sql
-- Replace USER_ID, FIRST_NAME, LAST_NAME with actual values
INSERT INTO employees (user_id, first_name, last_name, hire_date, phone)
VALUES (
  2,  -- USER_ID from users table
  'Jane',  -- First name
  'Smith',  -- Last name
  CURRENT_DATE,  -- Hire date
  '555-0200'  -- Phone (optional)
);
```

### Link Appointments to Services
```sql
-- Update appointments without service_id
UPDATE appointments a
SET service_id = s.id
FROM services s
WHERE a.service_id IS NULL
  AND s.name = 'Oil Change'  -- Change this to match your needs
LIMIT 10;
```

### Fix Orphaned Vehicles
```sql
-- Find vehicles without valid customer
SELECT v.*, c.id as customer_exists
FROM vehicles v
LEFT JOIN customers c ON v.customer_id = c.id
WHERE c.id IS NULL;

-- Delete orphaned vehicles (BE CAREFUL!)
-- DELETE FROM vehicles WHERE customer_id NOT IN (SELECT id FROM customers);
```

## 👤 User Management

### Create New Admin User
```sql
-- First, insert into users table
INSERT INTO users (email, password_hash, role, is_active)
VALUES (
  'admin@autoserve.com',
  'temp_password',  -- Change this!
  'admin',
  true
)
RETURNING id;

-- Admin users don't need customer/employee profiles
```

### Reset User Password (Plain Text - Testing Only)
```sql
UPDATE users
SET password_hash = 'password123'
WHERE email = 'test@example.com';
```

### Activate/Deactivate User
```sql
-- Deactivate
UPDATE users SET is_active = false WHERE email = 'user@example.com';

-- Activate
UPDATE users SET is_active = true WHERE email = 'user@example.com';
```

### Change User Role
```sql
UPDATE users
SET role = 'employee'  -- or 'customer' or 'admin'
WHERE email = 'user@example.com';

-- Don't forget to create the corresponding profile!
```

## 📊 Service & Appointment Management

### View Service Statistics
```sql
SELECT 
  s.name as service_name,
  COUNT(a.id) as times_booked,
  s.base_price,
  COUNT(a.id) * s.base_price as potential_revenue
FROM services s
LEFT JOIN appointments a ON s.id = a.service_id
WHERE s.is_active = true
GROUP BY s.id, s.name, s.base_price
ORDER BY times_booked DESC;
```

### View Appointments by Status
```sql
SELECT 
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM appointments
GROUP BY status
ORDER BY count DESC;
```

### Find Appointments Without Assigned Employees
```sql
SELECT 
  a.id,
  a.scheduled_date,
  c.first_name || ' ' || c.last_name as customer,
  s.name as service
FROM appointments a
JOIN customers c ON a.customer_id = c.id
LEFT JOIN services s ON a.service_id = s.id
LEFT JOIN service_logs sl ON a.id = sl.appointment_id
WHERE sl.id IS NULL
  AND a.status != 'cancelled'
ORDER BY a.scheduled_date;
```

### Assign Appointment to Employee
```sql
-- Create a service log entry (this assigns the work)
INSERT INTO service_logs (
  appointment_id,
  employee_id,
  start_time,
  status,
  notes
)
VALUES (
  1,  -- Appointment ID
  1,  -- Employee ID
  NOW(),
  'in_progress',
  'Service assigned'
);
```

## 📦 Parts & Inventory

### View Low Stock Parts
```sql
SELECT 
  name,
  part_number,
  quantity_in_stock,
  reorder_level,
  (reorder_level - quantity_in_stock) as need_to_order
FROM parts
WHERE quantity_in_stock <= reorder_level
ORDER BY need_to_order DESC;
```

### Parts Usage Report
```sql
SELECT 
  p.name,
  p.part_number,
  SUM(sp.quantity_used) as total_used,
  p.quantity_in_stock as current_stock,
  p.unit_price,
  SUM(sp.quantity_used) * p.unit_price as total_cost
FROM parts p
LEFT JOIN service_parts sp ON p.id = sp.part_id
GROUP BY p.id, p.name, p.part_number, p.quantity_in_stock, p.unit_price
ORDER BY total_used DESC;
```

## 📈 Reports & Analytics

### Customer Activity Report
```sql
SELECT 
  c.id,
  c.first_name || ' ' || c.last_name as customer_name,
  u.email,
  COUNT(DISTINCT v.id) as vehicles,
  COUNT(DISTINCT a.id) as appointments,
  COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as completed_services,
  MAX(a.scheduled_date) as last_visit
FROM customers c
JOIN users u ON c.user_id = u.id
LEFT JOIN vehicles v ON c.id = v.customer_id
LEFT JOIN appointments a ON c.id = a.customer_id
GROUP BY c.id, customer_name, u.email
ORDER BY appointments DESC;
```

### Monthly Revenue Report (Estimated)
```sql
SELECT 
  DATE_TRUNC('month', a.scheduled_date) as month,
  COUNT(*) as appointments,
  SUM(s.base_price) as estimated_revenue,
  AVG(s.base_price) as avg_ticket
FROM appointments a
JOIN services s ON a.service_id = s.id
WHERE a.status = 'completed'
GROUP BY month
ORDER BY month DESC;
```

### Employee Performance Report
```sql
SELECT 
  e.first_name || ' ' || e.last_name as employee_name,
  COUNT(DISTINCT sl.appointment_id) as services_completed,
  SUM(sl.hours_worked) as total_hours,
  AVG(sl.hours_worked) as avg_hours_per_service,
  e.hourly_rate,
  SUM(sl.hours_worked) * e.hourly_rate as total_labor_cost
FROM employees e
LEFT JOIN service_logs sl ON e.id = sl.employee_id
WHERE sl.status = 'completed'
GROUP BY e.id, employee_name, e.hourly_rate
ORDER BY total_hours DESC;
```

## 🔄 Data Cleanup

### Remove Duplicate Service Logs
```sql
-- Find duplicates
SELECT 
  appointment_id,
  employee_id,
  start_time,
  COUNT(*) as duplicates
FROM service_logs
GROUP BY appointment_id, employee_id, start_time
HAVING COUNT(*) > 1;

-- Keep only the latest (BE CAREFUL!)
-- DELETE FROM service_logs
-- WHERE id NOT IN (
--   SELECT MAX(id)
--   FROM service_logs
--   GROUP BY appointment_id, employee_id, start_time
-- );
```

### Archive Old Completed Appointments
```sql
-- View old completed appointments
SELECT 
  id,
  scheduled_date,
  status
FROM appointments
WHERE status = 'completed'
  AND scheduled_date < NOW() - INTERVAL '1 year'
ORDER BY scheduled_date;

-- Archive (move to archive table or just keep for records)
-- You decide whether to delete or keep
```

## 🔍 Debugging Queries

### Check Foreign Key Integrity
```sql
-- Vehicles with invalid customer_id
SELECT v.* FROM vehicles v
LEFT JOIN customers c ON v.customer_id = c.id
WHERE c.id IS NULL;

-- Appointments with invalid customer_id
SELECT a.* FROM appointments a
LEFT JOIN customers c ON a.customer_id = c.id
WHERE c.id IS NULL;

-- Appointments with invalid vehicle_id
SELECT a.* FROM appointments a
LEFT JOIN vehicles v ON a.vehicle_id = v.id
WHERE v.id IS NULL;
```

### View Table Sizes
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## 💡 Tips

1. **Always test queries** on a copy or with `LIMIT` first
2. **Use transactions** for important updates:
   ```sql
   BEGIN;
   -- Your queries here
   -- Check results
   COMMIT;  -- or ROLLBACK;
   ```
3. **Backup before major changes**
4. **Use RETURNING** to see what was inserted/updated:
   ```sql
   UPDATE users SET role = 'admin' WHERE id = 1 RETURNING *;
   ```

---

Save this file for quick reference when working with your database! 📚
