/**
 * Database Diagnostic Tool
 * Use this to check your existing database structure and data
 */

import { supabase } from './supabase-client';

export interface DiagnosticReport {
  tables: {
    [key: string]: {
      exists: boolean;
      rowCount: number;
      sampleRow: any;
      columns?: string[];
    };
  };
  issues: string[];
  recommendations: string[];
}

export async function runDatabaseDiagnostic(): Promise<DiagnosticReport> {
  const report: DiagnosticReport = {
    tables: {},
    issues: [],
    recommendations: [],
  };

  const tables = [
    'users',
    'customers',
    'employees',
    'vehicles',
    'services',
    'appointments',
    'projects',
    'service_logs',
    'project_logs',
    'parts',
    'service_parts',
    'feedback',
    'notifications',
    'messages',
    'audit_logs',
  ];

  // Check each table
  for (const tableName of tables) {
    try {
      // Get count
      const { count, error: countError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      // Get sample row
      const { data: sampleData, error: sampleError } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      report.tables[tableName] = {
        exists: !countError,
        rowCount: count || 0,
        sampleRow: sampleData?.[0] || null,
        columns: sampleData?.[0] ? Object.keys(sampleData[0]) : [],
      };

      if (countError) {
        report.issues.push(`Table '${tableName}' might not exist or is not accessible`);
      }
    } catch (error) {
      report.tables[tableName] = {
        exists: false,
        rowCount: 0,
        sampleRow: null,
      };
      report.issues.push(`Error checking table '${tableName}': ${error}`);
    }
  }

  // Check for critical data
  if (report.tables.users?.rowCount === 0) {
    report.recommendations.push('No users found. Create at least one admin user to get started.');
  }

  if (report.tables.services?.rowCount === 0) {
    report.recommendations.push('No services found. Add services to your catalog (Oil Change, Brake Service, etc.)');
  }

  // Check for orphaned records
  if (report.tables.customers && report.tables.users) {
    const { data: orphanedCustomers } = await supabase
      .from('customers')
      .select('id, user_id')
      .not('user_id', 'in', `(SELECT id FROM users)`);

    if (orphanedCustomers && orphanedCustomers.length > 0) {
      report.issues.push(`Found ${orphanedCustomers.length} customer(s) without a user account`);
    }
  }

  // Check password hash format
  if (report.tables.users?.sampleRow?.password_hash) {
    const hash = report.tables.users.sampleRow.password_hash;
    if (!hash.match(/^\$2[aby]\$/)) {
      report.recommendations.push('Password hashes do not appear to be bcrypt format. The app will try to handle this automatically.');
    }
  }

  // Check for missing profiles
  const { data: usersWithoutProfiles } = await supabase
    .from('users')
    .select(`
      id,
      email,
      role,
      customers!left(id),
      employees!left(id)
    `);

  usersWithoutProfiles?.forEach((user: any) => {
    if (user.role === 'customer' && !user.customers?.id) {
      report.issues.push(`User ${user.email} is a customer but has no customer profile`);
    }
    if (user.role === 'employee' && !user.employees?.id) {
      report.issues.push(`User ${user.email} is an employee but has no employee profile`);
    }
  });

  return report;
}

// Print diagnostic report to console
export function printDiagnosticReport(report: DiagnosticReport) {
  console.group('📊 Database Diagnostic Report');
  
  console.group('📋 Tables');
  Object.entries(report.tables).forEach(([name, info]) => {
    const status = info.exists ? '✅' : '❌';
    console.log(`${status} ${name}: ${info.rowCount} rows`);
    if (info.sampleRow && info.rowCount > 0) {
      console.log(`   Sample columns:`, info.columns?.join(', '));
    }
  });
  console.groupEnd();

  if (report.issues.length > 0) {
    console.group('⚠️ Issues Found');
    report.issues.forEach(issue => console.warn(issue));
    console.groupEnd();
  }

  if (report.recommendations.length > 0) {
    console.group('💡 Recommendations');
    report.recommendations.forEach(rec => console.info(rec));
    console.groupEnd();
  }

  console.groupEnd();
}

// Quick check function
export async function quickDatabaseCheck(): Promise<{
  ready: boolean;
  message: string;
}> {
  try {
    // Check if we can query users table
    const { data: users, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (error) {
      return {
        ready: false,
        message: `Database connection issue: ${error.message}`,
      };
    }

    if (!users || users.length === 0) {
      return {
        ready: false,
        message: 'Database is empty. Please add users to get started.',
      };
    }

    return {
      ready: true,
      message: 'Database is ready!',
    };
  } catch (error) {
    return {
      ready: false,
      message: `Unexpected error: ${error}`,
    };
  }
}
