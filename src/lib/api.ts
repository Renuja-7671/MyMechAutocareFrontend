import { authService } from '../services/auth';
import { vehicleService } from '../services/vehicles';
import { appointmentService } from '../services/appointments';
import { employeeService } from '../services/employees';
import { projectService } from '../services/projects';
import { adminService } from '../services/admin';
import { chatbotService } from '../services/chatbot';

// API Response types
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// Helper function for error handling
const handleApiError = (error: any): ApiErrorResponse => {
  console.error('API error:', error);
  return {
    success: false,
    error: error.response?.data?.error || error.response?.data?.message || error.message || 'An error occurred',
  };
};

// Get current user from localStorage
const getCurrentUser = (): any | null => {
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
  } catch (error) {
    console.error('Error getting current user:', error);
  }
  return null;
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<ApiResponse> => {
    try {
      const data = await authService.login({ email, password });
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  signup: async (signupData: {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: string;
  }): Promise<ApiResponse<void>> => {
    try {
      await authService.signup(signupData);
      return { success: true, data: undefined };
    } catch (error) {
      return handleApiError(error);
    }
  },

  logout: async () => {
    try {
      await authService.logout();
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    } catch (error) {
      // Even if API call fails, clear local storage
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    }
  },
};

// Customer API
export const customerAPI = {
  getServiceProgress: async () => {
    try {
      const data = await appointmentService.getServiceProgress();
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  getVehicles: async () => {
    try {
      const data = await vehicleService.fetchVehicles();
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  addVehicle: async (vehicleData: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    vin?: string;
    exteriorImages?: File[];
    interiorImage?: File;
  }) => {
    try {
      const data = await vehicleService.createVehicle(vehicleData);
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  getVehicleServiceHistory: async (vehicleId: string) => {
    try {
      const data = await vehicleService.getVehicleServiceHistory(vehicleId);
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  bookAppointment: async (appointmentData: {
    vehicleId: string;
    serviceType: string;
    preferredDate: string;
    preferredTime: string;
    description: string;
  }) => {
    try {
      const data = await appointmentService.createAppointment(appointmentData);
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  getAppointments: async () => {
    try {
      const data = await appointmentService.fetchAppointments();
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  requestModification: async (modData: {
    vehicleId: string;
    modificationDetails: string;
    estimatedBudget: number;
  }) => {
    try {
      const data = await projectService.createModificationRequest(modData);
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  chatbotCheckSlots: async (date: string, serviceType: string) => {
    try {
      const data = await chatbotService.checkSlots(date, serviceType);
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  getMyModificationRequests: async () => {
    try {
      const data = await projectService.getMyModificationRequests();
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  deleteModificationRequest: async (requestId: string) => {
    try {
      await projectService.deleteModificationRequest(requestId);
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    }
  },
};

// Employee API
export const employeeAPI = {
  getAssignedServices: async () => {
    try {
      const data = await employeeService.getAssignedServices();
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  logTime: async (timeData: {
    serviceId: string;
    hours: number;
    description: string;
    date: string;
  }) => {
    try {
      const data = await employeeService.logTime(timeData);
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  updateServiceStatus: async (serviceId: string, status: string, progress: number, notes?: string) => {
    try {
      const data = await employeeService.updateServiceStatus(serviceId, status, progress, notes);
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  getUpcomingAppointments: async () => {
    try {
      const data = await appointmentService.getUpcomingAppointments();
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  getTimeLogs: async (serviceId?: string) => {
    try {
      const data = await employeeService.getTimeLogs(serviceId);
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  },
};

// Admin API
export const adminAPI = {
  getAllUsers: async () => {
    try {
      const data = await adminService.getAllUsers();
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  updateUserRole: async (userId: string, role: string) => {
    try {
      const data = await adminService.updateUserRole(userId, role);
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  deleteUser: async (userId: string) => {
    try {
      await adminService.deleteUser(userId);
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    }
  },

  getAllServices: async () => {
    try {
      const data = await adminService.getAllServices();
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  assignServiceToEmployee: async (serviceId: string, employeeId: string) => {
    try {
      const data = await adminService.assignServiceToEmployee(serviceId, employeeId);
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  getAllAppointments: async () => {
    try {
      const data = await adminService.getAllAppointments();
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  getReports: async (type: string, startDate?: string, endDate?: string) => {
    try {
      const data = await adminService.getReports(type, startDate, endDate);
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  getDashboardStats: async () => {
    try {
      const data = await adminService.getDashboardStats();
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  addEmployee: async (employeeData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    position?: string;
  }) => {
    try {
      const data = await employeeService.createEmployee(employeeData);
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  getAllModificationRequests: async () => {
    try {
      const data = await projectService.getAllModificationRequests();
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  updateModificationStatus: async (projectId: string, status: string, approvedCost?: number) => {
    try {
      const data = await projectService.updateModificationStatus(projectId, status, approvedCost);
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  },
};