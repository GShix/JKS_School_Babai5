/**
 * Error Handler Utility
 * Utilities for handling and displaying API errors
 */

import type { ApiError } from '../api/types';

/**
 * Extract error message from API error
 */
export const getErrorMessage = (error: unknown): string => {
  if (!error) return 'An unknown error occurred';

  // API Error
  if (typeof error === 'object' && 'message' in error) {
    const apiError = error as ApiError;
    
    // If there are validation errors, combine them
    if (apiError.errors) {
      const errorMessages = Object.values(apiError.errors)
        .flat()
        .join(', ');
      return errorMessages || apiError.message;
    }
    
    return apiError.message;
  }

  // Standard Error
  if (error instanceof Error) {
    return error.message;
  }

  // String error
  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
};

/**
 * Display error notification
 * You can replace this with your preferred notification library
 */
export const showError = (error: unknown): void => {
  const message = getErrorMessage(error);
  
  // Using browser's alert for now
  // Replace with toast notification library (e.g., react-hot-toast, react-toastify)
  console.error('Error:', message);
  alert(`Error: ${message}`);
};

/**
 * Display success notification
 */
export const showSuccess = (message: string): void => {
  // Using browser's alert for now
  // Replace with toast notification library
  console.log('Success:', message);
  alert(`Success: ${message}`);
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (typeof error === 'object' && error !== null && 'error' in error) {
    const apiError = error as ApiError;
    return apiError.error === 'NETWORK_ERROR' || apiError.statusCode === 0;
  }
  return false;
};

/**
 * Check if error is an authentication error
 */
export const isAuthError = (error: unknown): boolean => {
  if (typeof error === 'object' && error !== null && 'statusCode' in error) {
    const apiError = error as ApiError;
    return apiError.statusCode === 401;
  }
  return false;
};

/**
 * Check if error is a validation error
 */
export const isValidationError = (error: unknown): boolean => {
  if (typeof error === 'object' && error !== null && 'errors' in error) {
    const apiError = error as ApiError;
    return !!apiError.errors && Object.keys(apiError.errors).length > 0;
  }
  return false;
};

/**
 * Get validation errors as an object
 */
export const getValidationErrors = (error: unknown): Record<string, string[]> | null => {
  if (isValidationError(error)) {
    const apiError = error as ApiError;
    return apiError.errors || null;
  }
  return null;
};

/**
 * Format error for display in forms
 */
export const formatFieldError = (error: unknown, fieldName: string): string | undefined => {
  const validationErrors = getValidationErrors(error);
  if (validationErrors && validationErrors[fieldName]) {
    return validationErrors[fieldName][0];
  }
  return undefined;
};
