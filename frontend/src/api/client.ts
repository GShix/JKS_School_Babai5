/**
 * API Client
 * Configured Axios instance with interceptors for request/response handling
 */

import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, REQUEST_TIMEOUT, TOKEN_KEY } from './config';
import type { ApiError, ApiResponse } from './types';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Automatically adds authentication token to requests
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage or sessionStorage
    const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    
    // Add token to headers if available
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development mode
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles responses and errors globally
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development mode
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Log error in development mode
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
    }

    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem(TOKEN_KEY);
          sessionStorage.removeItem(TOKEN_KEY);
          
          // Only redirect if not already on login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;

        case 403:
          // Forbidden
          console.error('Access Forbidden:', data.message);
          break;

        case 404:
          // Not Found
          console.error('Resource Not Found:', data.message);
          break;

        case 500:
          // Server Error
          console.error('Server Error:', data.message);
          break;

        default:
          console.error('API Error:', data.message);
      }

      // Return formatted error
      return Promise.reject({
        message: data.message || 'An error occurred',
        error: data.error,
        errors: data.errors,
        statusCode: status,
      } as ApiError);
    } else if (error.request) {
      // Network Error
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        error: 'NETWORK_ERROR',
        statusCode: 0,
      } as ApiError);
    } else {
      // Other Error
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
        error: 'UNKNOWN_ERROR',
        statusCode: 0,
      } as ApiError);
    }
  }
);

/**
 * API Request Methods
 */
export const api = {
  /**
   * GET request
   */
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.get<ApiResponse<T>>(url, config).then((res) => res.data);
  },

  /**
   * POST request
   */
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.post<ApiResponse<T>>(url, data, config).then((res) => res.data);
  },

  /**
   * PUT request
   */
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.put<ApiResponse<T>>(url, data, config).then((res) => res.data);
  },

  /**
   * PATCH request
   */
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.patch<ApiResponse<T>>(url, data, config).then((res) => res.data);
  },

  /**
   * DELETE request
   */
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.delete<ApiResponse<T>>(url, config).then((res) => res.data);
  },

  /**
   * Upload file with FormData
   * @param method - HTTP method (POST or PUT), defaults to POST
   */
  upload: <T = any>(
    url: string, 
    formData: FormData, 
    method: 'POST' | 'PUT' = 'POST',
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const requestMethod = method === 'PUT' ? apiClient.put : apiClient.post;
    
    return requestMethod<ApiResponse<T>>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    }).then((res) => res.data);
  },
};

export default apiClient;
