import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import Badge from '../../components/shared/Badge';
import Button from '../../components/shared/Button';
import DataTable from '../../components/shared/DataTable';
import Modal from '../../components/shared/Modal';
import FormInput from '../../components/shared/FormInput';
import { messageService } from '../../api';
import type { SchoolMessage } from '../../api';
import { getErrorMessage } from '../../utils/errorHandler';
import { showSuccess, showError, showWarning, showDeleteConfirm } from '../../utils/sweetAlert';

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<SchoolMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMessage, setEditingMessage] = useState<SchoolMessage | null>(null);
  const [formData, setFormData] = useState({
    personName: '',
    personPosition: '',
    message: '',
    displayOrder: 0,
    isActive: true
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await messageService.getAll(false); // Get all messages
      setMessages(response.data || []);
    } catch (error) {
      console.error('Error fetching messages:', getErrorMessage(error));
      showError(`Failed to fetch messages: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      
      submitData.append('personName', formData.personName);
      submitData.append('personPosition', formData.personPosition);
      submitData.append('message', formData.message);
      submitData.append('displayOrder', formData.displayOrder.toString());
      submitData.append('isActive', formData.isActive.toString());
      
      if (selectedImage) {
        submitData.append('photo', selectedImage);
      }
      
      if (editingMessage) {
        await messageService.update(editingMessage.id, submitData);
      } else {
        await messageService.create(submitData);
      }
      
      setShowModal(false);
      setEditingMessage(null);
      resetForm();
      fetchMessages();
      showSuccess(`Message has been ${editingMessage ? 'updated' : 'added'} successfully!`);
    } catch (error) {
      console.error('Error saving message:', error);
      showError(`Failed to save message: ${getErrorMessage(error)}`);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await showDeleteConfirm('this message');
    if (!result.isConfirmed) return;
    
    try {
      await messageService.delete(id);
      fetchMessages();
      showSuccess('Message has been deleted successfully!');
    } catch (error) {
      console.error('Error deleting message:', error);
      showError(`Failed to delete message: ${getErrorMessage(error)}`);
    }
  };

  const handleEdit = (message: SchoolMessage) => {
    setEditingMessage(message);
    setFormData({
      personName: message.personName,
      personPosition: message.personPosition,
      message: message.message,
      displayOrder: message.displayOrder,
      isActive: message.isActive
    });
    if (message.photo) {
      setImagePreview(message.photo);
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      personName: '',
      personPosition: '',
      message: '',
      displayOrder: 0,
      isActive: true
    });
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showWarning('File size too large', 'File size must be less than 5MB.');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        showWarning('Invalid file type', 'Please select an image file.');
        return;
      }
      
      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleActiveStatus = async (message: SchoolMessage) => {
    try {
      const formData = new FormData();
      formData.append('personName', message.personName);
      formData.append('personPosition', message.personPosition);
      formData.append('message', message.message);
      formData.append('displayOrder', message.displayOrder.toString());
      formData.append('isActive', (!message.isActive).toString());
      
      await messageService.update(message.id, formData);
      fetchMessages();
      showSuccess(`Message ${!message.isActive ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Error toggling message status:', error);
      showError(`Failed to update message status: ${getErrorMessage(error)}`);
    }
  };

  const columns = [
    {
      key: 'photo',
      label: 'Photo',
      render: (_value: string, row: SchoolMessage) => (
        <img 
          src={row.photo || '/img/default-avatar.svg'} 
          alt={row.personName}
          className="w-12 h-12 rounded-full object-cover border border-gray-200"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/img/default-avatar.svg';
          }}
        />
      )
    },
    { key: 'personName', label: 'Person Name' },
    { key: 'personPosition', label: 'Position' },
    { 
      key: 'message', 
      label: 'Message',
      render: (value: string, _row: any) => (
        <div className="max-w-xs truncate" title={value}>
          {value.substring(0, 100)}{value.length > 100 ? '...' : ''}
        </div>
      )
    },
    { 
      key: 'displayOrder', 
      label: 'Order',
      render: (value: number, _row: any) => (
        <span className="text-center block">{value}</span>
      )
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value: boolean, row: SchoolMessage) => (
        <div className="flex items-center gap-2">
          <Badge variant={value ? 'success' : 'danger'}>
            {value ? 'Active' : 'Inactive'}
          </Badge>
          <button
            onClick={() => toggleActiveStatus(row)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title={value ? 'Deactivate' : 'Activate'}
          >
            {value ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">School Messages</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage messages from Principal and other valuable persons
            </p>
          </div>
          <Button
            variant="primary"
            icon={<Plus className="w-5 h-5" />}
            onClick={() => {
              setEditingMessage(null);
              resetForm();
              setShowModal(true);
            }}
          >
            Add New Message
          </Button>
        </div>

        {/* Messages Table */}
        <DataTable
          data={messages}
          columns={columns}
          searchPlaceholder="Search by person name, position..."
          loading={loading}
          actions={(message: SchoolMessage) => (
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(message)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(message.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingMessage(null);
          resetForm();
        }}
        title={editingMessage ? 'Edit Message' : 'Add New Message'}
        size="lg"
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowModal(false);
                setEditingMessage(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
            >
              {editingMessage ? 'Update' : 'Add'} Message
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo
            </label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                />
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    cursor-pointer"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Only image files (max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Person Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Person Name"
              required
              value={formData.personName}
              onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
              placeholder="e.g., Mr. Ram Sharma"
            />
            
            <FormInput
              label="Position"
              required
              value={formData.personPosition}
              onChange={(e) => setFormData({ ...formData, personPosition: e.target.value })}
              placeholder="e.g., Principal"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter the message..."
            />
          </div>

          {/* Display Order & Active Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Display Order"
              type="number"
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
              placeholder="0"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex items-center gap-4 mt-3">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="form-checkbox h-5 w-5 text-blue-600 rounded"
                  />
                  <span className="ml-2 text-gray-700">Active (visible on website)</span>
                </label>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Messages;
