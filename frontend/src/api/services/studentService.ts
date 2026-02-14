/**
 * Student Service
 * API service for student management
 */

import { api } from '../client';
import { API_ENDPOINTS } from '../config';
import type { Student, StudentFormData, ApiResponse } from '../types';

export const studentService = {
  /**
   * Get all students
   */
  getAll: async (): Promise<ApiResponse<Student[]>> => {
    return api.get<Student[]>(API_ENDPOINTS.STUDENTS.BASE);
  },

  /**
   * Get student by ID
   */
  getById: async (id: number): Promise<ApiResponse<Student>> => {
    return api.get<Student>(API_ENDPOINTS.STUDENTS.GET_BY_ID(id));
  },

  /**
   * Get students by class
   */
  getByClass: async (className: string): Promise<ApiResponse<Student[]>> => {
    return api.get<Student[]>(API_ENDPOINTS.STUDENTS.GET_BY_CLASS(className));
  },

  /**
   * Create new student
   * Supports both JSON and FormData (for image uploads)
   */
  create: async (data: StudentFormData | FormData): Promise<ApiResponse<Student>> => {
    if (data instanceof FormData) {
      return api.upload<Student>(API_ENDPOINTS.STUDENTS.CREATE, data);
    }
    return api.post<Student>(API_ENDPOINTS.STUDENTS.CREATE, data);
  },

  /**
   * Update student
   * Supports both JSON and FormData (for image uploads)
   */
  update: async (id: number, data: Partial<StudentFormData> | FormData): Promise<ApiResponse<Student>> => {
    if (data instanceof FormData) {
      return api.upload<Student>(API_ENDPOINTS.STUDENTS.UPDATE(id), data);
    }
    return api.put<Student>(API_ENDPOINTS.STUDENTS.UPDATE(id), data);
  },

  /**
   * Delete student
   */
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return api.delete<void>(API_ENDPOINTS.STUDENTS.DELETE(id));
  },
};
