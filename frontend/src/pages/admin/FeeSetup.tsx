import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, FolderPlus, List } from 'lucide-react';
import Button from '../../components/shared/Button';
import FormInput from '../../components/shared/FormInput';
import Select from '../../components/shared/Select';
import Modal from '../../components/shared/Modal';
import DataTable from '../../components/shared/DataTable';
import Badge from '../../components/shared/Badge';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';
import { showSuccess, showError, showDeleteConfirm } from '../../utils/sweetAlert';

interface FeeCategory {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  displayOrder: number;
}

interface FeeStructure {
  id: number;
  name: string;
  academicYear: string;
  class: string;
  section: string;
  totalAmount: number;
  isActive: boolean;
  dueDate: string;
  items?: FeeStructureItem[];
}

interface FeeStructureItem {
  feeCategoryId: number;
  amount: number;
  description: string;
  category?: FeeCategory;
}

const FeeSetup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'categories' | 'structures'>('categories');
  const [categories, setCategories] = useState<FeeCategory[]>([]);
  const [structures, setStructures] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(false);

  // Category Modal State
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FeeCategory | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    isActive: true,
    displayOrder: 0,
  });

  // Structure Modal State
  const [structureModalOpen, setStructureModalOpen] = useState(false);
  const [editingStructure, setEditingStructure] = useState<FeeStructure | null>(null);
  const [structureFormData, setStructureFormData] = useState({
    name: '',
    academicYear: '2081-2082',
    class: '',
    section: '',
    description: '',
    dueDate: '',
    items: [] as FeeStructureItem[],
  });

  const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

  useEffect(() => {
    fetchCategories();
    fetchStructures();
  }, []);

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/fee-management/categories`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showError('Error fetching fee categories');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Structures
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

  // Category Handlers
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingCategory) {
        await axios.put(
          `${API_BASE_URL}/fee-management/categories/${editingCategory.id}`,
          categoryFormData,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        showSuccess('Category updated successfully');
      } else {
        await axios.post(
          `${API_BASE_URL}/fee-management/categories`,
          categoryFormData,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        showSuccess('Category created successfully');
      }
      fetchCategories();
      handleCloseCategoryModal();
    } catch (error: any) {
      showError(error.response?.data?.message || 'Error saving category');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (category: FeeCategory) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description || '',
      isActive: category.isActive,
      displayOrder: category.displayOrder || 0,
    });
    setCategoryModalOpen(true);
  };

  const handleDeleteCategory = async (id: number) => {
    const confirmed = await showDeleteConfirm('This will deactivate the category');
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/fee-management/categories/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      showSuccess('Category deactivated successfully');
      fetchCategories();
    } catch (error) {
      showError('Error deactivating category');
    }
  };

  const handleCloseCategoryModal = () => {
    setCategoryModalOpen(false);
    setEditingCategory(null);
    setCategoryFormData({
      name: '',
      description: '',
      isActive: true,
      displayOrder: 0,
    });
  };

  // Structure Handlers
  const handleStructureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (structureFormData.items.length === 0) {
      showError('Please add at least one fee item');
      return;
    }

    try {
      setLoading(true);
      const data = {
        ...structureFormData,
        items: structureFormData.items.map((item) => ({
          feeCategoryId: parseInt(item.feeCategoryId.toString()),
          amount: parseFloat(item.amount.toString()),
          description: item.description,
        })),
      };

      if (editingStructure) {
        await axios.put(
          `${API_BASE_URL}/fee-management/structures/${editingStructure.id}`,
          data,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        showSuccess('Fee structure updated successfully');
      } else {
        await axios.post(`${API_BASE_URL}/fee-management/structures`, data, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        showSuccess('Fee structure created successfully');
      }
      fetchStructures();
      handleCloseStructureModal();
    } catch (error: any) {
      showError(error.response?.data?.message || 'Error saving fee structure');
    } finally {
      setLoading(false);
    }
  };

  const handleEditStructure = (structure: FeeStructure) => {
    setEditingStructure(structure);
    setStructureFormData({
      name: structure.name,
      academicYear: structure.academicYear,
      class: structure.class,
      section: structure.section || '',
      description: '',
      dueDate: structure.dueDate || '',
      items: structure.items || [],
    });
    setStructureModalOpen(true);
  };

  const handleDeleteStructure = async (id: number) => {
    const confirmed = await showDeleteConfirm('This will deactivate the fee structure');
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/fee-management/structures/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      showSuccess('Fee structure deactivated successfully');
      fetchStructures();
    } catch (error) {
      showError('Error deactivating fee structure');
    }
  };

  const handleCloseStructureModal = () => {
    setStructureModalOpen(false);
    setEditingStructure(null);
    setStructureFormData({
      name: '',
      academicYear: '2081-2082',
      class: '',
      section: '',
      description: '',
      dueDate: '',
      items: [],
    });
  };

  const handleAddItem = () => {
    setStructureFormData({
      ...structureFormData,
      items: [
        ...structureFormData.items,
        { feeCategoryId: 0, amount: 0, description: '' },
      ],
    });
  };

  const handleRemoveItem = (index: number) => {
    setStructureFormData({
      ...structureFormData,
      items: structureFormData.items.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...structureFormData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setStructureFormData({ ...structureFormData, items: updatedItems });
  };

  // Category Columns
  const categoryColumns = [
    { key: 'name', label: 'Category Name' },
    { key: 'description', label: 'Description' },
    { key: 'displayOrder', label: 'Order' },
    {
      key: 'isActive',
      label: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'success' : 'danger'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  // Structure Columns
  const structureColumns = [
    { key: 'name', label: 'Structure Name' },
    { key: 'academicYear', label: 'Academic Year' },
    { key: 'class', label: 'Class' },
    { key: 'section', label: 'Section' },
    {
      key: 'totalAmount',
      label: 'Total Amount',
      render: (value: number) => `NPR ${value.toFixed(2)}`,
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'success' : 'danger'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Fee Setup</h2>
        <p className="text-gray-600">Manage fee categories and structures</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'categories'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <List className="w-4 h-4 inline mr-2" />
            Fee Categories
          </button>
          <button
            onClick={() => setActiveTab('structures')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'structures'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FolderPlus className="w-4 h-4 inline mr-2" />
            Fee Structures
          </button>
        </nav>
      </div>

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              icon={<Plus className="w-5 h-5" />}
              onClick={() => setCategoryModalOpen(true)}
            >
              Add Category
            </Button>
          </div>

          <DataTable
            data={categories}
            columns={categoryColumns}
            loading={loading}
            searchPlaceholder="Search categories..."
            actions={(category: FeeCategory) => (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          />
        </div>
      )}

      {/* Structures Tab */}
      {activeTab === 'structures' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              icon={<Plus className="w-5 h-5" />}
              onClick={() => setStructureModalOpen(true)}
            >
              Add Structure
            </Button>
          </div>

          <DataTable
            data={structures}
            columns={structureColumns}
            loading={loading}
            searchPlaceholder="Search fee structures..."
            actions={(structure: FeeStructure) => (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditStructure(structure)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteStructure(structure.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          />
        </div>
      )}

      {/* Category Modal */}
      <Modal
        isOpen={categoryModalOpen}
        onClose={handleCloseCategoryModal}
        title={editingCategory ? 'Edit Fee Category' : 'Add Fee Category'}
      >
        <form onSubmit={handleCategorySubmit} className="space-y-4">
          <FormInput
            label="Category Name *"
            value={categoryFormData.name}
            onChange={(e) =>
              setCategoryFormData({ ...categoryFormData, name: e.target.value })
            }
            required
          />
          <FormInput
            label="Description"
            value={categoryFormData.description}
            onChange={(e) =>
              setCategoryFormData({ ...categoryFormData, description: e.target.value })
            }
          />
          <FormInput
            label="Display Order"
            type="number"
            value={categoryFormData.displayOrder}
            onChange={(e) =>
              setCategoryFormData({
                ...categoryFormData,
                displayOrder: parseInt(e.target.value),
              })
            }
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={categoryFormData.isActive}
              onChange={(e) =>
                setCategoryFormData({ ...categoryFormData, isActive: e.target.checked })
              }
              className="rounded"
            />
            <label>Active</label>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseCategoryModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Structure Modal */}
      <Modal
        isOpen={structureModalOpen}
        onClose={handleCloseStructureModal}
        title={editingStructure ? 'Edit Fee Structure' : 'Add Fee Structure'}
        size="large"
      >
        <form onSubmit={handleStructureSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Structure Name *"
              value={structureFormData.name}
              onChange={(e) =>
                setStructureFormData({ ...structureFormData, name: e.target.value })
              }
              required
            />
            <FormInput
              label="Academic Year *"
              value={structureFormData.academicYear}
              onChange={(e) =>
                setStructureFormData({
                  ...structureFormData,
                  academicYear: e.target.value,
                })
              }
              placeholder="e.g., 2081-2082"
              required
            />
            <FormInput
              label="Class *"
              value={structureFormData.class}
              onChange={(e) =>
                setStructureFormData({ ...structureFormData, class: e.target.value })
              }
              placeholder="e.g., 8, 9, 10"
              required
            />
            <FormInput
              label="Section"
              value={structureFormData.section}
              onChange={(e) =>
                setStructureFormData({ ...structureFormData, section: e.target.value })
              }
              placeholder="e.g., A, B (optional)"
            />
            <FormInput
              label="Due Date"
              type="date"
              value={structureFormData.dueDate}
              onChange={(e) =>
                setStructureFormData({ ...structureFormData, dueDate: e.target.value })
              }
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold">Fee Items</h4>
              <Button type="button" size="small" onClick={handleAddItem}>
                <Plus className="w-4 h-4 mr-1" /> Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {structureFormData.items.map((item, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <Select
                    label="Category *"
                    value={item.feeCategoryId}
                    onChange={(e) =>
                      handleItemChange(index, 'feeCategoryId', parseInt(e.target.value))
                    }
                    options={[
                      { value: '', label: 'Select Category' },
                      ...categories
                        .filter((c) => c.isActive)
                        .map((c) => ({ value: c.id, label: c.name })),
                    ]}
                    required
                  />
                  <FormInput
                    label="Amount *"
                    type="number"
                    step="0.01"
                    value={item.amount}
                    onChange={(e) =>
                      handleItemChange(index, 'amount', parseFloat(e.target.value))
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="mt-8 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button type="button" variant="secondary" onClick={handleCloseStructureModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Structure'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FeeSetup;
