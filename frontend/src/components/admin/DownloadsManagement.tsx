import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Download as DownloadIcon, FileText, Upload, X } from 'lucide-react';
import DataTable from '../shared/DataTable';
import Button from '../shared/Button';
import Modal from '../shared/Modal';
import FormInput from '../shared/FormInput';
import Select from '../shared/Select';
import Badge from '../shared/Badge';
import { showError, showDeleteConfirm, showSuccess } from '../../utils/sweetAlert';
import { downloadService, type Download } from '../../api/services/downloadService';

const DownloadsManagement = () => {
  const [files, setFiles] = useState<Download[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFile, setEditingFile] = useState<Download | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    class: '',
    subject: '',
    academicYear: '',
    status: 'active'
  });

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await downloadService.getAll();
      if (response.data) {
        setFiles(response.data);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      showError('Failed to load downloads. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showError('Please select a valid file (PDF or image)');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      showError('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleSubmit = async () => {
    try {
      // Validation
      if (!formData.title || !formData.category) {
        showError('Please fill in all required fields');
        return;
      }

      if (!editingFile && !selectedFile) {
        showError('Please select a file to upload');
        return;
      }

      setUploading(true);

      // Create FormData
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('description', formData.description || '');
      data.append('class', formData.class || '');
      data.append('subject', formData.subject || '');
      data.append('academicYear', formData.academicYear || '');
      data.append('status', formData.status);

      if (selectedFile) {
        data.append('file', selectedFile);
      }

      if (editingFile) {
        // Update existing file
        await downloadService.update(editingFile.id, data);
        showSuccess('Download updated successfully');
      } else {
        // Create new file
        await downloadService.create(data);
        showSuccess('Download created successfully');
      }
      
      setShowModal(false);
      resetForm();
      fetchFiles();
    } catch (error: any) {
      console.error('Error saving file:', error);
      showError(error?.response?.data?.message || 'Failed to save download. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (file: Download) => {
    setEditingFile(file);
    setFormData({
      title: file.title,
      category: file.category,
      description: file.description || '',
      class: file.class || '',
      subject: file.subject || '',
      academicYear: file.academicYear || '',
      status: file.status
    });
    setSelectedFile(null);
    setFilePreview(null);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    const result = await showDeleteConfirm('this download');
    if (!result.isConfirmed) return;
    
    try {
      await downloadService.delete(id);
      showSuccess('Download deleted successfully');
      fetchFiles();
    } catch (error: any) {
      console.error('Error deleting file:', error);
      showError(error?.response?.data?.message || 'Failed to delete download. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      description: '',
      class: '',
      subject: '',
      academicYear: '',
      status: 'active'
    });
    setEditingFile(null);
    setSelectedFile(null);
    setFilePreview(null);
  };

  const getCategoryBadgeVariant = (category: string): 'default' | 'success' | 'danger' | 'warning' | 'info' => {
    switch (category) {
      case 'notes': return 'info';
      case 'question-papers': return 'warning';
      case 'solutions': return 'success';
      case 'forms': return 'default';
      case 'syllabus': return 'success';
      case 'others': return 'default';
      default: return 'default';
    }
  };

  const getStatCardClasses = (color: string) => {
    const classes = {
      blue: 'bg-blue-50 border border-blue-200',
      yellow: 'bg-yellow-50 border border-yellow-200',
      green: 'bg-green-50 border border-green-200',
      gray: 'bg-gray-50 border border-gray-200'
    };
    return classes[color as keyof typeof classes] || classes.gray;
  };

  const getStatTextClasses = (color: string) => {
    const classes = {
      blue: 'text-blue-600',
      yellow: 'text-yellow-600',
      green: 'text-green-600',
      gray: 'text-gray-600'
    };
    return classes[color as keyof typeof classes] || classes.gray;
  };

  const getStatIconClasses = (color: string) => {
    const classes = {
      blue: 'text-blue-500',
      yellow: 'text-yellow-500',
      green: 'text-green-500',
      gray: 'text-gray-500'
    };
    return classes[color as keyof typeof classes] || classes.gray;
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { 
      key: 'category', 
      label: 'Category',
      render: (value: string) => (
        <Badge variant={getCategoryBadgeVariant(value)}>
          {value.replace(/-/g, ' ').toUpperCase()}
        </Badge>
      )
    },
    { key: 'class', label: 'Class' },
    { key: 'subject', label: 'Subject' },
    { key: 'fileSize', label: 'Size' },
    { key: 'downloads', label: 'Downloads' },
    { 
      key: 'createdAt', 
      label: 'Uploaded',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'success' : 'danger'}>
          {value}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Downloads Management</h2>
          <p className="text-gray-600">Manage study materials, notes, and question papers</p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-5 h-5" />}
          onClick={() => {
            setEditingFile(null);
            resetForm();
            setShowModal(true);
          }}
        >
          Add File
        </Button>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { category: 'Notes', count: files.filter(f => f.category === 'notes').length, icon: FileText, color: 'blue' },
          { category: 'Question Papers', count: files.filter(f => f.category === 'question-papers').length, icon: FileText, color: 'yellow' },
          { category: 'Solutions', count: files.filter(f => f.category === 'solutions').length, icon: FileText, color: 'green' },
          { category: 'Forms', count: files.filter(f => f.category === 'forms').length, icon: FileText, color: 'gray' },
          { category: 'Syllabus', count: files.filter(f => f.category === 'syllabus').length, icon: FileText, color: 'green' },
          { category: 'Others', count: files.filter(f => f.category === 'others').length, icon: FileText, color: 'gray' }
        ].map((stat) => (
          <div
            key={stat.category}
            className={`${getStatCardClasses(stat.color)} rounded-lg p-4`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`${getStatTextClasses(stat.color)} text-sm font-medium`}>{stat.category}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.count}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${getStatIconClasses(stat.color)}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Files Table */}
      <DataTable
        data={files}
        columns={columns}
        searchPlaceholder="Search files by title, subject..."
        actions={(file: Download) => (
          <div className="flex gap-2">
            <a
              href={file.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="View/Download"
            >
              <DownloadIcon className="w-4 h-4" />
            </a>
            <button
              onClick={() => handleEdit(file)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(file.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingFile(null);
          resetForm();
        }}
        title={editingFile ? 'Edit Download' : 'Add New Download'}
        size="lg"
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowModal(false);
                setEditingFile(null);
                resetForm();
              }}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : editingFile ? 'Update' : 'Upload'}
            </Button>
          </div>
        }
      >
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <FormInput
              label="Title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Class 10 Mathematics Chapter 1 Notes"
            />
          </div>

          <Select
            label="Category"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={[
              { value: '', label: 'Select Category' },
              { value: 'notes', label: 'Notes' },
              { value: 'question-papers', label: 'Question Papers' },
              { value: 'solutions', label: 'Solutions' },
              { value: 'forms', label: 'Forms' },
              { value: 'syllabus', label: 'Syllabus' },
              { value: 'others', label: 'Others' }
            ]}
          />

          <Select
            label="Class"
            value={formData.class}
            onChange={(e) => setFormData({ ...formData, class: e.target.value })}
            options={[
              { value: '', label: 'All Classes' },
              { value: '1', label: 'Class 1' },
              { value: '2', label: 'Class 2' },
              { value: '3', label: 'Class 3' },
              { value: '4', label: 'Class 4' },
              { value: '5', label: 'Class 5' },
              { value: '6', label: 'Class 6' },
              { value: '7', label: 'Class 7' },
              { value: '8', label: 'Class 8' },
              { value: '9', label: 'Class 9' },
              { value: '10', label: 'Class 10' },
              { value: '11', label: 'Class 11' },
              { value: '12', label: 'Class 12' }
            ]}
          />

          <FormInput
            label="Subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="e.g., Mathematics, Science"
          />

          <FormInput
            label="Academic Year"
            value={formData.academicYear}
            onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
            placeholder="e.g., 2024-2025"
          />

          {/* File Upload Section */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File {!editingFile && <span className="text-red-500">*</span>}
            </label>
            <div className="mt-1">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {selectedFile ? (
                      <>
                        <Upload className="w-8 h-8 mb-2 text-green-600" />
                        <p className="mb-2 text-sm text-gray-700">
                          <span className="font-semibold">{selectedFile.name}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF or Image (Max 10MB)</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>
              {selectedFile && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setFilePreview(null);
                  }}
                  className="mt-2 text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Remove file
                </button>
              )}
              {editingFile && !selectedFile && (
                <p className="mt-2 text-sm text-gray-500">
                  Current file: <a href={editingFile.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{editingFile.fileName}</a>
                </p>
              )}
            </div>
          </div>

          {/* Image Preview */}
          {filePreview && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <img
                src={filePreview}
                alt="Preview"
                className="max-w-full h-48 object-contain rounded-lg border border-gray-300"
              />
            </div>
          )}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of the file content..."
            />
          </div>

          <Select
            label="Status"
            required
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]}
          />
        </form>
      </Modal>
    </div>
  );
};

export default DownloadsManagement;
