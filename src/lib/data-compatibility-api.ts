/**
 * Data Compatibility Layer - API Version
 * This file helps the application work with existing database data via REST API
 */

import apiClient from './api-client';

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
    const response = await apiClient.get('/admin/database-status');
    return response.data;
  } catch (error) {
    console.error('Error checking database:', error);
    return checks;
  }
}

// Get sample data to verify structure
export async function getSampleData() {
  try {
    const response = await apiClient.get('/admin/sample-data');
    return response.data;
  } catch (error) {
    console.error('Error getting sample data:', error);
    return null;
  }
}

// Detect password hashing method
export async function detectPasswordHashMethod(email: string): Promise<'bcrypt' | 'plain' | 'unknown'> {
  try {
    const response = await apiClient.get(`/admin/password-hash-method/${email}`);
    return response.data.method;
  } catch (error) {
    return 'unknown';
  }
}

// Get all existing service names for dropdown
export async function getExistingServiceNames(): Promise<string[]> {
  try {
    const response = await apiClient.get('/services/names');
    return response.data;
  } catch (error) {
    console.error('Error getting service names:', error);
    return [];
  }
}

// Get all employees for assignment
export async function getAvailableEmployees(): Promise<Array<{ id: number; name: string; department: string | null }>> {
  try {
    const response = await apiClient.get('/employees/available');
    return response.data;
  } catch (error) {
    console.error('Error getting employees:', error);
    return [];
  }
}

// Verify user has required profile
export async function verifyUserProfile(userId: number, role: string): Promise<boolean> {
  try {
    const response = await apiClient.get(`/admin/verify-profile/${userId}/${role}`);
    return response.data.hasProfile;
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
    await apiClient.post(`/admin/create-profile/${userId}/${role}`, userData);
    return true;
  } catch (error) {
    console.error('Error creating profile:', error);
    return false;
  }
}