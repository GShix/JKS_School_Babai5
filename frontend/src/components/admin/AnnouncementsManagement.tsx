import React, { useEffect, useState } from 'react';
import { Bell, Plus, Edit, Trash2, Pin, Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import DataTable from '../shared/DataTable';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import FormInput from '../shared/FormInput';
import Select from '../shared/Select';
import Badge from '../shared/Badge';
import axios from 'axios';
import { SERVER_URL } from '../../api/config';
import { showSuccess, showError, showWarning, showDeleteConfirm } from '../../utils/sweetAlert';

interface Attachment {
  filename: string;
  originalName: string;
  fileType: string;
  url: string;
  size: number;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetAudience: string;
  isPinned: boolean;
  startDate: string;
  endDate?: string;
  attachments?: Attachment[];
  createdBy: number;
  createdByName?: string;
  createdAt: string;
  status: 'active' | 'expired';
}

const AnnouncementsManagement: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewAttachmentsModal, setViewAttachmentsModal] = useState(false);
  const [selectedAttachments, setSelectedAttachments] = useState<Attachment[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium',
    targetAudience: 'all',
    isPinned: false,
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<Attachment[]>([]);
  const [filesToRemove, setFilesToRemove] = useState<string[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Validate file types
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf'];
      const invalidFiles = files.filter(file => !validTypes.includes(file.type));
      
      if (invalidFiles.length > 0) {
        showWarning(`Invalid file types: ${invalidFiles.map(f => f.name).join(', ')}.`, 'Only images and PDFs are allowed.');
        return;
      }
      
      // Validate file sizes (10MB max)
      const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        showWarning(`Files too large: ${oversizedFiles.map(f => f.name).join(', ')}.`, 'Maximum size is 10MB.');
        return;
      }
      
      // Limit to 5 files total
      const totalFiles = selectedFiles.length + existingAttachments.length - filesToRemove.length + files.length;
      if (totalFiles > 5) {
        showWarning('Maximum 5 files allowed.', 'Please remove some files first.');
        return;
      }
      
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };
  
  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const removeExistingFile = (filename: string) => {
    setFilesToRemove(prev => [...prev, filename]);
  };
  
  const restoreExistingFile = (filename: string) => {
    setFilesToRemove(prev => prev.filter(f => f !== filename));
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Normalize announcement data from API response
  const normalizeAnnouncement = (announcement: any): Announcement => {
    if (!announcement) {
      throw new Error('Invalid announcement data: null or undefined');
    }
    return {
      ...announcement,
      priority: announcement.priority || 'medium',
      targetAudience: announcement.targetAudience || 'all',
      isPinned: announcement.isPinned || false,
      attachments: announcement.attachments || [],
      status: announcement.status || 'active',
      startDate: announcement.startDate || new Date().toISOString().split('T')[0],
      endDate: announcement.endDate || null,
      createdAt: announcement.createdAt || new Date().toISOString()
    };
  };

  const fetchAnnouncements = async () => {
    try {
      setError(null);
      const response = await axios.get('http://localhost:4000/api/announcements', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      
      // Handle RESTful API response
      if (response.data && response.data.data) {
        const normalizedData = response.data.data
          .filter((item: any) => item != null) // Filter out null/undefined
          .map(normalizeAnnouncement);
        setAnnouncements(normalizedData);
      } else {
        console.warn('Unexpected API response structure:', response.data);
        setAnnouncements([]);
      }
    } catch (error: any) {
      console.error('Error fetching announcements:', error);
      
      // Handle different error types
      if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please ensure the backend is running on http://localhost:4000');
      } else if (error.response) {
        // Server responded with error status
        const errorMsg = error.response.data?.message || `Server error: ${error.response.status}`;
        setError(errorMsg);
      } else {
        setError(error.message || 'Failed to fetch announcements');
      }
      
      setAnnouncements([]);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate title and content are not empty or whitespace
    if (!formData.title.trim()) {
      showWarning('Title cannot be empty', 'Please enter a title for the announcement.');
      return;
    }
    
    if (!formData.content.trim()) {
      showWarning('Content cannot be empty', 'Please enter content for the announcement.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title.trim());
    formDataToSend.append('content', formData.content.trim());
    formDataToSend.append('priority', formData.priority);
    formDataToSend.append('targetAudience', formData.targetAudience);
    formDataToSend.append('isPinned', formData.isPinned.toString());
    formDataToSend.append('startDate', formData.startDate);
    if (formData.endDate) {
      formDataToSend.append('endDate', formData.endDate);
    }
    formDataToSend.append('status', 'active');
    
    // Append files
    selectedFiles.forEach(file => {
      formDataToSend.append('files', file);
    });
    
    // Append files to remove (for updates)
    if (editingAnnouncement && filesToRemove.length > 0) {
      formDataToSend.append('removeAttachments', JSON.stringify(filesToRemove));
    }

    try {
      setLoading(true);
      setError(null);
      
      let responseMessage = '';
      
      if (editingAnnouncement) {
        const response = await axios.put(
          `http://localhost:4000/api/announcements/${editingAnnouncement.id}`,
          formDataToSend,
          { 
            headers: { 
              Authorization: `Bearer ${getToken()}`,
              'Content-Type': 'multipart/form-data'
            } 
          }
        );
        responseMessage = response.data?.message || 'Announcement updated successfully!';
      } else {
        const response = await axios.post(
          'http://localhost:4000/api/announcements/create',
          formDataToSend,
          { 
            headers: { 
              Authorization: `Bearer ${getToken()}`,
              'Content-Type': 'multipart/form-data'
            } 
          }
        );
        responseMessage = response.data?.message || 'Announcement created successfully!';
      }
      
      showSuccess(responseMessage);
      
      setModalOpen(false);
      resetForm();
      await fetchAnnouncements();
    } catch (error: any) {
      console.error('Error saving announcement:', error);
      
      let errorMessage = 'Failed to save announcement';
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server. Please ensure the backend is running on http://localhost:4000';
      } else if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showError(errorMessage, 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    if (!announcement) {
      showError('Invalid announcement data', 'Unable to edit this announcement.');
      return;
    }
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title || '',
      content: announcement.content || '',
      priority: announcement.priority || 'medium',
      targetAudience: announcement.targetAudience || 'all',
      isPinned: announcement.isPinned || false,
      startDate: announcement.startDate || new Date().toISOString().split('T')[0],
      endDate: announcement.endDate || ''
    });
    setExistingAttachments(announcement.attachments || []);
    setSelectedFiles([]);
    setFilesToRemove([]);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const result = await showDeleteConfirm('this announcement');
    if (!result.isConfirmed) return;

    try {
      const response = await axios.delete(`http://localhost:4000/api/announcements/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      
      // Optimistically update UI
      setAnnouncements(prev => prev.filter(a => a.id !== id));
      
      // Show success message from API
      const successMsg = response.data?.message || 'Announcement deleted successfully!';
      showSuccess(successMsg);
    } catch (error: any) {
      console.error('Error deleting announcement:', error);
      
      // Handle RESTful error response
      const errorMsg = error.response?.data?.message || error.message || 'Failed to delete announcement';
      showError(errorMsg, 'Please try again.');
      
      // Refresh to get accurate data
      fetchAnnouncements();
    }
  };

  const togglePin = async (id: number, currentPinned: boolean) => {
    try {
      // Optimistically update UI
      setAnnouncements(prev => prev.map(a => 
        a.id === id ? { ...a, isPinned: !currentPinned } : a
      ));
      
      const response = await axios.patch(
        `http://localhost:4000/api/announcements/${id}/pin`,
        { isPinned: !currentPinned },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      
      // Update with server response to ensure consistency
      if (response.data?.data) {
        const updatedAnnouncement = normalizeAnnouncement(response.data.data);
        setAnnouncements(prev => prev.map(a => 
          a.id === id ? updatedAnnouncement : a
        ));
      }
    } catch (error: any) {
      console.error('Error toggling pin:', error);
      
      // Revert on error
      setAnnouncements(prev => prev.map(a => 
        a.id === id ? { ...a, isPinned: currentPinned } : a
      ));
      
      const errorMsg = error.response?.data?.message || error.message || 'Failed to toggle pin';
      showError(errorMsg, 'Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      priority: 'medium',
      targetAudience: 'all',
      isPinned: false,
      startDate: new Date().toISOString().split('T')[0],
      endDate: ''
    });
    setEditingAnnouncement(null);
    setSelectedFiles([]);
    setExistingAttachments([]);
    setFilesToRemove([]);
  };

  const columns = [
    { 
      key: 'title', 
      label: 'Title',
      render: (_value: any, announcement: Announcement) => (
        <div className="flex items-center gap-2">
          {announcement.isPinned && <Pin className="w-4 h-4 text-orange-500" />}
          <span className="font-medium">{announcement.title}</span>
        </div>
      )
    },
    { 
      key: 'content', 
      label: 'Content', 
      render: (_value: any, announcement: Announcement) => (
        <span className="max-w-xs truncate block" title={announcement.content}>
          {announcement.content}
        </span>
      )
    },
    { 
      key: 'priority', 
      label: 'Priority', 
      render: (_value: any, announcement: Announcement) => {
        if (!announcement) return <span className="text-gray-400">-</span>;
        const priority = announcement.priority || 'medium';
        const variants: { [key: string]: any } = {
          low: 'default',
          medium: 'info',
          high: 'warning',
          urgent: 'danger'
        };
        return <Badge variant={variants[priority]}>{priority.toUpperCase()}</Badge>;
      }
    },
    { key: 'targetAudience', label: 'Target' },
    { 
      key: 'attachments', 
      label: 'Files', 
      render: (_value: any, announcement: Announcement) => {
        const count = announcement.attachments?.length || 0;
        return count > 0 ? (
          <button
            onClick={() => {
              setSelectedAttachments(announcement.attachments || []);
              setCurrentImageIndex(0);
              setViewAttachmentsModal(true);
            }}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm">{count}</span>
          </button>
        ) : (
          <span className="text-gray-400">-</span>
        );
      }
    },
    { key: 'startDate', label: 'Start Date' },
    { 
      key: 'endDate', 
      label: 'End Date', 
      render: (_value: any, announcement: Announcement) => {
        if (!announcement) return 'N/A';
        return announcement.endDate || 'N/A';
      }
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (_value: any, announcement: Announcement) => {
        if (!announcement) return <Badge variant="default">UNKNOWN</Badge>;
        const today = new Date();
        const endDate = announcement.endDate ? new Date(announcement.endDate) : null;
        const isExpired = endDate && endDate < today;
        return <Badge variant={isExpired ? 'danger' : 'success'}>{isExpired ? 'EXPIRED' : 'ACTIVE'}</Badge>;
      }
    }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const audienceOptions = [
    { value: 'all', label: 'All (Students & Staff)' },
    { value: 'students', label: 'Students Only' },
    { value: 'staff', label: 'Staff Only' },
    { value: 'parents', label: 'Parents Only' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="w-7 h-7 text-purple-600" />
              Announcements Management
            </h2>
            <p className="text-sm text-gray-600 mt-1">Create and manage school announcements</p>
          </div>
          <Button onClick={() => { resetForm(); setModalOpen(true); }} icon={<Plus />}>
            New Announcement
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">Connection Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <button 
                  onClick={fetchAnnouncements}
                  className="mt-2 text-sm font-medium text-red-800 hover:text-red-900 underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Announcements Table */}
        <DataTable
          data={announcements}
          columns={columns}
          searchable={true}
          searchPlaceholder="Search announcements..."
          loading={initialLoading}
          actions={(announcement) => (
              <div className="flex gap-2">
                <button
                  onClick={() => togglePin(announcement.id, announcement.isPinned)}
                  className={`p-2 rounded-lg transition ${
                    announcement.isPinned 
                      ? 'text-orange-600 bg-orange-50 hover:bg-orange-100' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title={announcement.isPinned ? 'Unpin' : 'Pin'}
                >
                  <Pin className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(announcement)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(announcement.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          />
      </div>
      {/* Attachments Viewer Modal */}
      <Modal
        isOpen={viewAttachmentsModal}
        onClose={() => {
          setViewAttachmentsModal(false);
          setSelectedAttachments([]);
          setCurrentImageIndex(0);
        }}
        title="Attachments"
        size="lg"
      >
        <div className="space-y-4">
          {selectedAttachments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No attachments</p>
          ) : (
            <div className="space-y-3">
              {selectedAttachments.map((file, index) => {
                const isImage = file.fileType.startsWith('image/');
                const isPDF = file.fileType === 'application/pdf';
                
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {isImage ? (
                            <ImageIcon className="w-5 h-5 text-blue-600" />
                          ) : (
                            <FileText className="w-5 h-5 text-red-600" />
                          )}
                          <span className="font-medium text-gray-900">{file.originalName}</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB • {file.fileType}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {isImage && (
                          <button
                            onClick={() => setCurrentImageIndex(index)}
                            className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                          >
                            Preview
                          </button>
                        )}
                        <a
                          href={`${SERVER_URL}${file.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                        >
                          {isPDF ? 'Open PDF' : 'Download'}
                        </a>
                      </div>
                    </div>
                    
                    {/* Image Preview */}
                    {isImage && currentImageIndex === index && (
                      <div className="mt-4 border-t pt-4">
                        <img
                          src={`${SERVER_URL}${file.url}`}
                          alt={file.originalName}
                          className="max-w-full h-auto rounded-lg mx-auto"
                          style={{ maxHeight: '400px' }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Modal>
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); resetForm(); }}
        title={editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
        size="lg"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              options={priorityOptions}
              required
            />
            <Select
              label="Target Audience"
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              options={audienceOptions}
              required
            />
            <FormInput
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
            <FormInput
              label="End Date (Optional)"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPinned"
              checked={formData.isPinned}
              onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="isPinned" className="text-sm font-medium text-gray-700">
              Pin this announcement (appears at top)
            </label>
          </div>

          {/* File Upload Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Attachments (Images & PDFs)
            </label>
            
            {/* Existing Attachments */}
            {existingAttachments.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500">Existing files:</p>
                {existingAttachments.map((file) => (
                  <div 
                    key={file.filename} 
                    className={`flex items-center justify-between p-2 border rounded-lg ${
                      filesToRemove.includes(file.filename) 
                        ? 'bg-red-50 border-red-200 opacity-50' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {file.fileType.startsWith('image/') ? (
                        <ImageIcon className="w-4 h-4 text-blue-500" />
                      ) : (
                        <FileText className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm truncate">{file.originalName}</span>
                      <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                    </div>
                    
                    {filesToRemove.includes(file.filename) ? (
                      <button
                        type="button"
                        onClick={() => restoreExistingFile(file.filename)}
                        className="text-xs text-green-600 hover:text-green-700 px-2 py-1"
                      >
                        Restore
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeExistingFile(file.filename)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* New File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition">
              <input
                type="file"
                id="fileUpload"
                multiple
                accept="image/*,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label
                htmlFor="fileUpload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Click to upload images or PDFs
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  Max 5 files, 10MB each
                </span>
              </label>
            </div>
            
            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500">New files to upload:</p>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 flex-1">
                      {file.type.startsWith('image/') ? (
                        <ImageIcon className="w-4 h-4 text-blue-500" />
                      ) : (
                        <FileText className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm truncate">{file.name}</span>
                      <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSelectedFile(index)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" onClick={() => { setModalOpen(false); resetForm(); }} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {editingAnnouncement ? 'Update' : 'Create'} Announcement
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AnnouncementsManagement;
