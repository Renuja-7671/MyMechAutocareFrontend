import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey);

// Enums
export type Role = 'customer' | 'employee' | 'admin';
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
export type ProjectStatus = 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type ServiceStatus = 'not_started' | 'in_progress' | 'completed' | 'on_hold';

// Database types based on Prisma schema
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: number;
          email: string;
          password_hash: string;
          role: Role;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          email: string;
          password_hash: string;
          role: Role;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          email?: string;
          password_hash?: string;
          role?: Role;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: number;
          user_id: number;
          first_name: string;
          last_name: string;
          phone: string | null;
          address: string | null;
          city: string | null;
          postal_code: string | null;
          date_of_birth: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: number;
          first_name: string;
          last_name: string;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          postal_code?: string | null;
          date_of_birth?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: number;
          first_name?: string;
          last_name?: string;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          postal_code?: string | null;
          date_of_birth?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      employees: {
        Row: {
          id: number;
          user_id: number;
          first_name: string;
          last_name: string;
          phone: string | null;
          department: string | null;
          position: string | null;
          hire_date: string;
          hourly_rate: number | null;
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: number;
          first_name: string;
          last_name: string;
          phone?: string | null;
          department?: string | null;
          position?: string | null;
          hire_date: string;
          hourly_rate?: number | null;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: number;
          first_name?: string;
          last_name?: string;
          phone?: string | null;
          department?: string | null;
          position?: string | null;
          hire_date?: string;
          hourly_rate?: number | null;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      vehicles: {
        Row: {
          id: number;
          customer_id: number;
          make: string;
          model: string;
          year: number;
          vin: string | null;
          license_plate: string | null;
          color: string | null;
          mileage: number | null;
          exterior_image_1: string | null;
          exterior_image_2: string | null;
          interior_image: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          customer_id: number;
          make: string;
          model: string;
          year: number;
          vin?: string | null;
          license_plate?: string | null;
          color?: string | null;
          mileage?: number | null;
          exterior_image_1?: string | null;
          exterior_image_2?: string | null;
          interior_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          customer_id?: number;
          make?: string;
          model?: string;
          year?: number;
          vin?: string | null;
          license_plate?: string | null;
          color?: string | null;
          mileage?: number | null;
          exterior_image_1?: string | null;
          exterior_image_2?: string | null;
          interior_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          category: string | null;
          estimated_duration: number | null;
          base_price: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string | null;
          category?: string | null;
          estimated_duration?: number | null;
          base_price?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string | null;
          category?: string | null;
          estimated_duration?: number | null;
          base_price?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      appointments: {
        Row: {
          id: number;
          customer_id: number;
          vehicle_id: number;
          service_id: number | null;
          scheduled_date: string;
          status: AppointmentStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          customer_id: number;
          vehicle_id: number;
          service_id?: number | null;
          scheduled_date: string;
          status?: AppointmentStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          customer_id?: number;
          vehicle_id?: number;
          service_id?: number | null;
          scheduled_date?: string;
          status?: AppointmentStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: number;
          customer_id: number;
          vehicle_id: number;
          title: string;
          description: string;
          project_type: string | null;
          status: ProjectStatus;
          priority: Priority;
          estimated_cost: number | null;
          actual_cost: number | null;
          start_date: string | null;
          end_date: string | null;
          approved_by: number | null;
          approved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          customer_id: number;
          vehicle_id: number;
          title: string;
          description: string;
          project_type?: string | null;
          status?: ProjectStatus;
          priority?: Priority;
          estimated_cost?: number | null;
          actual_cost?: number | null;
          start_date?: string | null;
          end_date?: string | null;
          approved_by?: number | null;
          approved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          customer_id?: number;
          vehicle_id?: number;
          title?: string;
          description?: string;
          project_type?: string | null;
          status?: ProjectStatus;
          priority?: Priority;
          estimated_cost?: number | null;
          actual_cost?: number | null;
          start_date?: string | null;
          end_date?: string | null;
          approved_by?: number | null;
          approved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      service_logs: {
        Row: {
          id: number;
          appointment_id: number;
          employee_id: number;
          start_time: string;
          end_time: string | null;
          hours_worked: number | null;
          progress_percentage: number;
          status: ServiceStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          appointment_id: number;
          employee_id: number;
          start_time: string;
          end_time?: string | null;
          hours_worked?: number | null;
          progress_percentage?: number;
          status?: ServiceStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          appointment_id?: number;
          employee_id?: number;
          start_time?: string;
          end_time?: string | null;
          hours_worked?: number | null;
          progress_percentage?: number;
          status?: ServiceStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      project_logs: {
        Row: {
          id: number;
          project_id: number;
          employee_id: number;
          log_date: string;
          hours_logged: number;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          project_id: number;
          employee_id: number;
          log_date: string;
          hours_logged: number;
          description: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          project_id?: number;
          employee_id?: number;
          log_date?: string;
          hours_logged?: number;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      parts: {
        Row: {
          id: number;
          name: string;
          part_number: string | null;
          description: string | null;
          category: string | null;
          quantity_in_stock: number;
          unit_price: number | null;
          reorder_level: number;
          supplier: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          part_number?: string | null;
          description?: string | null;
          category?: string | null;
          quantity_in_stock?: number;
          unit_price?: number | null;
          reorder_level?: number;
          supplier?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          part_number?: string | null;
          description?: string | null;
          category?: string | null;
          quantity_in_stock?: number;
          unit_price?: number | null;
          reorder_level?: number;
          supplier?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      service_parts: {
        Row: {
          id: number;
          service_log_id: number | null;
          project_log_id: number | null;
          part_id: number;
          quantity_used: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          service_log_id?: number | null;
          project_log_id?: number | null;
          part_id: number;
          quantity_used: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          service_log_id?: number | null;
          project_log_id?: number | null;
          part_id?: number;
          quantity_used?: number;
          created_at?: string;
        };
      };
      feedback: {
        Row: {
          id: number;
          customer_id: number;
          appointment_id: number | null;
          project_id: number | null;
          rating: number | null;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          customer_id: number;
          appointment_id?: number | null;
          project_id?: number | null;
          rating?: number | null;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          customer_id?: number;
          appointment_id?: number | null;
          project_id?: number | null;
          rating?: number | null;
          comment?: string | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: number;
          user_id: number;
          title: string;
          message: string;
          type: string;
          is_read: boolean;
          related_entity_type: string | null;
          related_entity_id: number | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: number;
          title: string;
          message: string;
          type: string;
          is_read?: boolean;
          related_entity_type?: string | null;
          related_entity_id?: number | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: number;
          title?: string;
          message?: string;
          type?: string;
          is_read?: boolean;
          related_entity_type?: string | null;
          related_entity_id?: number | null;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: number;
          sender_id: number;
          receiver_id: number;
          related_entity_type: string | null;
          related_entity_id: number | null;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          sender_id: number;
          receiver_id: number;
          related_entity_type?: string | null;
          related_entity_id?: number | null;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          sender_id?: number;
          receiver_id?: number;
          related_entity_type?: string | null;
          related_entity_id?: number | null;
          message?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: number;
          user_id: number | null;
          action: string;
          entity_type: string;
          entity_id: number | null;
          changes: any | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id?: number | null;
          action: string;
          entity_type: string;
          entity_id?: number | null;
          changes?: any | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: number | null;
          action?: string;
          entity_type?: string;
          entity_id?: number | null;
          changes?: any | null;
          ip_address?: string | null;
          created_at?: string;
        };
      };
    };
  };
};
