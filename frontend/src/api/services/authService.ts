/**
 * Authentication Service
 * API service for authentication and authorization
 */

import { api } from "../client";
import { API_ENDPOINTS, TOKEN_KEY } from "../config";
import type { LoginRequest, LoginResponse, ApiResponse } from "../types";

export const authService = {
  /**
   * Admin login
   */
  adminLogin: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.postDirect<LoginResponse>(
      API_ENDPOINTS.AUTH.ADMIN_LOGIN,
      credentials,
    );

    // Store token based on rememberMe preference
    if (response.token) {
      const storage = credentials.rememberMe ? localStorage : sessionStorage;
      storage.setItem(TOKEN_KEY, response.token);
    }

    return response;
  },

  /**
   * Student login
   */
  studentLogin: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.postDirect<LoginResponse>(
      API_ENDPOINTS.AUTH.STUDENT_LOGIN,
      credentials,
    );

    // Store token based on rememberMe preference
    if (response.token) {
      const storage = credentials.rememberMe ? localStorage : sessionStorage;
      storage.setItem(TOKEN_KEY, response.token);
    }

    return response;
  },

  /**
   * Admin register
   */
  adminRegister: async (data: any): Promise<ApiResponse> => {
    return api.post(API_ENDPOINTS.AUTH.ADMIN_REGISTER, data);
  },

  /**
   * Student register
   */
  studentRegister: async (data: any): Promise<ApiResponse> => {
    return api.post(API_ENDPOINTS.AUTH.STUDENT_REGISTER, data);
  },

  /**
   * Logout
   */
  logout: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    window.location.href = "/admin/login";
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!(
      localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
    );
  },

  /**
   * Get stored token
   */
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  },
};
