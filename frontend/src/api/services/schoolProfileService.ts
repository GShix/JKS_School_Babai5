/**
 * School Profile Service
 * API service for school profile management
 */

import { api } from "../client";
import type {
  SchoolProfileFormData,
  ApiResponse,
  SchoolProfile,
} from "../types";

export const schoolProfileService = {
  /**
   * Get school profile
   */
  get: async (): Promise<ApiResponse<SchoolProfile>> => {
    return api.get<SchoolProfile>("/school-profile");
  },

  /**
   * Update school profile (Admin only)
   */
  update: async (
    data: SchoolProfileFormData,
  ): Promise<ApiResponse<SchoolProfile>> => {
    return api.put<SchoolProfile>("/school-profile", data);
  },
};
