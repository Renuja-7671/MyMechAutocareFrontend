-- WheelsDoc AutoCare Database Schema (Matching Prisma Schema)
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'employee', 'admin')),
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(20),
  date_of_birth DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  department VARCHAR(100),
  position VARCHAR(100),
  hire_date DATE NOT NULL,
  hourly_rate DECIMAL(10, 2),
  is_available BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================
-- VEHICLES
-- ============================================

CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  vin VARCHAR(17) UNIQUE,
  license_plate VARCHAR(20),
  color VARCHAR(50),
  mileage INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================
-- SERVICE CATALOG
-- ============================================

CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  estimated_duration INTEGER,
  base_price DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================
-- APPOINTMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  service_id INTEGER REFERENCES services(id),
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================
-- PROJECTS (Custom Modifications)
-- ============================================

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  project_type VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'in_progress', 'completed', 'cancelled')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  estimated_cost DECIMAL(10, 2),
  actual_cost DECIMAL(10, 2),
  start_date DATE,
  end_date DATE,
  approved_by INTEGER,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================
-- SERVICE LOGS (Time tracking for appointments)
-- ============================================

CREATE TABLE IF NOT EXISTS service_logs (
  id SERIAL PRIMARY KEY,
  appointment_id INTEGER NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  hours_worked DECIMAL(5, 2),
  progress_percentage INTEGER DEFAULT 0 NOT NULL,
  status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'completed', 'on_hold')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================
-- PROJECT LOGS (Time tracking for projects)
-- ============================================

CREATE TABLE IF NOT EXISTS project_logs (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  hours_logged DECIMAL(5, 2) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================
-- PARTS INVENTORY
-- ============================================

CREATE TABLE IF NOT EXISTS parts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  part_number VARCHAR(100) UNIQUE,
  description TEXT,
  category VARCHAR(100),
  quantity_in_stock INTEGER DEFAULT 0 NOT NULL,
  unit_price DECIMAL(10, 2),
  reorder_level INTEGER DEFAULT 10 NOT NULL,
  supplier VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================
-- SERVICE PARTS (Parts used in services/projects)
-- ============================================

CREATE TABLE IF NOT EXISTS service_parts (
  id SERIAL PRIMARY KEY,
  service_log_id INTEGER REFERENCES service_logs(id) ON DELETE CASCADE,
  project_log_id INTEGER REFERENCES project_logs(id) ON DELETE CASCADE,
  part_id INTEGER NOT NULL REFERENCES parts(id),
  quantity_used INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================
-- FEEDBACK & REVIEWS
-- ============================================

CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  appointment_id INTEGER REFERENCES appointments(id) ON DELETE SET NULL,
  project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  is_read BOOLEAN DEFAULT FALSE NOT NULL,
  related_entity_type VARCHAR(50),
  related_entity_id INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================
-- MESSAGES
-- ============================================

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  related_entity_type VARCHAR(50),
  related_entity_id INTEGER,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================
-- AUDIT LOG
-- ============================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id INTEGER,
  changes JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_customer_id ON vehicles(customer_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_vin ON vehicles(vin);
CREATE INDEX IF NOT EXISTS idx_appointments_customer_id ON appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_vehicle_id ON appointments(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_date ON appointments(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_projects_customer_id ON projects(customer_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_service_logs_appointment_id ON service_logs(appointment_id);
CREATE INDEX IF NOT EXISTS idx_service_logs_employee_id ON service_logs(employee_id);
CREATE INDEX IF NOT EXISTS idx_project_logs_project_id ON project_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_project_logs_employee_id ON project_logs(employee_id);
CREATE INDEX IF NOT EXISTS idx_parts_part_number ON parts(part_number);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_logs_updated_at BEFORE UPDATE ON service_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_logs_updated_at BEFORE UPDATE ON project_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parts_updated_at BEFORE UPDATE ON parts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (
  id = (SELECT id FROM users WHERE id = current_setting('request.jwt.claims', true)::json->>'sub')::integer
);
CREATE POLICY "Anyone can insert users on signup" ON users FOR INSERT WITH CHECK (true);

-- Customers policies
CREATE POLICY "Customers can view own profile" ON customers FOR SELECT USING (
  user_id = (SELECT id FROM users WHERE id = current_setting('request.jwt.claims', true)::json->>'sub')::integer OR
  EXISTS (SELECT 1 FROM users WHERE id = current_setting('request.jwt.claims', true)::json->>'sub')::integer AND role IN ('employee', 'admin'))
);
CREATE POLICY "Customers can insert own profile" ON customers FOR INSERT WITH CHECK (
  user_id = (SELECT id FROM users WHERE id = current_setting('request.jwt.claims', true)::json->>'sub')::integer
);
CREATE POLICY "Customers can update own profile" ON customers FOR UPDATE USING (
  user_id = (SELECT id FROM users WHERE id = current_setting('request.jwt.claims', true)::json->>'sub')::integer
);

-- Employees policies
CREATE POLICY "Employees can view profiles" ON employees FOR SELECT USING (
  user_id = (SELECT id FROM users WHERE id = current_setting('request.jwt.claims', true)::json->>'sub')::integer OR
  EXISTS (SELECT 1 FROM users WHERE id = current_setting('request.jwt.claims', true)::json->>'sub')::integer AND role = 'admin')
);

-- Vehicles policies
CREATE POLICY "Vehicles viewable by owner and staff" ON vehicles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM customers c 
    JOIN users u ON c.user_id = u.id 
    WHERE c.id = vehicles.customer_id 
    AND (u.id = current_setting('request.jwt.claims', true)::json->>'sub')::integer
  ) OR
  EXISTS (SELECT 1 FROM users WHERE id = current_setting('request.jwt.claims', true)::json->>'sub')::integer AND role IN ('employee', 'admin'))
);

CREATE POLICY "Customers can manage own vehicles" ON vehicles FOR ALL USING (
  EXISTS (
    SELECT 1 FROM customers c 
    JOIN users u ON c.user_id = u.id 
    WHERE c.id = vehicles.customer_id 
    AND u.id = (current_setting('request.jwt.claims', true)::json->>'sub')::integer
  )
);

-- Services policies (catalog)
CREATE POLICY "Services viewable by all" ON services FOR SELECT USING (is_active = true OR 
  EXISTS (SELECT 1 FROM users WHERE id = current_setting('request.jwt.claims', true)::json->>'sub')::integer AND role = 'admin')
);

-- Appointments policies
CREATE POLICY "Appointments viewable by relevant users" ON appointments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM customers c 
    JOIN users u ON c.user_id = u.id 
    WHERE c.id = appointments.customer_id 
    AND u.id = (current_setting('request.jwt.claims', true)::json->>'sub')::integer
  ) OR
  EXISTS (SELECT 1 FROM users WHERE id = current_setting('request.jwt.claims', true)::json->>'sub')::integer AND role IN ('employee', 'admin'))
);

CREATE POLICY "Customers can create appointments" ON appointments FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM customers c 
    JOIN users u ON c.user_id = u.id 
    WHERE c.id = appointments.customer_id 
    AND u.id = (current_setting('request.jwt.claims', true)::json->>'sub')::integer
  )
);

-- Projects policies
CREATE POLICY "Projects viewable by relevant users" ON projects FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM customers c 
    JOIN users u ON c.user_id = u.id 
    WHERE c.id = projects.customer_id 
    AND u.id = (current_setting('request.jwt.claims', true)::json->>'sub')::integer
  ) OR
  EXISTS (SELECT 1 FROM users WHERE id = current_setting('request.jwt.claims', true)::json->>'sub')::integer AND role IN ('employee', 'admin'))
);

-- Service logs policies
CREATE POLICY "Service logs viewable by employees and admins" ON service_logs FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM employees e 
    JOIN users u ON e.user_id = u.id 
    WHERE e.id = service_logs.employee_id 
    AND u.id = (current_setting('request.jwt.claims', true)::json->>'sub')::integer
  ) OR
  EXISTS (SELECT 1 FROM users WHERE id = current_setting('request.jwt.claims', true)::json->>'sub')::integer AND role = 'admin')
);

CREATE POLICY "Employees can create service logs" ON service_logs FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM employees e 
    JOIN users u ON e.user_id = u.id 
    WHERE e.id = service_logs.employee_id 
    AND u.id = (current_setting('request.jwt.claims', true)::json->>'sub')::integer
  )
);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (
  user_id = (current_setting('request.jwt.claims', true)::json->>'sub')::integer
);

CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (
  user_id = (current_setting('request.jwt.claims', true)::json->>'sub')::integer
);

-- Messages policies
CREATE POLICY "Users can view sent/received messages" ON messages FOR SELECT USING (
  sender_id = (current_setting('request.jwt.claims', true)::json->>'sub')::integer OR
  receiver_id = (current_setting('request.jwt.claims', true)::json->>'sub')::integer
);

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert sample services
INSERT INTO services (name, description, category, estimated_duration, base_price, is_active) VALUES
  ('Oil Change', 'Regular oil and filter change', 'Maintenance', 30, 49.99, true),
  ('Brake Service', 'Brake pad replacement and inspection', 'Brakes', 90, 299.99, true),
  ('Tire Rotation', 'Rotate and balance tires', 'Tires', 45, 79.99, true),
  ('Engine Diagnostic', 'Complete engine diagnostic scan', 'Diagnostic', 60, 89.99, true),
  ('Transmission Service', 'Transmission fluid change and inspection', 'Maintenance', 120, 199.99, true),
  ('Air Conditioning Service', 'AC system inspection and recharge', 'Climate', 60, 149.99, true),
  ('Alignment', 'Wheel alignment service', 'Tires', 60, 99.99, true),
  ('Battery Replacement', 'Battery test and replacement', 'Electrical', 30, 149.99, true),
  ('Custom Paint Job', 'Full vehicle paint customization', 'Customization', 480, 2999.99, true),
  ('Performance Tuning', 'Engine performance upgrade', 'Performance', 240, 1499.99, true)
ON CONFLICT DO NOTHING;

-- Insert sample parts
INSERT INTO parts (name, part_number, description, category, quantity_in_stock, unit_price, reorder_level, supplier) VALUES
  ('Oil Filter', 'OF-001', 'Standard oil filter', 'Filters', 50, 8.99, 10, 'AutoParts Inc'),
  ('Air Filter', 'AF-001', 'Engine air filter', 'Filters', 40, 12.99, 10, 'AutoParts Inc'),
  ('Brake Pads', 'BP-001', 'Ceramic brake pads (set)', 'Brakes', 30, 89.99, 5, 'Brake Masters'),
  ('Brake Rotors', 'BR-001', 'Front brake rotors (pair)', 'Brakes', 20, 149.99, 5, 'Brake Masters'),
  ('Spark Plugs', 'SP-001', 'Iridium spark plugs (set of 4)', 'Engine', 25, 39.99, 10, 'Engine Pro'),
  ('Battery', 'BAT-001', '12V car battery', 'Electrical', 15, 129.99, 5, 'PowerCell'),
  ('Motor Oil 5W-30', 'MO-001', 'Synthetic motor oil (quart)', 'Fluids', 100, 6.99, 20, 'Oil Co'),
  ('Coolant', 'CL-001', 'Engine coolant (gallon)', 'Fluids', 40, 14.99, 10, 'Fluid Systems'),
  ('Wiper Blades', 'WB-001', 'Front wiper blades (pair)', 'Accessories', 35, 24.99, 10, 'Auto Accessories'),
  ('Transmission Fluid', 'TF-001', 'ATF transmission fluid (quart)', 'Fluids', 50, 8.99, 15, 'Fluid Systems')
ON CONFLICT DO NOTHING;
