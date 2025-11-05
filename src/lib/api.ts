// API Service Layer - Replace BASE_URL with your Express.js backend URL
// For development, you can change this to your backend URL directly
const BASE_URL = 'http://localhost:5000/api';

// API Response type
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('authToken');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'An error occurred',
      };
    }

    return {
      success: true,
      data: data.data || data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  signup: (data: { email: string; password: string; name: string; phone: string; role: string }) =>
    apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
  },
};

// Customer API
export const customerAPI = {
  getServiceProgress: () => apiCall('/customer/services'),
  
  bookAppointment: (data: {
    vehicleId: string;
    serviceType: string;
    preferredDate: string;
    preferredTime: string;
    description: string;
  }) =>
    apiCall('/customer/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  requestModification: (data: {
    vehicleId: string;
    modificationDetails: string;
    estimatedBudget: number;
  }) =>
    apiCall('/customer/modifications', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getVehicles: () => apiCall('/customer/vehicles'),
  
  addVehicle: (data: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    vin?: string;
  }) =>
    apiCall('/customer/vehicles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getAppointments: () => apiCall('/customer/appointments'),
  
  chatbotCheckSlots: (date: string, serviceType: string) =>
    apiCall(`/customer/chatbot/slots?date=${date}&serviceType=${serviceType}`),
};

// Employee API
export const employeeAPI = {
  getAssignedServices: () => apiCall('/employee/services'),
  
  logTime: (data: {
    serviceId: string;
    hours: number;
    description: string;
    date: string;
  }) =>
    apiCall('/employee/time-logs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  updateServiceStatus: (serviceId: string, status: string, notes?: string) =>
    apiCall(`/employee/services/${serviceId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    }),
  
  getUpcomingAppointments: () => apiCall('/employee/appointments/upcoming'),
  
  getTimeLogs: (serviceId?: string) =>
    apiCall(`/employee/time-logs${serviceId ? `?serviceId=${serviceId}` : ''}`),
};

// Admin API
export const adminAPI = {
  getAllUsers: () => apiCall('/admin/users'),
  
  updateUserRole: (userId: string, role: string) =>
    apiCall(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),
  
  deleteUser: (userId: string) =>
    apiCall(`/admin/users/${userId}`, {
      method: 'DELETE',
    }),
  
  getAllServices: () => apiCall('/admin/services'),
  
  getAllAppointments: () => apiCall('/admin/appointments'),
  
  assignServiceToEmployee: (serviceId: string, employeeId: string) =>
    apiCall(`/admin/services/${serviceId}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ employeeId }),
    }),
  
  getReports: (type: string, startDate?: string, endDate?: string) =>
    apiCall(`/admin/reports/${type}?startDate=${startDate}&endDate=${endDate}`),
  
  getDashboardStats: () => apiCall('/admin/dashboard/stats'),
};
