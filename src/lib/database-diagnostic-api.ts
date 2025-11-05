/**
 * Database Diagnostic Tool - API Version
 * Use this to check your existing database structure and data via REST API
 */

import apiClient from './api-client';

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
  try {
    const response = await apiClient.get('/admin/database-diagnostic');
    return response.data;
  } catch (error: any) {
    return {
      tables: {},
      issues: [`Failed to run diagnostic: ${error.message}`],
      recommendations: ['Check if the backend API is running and accessible'],
    };
  }
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
    const response = await apiClient.get('/admin/database-quick-check');
    return response.data;
  } catch (error: any) {
    return {
      ready: false,
      message: `API connection issue: ${error.message}`,
    };
  }
}