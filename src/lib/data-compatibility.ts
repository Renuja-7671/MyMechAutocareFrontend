/**
 * Data Compatibility Layer
 * This file helps the application work with existing database data
 */

import { supabase } from './supabase-client';

// Check if tables exist and have data
export async function checkDatabaseSetup() {
  const checks = {
    users: false,
    customers: false,
    employees: false,
    vehicles: false,
    appointments: false,
    services: false,
  };

  try {
    // Check users table
    const { count: userCount, error: userError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    checks.users = !userError && (userCount ?? 0) > 0;

    // Check customers table
    const { count: customerCount, error: customerError } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true });
    
    checks.customers = !customerError && (customerCount ?? 0) > 0;

    // Check employees table
    const { count: employeeCount, error: employeeError } = await supabase
      .from('employees')
      .select('*', { count: 'exact', head: true });
    
    checks.employees = !employeeError && (employeeCount ?? 0) > 0;

    // Check vehicles table
    const { count: vehicleCount, error: vehicleError } = await supabase
      .from('vehicles')
      .select('*', { count: 'exact', head: true });
    
    checks.vehicles = !vehicleError && (vehicleCount ?? 0) > 0;

    // Check appointments table
    const { count: appointmentCount, error: appointmentError } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true });
    
    checks.appointments = !appointmentError && (appointmentCount ?? 0) > 0;

    // Check services table
    const { count: serviceCount, error: serviceError } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true });
    
    checks.services = !serviceError && (serviceCount ?? 0) > 0;

    return checks;
  } catch (error) {
    console.error('Error checking database:', error);
    return checks;
  }
}

// Get sample data to verify structure
export async function getSampleData() {
  try {
    const [usersResult, customersResult, employeesResult, servicesResult] = await Promise.all([
      supabase.from('users').select('*').limit(1),
      supabase.from('customers').select('*').limit(1),
      supabase.from('employees').select('*').limit(1),
      supabase.from('services').select('*').limit(1),
    ]);

    return {
      user: usersResult.data?.[0] || null,
      customer: customersResult.data?.[0] || null,
      employee: employeesResult.data?.[0] || null,
      service: servicesResult.data?.[0] || null,
    };
  } catch (error) {
    console.error('Error getting sample data:', error);
    return null;
  }
}

// Detect password hashing method
export async function detectPasswordHashMethod(email: string): Promise<'bcrypt' | 'plain' | 'unknown'> {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('password_hash')
      .eq('email', email)
      .single();

    if (!user?.password_hash) return 'unknown';

    // Bcrypt hashes start with $2a$, $2b$, or $2y$
    if (user.password_hash.match(/^\$2[aby]\$/)) {
      return 'bcrypt';
    }

    // If it looks like plain text (no special characters/short length)
    if (user.password_hash.length < 20) {
      return 'plain';
    }

    return 'unknown';
  } catch (error) {
    return 'unknown';
  }
}

// Get all existing service names for dropdown
export async function getExistingServiceNames(): Promise<string[]> {
  try {
    const { data } = await supabase
      .from('services')
      .select('name')
      .eq('is_active', true)
      .order('name');

    return data?.map(s => s.name) || [];
  } catch (error) {
    console.error('Error getting service names:', error);
    return [];
  }
}

// Get all employees for assignment
export async function getAvailableEmployees(): Promise<Array<{ id: number; name: string; department: string | null }>> {
  try {
    const { data } = await supabase
      .from('employees')
      .select('id, first_name, last_name, department, is_available')
      .eq('is_available', true)
      .order('first_name');

    return data?.map(e => ({
      id: e.id,
      name: `${e.first_name} ${e.last_name}`,
      department: e.department,
    })) || [];
  } catch (error) {
    console.error('Error getting employees:', error);
    return [];
  }
}

// Verify user has required profile
export async function verifyUserProfile(userId: number, role: string): Promise<boolean> {
  try {
    if (role === 'customer') {
      const { data } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', userId)
        .single();
      return !!data;
    } else if (role === 'employee') {
      const { data } = await supabase
        .from('employees')
        .select('id')
        .eq('user_id', userId)
        .single();
      return !!data;
    }
    return true; // Admin doesn't need profile
  } catch (error) {
    return false;
  }
}

// Create missing profile if needed
export async function createMissingProfile(userId: number, role: string, userData: {
  firstName: string;
  lastName: string;
  phone?: string;
}): Promise<boolean> {
  try {
    if (role === 'customer') {
      const { error } = await supabase
        .from('customers')
        .insert({
          user_id: userId,
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
        });
      return !error;
    } else if (role === 'employee') {
      const { error } = await supabase
        .from('employees')
        .insert({
          user_id: userId,
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
          hire_date: new Date().toISOString().split('T')[0],
        });
      return !error;
    }
    return true;
  } catch (error) {
    console.error('Error creating profile:', error);
    return false;
  }
}
