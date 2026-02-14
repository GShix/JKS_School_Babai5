/**
 * Announcement Service
 * API service for announcement management with RESTful approach
 */

import { api } from '../client';
import type { Announcement, ApiResponse } from '../types';

const BASE_URL = '/announcements';

/**
 * Normalize announcement data from API response
 * Ensures all fields have default values to prevent undefined errors
 */
const normalizeAnnouncement = (announcement: any): Announcement => {
  if (!announcement) {
    throw new Error('Cannot normalize null or undefined announcement');
  }
  return {
    ...announcement,
    priority: announcement.priority || 'medium',
    targetAudience: announcement.targetAudience || 'all',
    isPinned: announcement.isPinned || false,
    attachments: announcement.attachments || [],
    status: announcement.status || 'active',
    startDate: announcement.startDate || null,
    endDate: announcement.endDate || null,
    createdAt: announcement.createdAt || new Date().toISOString()
  };
};

export const announcementService = {

  getAll: async (params?: {
    targetAudience?: string;
    priority?: string;
    status?: string;
  }): Promise<ApiResponse<Announcement[]>> => {
    const response = await api.get<Announcement[]>(BASE_URL, { params });
    
    // Normalize data to ensure consistency and filter out null values
    if (response.data) {
      response.data = response.data
        .filter(item => item != null)
        .map(normalizeAnnouncement);
    }
    
    return response;
  },

  /**
   * Get announcement by ID
   * @param id - Announcement ID
   */
  getById: async (id: number): Promise<ApiResponse<Announcement>> => {
    const response = await api.get<Announcement>(`${BASE_URL}/${id}`);
    
    // Normalize data
    if (response.data) {
      response.data = normalizeAnnouncement(response.data);
    }
    
    return response;
  },

  /**
   * Create new announcement
   * Supports FormData for file uploads
   * @param data - Announcement data (FormData or object)
   */
  create: async (data: FormData): Promise<ApiResponse<Announcement>> => {
    const response = await api.upload<Announcement>(`${BASE_URL}/create`, data);
    
    // Normalize data
    if (response.data) {
      response.data = normalizeAnnouncement(response.data);
    }
    
    return response;
  },

  /**
   * Update announcement
   * Supports FormData for file uploads
   * @param id - Announcement ID
   * @param data - Updated announcement data
   */
  update: async (id: number, data: FormData): Promise<ApiResponse<Announcement>> => {
    const response = await api.upload<Announcement>(`${BASE_URL}/${id}`, data, 'PUT');
    
    // Normalize data
    if (response.data) {
      response.data = normalizeAnnouncement(response.data);
    }
    
    return response;
  },

  /**
   * Delete announcement
   * @param id - Announcement ID
   */
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return api.delete<void>(`${BASE_URL}/${id}`);
  },

  /**
   * Toggle pin status of announcement
   * @param id - Announcement ID
   * @param isPinned - New pin status
   */
  togglePin: async (id: number, isPinned: boolean): Promise<ApiResponse<Announcement>> => {
    const response = await api.patch<Announcement>(`${BASE_URL}/${id}/pin`, { isPinned });
    
    // Normalize data
    if (response.data) {
      response.data = normalizeAnnouncement(response.data);
    }
    
    return response;
  },

  /**
   * Get high priority announcements for modal
   * Filters for high/urgent priority announcements targeted to "all"
   */
  getHighPriority: async (): Promise<Announcement[]> => {
    const response = await announcementService.getAll();
    
    if (!response.data) return [];
    
    const today = new Date();
    
    return response.data
      .filter(announcement => announcement != null) // Extra safety check
      .filter(announcement => {
        const isHighPriority = announcement.priority === 'high' || announcement.priority === 'urgent';
        const isForAll = announcement.targetAudience === 'all';
        const endDate = announcement.endDate ? new Date(announcement.endDate) : null;
        const isActive = !endDate || endDate >= today;
        
        return isHighPriority && isForAll && isActive;
      })
      .sort((a, b) => {
        // Sort by: pinned first, then by priority (urgent > high), then by date
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
        if (a.priority !== 'urgent' && b.priority === 'urgent') return 1;
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
  }
};
