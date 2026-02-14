import React, { useEffect, useState } from 'react';
import { Newspaper, Plus, Edit, Trash2, Upload } from 'lucide-react';
import DataTable from '../shared/DataTable';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import FormInput from '../shared/FormInput';
import Badge from '../shared/Badge';
import TiptapEditor from '../shared/TiptapEditor';
import axios from 'axios';
import { SERVER_URL, API_BASE_URL } from '../../api/config';
import { showSuccess, showError, showDeleteConfirm } from '../../utils/sweetAlert';

interface Blog {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  imageUrl?: string;
  tags?: string;
  publishedDate: string;
  status: 'draft' | 'published' | 'archived';
  views: number;
  createdAt: string;
}

const BlogsManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    category: '',
    imageUrl: '',
    tags: '',
    status: 'draft'
  });

  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Image upload handler for Tiptap editor
  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('contentImage', file);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/blogs/upload-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return `${SERVER_URL}${response.data.url}`;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/blogs`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setBlogs(response.data.data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const blogData = {
      title: formData.title,
      content: formData.content,
      author: formData.author,
      category: formData.category,
      imageUrl: formData.imageUrl,
      tags: formData.tags,
      status: formData.status,
      publishedDate: formData.status === 'published' ? new Date().toISOString() : null
    };

    try {
      setLoading(true);
      if (editingBlog) {
        await axios.put(
          `${API_BASE_URL}/blogs/${editingBlog.id}/update`,
          blogData,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        showSuccess('Blog post has been updated successfully!');
      } else {
        await axios.post(
          `${API_BASE_URL}/blogs/create`,
          blogData,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        showSuccess('New blog post has been created successfully!');
      }
      
      setModalOpen(false);
      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
      showError('Failed to save blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      author: blog.author,
      category: blog.category,
      imageUrl: blog.imageUrl || '',
      tags: blog.tags || '',
      status: blog.status
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const result = await showDeleteConfirm('this blog post');
    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/blogs/${id}/delete`, {
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
      title: '',
      content: '',
      author: '',
      category: '',
      imageUrl: '',
      tags: '',
      status: 'draft'
    });
    setEditingBlog(null);
  };

  const columns = [
    { 
      key: 'title', 
      label: 'Title',
      render: (_value: string, blog: Blog) => (
        <div>
          <p className="font-medium">{blog.title || 'Untitled'}</p>
          <p className="text-xs text-gray-600">{blog.category || 'Uncategorized'}</p>
        </div>
      )
    },
    { 
      key: 'author', 
      label: 'Author',
      render: (value: string) => value || 'Unknown'
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (value: string) => {
        if (!value) return <Badge variant="default">DRAFT</Badge>;
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
      render: (value: number) => value || 0
    },
    { 
      key: 'publishedDate', 
      label: 'Published',
      render: (value: string) => 
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
            <p className="text-sm text-gray-600 mt-1">Manage school blog posts and articles</p>
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <TiptapEditor
              content={formData.content}
              onChange={(html) => setFormData({ ...formData, content: html })}
              placeholder="Write your blog content here... Click the image icon to upload images."
              onImageUpload={handleImageUpload}
            />
            <p className="text-xs text-gray-500 mt-2">
              <Upload className="w-3 h-3 inline mr-1" />
              Tip: Click the image icon in the toolbar to upload images.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Author"
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              required
            />
            <FormInput
              label="Category"
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
            <FormInput
              label="Cover Image URL"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
            <FormInput
              label="Tags (comma-separated)"
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="education, school, events"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button type="button" onClick={() => { setModalOpen(false); resetForm(); }} variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : editingBlog ? 'Update Blog' : 'Create Blog'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BlogsManagement;
