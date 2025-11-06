// Shared TypeScript types for AutoServe Pro

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'employee' | 'admin';
  createdAt: string;
}

export interface Vehicle {
  id: string;
  customerId: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  vehicleId: string;
  vehicleName: string;
  customerId: string;
  customerName: string;
  assignedEmployeeId?: string;
  assignedEmployee?: string;
  serviceType: string;
  description?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'scheduled' | 'confirmed' | 'cancelled';
  progress: number;
  startDate: string;
  estimatedCompletion: string;
  actualCompletion?: string;
  totalHoursLogged: number;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  vehicleId: string;
  vehicleName: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  serviceType: string;
  date: string;
  time: string;
  description?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface TimeLog {
  id: string;
  serviceId: string;
  serviceName: string;
  employeeId: string;
  hours: number;
  description: string;
  date: string;
  createdAt: string;
}

export interface Modification {
  id: string;
  vehicleId: string;
  vehicleName: string;
  customerId: string;
  modificationDetails: string;
  estimatedBudget: number;
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected';
  createdAt: string;
}

export interface DashboardStats {
  totalCustomers: number;
  totalEmployees: number;
  activeServices: number;
  completedServices: number;
  pendingAppointments: number;
  revenue: number;
}

export interface Report {
  type: 'revenue' | 'services' | 'customers' | 'employees';
  startDate: string;
  endDate: string;
  totalRecords: number;
  totalAmount?: number;
  average?: number;
  growth?: number;
  data: any[];
}

export interface ChatbotMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export interface AvailableSlot {
  date: string;
  time: string;
  available: boolean;
}

// Utility function to format status text with proper capitalization
export function formatStatusText(status: string): string {
  if (!status) return '';
  
  // Replace underscores with spaces and capitalize each word
  return status
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
