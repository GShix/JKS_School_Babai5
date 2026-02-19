import React, { useState, useEffect } from 'react';
import { 
  Image, 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Plus, 
  Edit,
  Eye,
  EyeOff,
  Upload,
  X
} from 'lucide-react';
import { heroSlideService, type HeroSlide } from '../../api/services';
import { showSuccess, showError } from '../../utils/sweetAlert';
import Modal from '../../components/shared/Modal';


interface SlideFormData {
  title: string;
  status: 'active' | 'inactive';
  image: File | null;
}

const HeroSlides: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [formData, setFormData] = useState<SlideFormData>({
    title: '',
    status: 'active',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const response = await heroSlideService.getAll();
      if (response.data) {
        // Sort by display order
        const sorted = [...response.data].sort((a, b) => a.displayOrder - b.displayOrder);
        setSlides(sorted);
      }
    } catch (error) {
      console.error('Error fetching hero slides:', error);
      showError('Failed to load hero slides');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showError('Please select an image file');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('Image size must be less than 5MB');
        return;
      }

      setFormData({ ...formData, image: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingSlide && !formData.image) {
      showError('Please select an image');
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('title', formData.title);
      data.append('status', formData.status);
      
      if (formData.image) {
        data.append('image', formData.image);
      }

      let response;
      if (editingSlide) {
        response = await heroSlideService.update(editingSlide.id, data);
      } else {
        response = await heroSlideService.create(data);
      }

      if (response.data) {
        showSuccess(editingSlide ? 'Slide updated successfully' : 'Slide created successfully');
        setShowModal(false);
        resetForm();
        fetchSlides();
      }
    } catch (error: any) {
      console.error('Error saving slide:', error);
      showError(error.response?.data?.message || 'Failed to save slide');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title || '',
      status: slide.status,
      image: null,
    });
    setImagePreview(slide.imageUrl);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;

    try {
      const response = await heroSlideService.delete(id);
      if (!response.error) {
        showSuccess('Slide deleted successfully');
        fetchSlides();
      }
    } catch (error: any) {
      console.error('Error deleting slide:', error);
      showError(error.response?.data?.message || 'Failed to delete slide');
    }
  };

  const handleToggleStatus = async (slide: HeroSlide) => {
    try {
      const data = new FormData();
      data.append('title', slide.title || '');
      data.append('status', slide.status === 'active' ? 'inactive' : 'active');
      
      const response = await heroSlideService.update(slide.id, data);
      if (response.data) {
        showSuccess('Status updated successfully');
        fetchSlides();
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      showError('Failed to update status');
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;

    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[index - 1];
    newSlides[index - 1] = temp;

    // Update display orders
    const updates = newSlides.map((slide, idx) => ({
      id: slide.id,
      displayOrder: idx,
    }));

    try {
      const response = await heroSlideService.reorder(updates);
      if (!response.error) {
        setSlides(newSlides);
        showSuccess('Order updated successfully');
      }
    } catch (error) {
      console.error('Error reordering slides:', error);
      showError('Failed to update order');
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === slides.length - 1) return;

    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[index + 1];
    newSlides[index + 1] = temp;

    // Update display orders
    const updates = newSlides.map((slide, idx) => ({
      id: slide.id,
      displayOrder: idx,
    }));

    try {
      const response = await heroSlideService.reorder(updates);
      if (!response.error) {
        setSlides(newSlides);
        showSuccess('Order updated successfully');
      }
    } catch (error) {
      console.error('Error reordering slides:', error);
      showError('Failed to update order');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      status: 'active',
      image: null,
    });
    setImagePreview('');
    setEditingSlide(null);
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hero Slide Management</h2>
          <p className="text-gray-600 mt-1">Manage carousel images on homepage</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Slide
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Slides</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{slides.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Image className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Slides</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {slides.filter(s => s.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Inactive Slides</p>
              <p className="text-2xl font-bold text-gray-600 mt-1">
                {slides.filter(s => s.status === 'inactive').length}
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <EyeOff className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Slides List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero Slides</h3>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-gray-600">Loading slides...</span>
              </div>
            </div>
          ) : slides.length === 0 ? (
            <div className="text-center py-12">
              <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No hero slides yet</p>
              <p className="text-gray-500 text-sm">Add your first slide to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  {/* Image Preview */}
                  <div className="w-32 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={slide.imageUrl}
                      alt={slide.title || 'Hero slide'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-grow">
                    <h4 className="font-medium text-gray-900">
                      {slide.title || 'Untitled Slide'}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Position: {index + 1}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        slide.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {slide.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Move Up/Down */}
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className={`p-2 rounded-lg transition-colors ${
                        index === 0
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-blue-600 hover:bg-blue-50'
                      }`}
                      title="Move up"
                    >
                      <ChevronUp className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === slides.length - 1}
                      className={`p-2 rounded-lg transition-colors ${
                        index === slides.length - 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-blue-600 hover:bg-blue-50'
                      }`}
                      title="Move down"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </button>

                    {/* Toggle Status */}
                    <button
                      onClick={() => handleToggleStatus(slide)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      title={slide.status === 'active' ? 'Deactivate' : 'Activate'}
                    >
                      {slide.status === 'active' ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleEdit(slide)}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(slide.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={showModal} 
        onClose={handleModalClose} 
        size="md"
        title={editingSlide ? 'Edit Hero Slide' : 'Add Hero Slide'}
      >
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (Optional)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter slide title..."
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image {!editingSlide && <span className="text-red-500">*</span>}
              </label>
              
              {imagePreview && (
                <div className="mb-4 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setFormData({ ...formData, image: null });
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <label className="flex items-center justify-center w-full h-32 px-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF, WebP (Max 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleModalClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Saving...' : editingSlide ? 'Update Slide' : 'Add Slide'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default HeroSlides;
