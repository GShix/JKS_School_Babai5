import client from '../client';

export const galleryService = {
  // Public endpoints
  getAllGallery: (params?: { category?: string; featured?: boolean; status?: string }) => 
    client.get('/gallery', { params }),
  
  getFeaturedGallery: () => 
    client.get('/gallery', { params: { featured: true, status: 'active' } }),
  
  getSingleGallery: (id: number) => 
    client.get(`/gallery/${id}`),

  // Admin endpoints (require authentication)
  createGallery: (data: FormData) => 
    client.post('/gallery', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  updateGallery: (id: number, data: FormData) => 
    client.put(`/gallery/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  deleteGallery: (id: number) => 
    client.delete(`/gallery/${id}`),
  
  toggleFeatured: (id: number) => 
    client.patch(`/gallery/${id}/toggle-featured`)
};
