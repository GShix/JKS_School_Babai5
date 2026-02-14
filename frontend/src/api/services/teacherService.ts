/**
 * Teacher Service
 * API service for teacher management
 */

import { api } from '../client';
import { API_ENDPOINTS } from '../config';
import type { Teacher, TeacherFormData, ApiResponse } from '../types';

export const teacherService = {
  /**
   * Get all teachers
   */
  getAll: async (): Promise<ApiResponse<Teacher[]>> => {
    return api.get<Teacher[]>(API_ENDPOINTS.TEACHERS.BASE);
  },

  /**
   * Get teacher by ID
   */
  getById: async (id: number): Promise<ApiResponse<Teacher>> => {
    return api.get<Teacher>(API_ENDPOINTS.TEACHERS.GET_BY_ID(id));
  },

  /**
   * Get teachers by department
   */
  getByDepartment: async (department: string): Promise<ApiResponse<Teacher[]>> => {
    return api.get<Teacher[]>(API_ENDPOINTS.TEACHERS.GET_BY_DEPARTMENT(department));
  },

  /**
   * Get teachers by status
   */
  getByStatus: async (status: string): Promise<ApiResponse<Teacher[]>> => {
    return api.get<Teacher[]>(API_ENDPOINTS.TEACHERS.GET_BY_STATUS(status));
  },

  /**
   * Create new teacher
   * Supports both JSON and FormData (for image uploads)
   */
  create: async (data: TeacherFormData | FormData): Promise<ApiResponse<Teacher>> => {
    if (data instanceof FormData) {
      return api.upload<Teacher>(API_ENDPOINTS.TEACHERS.CREATE, data);
    }
    return api.post<Teacher>(API_ENDPOINTS.TEACHERS.CREATE, data);
  },

  /**
   * Update teacher
   * Supports both JSON and FormData (for image uploads)
   */
  update: async (id: number, data: Partial<TeacherFormData> | FormData): Promise<ApiResponse<Teacher>> => {
    if (data instanceof FormData) {
      return api.upload<Teacher>(API_ENDPOINTS.TEACHERS.UPDATE(id), data);
    }
    return api.put<Teacher>(API_ENDPOINTS.TEACHERS.UPDATE(id), data);
  },

  /**
   * Delete teacher
   */
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return api.delete<void>(API_ENDPOINTS.TEACHERS.DELETE(id));
  },
};
