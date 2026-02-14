import { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon, X, Video } from 'lucide-react';
import DataTable from '../shared/DataTable';
import Button from '../shared/Button';
import Modal from '../shared/Modal';
import FormInput from '../shared/FormInput';
import Select from '../shared/Select';
import Badge from '../shared/Badge';
import axios from 'axios';
import { SERVER_URL, API_BASE_URL } from '../../api/config';
import { showSuccess, showError, showWarning, showDeleteConfirm } from '../../utils/sweetAlert';

interface FileObject {
  filename: string;
  originalName: string;
  fileType: string;
  url: string;
  size: number;
}

interface GalleryImage {
  id: number;
  title: string;
  description: string;
  images: FileObject[];
  videos: FileObject[];
  category: string;
  eventDate: string;
  uploadedDate?: string;
  uploadedBy?: number;
  views: number;
  tags: string;
  featured: boolean;
  status: string;
  createdAt?: string;
}

const GalleryManagement = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'events',
    eventDate: '',
    tags: '',
    featured: false,
    status: 'active'
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/gallery`);
      if (response.data && response.data.data) {
        setImages(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const videoFiles = files.filter(file => file.type.startsWith('video/'));

    if (imageFiles.length > 0) {
      setSelectedImages(prev => [...prev, ...imageFiles].slice(0, 20));
    }
    if (videoFiles.length > 0) {
      setSelectedVideos(prev => [...prev, ...videoFiles].slice(0, 5));
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages(prev => [...prev, ...files].slice(0, 20));
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedVideos(prev => [...prev, ...files].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setSelectedVideos(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const handleSubmit = async () => {
    try {
      // Validate form
      if (!formData.title.trim()) {
        showWarning('Please enter a title for the gallery item');
        return;
      }

      if (!editingImage && selectedImages.length === 0) {
        showWarning('Please select at least one image');
        return;
      }

      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('eventDate', formData.eventDate);
      submitData.append('tags', formData.tags);
      submitData.append('featured', formData.featured.toString());
      submitData.append('status', formData.status);

      // Add new images
      selectedImages.forEach(image => {
        submitData.append('images', image);
      });

      // Add new videos
      selectedVideos.forEach(video => {
        submitData.append('videos', video);
      });

      if (editingImage) {
        // Update existing gallery item
        await axios.put(`${API_BASE_URL}/gallery/${editingImage.id}`, submitData, {
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        showSuccess('Gallery item has been updated successfully!');
      } else {
        // Create new gallery item
        await axios.post(`${API_BASE_URL}/gallery`, submitData, {
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        showSuccess('New gallery item has been created successfully!');
      }
      
      setShowModal(false);
      resetForm();
      fetchImages();
    } catch (error: any) {
      console.error('Error saving gallery item:', error);
      showError(error.response?.data?.error || 'Failed to save gallery item. Please try again.');
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      description: image.description,
      category: image.category,
      eventDate: image.eventDate,
      tags: image.tags,
      featured: image.featured,
      status: image.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    const result = await showDeleteConfirm('this gallery item', 'All associated files will be deleted');
    if (!result.isConfirmed) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/gallery/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      showSuccess('Gallery item has been deleted successfully!');
      fetchImages();
    } catch (error: any) {
      console.error('Error deleting gallery item:', error);
      showError(error.response?.data?.error || 'Failed to delete gallery item. Please try again.');
    }
  };

  const toggleFeatured = async (id: number) => {
    try {
      await axios.patch(`${API_BASE_URL}/gallery/${id}/toggle-featured`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      fetchImages();
    } catch (error: any) {
      console.error('Error toggling featured:', error);
      showError(error.response?.data?.error || 'Failed to update featured status. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'events',
      eventDate: '',
      tags: '',
      featured: false,
      status: 'active'
    });
    setEditingImage(null);
    setSelectedImages([]);
    setSelectedVideos([]);
  };

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case 'events': return 'info';
      case 'academic': return 'success';
      case 'cultural': return 'warning';
      case 'sports': return 'info';
      case 'infrastructure': return 'default';
      default: return 'default';
    }
  };

  const getCategoryStats = () => {
    const stats = images.reduce((acc, img) => {
      acc[img.category] = (acc[img.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return stats;
  };

  const categoryStats = getCategoryStats();

  const columns = [
    { 
      key: 'images', 
      label: 'Preview',
      render: (value: FileObject[], row: GalleryImage) => {
        const firstImage = value && value.length > 0 ? value[0] : null;
        return firstImage ? (
          <div className="relative">
            <img 
              src={`${SERVER_URL}${firstImage.url}`}
              alt={row.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
            {value.length > 1 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                +{value.length - 1}
              </span>
            )}
          </div>
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-gray-400" />
          </div>
        );
      }
    },
    { key: 'title', label: 'Title' },
    { 
      key: 'category', 
      label: 'Category',
      render: (value: string) => (
        <Badge variant={getCategoryBadgeVariant(value)}>
          {value.toUpperCase()}
        </Badge>
      )
    },
    { 
      key: 'eventDate', 
      label: 'Event Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'images',
      label: 'Media',
      render: (value: FileObject[], row: GalleryImage) => (
        <div className="flex gap-2">
          <span className="text-sm">{value?.length || 0} 📷</span>
          <span className="text-sm">{row.videos?.length || 0} 🎥</span>
        </div>
      )
    },
    { key: 'views', label: 'Views' },
    {
      key: 'featured',
      label: 'Featured',
      render: (value: boolean, row: GalleryImage) => (
        <button
          onClick={() => toggleFeatured(row.id)}
          className="focus:outline-none"
        >
          <Badge variant={value ? 'success' : 'default'}>
            {value ? 'Yes' : 'No'}
          </Badge>
        </button>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'success' : 'danger'}>
          {value}
        </Badge>
      )
    },
    {
      key: 'id',
      label: 'Actions',
      render: (value: number, row: GalleryImage) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(value)}
            className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-600">Total Items: {images.length}</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Add Gallery Item
        </Button>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(categoryStats).map(([category, count]) => (
          <div key={category} className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm text-gray-600 capitalize">{category}</h3>
            <p className="text-2xl font-bold text-primary">{count}</p>
          </div>
        ))}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <DataTable
          columns={columns}
          data={images}
          loading={loading && images.length === 0}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingImage ? 'Edit Gallery Item' : 'Add Gallery Item'}
        size="xl"
      >
        <div className="space-y-4">
          <FormInput
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter gallery item title"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: 'events', label: 'Events' },
                { value: 'academic', label: 'Academic' },
                { value: 'cultural', label: 'Cultural' },
                { value: 'sports', label: 'Sports' },
                { value: 'infrastructure', label: 'Infrastructure' },
                { value: 'other', label: 'Other' }
              ]}
            />

            <FormInput
              label="Event Date"
              type="date"
              value={formData.eventDate}
              onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
            />
          </div>

          <FormInput
            label="Tags (comma separated)"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="e.g. sports, annual, events"
          />

          {/* File Upload Area */}
          <div className="space-y-4">
            {/* Images Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images {!editingImage && <span className="text-danger">*</span>} 
                <span className="text-gray-500 text-xs ml-2">(Max 20 images)</span>
              </label>
              
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => imageInputRef.current?.click()}
              >
                <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Drag & drop images here or click to browse
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supports: JPEG, PNG, GIF, WEBP, SVG
                </p>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>

              {/* Selected Images Preview */}
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {selectedImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="absolute top-1 right-1 bg-danger text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Existing Images (Edit Mode) */}
              {editingImage && editingImage.images && editingImage.images.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Existing Images:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {editingImage.images.map((img, index) => (
                      <div key={index}>
                        <img
                          src={`${SERVER_URL}${img.url}`}
                          alt={img.originalName}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <p className="text-xs text-gray-500 mt-1 truncate">{img.originalName}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Videos Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Videos (Optional)
                <span className="text-gray-500 text-xs ml-2">(Max 5 videos, 1GB each)</span>
              </label>
              
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer border-gray-300 hover:border-primary"
                onClick={() => videoInputRef.current?.click()}
              >
                <Video className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Click to add videos
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supports: MP4, MPEG, MOV, AVI, WEBM
                </p>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleVideoSelect}
                  className="hidden"
                />
              </div>

              {/* Selected Videos List */}
              {selectedVideos.length > 0 && (
                <div className="space-y-2 mt-3">
                  {selectedVideos.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                      </div>
                      <button
                        onClick={() => removeVideo(index)}
                        className="text-danger hover:bg-danger/10 p-1 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Existing Videos (Edit Mode) */}
              {editingImage && editingImage.videos && editingImage.videos.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Existing Videos:</p>
                  <div className="space-y-2">
                    {editingImage.videos.map((video, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                        <Video className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{video.originalName}</span>
                        <span className="text-xs text-gray-500">({formatFileSize(video.size)})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded text-primary focus:ring-primary"
              />
              <span className="text-sm">Featured on homepage</span>
            </label>

            <Select
              label=""
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
              ]}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingImage ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GalleryManagement;
