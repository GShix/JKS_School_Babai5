/**
 * Content Service
 * API service for content management (school profile, etc.)
 */

import { api } from '../client';
import { API_ENDPOINTS } from '../config';
import type { ApiResponse } from '../types';

export interface SchoolProfile {
  id?: number;
  schoolName?: string;
  schoolNameNepali?: string;
  schoolTypeNepali?: string;
  aboutUsStory?: string;
  aboutUsDescription?: string;
  heroImage?: string;
  address?: string;
  phone?: string;
  email?: string;
  mapUrl?: string;
  establishedYear?: string;
  principalName?: string;
  principalMessage?: string;
  vision?: string;
  mission?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const contentService = {
  /**
   * Get school profile
   */
  getSchoolProfile: async (): Promise<ApiResponse<SchoolProfile>> => {
    return api.get<SchoolProfile>(API_ENDPOINTS.CONTENT.SCHOOL_PROFILE);
  },

  /**
   * Update school profile
   * @param data - School profile data
   */
  updateSchoolProfile: async (data: Partial<SchoolProfile> | FormData): Promise<ApiResponse<SchoolProfile>> => {
    if (data instanceof FormData) {
      return api.upload<SchoolProfile>(API_ENDPOINTS.CONTENT.UPDATE('school-profile'), data, 'PUT');
    }
    return api.put<SchoolProfile>(API_ENDPOINTS.CONTENT.UPDATE('school-profile'), data);
  },
};
