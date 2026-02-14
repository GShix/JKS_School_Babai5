/**
 * Hero Slide Service
 * API service for hero slider management
 */

import { api } from '../client';
import type { ApiResponse } from '../types';

export interface HeroSlide {
  id: number;
  title: string | null;
  imageUrl: string;
  displayOrder: number;
  status: 'active' | 'inactive';
  uploadedBy: number;
  createdAt: string;
  updatedAt: string;
}

const BASE_URL = '/hero-slides';

/**
 * Normalize hero slide data from API response
 */
const normalizeHeroSlide = (slide: any): HeroSlide => {
  if (!slide) {
    throw new Error('Cannot normalize null or undefined hero slide');
  }
  return {
    ...slide,
    status: slide.status || 'active',
    displayOrder: slide.displayOrder || 0,
    title: slide.title || null,
  };
};

export const heroSlideService = {
  /**
   * Get all hero slides (admin)
   */
  getAll: async (params?: {
    status?: string;
  }): Promise<ApiResponse<HeroSlide[]>> => {
    const response = await api.get<HeroSlide[]>(BASE_URL, { params });
    
    if (response.data) {
      response.data = response.data
        .filter(item => item != null)
        .map(normalizeHeroSlide);
    }
    
    return response;
  },

  /**
   * Get active hero slides (public)
   */
  getActive: async (): Promise<ApiResponse<HeroSlide[]>> => {
    const response = await api.get<HeroSlide[]>(`${BASE_URL}/active`);
    
    if (response.data) {
      response.data = response.data
        .filter(item => item != null)
        .map(normalizeHeroSlide);
    }
    
    return response;
  },

  /**
   * Get hero slide by ID
   */
  getById: async (id: number): Promise<ApiResponse<HeroSlide>> => {
    const response = await api.get<HeroSlide>(`${BASE_URL}/${id}`);
    
    if (response.data) {
      response.data = normalizeHeroSlide(response.data);
    }
    
    return response;
  },

  /**
   * Create new hero slide
   * @param data - FormData containing image and slide information
   */
  create: async (data: FormData): Promise<ApiResponse<HeroSlide>> => {
    const response = await api.upload<HeroSlide>(`${BASE_URL}/create`, data);
    
    if (response.data) {
      response.data = normalizeHeroSlide(response.data);
    }
    
    return response;
  },

  /**
   * Update hero slide
   * @param id - Hero slide ID
   * @param data - FormData or object with updated data
   */
  update: async (id: number, data: FormData): Promise<ApiResponse<HeroSlide>> => {
    const response = await api.upload<HeroSlide>(`${BASE_URL}/${id}`, data, 'PUT');
    
    if (response.data) {
      response.data = normalizeHeroSlide(response.data);
    }
    
    return response;
  },

  /**
   * Delete hero slide
   */
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return await api.delete(`${BASE_URL}/${id}`);
  },

  /**
   * Reorder hero slides
   * @param slides - Array of {id, displayOrder}
   */
  reorder: async (slides: Array<{ id: number; displayOrder: number }>): Promise<ApiResponse<void>> => {
    return await api.patch(`${BASE_URL}/reorder`, { slides });
  },
};
