/**
 * Staff Service
 * API service for staff management
 */

import { api } from '../client';
import { API_ENDPOINTS } from '../config';
import type { Staff, StaffFormData, ApiResponse } from '../types';

export const staffService = {
  /**
   * Get all staff members
   */
  getAll: async (): Promise<ApiResponse<Staff[]>> => {
    return api.get<Staff[]>(API_ENDPOINTS.STAFF.BASE);
  },

  /**
   * Get staff by ID
   */
  getById: async (id: number): Promise<ApiResponse<Staff>> => {
    return api.get<Staff>(API_ENDPOINTS.STAFF.GET_BY_ID(id));
  },

  /**
   * Get staff by department
   */
  getByDepartment: async (department: string): Promise<ApiResponse<Staff[]>> => {
    return api.get<Staff[]>(API_ENDPOINTS.STAFF.GET_BY_DEPARTMENT(department));
  },

  /**
   * Get staff by status
   */
  getByStatus: async (status: string): Promise<ApiResponse<Staff[]>> => {
    return api.get<Staff[]>(API_ENDPOINTS.STAFF.GET_BY_STATUS(status));
  },

  /**
   * Create new staff member
   * Supports both JSON and FormData (for image uploads)
   */
  create: async (data: StaffFormData | FormData): Promise<ApiResponse<Staff>> => {
    if (data instanceof FormData) {
      return api.upload<Staff>(API_ENDPOINTS.STAFF.CREATE, data);
    }
    return api.post<Staff>(API_ENDPOINTS.STAFF.CREATE, data);
  },

  /**
   * Update staff member
   * Supports both JSON and FormData (for image uploads)
   */
  update: async (id: number, data: Partial<StaffFormData> | FormData): Promise<ApiResponse<Staff>> => {
    if (data instanceof FormData) {
      return api.upload<Staff>(API_ENDPOINTS.STAFF.UPDATE(id), data);
    }
    return api.put<Staff>(API_ENDPOINTS.STAFF.UPDATE(id), data);
  },

  /**
   * Delete staff member
   */
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return api.delete<void>(API_ENDPOINTS.STAFF.DELETE(id));
  },
};
