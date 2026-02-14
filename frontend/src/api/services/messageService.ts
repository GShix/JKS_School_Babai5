/**
 * Message Service
 * API service for school messages (Principal message, etc.)
 */

import { api } from '../client';
import type { SchoolMessage, SchoolMessageFormData, ApiResponse } from '../types';

export const messageService = {
  /**
   * Get all messages
   * @param activeOnly - If true, returns only active messages
   */
  getAll: async (activeOnly: boolean = false): Promise<ApiResponse<SchoolMessage[]>> => {
    const queryParam = activeOnly ? '?active=true' : '';
    return api.get<SchoolMessage[]>(`/messages${queryParam}`);
  },

  /**
   * Get message by ID
   */
  getById: async (id: number): Promise<ApiResponse<SchoolMessage>> => {
    return api.get<SchoolMessage>(`/messages/${id}`);
  },

  /**
   * Create new message (Admin only)
   * Supports both JSON and FormData (for photo uploads)
   */
  create: async (data: SchoolMessageFormData | FormData): Promise<ApiResponse<SchoolMessage>> => {
    if (data instanceof FormData) {
      return api.upload<SchoolMessage>('/messages', data);
    }
    return api.post<SchoolMessage>('/messages', data);
  },

  /**
   * Update message (Admin only)
   * Supports both JSON and FormData (for photo uploads)
   */
  update: async (id: number, data: SchoolMessageFormData | FormData): Promise<ApiResponse<SchoolMessage>> => {
    if (data instanceof FormData) {
      return api.upload<SchoolMessage>(`/messages/${id}`, data, 'PUT');
    }
    return api.put<SchoolMessage>(`/messages/${id}`, data);
  },

  /**
   * Delete message (Admin only)
   */
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return api.delete<void>(`/messages/${id}`);
  },
};
