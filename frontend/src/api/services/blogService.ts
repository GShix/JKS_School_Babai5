/**
 * Blog Service
 * API service for blog management
 */

import { api } from '../client';
import { API_ENDPOINTS } from '../config';
import type { Blog, BlogFormData, ApiResponse } from '../types';

export const blogService = {
  /**
   * Get all blogs
   */
  getAll: async (): Promise<ApiResponse<Blog[]>> => {
    return api.get<Blog[]>(API_ENDPOINTS.BLOGS.BASE);
  },

  /**
   * Get blog by ID
   */
  getById: async (id: number): Promise<ApiResponse<Blog>> => {
    return api.get<Blog>(API_ENDPOINTS.BLOGS.GET_BY_ID(id));
  },

  /**
   * Create new blog
   * Supports both JSON and FormData (for image uploads)
   */
  create: async (data: BlogFormData | FormData): Promise<ApiResponse<Blog>> => {
    if (data instanceof FormData) {
      return api.upload<Blog>(API_ENDPOINTS.BLOGS.CREATE, data);
    }
    return api.post<Blog>(API_ENDPOINTS.BLOGS.CREATE, data);
  },

  /**
   * Update blog
   * Supports both JSON and FormData (for image uploads)
   */
  update: async (id: number, data: Partial<BlogFormData> | FormData): Promise<ApiResponse<Blog>> => {
    if (data instanceof FormData) {
      return api.upload<Blog>(API_ENDPOINTS.BLOGS.UPDATE(id), data);
    }
    return api.put<Blog>(API_ENDPOINTS.BLOGS.UPDATE(id), data);
  },

  /**
   * Delete blog
   */
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return api.delete<void>(API_ENDPOINTS.BLOGS.DELETE(id));
  },
};
