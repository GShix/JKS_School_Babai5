/**
 * Download Service
 * API service for download management (study materials, notes, question papers, etc.)
 */

import { api } from '../client';
import type { ApiResponse } from '../types';

export interface Download {
  id: number;
  title: string;
  description: string | null;
  category: 'notes' | 'question-papers' | 'solutions' | 'forms' | 'syllabus' | 'others';
  class: string | null;
  subject: string | null;
  fileUrl: string;
  fileName: string;
  fileType: 'pdf' | 'image';
  fileSize: string | null;
  downloads: number;
  status: 'active' | 'inactive';
  uploadedBy: number;
  academicYear: string | null;
  createdAt: string;
  updatedAt: string;
}

const BASE_URL = '/downloads';

/**
 * Normalize download data from API response
 */
const normalizeDownload = (download: any): Download => {
  if (!download) {
    throw new Error('Cannot normalize null or undefined download');
  }
  return {
    ...download,
    category: download.category || 'others',
    status: download.status || 'active',
    downloads: download.downloads || 0,
    description: download.description || null,
    class: download.class || null,
    subject: download.subject || null,
    fileSize: download.fileSize || null,
    academicYear: download.academicYear || null,
  };
};

export const downloadService = {
  /**
   * Get all downloads with optional filters
   */
  getAll: async (params?: {
    category?: string;
    class?: string;
    subject?: string;
    status?: string;
  }): Promise<ApiResponse<Download[]>> => {
    const response = await api.get<Download[]>(BASE_URL, { params });
    
    // Normalize data to ensure consistency and filter out null values
    if (response.data) {
      response.data = response.data
        .filter(item => item != null)
        .map(normalizeDownload);
    }
    
    return response;
  },

  /**
   * Get download by ID
   */
  getById: async (id: number): Promise<ApiResponse<Download>> => {
    const response = await api.get<Download>(`${BASE_URL}/${id}`);
    
    // Normalize data
    if (response.data) {
      response.data = normalizeDownload(response.data);
    }
    
    return response;
  },

  /**
   * Get downloads by category
   */
  getByCategory: async (category: string): Promise<ApiResponse<Download[]>> => {
    const response = await api.get<Download[]>(`${BASE_URL}/category/${category}`);
    
    // Normalize data
    if (response.data) {
      response.data = response.data
        .filter(item => item != null)
        .map(normalizeDownload);
    }
    
    return response;
  },

  /**
   * Create new download
   * @param data - FormData containing file and download information
   */
  create: async (data: FormData): Promise<ApiResponse<Download>> => {
    const response = await api.upload<Download>(`${BASE_URL}/create`, data);
    
    // Normalize data
    if (response.data) {
      response.data = normalizeDownload(response.data);
    }
    
    return response;
  },

  /**
   * Update download
   * @param id - Download ID
   * @param data - FormData or object with updated data
   */
  update: async (id: number, data: FormData): Promise<ApiResponse<Download>> => {
    const response = await api.upload<Download>(`${BASE_URL}/${id}`, data, 'PUT');
    
    // Normalize data
    if (response.data) {
      response.data = normalizeDownload(response.data);
    }
    
    return response;
  },

  /**
   * Delete download
   */
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return await api.delete(`${BASE_URL}/${id}`);
  },

  /**
   * Increment download count
   */
  incrementCount: async (id: number): Promise<ApiResponse<{ downloads: number }>> => {
    return await api.patch(`${BASE_URL}/${id}/count`);
  },
};
