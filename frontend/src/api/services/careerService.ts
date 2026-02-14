/**
 * Career Service
 * API service for career positions and job applications
 */

import { api } from '../client';
import { API_ENDPOINTS } from '../config';
import type { CareerPosition, JobApplication, ApiResponse } from '../types';

export const careerService = {
  // ==================== PUBLIC ENDPOINTS ====================
  
  /**
   * Get all active career positions (Public)
   */
  getActivePositions: async (): Promise<ApiResponse<CareerPosition[]>> => {
    return api.get<CareerPosition[]>(API_ENDPOINTS.CAREER.POSITIONS);
  },

  /**
   * Get career position by ID (Public)
   */
  getPositionById: async (id: number): Promise<ApiResponse<CareerPosition>> => {
    return api.get<CareerPosition>(API_ENDPOINTS.CAREER.GET_POSITION(id));
  },

  /**
   * Submit job application (Public)
   * Requires FormData with resume file
   */
  submitApplication: async (data: FormData): Promise<ApiResponse<JobApplication>> => {
    return api.upload<JobApplication>(API_ENDPOINTS.CAREER.SUBMIT_APPLICATION, data);
  },

  // ==================== ADMIN ENDPOINTS ====================

  /**
   * Get all career positions (Admin)
   */
  getAllPositions: async (params?: {
    status?: string;
    department?: string;
    type?: string;
  }): Promise<ApiResponse<CareerPosition[]>> => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.department) queryParams.append('department', params.department);
    if (params?.type) queryParams.append('type', params.type);
    
    const url = `${API_ENDPOINTS.CAREER.ADMIN_POSITIONS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<CareerPosition[]>(url);
  },

  /**
   * Create career position (Admin)
   * Supports both JSON and FormData (for notice file uploads)
   */
  createPosition: async (data: FormData): Promise<ApiResponse<CareerPosition>> => {
    return api.upload<CareerPosition>(API_ENDPOINTS.CAREER.CREATE_POSITION, data);
  },

  /**
   * Update career position (Admin)
   * Supports both JSON and FormData (for notice file uploads)
   */
  updatePosition: async (id: number, data: FormData): Promise<ApiResponse<CareerPosition>> => {
    return api.upload<CareerPosition>(API_ENDPOINTS.CAREER.UPDATE_POSITION(id), data);
  },

  /**
   * Delete career position (Admin)
   */
  deletePosition: async (id: number): Promise<ApiResponse<void>> => {
    return api.delete<void>(API_ENDPOINTS.CAREER.DELETE_POSITION(id));
  },

  /**
   * Get all job applications (Admin)
   */
  getAllApplications: async (params?: {
    positionId?: number;
    status?: string;
  }): Promise<ApiResponse<JobApplication[]>> => {
    const queryParams = new URLSearchParams();
    if (params?.positionId) queryParams.append('positionId', params.positionId.toString());
    if (params?.status) queryParams.append('status', params.status);
    
    const url = `${API_ENDPOINTS.CAREER.ADMIN_APPLICATIONS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<JobApplication[]>(url);
  },

  /**
   * Get job application by ID (Admin)
   */
  getApplicationById: async (id: number): Promise<ApiResponse<JobApplication>> => {
    return api.get<JobApplication>(API_ENDPOINTS.CAREER.GET_APPLICATION(id));
  },

  /**
   * Update application status (Admin)
   */
  updateApplicationStatus: async (
    id: number,
    data: { status?: string; notes?: string }
  ): Promise<ApiResponse<JobApplication>> => {
    return api.patch<JobApplication>(API_ENDPOINTS.CAREER.UPDATE_APPLICATION(id), data);
  },

  /**
   * Delete job application (Admin)
   */
  deleteApplication: async (id: number): Promise<ApiResponse<void>> => {
    return api.delete<void>(API_ENDPOINTS.CAREER.DELETE_APPLICATION(id));
  },
};
