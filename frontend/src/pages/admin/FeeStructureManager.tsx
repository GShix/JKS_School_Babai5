/**
 * Enhanced Fee Structure Manager
 * Professional two-step workflow - Step 1: Structure Management
 */

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Copy,
  Trash2,
  X,
  BookOpen,
  GraduationCap,
  FileText,
  Bus,
  Home,
  Library,
  Beaker,
  Trophy,
  Layers,
  Check,
  AlertCircle,
} from 'lucide-react';
import Button from '../../components/shared/Button';
import FormInput from '../../components/shared/FormInput';
import Select from '../../components/shared/Select';
import Modal from '../../components/shared/Modal';
import Badge from '../../components/shared/Badge';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';
import { showSuccess, showError, showDeleteConfirm } from '../../utils/sweetAlert';

interface FeeCategory {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

interface FeeStructureItem {
  feeCategoryId: number;
  amount: number;
  description: string;
  category?: FeeCategory;
}

interface FeeStructure {
  id: number;
  name: string;
  academicYear: string;
  class: string;
  section: string;
  totalAmount: number;
  isActive: boolean;
  purpose: string;
  dueDate: string;
  description: string;
  isTemplate: boolean;
  clonedFrom: number | null;
  items?: FeeStructureItem[];
  createdAt: string;
}

const FeeStructureManager: React.FC = () => {
  const [structures, setStructures] = useState<FeeStructure[]>([]);
  const [categories, setCategories] = useState<FeeCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStructure, setEditingStructure] = useState<FeeStructure | null>(null);
  const [filterPurpose, setFilterPurpose] = useState<string>('all');
  const [filterClass, setFilterClass] = useState<string>('all');

  const [formData, setFormData] = useState({
    name: '',
    academicYear: '2081-2082',
    class: '',
    section: '',
    purpose: 'tuition',
    description: '',
    dueDate: '',
    isTemplate: false,
    items: [] as FeeStructureItem[],
  });

  const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

  useEffect(() => {
    fetchStructures();
    fetchCategories();
  }, []);

  const fetchStructures = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/fee-management/structures`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setStructures(response.data.data || []);
    } catch (error) {
      console.error('Error fetching structures:', error);
      showError('Error fetching fee structures');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/fee-management/categories`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setCategories(response.data.data.filter((cat: FeeCategory) => cat.isActive) || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.items.length === 0) {
      showError('Please add at least one fee category');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        totalAmount: formData.items.reduce((sum, item) => sum + parseFloat(item.amount.toString()), 0),
      };

      if (editingStructure) {
        await axios.put(
          `${API_BASE_URL}/fee-management/structures/${editingStructure.id}`,
          payload,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        showSuccess('Fee structure updated successfully');
      } else {
        await axios.post(
          `${API_BASE_URL}/fee-management/structures`,
          payload,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        showSuccess('Fee structure created successfully');
      }

      fetchStructures();
      handleCloseModal();
    } catch (error: any) {
      showError(error.response?.data?.message || 'Error saving fee structure');
    } finally {
      setLoading(false);
    }
  };

  const handleClone = async (structure: FeeStructure) => {
    setFormData({
      name: `${structure.name} (Copy)`,
      academicYear: structure.academicYear,
      class: structure.class,
      section: structure.section,
      purpose: structure.purpose,
      description: structure.description || '',
      dueDate: structure.dueDate || '',
      isTemplate: false,
      items: structure.items?.map(item => ({
        feeCategoryId: item.feeCategoryId,
        amount: item.amount,
        description: item.description || '',
      })) || [],
    });
    setEditingStructure(null);
    setModalOpen(true);
  };

  const handleEdit = (structure: FeeStructure) => {
    setEditingStructure(structure);
    setFormData({
      name: structure.name,
      academicYear: structure.academicYear,
      class: structure.class,
      section: structure.section || '',
      purpose: structure.purpose || 'tuition',
      description: structure.description || '',
      dueDate: structure.dueDate || '',
      isTemplate: structure.isTemplate || false,
      items: structure.items?.map(item => ({
        feeCategoryId: item.feeCategoryId,
        amount: item.amount,
        description: item.description || '',
      })) || [],
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await showDeleteConfirm('This will deactivate the fee structure');
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/fee-management/structures/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      showSuccess('Fee structure deactivated');
      fetchStructures();
    } catch (error: any) {
      showError(error.response?.data?.message || 'Error deleting structure');
    }
  };

  const handleAddItem = () => {
    if (categories.length === 0) {
      showError('Please create fee categories first');
      return;
    }
    setFormData({
      ...formData,
      items: [...formData.items, { feeCategoryId: categories[0].id, amount: 0, description: '' }],
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingStructure(null);
    setFormData({
      name: '',
      academicYear: '2081-2082',
      class: '',
      section: '',
      purpose: 'tuition',
      description: '',
      dueDate: '',
      isTemplate: false,
      items: [],
    });
  };

  const getPurposeIcon = (purpose: string) => {
    const icons: Record<string, any> = {
      admission: GraduationCap,
      tuition: BookOpen,
      examination: FileText,
      event: Trophy,
      transport: Bus,
      hostel: Home,
      library: Library,
      lab: Beaker,
      sports: Trophy,
      other: null,
    };
    const Icon = icons[purpose];
    if (!Icon) {
      return <span className="text-lg font-bold">रु</span>;
    }
    return <Icon className="w-5 h-5" />;
  };

  const getPurposeColor = (purpose: string) => {
    const colors: Record<string, string> = {
      admission: 'bg-purple-100 text-purple-800 border-purple-200',
      tuition: 'bg-blue-100 text-blue-800 border-blue-200',
      examination: 'bg-orange-100 text-orange-800 border-orange-200',
      event: 'bg-pink-100 text-pink-800 border-pink-200',
      transport: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      hostel: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      library: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      lab: 'bg-teal-100 text-teal-800 border-teal-200',
      sports: 'bg-green-100 text-green-800 border-green-200',
      other: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[purpose] || colors['other'];
  };

  const filteredStructures = structures.filter(s => {
    if (filterPurpose !== 'all' && s.purpose !== filterPurpose) return false;
    if (filterClass !== 'all' && s.class !== filterClass) return false;
    return true;
  });

  const totalAmount = formData.items.reduce((sum, item) => sum + parseFloat(item.amount.toString() || '0'), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Layers className="w-7 h-7 text-blue-600" />
            Fee Structure Manager
          </h1>
          <p className="text-gray-600 mt-1">Create and manage fee templates for different classes</p>
        </div>
        <Button onClick={() => setModalOpen(true)} icon={<Plus className="w-5 h-5" />}>
          Create New Structure
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Purpose</label>
            <Select
              value={filterPurpose}
              onChange={(e) => setFilterPurpose(e.target.value)}
              options={[
                { value: 'all', label: 'All Purposes' },
                { value: 'admission', label: 'Admission' },
                { value: 'tuition', label: 'Tuition' },
                { value: 'examination', label: 'Examination' },
                { value: 'event', label: 'Event' },
                { value: 'transport', label: 'Transport' },
                { value: 'hostel', label: 'Hostel' },
                { value: 'library', label: 'Library' },
                { value: 'lab', label: 'Lab' },
                { value: 'sports', label: 'Sports' },
                { value: 'other', label: 'Other' },
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Class</label>
            <Select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              options={[
                { value: 'all', label: 'All Classes' },
                ...[...Array(12)].map((_, i) => ({ 
                  value: `${i + 1}`, 
                  label: `Class ${i + 1}` 
                })),
              ]}
            />
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">{filteredStructures.length}</span> structures found
            </div>
          </div>
        </div>
      </div>

      {/* Structure Cards */}
      {loading && structures.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading structures...</p>
        </div>
      ) : filteredStructures.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No fee structures found</h3>
          <p className="text-gray-600 mb-4">Create your first fee structure to get started</p>
          <Button onClick={() => setModalOpen(true)} icon={<Plus className="w-5 h-5" />}>
            Create Fee Structure
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredStructures.map((structure) => (
            <div
              key={structure.id}
              className={`bg-white rounded-xl shadow-sm border-2 transition-all hover:shadow-md ${
                structure.isActive ? 'border-gray-200 hover:border-blue-300' : 'border-gray-100 opacity-60'
              }`}
            >
              {/* Header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{structure.name}</h3>
                      {structure.isTemplate && (
                        <Badge variant="info">
                          <span className="text-xs">Template</span>
                        </Badge>
                      )}
                      {!structure.isActive && (
                        <Badge variant="default">
                          <span className="text-xs">Inactive</span>
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-4 h-4" />
                        Class {structure.class}
                        {structure.section && `-${structure.section}`}
                      </span>
                      <span>•</span>
                      <span>{structure.academicYear}</span>
                    </div>
                    
                    {/* Fee Categories Display */}
                    {structure.items && structure.items.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-gray-500 mb-1.5">Fee Categories:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {structure.items.map((item, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300"
                            >
                              {item.category?.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center gap-1.5 ${getPurposeColor(structure.purpose)}`}>
                    {getPurposeIcon(structure.purpose)}
                    {structure.purpose.charAt(0).toUpperCase() + structure.purpose.slice(1)}
                  </div>
                </div>
              </div>

              {/* Fee Items */}
              <div className="p-5">
                <div className="space-y-2 mb-4">
                  {structure.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-gray-700">{item.category?.name}</span>
                      <span className="font-semibold text-gray-900">NPR {parseFloat(item.amount.toString()).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-900">Total Amount</span>
                    <span className="text-xl font-bold text-blue-900">
                      NPR {parseFloat(structure.totalAmount.toString()).toLocaleString()}
                    </span>
                  </div>
                  {structure.dueDate && (
                    <div className="text-xs text-blue-700 mt-1">
                      Due: {new Date(structure.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => handleEdit(structure)} icon={<Edit className="w-4 h-4" />} className="flex-1">
                    Edit
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => handleClone(structure)} icon={<Copy className="w-4 h-4" />} className="flex-1">
                    Clone
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(structure.id)} icon={<Trash2 className="w-4 h-4" />}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={handleCloseModal} title={editingStructure ? 'Edit Fee Structure' : 'Create Fee Structure'} size="xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <FormInput
                label="Structure Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Class 8 Annual Fee 2024-25"
                required
              />
            </div>
            <Select
              label="Purpose/Type *"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              options={[
                { value: 'admission', label: 'Admission Fee' },
                { value: 'tuition', label: 'Tuition Fee' },
                { value: 'examination', label: 'Examination Fee' },
                { value: 'event', label: 'Event Fee' },
                { value: 'transport', label: 'Transport Fee' },
                { value: 'hostel', label: 'Hostel Fee' },
                { value: 'library', label: 'Library Fee' },
                { value: 'lab', label: 'Lab Fee' },
                { value: 'sports', label: 'Sports Fee' },
                { value: 'other', label: 'Other' },
              ]}
              required
            />
            <FormInput
              label="Academic Year *"
              value={formData.academicYear}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
              placeholder="e.g., 2081-2082"
              required
            />
            <Select
              label="Class *"
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              options={[
                { value: '', label: 'Select Class' },
                ...[...Array(12)].map((_, i) => ({ 
                  value: `${i + 1}`, 
                  label: `Class ${i + 1}` 
                })),
              ]}
              required
            />
            <FormInput
              label="Section (Optional)"
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value.toUpperCase() })}
              placeholder="e.g., A, B, C"
            />
            <FormInput
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
            <div className="md:col-span-2">
              <FormInput
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional notes about this fee structure"
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.isTemplate}
                  onChange={(e) => setFormData({ ...formData, isTemplate: e.target.checked })}
                  className="rounded"
                />
                <span>Save as template (for easy cloning)</span>
              </label>
            </div>
          </div>

          {/* Fee Items */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">Fee Categories *</label>
              <Button type="button" size="sm" variant="secondary" onClick={handleAddItem} icon={<Plus className="w-4 h-4" />}>
                Add Category
              </Button>
            </div>

            {formData.items.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-6 text-center border-2 border-dashed border-gray-300">
                <span className="text-5xl text-gray-400 inline-block mb-2">रु</span>
                <p className="text-gray-600">No fee categories added yet</p>
                <p className="text-sm text-gray-500">Click "Add Category" to start</p>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.items.map((item, index) => (
                  <div key={index} className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg">
                    <div className="flex-1">
                      <Select
                        value={item.feeCategoryId.toString()}
                        onChange={(e) => handleItemChange(index, 'feeCategoryId', parseInt(e.target.value))}
                        options={categories.map((cat) => ({ value: cat.id.toString(), label: cat.name }))}
                        required
                      />
                    </div>
                    <div className="w-40">
                      <FormInput
                        type="number"
                        step="0.01"
                        value={item.amount}
                        onChange={(e) => handleItemChange(index, 'amount', parseFloat(e.target.value) || 0)}
                        placeholder="Amount"
                        required
                      />
                    </div>
                    <Button type="button" size="sm" variant="danger" onClick={() => handleRemoveItem(index)} icon={<X className="w-4 h-4" />}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {formData.items.length > 0 && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-900">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-900">NPR {totalAmount.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} icon={<Check className="w-5 h-5" />}>
              {loading ? 'Saving...' : editingStructure ? 'Update Structure' : 'Create Structure'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FeeStructureManager;
