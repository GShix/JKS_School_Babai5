import { SERVER_URL } from '../api/config';

/**
 * Get the correct image URL for display
 * Handles both absolute Supabase URLs and relative legacy URLs
 */
export const getImageUrl = (url: string | undefined): string => {
  if (!url) return '';
  
  // If URL already starts with http:// or https://, it's an absolute URL from Supabase
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Otherwise, it's a relative URL (legacy uploads), prepend SERVER_URL
  return `${SERVER_URL}${url}`;
};
