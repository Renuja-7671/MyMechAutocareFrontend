import { supabase } from './supabase-client';
import bcrypt from 'bcryptjs';
import { verifyUserProfile, createMissingProfile } from './data-compatibility';

// Helper function for error handling
const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  return {
    success: false,
    error: error.message || 'An error occurred',
  };
};

// Flexible password verification - works with bcrypt or plain text
const verifyPassword = async (inputPassword: string, storedHash: string): Promise<boolean> => {
  // Check if it's a bcrypt hash
  if (storedHash.match(/^\$2[aby]\$/)) {
    try {
      return await bcrypt.compare(inputPassword, storedHash);
    } catch (error) {
      console.error('Bcrypt comparison error:', error);
      return false;
    }
  }
  
  // Fallback to plain text comparison (for testing/existing data)
  return inputPassword === storedHash;
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

// Get current user ID from session
const getCurrentUserId = async (): Promise<number | null> => {
  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.email) {
    return null;
  }
  
  // Get user from users table
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', currentUser.email)
    .single();
  
  if (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
  
  return data?.id || null;
};

// Get customer ID for current user
const getCustomerId = async (): Promise<number | null> => {
  const userId = await getCurrentUserId();
  if (!userId) {
    return null;
  }
  
  const { data, error } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error getting customer ID:', error);
    return null;
  }
  
  return data?.id || null;
};

// Get employee ID for current user
const getEmployeeId = async (): Promise<number | null> => {
  const userId = await getCurrentUserId();
  if (!userId) return null;
  
  const { data } = await supabase
    .from('employees')
    .select('id')
    .eq('user_id', userId)
    .single();
  
  return data?.id || null;
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      // Get user from database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userError || !userData) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Check if user is active
      if (!userData.is_active) {
        return { success: false, error: 'Account is inactive. Please contact support.' };
      }

      // Verify password (supports both bcrypt and plain text)
      const passwordMatch = await verifyPassword(password, userData.password_hash);
      if (!passwordMatch) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Get customer or employee details based on role
      let profileData: any = null;
      if (userData.role === 'customer') {
        const { data } = await supabase
          .from('customers')
          .select('*')
          .eq('user_id', userData.id)
          .single();
        profileData = data;

        // If customer profile doesn't exist, you might want to create it or return error
        if (!profileData) {
          console.warn(`Customer profile missing for user ${userData.id}`);
        }
      } else if (userData.role === 'employee') {
        const { data } = await supabase
          .from('employees')
          .select('*')
          .eq('user_id', userData.id)
          .single();
        profileData = data;

        // If employee profile doesn't exist, you might want to create it or return error
        if (!profileData) {
          console.warn(`Employee profile missing for user ${userData.id}`);
        }
      }

      const formattedUser = {
        id: userData.id,
        email: userData.email,
        role: userData.role,
        name: profileData ? `${profileData.first_name} ${profileData.last_name}` : 'Admin User',
        phone: profileData?.phone || null,
      };

      return {
        success: true,
        data: {
          user: formattedUser,
          token: 'dummy-token',
        },
      };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  signup: async (signupData: {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: string;
  }) => {
    try {
      // Hash password
      const passwordHash = await bcrypt.hash(signupData.password, 10);

      // Create user
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          email: signupData.email,
          password_hash: passwordHash,
          role: signupData.role as 'customer' | 'employee' | 'admin',
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (userError) return handleSupabaseError(userError);

      // Split name into first and last
      const nameParts = signupData.name.split(' ');
      const firstName = nameParts[0] || signupData.name;
      const lastName = nameParts.slice(1).join(' ') || '';

      // Create customer or employee profile
      if (signupData.role === 'customer') {
        const { error: customerError } = await supabase
          .from('customers')
          .insert({
            user_id: newUser.id,
            first_name: firstName,
            last_name: lastName,
            phone: signupData.phone,
            updated_at: new Date().toISOString(),
          });

        if (customerError) return handleSupabaseError(customerError);
      } else if (signupData.role === 'employee') {
        const { error: employeeError } = await supabase
          .from('employees')
          .insert({
            user_id: newUser.id,
            first_name: firstName,
            last_name: lastName,
            phone: signupData.phone,
            hire_date: new Date().toISOString().split('T')[0],
            updated_at: new Date().toISOString(),
          });

        if (employeeError) return handleSupabaseError(employeeError);
      }

      return { success: true };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  logout: async () => {
    localStorage.removeItem('user');
  },
};

// Customer API
export const customerAPI = {
  getServiceProgress: async () => {
    try {
      const customerId = await getCustomerId();
      if (!customerId) return { success: false, error: 'Not authenticated' };

      // Get appointments with service logs
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          vehicle:vehicles(*),
          service:services(name),
          service_logs(
            id,
            hours_worked,
            progress_percentage,
            status,
            employee:employees(first_name, last_name)
          )
        `)
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) return handleSupabaseError(error);

      const formatted = data?.map((apt: any) => {
        const latestLog = apt.service_logs?.[apt.service_logs.length - 1];
        const totalHours = apt.service_logs?.reduce((sum: number, log: any) => 
          sum + (parseFloat(log.hours_worked) || 0), 0) || 0;

        return {
          id: apt.id,
          vehicleName: `${apt.vehicle.year} ${apt.vehicle.make} ${apt.vehicle.model}`,
          serviceType: apt.service?.name || 'Service',
          status: latestLog?.status || apt.status,
          progress: latestLog?.progress_percentage || 0,
          startDate: apt.scheduled_date,
          estimatedCompletion: apt.scheduled_date,
          assignedEmployee: latestLog?.employee ? 
            `${latestLog.employee.first_name} ${latestLog.employee.last_name}` : null,
          totalHoursLogged: totalHours,
        };
      });

      return { success: true, data: formatted };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  getVehicles: async () => {
    try {
      const customerId = await getCustomerId();
      if (!customerId) return { success: false, error: 'Not authenticated' };

      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) return handleSupabaseError(error);

      return { success: true, data };
    } catch (error) {
      return handleSupabaseError(error);
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
      const customerId = await getCustomerId();
      if (!customerId) return { success: false, error: 'Not authenticated' };

      // First, insert the vehicle to get the ID
      const { data: vehicle, error: vehicleError } = await supabase
        .from('vehicles')
        .insert({
          customer_id: customerId,
          make: vehicleData.make,
          model: vehicleData.model,
          year: vehicleData.year,
          license_plate: vehicleData.licensePlate,
          vin: vehicleData.vin,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (vehicleError) return handleSupabaseError(vehicleError);

      // Upload images to Supabase Storage
      const imageUrls: string[] = [];
      const vehicleId = vehicle.id;

      // Upload exterior images
      if (vehicleData.exteriorImages && vehicleData.exteriorImages.length > 0) {
        for (let i = 0; i < vehicleData.exteriorImages.length; i++) {
          const file = vehicleData.exteriorImages[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${vehicleId}_exterior_${i + 1}_${Date.now()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('vehicle-images')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false,
            });

          if (uploadError) {
            console.error('Error uploading exterior image:', uploadError);
            if (uploadError.message.includes('row-level security policy')) {
              console.error('SETUP REQUIRED: Please configure RLS policies for vehicle-images bucket. See VEHICLE_IMAGES_STORAGE_SETUP.md');
            }
          } else {
            imageUrls.push(fileName);
          }
        }
      }

      // Upload interior image
      if (vehicleData.interiorImage) {
        const file = vehicleData.interiorImage;
        const fileExt = file.name.split('.').pop();
        const fileName = `${vehicleId}_interior_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('vehicle-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error('Error uploading interior image:', uploadError);
          if (uploadError.message.includes('row-level security policy')) {
            console.error('SETUP REQUIRED: Please configure RLS policies for vehicle-images bucket. See VEHICLE_IMAGES_STORAGE_SETUP.md');
          }
        } else {
          imageUrls.push(fileName);
        }
      }

      // Store image URLs in the database (we'll need to add columns for this)
      // For now, we'll use a simple JSON approach or store in a separate table
      // Since we don't have image columns in the vehicles table, let's update it
      const updateData: any = {};
      if (imageUrls.length > 0) {
        // Store as comma-separated string in a note/description field
        // Or we need to add proper columns. Let's store it properly.
        // We'll add columns: exterior_image_1, exterior_image_2, interior_image
        const exteriorUrls = imageUrls.filter(url => url.includes('exterior'));
        const interiorUrls = imageUrls.filter(url => url.includes('interior'));
        
        if (exteriorUrls[0]) updateData.exterior_image_1 = exteriorUrls[0];
        if (exteriorUrls[1]) updateData.exterior_image_2 = exteriorUrls[1];
        if (interiorUrls[0]) updateData.interior_image = interiorUrls[0];
      }

      // Update vehicle with image URLs if any were uploaded
      if (Object.keys(updateData).length > 0) {
        await supabase
          .from('vehicles')
          .update(updateData)
          .eq('id', vehicleId);
      }

      return { success: true, data: vehicle };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  getVehicleServiceHistory: async (vehicleId: string) => {
    try {
      const customerId = await getCustomerId();
      if (!customerId) return { success: false, error: 'Not authenticated' };

      // Verify vehicle belongs to customer
      const { data: vehicle } = await supabase
        .from('vehicles')
        .select('id')
        .eq('id', parseInt(vehicleId))
        .eq('customer_id', customerId)
        .single();

      if (!vehicle) {
        return { success: false, error: 'Vehicle not found or access denied' };
      }

      // Get all appointments for this vehicle with service details
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select(`
          id,
          scheduled_date,
          status,
          notes,
          service:services(name, description),
          service_logs(
            id,
            status,
            hours_worked,
            notes,
            created_at,
            employee:employees(
              first_name,
              last_name
            ),
            service_parts(
              id,
              part:parts(name, unit_price),
              quantity_used
            )
          )
        `)
        .eq('vehicle_id', parseInt(vehicleId))
        .order('scheduled_date', { ascending: false });

      if (error) return handleSupabaseError(error);

      // Transform data to match frontend interface
      const serviceHistory = appointments?.map((apt: any) => {
        // Get latest service log for employee info and status
        const latestLog = apt.service_logs?.[0];
        
        // Calculate total hours from service logs
        const totalHours = apt.service_logs?.reduce(
          (sum: number, log: any) => sum + (log.hours_worked || 0),
          0
        );

        // Collect all parts from all service logs
        const allParts: any[] = [];
        apt.service_logs?.forEach((log: any) => {
          log.service_parts?.forEach((sp: any) => {
            allParts.push({
              name: sp.part?.name || 'Unknown Part',
              quantity: sp.quantity_used || 0,
              cost: sp.part?.unit_price || 0,
            });
          });
        });

        // Calculate total cost from parts
        const totalCost = allParts.reduce(
          (sum: number, part: any) => sum + (part.cost * part.quantity),
          0
        );

        // Determine completion date from service logs
        const completedLogs = apt.service_logs?.filter((log: any) => log.status === 'completed');
        const completionDate = completedLogs && completedLogs.length > 0 
          ? completedLogs[completedLogs.length - 1].created_at 
          : null;

        return {
          id: apt.id.toString(),
          serviceType: apt.service?.name || 'General Service',
          status: latestLog?.status || apt.status || 'not_started',
          startDate: apt.scheduled_date,
          completionDate,
          totalCost,
          description: apt.notes || apt.service?.description || latestLog?.notes,
          employeeName: latestLog?.employee 
            ? `${latestLog.employee.first_name} ${latestLog.employee.last_name}`
            : undefined,
          totalHours,
          parts: allParts.length > 0 ? allParts : undefined,
        };
      });

      return { success: true, data: serviceHistory || [] };
    } catch (error) {
      return handleSupabaseError(error);
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
      const customerId = await getCustomerId();
      if (!customerId) return { success: false, error: 'Not authenticated' };

      // Find service by name (serviceType)
      const { data: service } = await supabase
        .from('services')
        .select('id')
        .eq('name', appointmentData.serviceType)
        .single();

      const scheduledDateTime = `${appointmentData.preferredDate} ${appointmentData.preferredTime}`;

      const { data, error } = await supabase
        .from('appointments')
        .insert({
          customer_id: customerId,
          vehicle_id: parseInt(appointmentData.vehicleId),
          service_id: service?.id || null,
          scheduled_date: scheduledDateTime,
          notes: appointmentData.description,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) return handleSupabaseError(error);

      return { success: true, data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  getAppointments: async () => {
    try {
      const customerId = await getCustomerId();
      if (!customerId) return { success: false, error: 'Not authenticated' };

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          vehicle:vehicles(*),
          service:services(name)
        `)
        .eq('customer_id', customerId)
        .order('scheduled_date', { ascending: false });

      if (error) return handleSupabaseError(error);

      const formatted = data?.map((apt: any) => {
        const aptDate = new Date(apt.scheduled_date);
        return {
          id: apt.id,
          vehicleName: `${apt.vehicle.year} ${apt.vehicle.make} ${apt.vehicle.model}`,
          serviceType: apt.service?.name || 'Service',
          date: aptDate.toISOString().split('T')[0],
          time: aptDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          status: apt.status,
        };
      });

      return { success: true, data: formatted };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  requestModification: async (modData: {
    vehicleId: string;
    modificationDetails: string;
    estimatedBudget: number;
  }) => {
    try {
      const customerId = await getCustomerId();
      if (!customerId) return { success: false, error: 'Not authenticated' };

      const { data, error } = await supabase
        .from('projects')
        .insert({
          customer_id: customerId,
          vehicle_id: parseInt(modData.vehicleId),
          title: 'Custom Modification Request',
          description: modData.modificationDetails,
          estimated_cost: modData.estimatedBudget,
          project_type: 'modification',
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) return handleSupabaseError(error);

      return { success: true, data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  chatbotCheckSlots: async (date: string, serviceType: string) => {
    return {
      success: true,
      data: {
        availableSlots: ['9:00 AM - 10:00 AM', '11:00 AM - 12:00 PM', '2:00 PM - 3:00 PM', '4:00 PM - 5:00 PM'],
      },
    };
  },

  getMyModificationRequests: async () => {
    try {
      const customerId = await getCustomerId();
      if (!customerId) return { success: false, error: 'Not authenticated' };

      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          vehicle:vehicles(year, make, model, license_plate)
        `)
        .eq('customer_id', customerId)
        .eq('project_type', 'modification')
        .order('created_at', { ascending: false });

      if (error) return handleSupabaseError(error);

      const formatted = data?.map((project: any) => ({
        id: project.id,
        vehicleName: `${project.vehicle.year} ${project.vehicle.make} ${project.vehicle.model}`,
        licensePlate: project.vehicle.license_plate,
        description: project.description,
        estimatedCost: project.estimated_cost,
        approvedCost: project.actual_cost,
        status: project.status || 'pending',
        createdAt: project.created_at,
      }));

      return { success: true, data: formatted };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  deleteModificationRequest: async (requestId: string) => {
    try {
      const customerId = await getCustomerId();
      if (!customerId) return { success: false, error: 'Not authenticated' };

      // First verify the request belongs to this customer and is approved
      const { data: project, error: fetchError } = await supabase
        .from('projects')
        .select('customer_id, status, actual_cost')
        .eq('id', parseInt(requestId))
        .single();

      if (fetchError) return handleSupabaseError(fetchError);
      
      if (!project) {
        return { success: false, error: 'Request not found' };
      }

      if (project.customer_id !== customerId) {
        return { success: false, error: 'Unauthorized' };
      }

      // Only allow deletion if approved and has approved cost
      if (project.status !== 'approved' || !project.actual_cost) {
        return { 
          success: false, 
          error: 'Can only delete approved requests with confirmed budget' 
        };
      }

      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', parseInt(requestId));

      if (deleteError) return handleSupabaseError(deleteError);

      return { success: true };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
};

// Employee API
export const employeeAPI = {
  getAssignedServices: async () => {
    try {
      const employeeId = await getEmployeeId();
      if (!employeeId) return { success: false, error: 'Not authenticated' };

      // Get service logs for this employee
      const { data, error } = await supabase
        .from('service_logs')
        .select(`
          *,
          appointment:appointments(
            *,
            vehicle:vehicles(*),
            customer:customers(first_name, last_name),
            service:services(name)
          )
        `)
        .eq('employee_id', employeeId)
        .order('created_at', { ascending: false });

      if (error) return handleSupabaseError(error);

      // Group by appointment and get latest status
      const appointmentMap = new Map();
      data?.forEach((log: any) => {
        const aptId = log.appointment.id;
        if (!appointmentMap.has(aptId) || 
            new Date(log.created_at) > new Date(appointmentMap.get(aptId).created_at)) {
          appointmentMap.set(aptId, log);
        }
      });

      const formatted = Array.from(appointmentMap.values()).map((log: any) => {
        const apt = log.appointment;
        const totalHours = data
          ?.filter((l: any) => l.appointment_id === apt.id)
          .reduce((sum: number, l: any) => sum + (parseFloat(l.hours_worked) || 0), 0) || 0;

        return {
          id: apt.id,
          vehicleName: `${apt.vehicle.year} ${apt.vehicle.make} ${apt.vehicle.model}`,
          customerName: `${apt.customer.first_name} ${apt.customer.last_name}`,
          serviceType: apt.service?.name || 'Service',
          status: log.status,
          progress: log.progress_percentage,
          startDate: apt.scheduled_date,
          estimatedCompletion: apt.scheduled_date,
          totalHoursLogged: totalHours,
          vehicle: {
            id: apt.vehicle.id,
            make: apt.vehicle.make,
            model: apt.vehicle.model,
            year: apt.vehicle.year,
            exterior_image_1: apt.vehicle.exterior_image_1,
            exterior_image_2: apt.vehicle.exterior_image_2,
            interior_image: apt.vehicle.interior_image,
          },
        };
      });

      return { success: true, data: formatted };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  logTime: async (timeData: {
    serviceId: string;
    hours: number;
    description: string;
    date: string;
  }) => {
    try {
      const employeeId = await getEmployeeId();
      if (!employeeId) return { success: false, error: 'Not authenticated' };

      const appointmentId = parseInt(timeData.serviceId);
      const startTime = new Date(timeData.date).toISOString();
      const endTime = new Date(new Date(timeData.date).getTime() + timeData.hours * 3600000).toISOString();

      const { data, error } = await supabase
        .from('service_logs')
        .insert({
          appointment_id: appointmentId,
          employee_id: employeeId,
          start_time: startTime,
          end_time: endTime,
          hours_worked: timeData.hours,
          notes: timeData.description,
          status: 'in_progress',
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) return handleSupabaseError(error);

      return { success: true, data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  updateServiceStatus: async (serviceId: string, status: string, progress: number, notes?: string) => {
    try {
      const employeeId = await getEmployeeId();
      if (!employeeId) return { success: false, error: 'Not authenticated' };

      const appointmentId = parseInt(serviceId);

      // Use the manually provided progress percentage
      // Auto-set to 100 if status is completed, otherwise use the provided value
      const progressPercentage = status === 'completed' ? 100 : progress;

      const { data, error } = await supabase
        .from('service_logs')
        .insert({
          appointment_id: appointmentId,
          employee_id: employeeId,
          start_time: new Date().toISOString(),
          status: status as any,
          progress_percentage: progressPercentage,
          notes: notes || `Status changed to ${status} (${progressPercentage}% complete)`,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) return handleSupabaseError(error);

      // Also update appointment status if completed
      if (status === 'completed') {
        await supabase
          .from('appointments')
          .update({ status: 'completed', updated_at: new Date().toISOString() })
          .eq('id', appointmentId);
      }

      return { success: true, data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  getUpcomingAppointments: async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          vehicle:vehicles(*),
          customer:customers(first_name, last_name, phone),
          service:services(name)
        `)
        .gte('scheduled_date', new Date().toISOString())
        .order('scheduled_date', { ascending: true });

      if (error) return handleSupabaseError(error);

      const formatted = data?.map((apt: any) => {
        const aptDate = new Date(apt.scheduled_date);
        return {
          id: apt.id,
          vehicleName: `${apt.vehicle.year} ${apt.vehicle.make} ${apt.vehicle.model}`,
          customerName: `${apt.customer.first_name} ${apt.customer.last_name}`,
          customerPhone: apt.customer.phone,
          serviceType: apt.service?.name || 'Service',
          date: aptDate.toISOString().split('T')[0],
          time: aptDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          status: apt.status,
        };
      });

      return { success: true, data: formatted };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  getTimeLogs: async (serviceId?: string) => {
    try {
      const employeeId = await getEmployeeId();
      if (!employeeId) return { success: false, error: 'Not authenticated' };

      let query = supabase
        .from('service_logs')
        .select(`
          *,
          appointment:appointments(
            *,
            vehicle:vehicles(*),
            service:services(name)
          )
        `)
        .eq('employee_id', employeeId)
        .order('start_time', { ascending: false });

      if (serviceId) {
        query = query.eq('appointment_id', parseInt(serviceId));
      }

      const { data, error } = await query;

      if (error) return handleSupabaseError(error);

      const formatted = data?.map((log: any) => ({
        id: log.id,
        serviceName: `${log.appointment.vehicle.year} ${log.appointment.vehicle.make} ${log.appointment.vehicle.model} - ${log.appointment.service?.name || 'Service'}`,
        hours: log.hours_worked || 0,
        description: log.notes || '',
        date: new Date(log.start_time).toISOString().split('T')[0],
      }));

      return { success: true, data: formatted };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
};

// Admin API
export const adminAPI = {
  getAllUsers: async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          customer:customers(*),
          employee:employees(*)
        `)
        .order('created_at', { ascending: false });

      if (error) return handleSupabaseError(error);

      const formatted = data?.map((user: any) => {
        let name = 'Admin User';
        let phone = null;
        let employeeId = null;
        let customerId = null;

        // Handle customer data (could be object or array)
        const customerData = Array.isArray(user.customer) ? user.customer[0] : user.customer;
        // Handle employee data (could be object or array)
        const employeeData = Array.isArray(user.employee) ? user.employee[0] : user.employee;

        if (customerData) {
          name = `${customerData.first_name} ${customerData.last_name}`;
          phone = customerData.phone;
          customerId = customerData.id;
        } else if (employeeData) {
          name = `${employeeData.first_name} ${employeeData.last_name}`;
          phone = employeeData.phone;
          employeeId = employeeData.id;
        }

        return {
          id: user.id,
          email: user.email,
          name,
          phone,
          role: user.role,
          isActive: user.is_active,
          createdAt: user.created_at,
          employeeId,
          customerId,
        };
      });

      return { success: true, data: formatted };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  updateUserRole: async (userId: string, role: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('id', parseInt(userId))
        .select()
        .single();

      if (error) return handleSupabaseError(error);

      return { success: true, data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  deleteUser: async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', parseInt(userId));

      if (error) return handleSupabaseError(error);

      return { success: true };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  getAllServices: async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          vehicle:vehicles(*),
          customer:customers(first_name, last_name),
          service:services(name),
          service_logs(
            employee:employees(id, first_name, last_name),
            status,
            progress_percentage
          )
        `)
        .order('created_at', { ascending: false });

      if (error) return handleSupabaseError(error);

      const formatted = data?.map((apt: any) => {
        const latestLog = apt.service_logs?.[apt.service_logs.length - 1];
        return {
          id: apt.id,
          vehicleName: `${apt.vehicle.year} ${apt.vehicle.make} ${apt.vehicle.model}`,
          customerName: `${apt.customer.first_name} ${apt.customer.last_name}`,
          serviceType: apt.service?.name || 'Service',
          status: latestLog?.status || apt.status,
          progress: latestLog?.progress_percentage || 0,
          assignedEmployee: latestLog?.employee ? 
            `${latestLog.employee.first_name} ${latestLog.employee.last_name}` : null,
          assignedEmployeeId: latestLog?.employee?.id || null,
          startDate: apt.scheduled_date,
          vehicle: {
            id: apt.vehicle.id,
            make: apt.vehicle.make,
            model: apt.vehicle.model,
            year: apt.vehicle.year,
            exterior_image_1: apt.vehicle.exterior_image_1,
            exterior_image_2: apt.vehicle.exterior_image_2,
            interior_image: apt.vehicle.interior_image,
          },
        };
      });

      return { success: true, data: formatted };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  assignServiceToEmployee: async (serviceId: string, employeeId: string) => {
    try {
      const appointmentId = parseInt(serviceId);
      const empId = parseInt(employeeId);

      console.log('Assigning service:', { serviceId, appointmentId, employeeId, empId });

      // Verify employee exists
      const { data: employee, error: employeeError } = await supabase
        .from('employees')
        .select('id, first_name, last_name')
        .eq('id', empId)
        .single();

      console.log('Employee lookup result:', { employee, employeeError });

      if (employeeError || !employee) {
        console.error('Employee not found:', { empId, employeeError });
        return { 
          success: false, 
          error: `Employee not found with ID ${empId}. Error: ${employeeError?.message || 'Unknown'}` 
        };
      }

      // Create a service log entry for this assignment
      const { data, error } = await supabase
        .from('service_logs')
        .insert({
          appointment_id: appointmentId,
          employee_id: empId,
          start_time: new Date().toISOString(),
          status: 'in_progress',
          notes: 'Service assigned',
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating service log:', error);
        return handleSupabaseError(error);
      }

      // Update appointment status
      await supabase
        .from('appointments')
        .update({ status: 'in_progress', updated_at: new Date().toISOString() })
        .eq('id', appointmentId);

      console.log('Service assigned successfully');
      return { success: true, data };
    } catch (error) {
      console.error('Exception in assignServiceToEmployee:', error);
      return handleSupabaseError(error);
    }
  },

  getAllAppointments: async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          vehicle:vehicles(*),
          customer:customers(first_name, last_name, user:users(email)),
          service:services(name)
        `)
        .order('scheduled_date', { ascending: false });

      if (error) return handleSupabaseError(error);

      const formatted = data?.map((apt: any) => {
        const aptDate = new Date(apt.scheduled_date);
        return {
          id: apt.id,
          vehicleName: `${apt.vehicle.year} ${apt.vehicle.make} ${apt.vehicle.model}`,
          customerName: `${apt.customer.first_name} ${apt.customer.last_name}`,
          customerEmail: apt.customer.user?.email || '',
          serviceType: apt.service?.name || 'Service',
          date: aptDate.toISOString().split('T')[0],
          time: aptDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          status: apt.status,
        };
      });

      return { success: true, data: formatted };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  getReports: async (type: string, startDate?: string, endDate?: string) => {
    return {
      success: true,
      data: {
        totalRecords: 100,
        totalAmount: 50000,
        average: 500,
        growth: 15,
      },
    };
  },

  getDashboardStats: async () => {
    try {
      const [customersResult, employeesResult, activeAptsResult, completedAptsResult, pendingAptsResult] = await Promise.all([
        supabase.from('customers').select('id', { count: 'exact', head: true }),
        supabase.from('employees').select('id', { count: 'exact', head: true }),
        supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('status', 'in_progress'),
        supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
        supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('status', 'scheduled'),
      ]);

      return {
        success: true,
        data: {
          totalCustomers: customersResult.count || 0,
          totalEmployees: employeesResult.count || 0,
          activeServices: activeAptsResult.count || 0,
          completedServices: completedAptsResult.count || 0,
          pendingAppointments: pendingAptsResult.count || 0,
          revenue: 0,
        },
      };
    } catch (error) {
      return handleSupabaseError(error);
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
      // Hash password
      const passwordHash = await bcrypt.hash(employeeData.password, 10);

      // Create user
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          email: employeeData.email,
          password_hash: passwordHash,
          role: 'employee',
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (userError) return handleSupabaseError(userError);

      // Create employee profile
      const { data: newEmployee, error: employeeError } = await supabase
        .from('employees')
        .insert({
          user_id: newUser.id,
          first_name: employeeData.firstName,
          last_name: employeeData.lastName,
          phone: employeeData.phone,
          position: employeeData.position || 'Technician',
          hire_date: new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (employeeError) {
        // Rollback user creation if employee profile fails
        await supabase.from('users').delete().eq('id', newUser.id);
        return handleSupabaseError(employeeError);
      }

      return { success: true, data: newEmployee };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  getAllModificationRequests: async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          customer:customers(first_name, last_name, phone),
          vehicle:vehicles(year, make, model, license_plate)
        `)
        .eq('project_type', 'modification')
        .order('created_at', { ascending: false });

      if (error) return handleSupabaseError(error);

      const formatted = data?.map((project: any) => ({
        id: project.id,
        customerName: `${project.customer.first_name} ${project.customer.last_name}`,
        customerPhone: project.customer.phone,
        vehicleName: `${project.vehicle.year} ${project.vehicle.make} ${project.vehicle.model}`,
        licensePlate: project.vehicle.license_plate,
        title: project.title,
        description: project.description,
        estimatedCost: project.estimated_cost,
        approvedCost: project.actual_cost,
        status: project.status || 'pending',
        createdAt: project.created_at,
      }));

      return { success: true, data: formatted };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  updateModificationStatus: async (projectId: string, status: string, approvedCost?: number) => {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString(),
      };

      // If approving and approved cost is provided, update the actual cost
      if (status === 'approved' && approvedCost !== undefined) {
        updateData.actual_cost = approvedCost;
      }

      const { data, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', parseInt(projectId))
        .select()
        .single();

      if (error) return handleSupabaseError(error);

      return { success: true, data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
};
