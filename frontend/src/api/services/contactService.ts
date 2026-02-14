/**
 * Contact Service
 * API service for contact form submissions
 */

import { api } from '../client';
import type { Contact, ContactFormData, ApiResponse } from '../types';

export const contactService = {
  /**
   * Submit contact form (Public)
   */
  submit: async (data: ContactFormData): Promise<ApiResponse<Contact>> => {
    return api.post<Contact>('/contacts', data);
  },

  /**
   * Get all contacts (Admin only)
   * @param status - Optional filter by status: 'pending', 'contacted', 'resolved'
   */
  getAll: async (status?: string): Promise<ApiResponse<Contact[]>> => {
    const queryParam = status ? `?status=${status}` : '';
    return api.get<Contact[]>(`/contacts${queryParam}`);
  },

  /**
   * Get contact by ID (Admin only)
   */
  getById: async (id: number): Promise<ApiResponse<Contact>> => {
    return api.get<Contact>(`/contacts/${id}`);
  },

  /**
   * Update contact status/notes (Admin only)
   */
  update: async (id: number, data: Partial<Contact>): Promise<ApiResponse<Contact>> => {
    return api.put<Contact>(`/contacts/${id}`, data);
  },

  /**
   * Delete contact (Admin only)
   */
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return api.delete<void>(`/contacts/${id}`);
  },
};
