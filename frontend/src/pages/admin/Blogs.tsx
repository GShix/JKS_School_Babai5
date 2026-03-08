import React, { useEffect, useState } from 'react';
import { Newspaper, Plus, Edit, Trash2, Upload, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import Badge from '../../components/shared/Badge';
import Button from '../../components/shared/Button';
import DataTable from '../../components/shared/DataTable';
import Modal from '../../components/shared/Modal';
import FormInput from '../../components/shared/FormInput';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';
import { showSuccess, showError, showDeleteConfirm } from '../../utils/sweetAlert';
import TiptapEditor from '../../components/shared/TiptapEditor';

interface Blog {
  id: number;
  blogTitle: string;
  blogDescription: string;
  blogAuthor: string;
  authorId?: number;
  blogCategory: string;
  blogImage?: string;
  tags?: string;
  publishedDate?: string;
  blogStatus: 'draft' | 'published' | 'archived';
  audience: 'public' | 'students_parents' | 'teachers' | 'internal';
  views: number;
  createdAt: string;
  updatedAt: string;
}

const BLOG_CATEGORIES = [
  { value: 'admission', label: 'Admissions' },
  { value: 'result', label: 'Results' },
  { value: 'academic', label: 'Academic' },
  { value: 'events', label: 'Events' },
  { value: 'sports', label: 'Sports' },
  { value: 'achievements', label: 'Achievements' },
  { value: 'announcements', label: 'Announcements' },
  { value: 'general', label: 'General' }
];

const AUDIENCE_OPTIONS = [
  { value: 'public', label: 'Public (Everyone)', description: 'Visible to all visitors' },
  { value: 'students_parents', label: 'Students & Parents', description: 'Restricted to logged-in students/parents' },
  { value: 'teachers', label: 'Teachers Only', description: 'Only teachers can view' },
  { value: 'internal', label: 'Internal', description: 'Admin and staff only' }
];

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');

  const [formData, setFormData] = useState({
    blogTitle: '',
    blogDescription: '',
    blogCategory: 'general',
    audience: 'public',
    tags: ''
  });

  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const getAdminName = () => {
    try {
      const adminData = localStorage.getItem('admin') || sessionStorage.getItem('admin');
      if (adminData) {
        const admin = JSON.parse(adminData);
        return admin.adminName || admin.email || 'Administrator';
      }
    } catch (error) {
      console.error('Error getting admin name:', error);
    }
    return 'Administrator';
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Image upload handler for Tiptap editor (content images)
  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('contentImage', file);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/blogs/upload-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  // Handle cover image selection
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showError('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('Image size should be less than 5MB');
        return;
      }

      setCoverImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/blogs`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setBlogs(response.data.data || []);
    } catch (error: any) {
      console.error('Error fetching blogs:', error);
      const msg = error?.response?.data?.message || error?.message || 'Failed to fetch blogs';
      showError(`Failed to load blogs: ${msg}`);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    try {
      setLoading(true);

      // Create FormData for multipart upload
      const submitData = new FormData();
      submitData.append('blogTitle', formData.blogTitle);
      submitData.append('blogDescription', formData.blogDescription);
      submitData.append('blogCategory', formData.blogCategory);
      submitData.append('audience', formData.audience);
      submitData.append('blogStatus', status);
      if (formData.tags) {
        submitData.append('tags', formData.tags);
      }

      // Add cover image if selected
      if (coverImageFile) {
        submitData.append('image', coverImageFile);
      }

      if (editingBlog) {
        await axios.put(
          `${API_BASE_URL}/admin/blogs/${editingBlog.id}`,
          submitData,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        showSuccess(`Blog post has been ${status === 'published' ? 'published' : 'saved as draft'} successfully!`);
      } else {
        await axios.post(
          `${API_BASE_URL}/admin/blogs`,
          submitData,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        showSuccess(`New blog post has been ${status === 'published' ? 'published' : 'saved as draft'} successfully!`);
      }

      setModalOpen(false);
      resetForm();
      fetchBlogs();
    } catch (error: any) {
      console.error('Error saving blog:', error);
      showError(error.response?.data?.message || 'Failed to save blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      blogTitle: blog.blogTitle,
      blogDescription: blog.blogDescription,
      blogCategory: blog.blogCategory,
      audience: blog.audience,
      tags: blog.tags || ''
    });

    // Set cover image preview if exists
    if (blog.blogImage) {
      setCoverImagePreview(blog.blogImage);
    }

    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const result = await showDeleteConfirm('this blog post');
    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/admin/blogs/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      showSuccess('Blog post has been deleted successfully!');
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      showError('Failed to delete blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      blogTitle: '',
      blogDescription: '',
      blogCategory: 'general',
      audience: 'public',
      tags: ''
    });
    setEditingBlog(null);
    setCoverImageFile(null);
    setCoverImagePreview('');
  };

  const columns = [
    {
      key: 'blogTitle',
      label: 'Title',
      render: (_value: string, blog: Blog) => (
        <div>
          <p className="font-medium">{blog.blogTitle || 'Untitled'}</p>
          <p className="text-xs text-gray-600">
            {BLOG_CATEGORIES.find(c => c.value === blog.blogCategory)?.label || blog.blogCategory}
          </p>
        </div>
      )
    },
    {
      key: 'blogAuthor',
      label: 'Author',
      render: (value: string, _row: any) => value || 'Unknown'
    },
    {
      key: 'audience',
      label: 'Audience',
      render: (value: string, _row: any) => {
        const audience = AUDIENCE_OPTIONS.find(a => a.value === value);
        const icons: { [key: string]: any } = {
          public: <Eye className="w-3 h-3 inline mr-1" />,
          students_parents: <EyeOff className="w-3 h-3 inline mr-1" />,
          teachers: <EyeOff className="w-3 h-3 inline mr-1" />,
          internal: <EyeOff className="w-3 h-3 inline mr-1" />
        };
        return (
          <span className="text-xs">
            {icons[value] || icons.public}
            {audience?.label || value}
          </span>
        );
      }
    },
    {
      key: 'blogStatus',
      label: 'Status',
      render: (value: string, _row: any) => {
        const variants: { [key: string]: any } = {
          draft: 'warning',
          published: 'success',
          archived: 'default'
        };
        return <Badge variant={variants[value] || 'default'}>{value.toUpperCase()}</Badge>;
      }
    },
    {
      key: 'views',
      label: 'Views',
      render: (value: number, _row: any) => value || 0
    },
    {
      key: 'publishedDate',
      label: 'Published',
      render: (value: string, _row: any) =>
        value ? new Date(value).toLocaleDateString() : '-'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Newspaper className="w-7 h-7 text-blue-600" />
              Blogs Management
            </h2>
            <p className="text-sm text-gray-600 mt-1">Create and manage school blog posts (Admin Dashboard Only)</p>
          </div>
          <Button onClick={() => { resetForm(); setModalOpen(true); }}>
            <Plus className="w-4 h-4 inline mr-2" />
            New Blog Post
          </Button>
        </div>

        <DataTable
          data={blogs}
          columns={columns}
          searchPlaceholder="Search blogs..."
          loading={loading && blogs.length === 0}
          actions={(blog: Blog) => (
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(blog)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(blog.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); resetForm(); }}
        title={editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
        size="xl"
      >
        <div className="space-y-4">
          {/* Author Info Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Author:</strong> {editingBlog?.blogAuthor || getAdminName()}
            </p>
          </div>

          <FormInput
            label="Title"
            type="text"
            value={formData.blogTitle}
            onChange={(e) => setFormData({ ...formData, blogTitle: e.target.value })}
            required
            placeholder="Enter blog post title"
          />

          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {coverImagePreview && (
                <div className="relative w-full h-48 border-2 border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={coverImagePreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCoverImageFile(null);
                      setCoverImagePreview('');
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <label className="flex-1 cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition">
                    <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      {coverImageFile ? coverImageFile.name : 'Click to upload cover image'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <TiptapEditor
              content={formData.blogDescription}
              onChange={(html) => setFormData({ ...formData, blogDescription: html })}
              placeholder="Write your blog content here... Click the image icon to upload images."
              onImageUpload={handleImageUpload}
            />
            <p className="text-xs text-gray-500 mt-2">
              <Upload className="w-3 h-3 inline mr-1" />
              Tip: Click the image icon in the toolbar to add images within your content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.blogCategory}
                onChange={(e) => setFormData({ ...formData, blogCategory: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {BLOG_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Audience <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {AUDIENCE_OPTIONS.map((aud) => (
                  <option key={aud.value} value={aud.value}>
                    {aud.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {AUDIENCE_OPTIONS.find(a => a.value === formData.audience)?.description}
              </p>
            </div>
          </div>

          <FormInput
            label="Tags (comma-separated)"
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="education, school, events"
          />

          {/* Three Button Layout: Cancel, Save as Draft, Publish */}
          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button
              type="button"
              onClick={() => { setModalOpen(false); resetForm(); }}
              variant="outline"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => handleSubmit('draft')}
              variant="outline"
              disabled={loading || !formData.blogTitle || !formData.blogDescription}
            >
              {loading ? 'Saving...' : 'Save as Draft'}
            </Button>
            <Button
              type="button"
              onClick={() => handleSubmit('published')}
              disabled={loading || !formData.blogTitle || !formData.blogDescription}
            >
              {loading ? 'Publishing...' : editingBlog ? 'Update & Publish' : 'Publish'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default Blogs;