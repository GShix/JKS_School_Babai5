import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';

import DataTable from '../../components/shared/DataTable';
import Button from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import FormInput from '../../components/shared/FormInput';
import Select from '../../components/shared/Select';

import { API_BASE_URL } from '../../api/config';
import {
  showError,
  showSuccess,
  showDeleteConfirm,
} from '../../utils/sweetAlert';

interface AcademicYear {
  id: number;
  year: string;
  title?: string;
  isCurrent?: boolean;
}

interface FeeCategory {
  id: number;
  name: string;
  description?: string;
  isActive?: boolean;
}

interface FeeStructureItem {
  id?: number;
  feeCategoryId: number;
  amount: number | string;
  description?: string;
  category?: FeeCategory;
}

interface FeeStructure {
  id: number;
  name: string;
  academicYear: string;
  class: string;
  section?: string | null;
  totalAmount: number | string;
  description?: string | null;
  isActive: boolean;
  dueDate?: string | null;
  purpose: string;
  isTemplate: boolean;
  clonedFrom?: number | null;
  items?: FeeStructureItem[];
  createdAt?: string;
  updatedAt?: string;
}

const FeeStructurePage: React.FC = () => {
  const [structures, setStructures] = useState<FeeStructure[]>([]);
  const [categories, setCategories] = useState<FeeCategory[]>([]);
  const [currentYear, setCurrentYear] = useState<AcademicYear | null>(null);

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [editingStructure, setEditingStructure] =
    useState<FeeStructure | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    class: '',
    section: '',
    description: '',
    dueDate: '',
    purpose: 'tuition',
    isTemplate: false,
  });

  const [feeItems, setFeeItems] = useState<FeeStructureItem[]>([
    {
      feeCategoryId: 0,
      amount: '',
      description: '',
    },
  ]);

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token') ||
      sessionStorage.getItem('token')
      : null;

  const authHeaders = token
    ? {
      Authorization: `Bearer ${token}`,
    }
    : {};

  // ============================================================
  // FETCH CURRENT ACADEMIC YEAR
  // ============================================================

  const fetchCurrentAcademicYear = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/academic-years?isCurrent=true`,
        {
          headers: authHeaders,
        }
      );

      if (res.data.data && res.data.data.length > 0) {
        setCurrentYear(res.data.data[0]);
      } else {
        setCurrentYear(null);
      }
    } catch (error) {
      console.error(
        'Error fetching current academic year:',
        error
      );
      setCurrentYear(null);
    }
  };

  // ============================================================
  // FETCH FEE STRUCTURES
  // ============================================================

  const fetchFeeStructures = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_BASE_URL}/fee-management/structures`,
        {
          headers: authHeaders,
        }
      );

      setStructures(res.data.data || []);
    } catch (error) {
      console.error('Error fetching fee structures:', error);
      showError('Failed to load fee structures');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // FETCH FEE CATEGORIES
  // ============================================================

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/fee-management/categories`,
        {
          headers: authHeaders,
        }
      );

      setCategories(res.data.data || []);
    } catch (error) {
      console.error('Error fetching fee categories:', error);
      showError('Failed to load fee categories');
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    fetchCurrentAcademicYear();
    fetchFeeStructures();
    fetchCategories();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================================
  // RESET FORM
  // ============================================================

  const resetForm = () => {
    setFormData({
      name: '',
      class: '',
      section: '',
      description: '',
      dueDate: '',
      purpose: 'tuition',
      isTemplate: false,
    });

    setFeeItems([
      {
        feeCategoryId: 0,
        amount: '',
        description: '',
      },
    ]);

    setEditingStructure(null);
  };

  // ============================================================
  // CREATE MODAL
  // ============================================================

  const openCreateModal = () => {
    if (!currentYear) {
      showError(
        'No active Academic Year found. Please configure an active Academic Year first.'
      );
      return;
    }

    resetForm();
    setModalOpen(true);
  };

  // ============================================================
  // EDIT MODAL
  // ============================================================

  const openEditModal = (item: FeeStructure) => {
    setEditingStructure(item);

    setFormData({
      name: item.name || '',
      class: item.class || '',
      section: item.section || '',
      description: item.description || '',
      dueDate: item.dueDate || '',
      purpose: item.purpose || 'tuition',
      isTemplate: item.isTemplate || false,
    });

    setFeeItems(
      item.items && item.items.length > 0
        ? item.items.map(feeItem => ({
          feeCategoryId: feeItem.feeCategoryId,
          amount: feeItem.amount,
          description: feeItem.description || '',
        }))
        : [
          {
            feeCategoryId: 0,
            amount: '',
            description: '',
          },
        ]
    );

    setModalOpen(true);
  };

  // ============================================================
  // FORM CHANGE
  // ============================================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================================
  // FEE ITEM CHANGE
  // ============================================================

  const handleFeeItemChange = (
    index: number,
    field: keyof FeeStructureItem,
    value: string | number
  ) => {
    setFeeItems(prev =>
      prev.map((item, itemIndex) =>
        itemIndex === index
          ? {
            ...item,
            [field]: value,
          }
          : item
      )
    );
  };

  // ============================================================
  // ADD FEE ITEM
  // ============================================================

  const addFeeItem = () => {
    setFeeItems(prev => [
      ...prev,
      {
        feeCategoryId: 0,
        amount: '',
        description: '',
      },
    ]);
  };

  // ============================================================
  // REMOVE FEE ITEM
  // ============================================================

  const removeFeeItem = (index: number) => {
    if (feeItems.length === 1) {
      return;
    }

    setFeeItems(prev =>
      prev.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  // ============================================================
  // TOTAL AMOUNT
  // ============================================================

  const totalAmount = feeItems.reduce(
    (sum, item) => sum + (parseFloat(String(item.amount)) || 0),
    0
  );

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentYear) {
      showError(
        'No active Academic Year found. Please configure an active Academic Year first.'
      );
      return;
    }

    if (!formData.name.trim()) {
      showError('Fee structure name is required');
      return;
    }

    if (!formData.class.trim()) {
      showError('Class is required');
      return;
    }

    if (!feeItems.length) {
      showError('At least one fee item is required');
      return;
    }

    const invalidItem = feeItems.some(
      item =>
        !item.feeCategoryId ||
        parseFloat(String(item.amount)) < 0 ||
        item.amount === ''
    );

    if (invalidItem) {
      showError(
        'Please select a category and enter a valid amount for every fee item'
      );
      return;
    }

    const payload = {
      name: formData.name.trim(),

      // Active Academic Year
      academicYear: currentYear.year,

      class: formData.class.trim(),

      section: formData.section.trim() || undefined,

      description:
        formData.description.trim() || undefined,

      dueDate:
        formData.dueDate || undefined,

      purpose: formData.purpose,

      isTemplate: formData.isTemplate,

      items: feeItems.map(item => ({
        feeCategoryId: Number(item.feeCategoryId),
        amount: parseFloat(String(item.amount)),
        description:
          item.description?.trim() || undefined,
      })),
    };

    try {
      setLoading(true);

      if (editingStructure) {
        await axios.put(
          `${API_BASE_URL}/fee-management/structures/${editingStructure.id}`,
          payload,
          {
            headers: authHeaders,
          }
        );

        showSuccess(
          'Fee structure updated successfully'
        );
      } else {
        await axios.post(
          `${API_BASE_URL}/fee-management/structures`,
          payload,
          {
            headers: authHeaders,
          }
        );

        showSuccess(
          'Fee structure created successfully'
        );
      }

      setModalOpen(false);
      resetForm();
      fetchFeeStructures();
    } catch (error: any) {
      console.error(
        'Error saving fee structure:',
        error
      );

      showError(
        error.response?.data?.message ||
        'Failed to save fee structure'
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // DELETE
  // ============================================================

  const handleDelete = async (item: FeeStructure) => {
    const result = await showDeleteConfirm(
      'this fee structure'
    );

    if (!result.isConfirmed) return;

    try {
      setLoading(true);

      await axios.delete(
        `${API_BASE_URL}/fee-management/structures/${item.id}`,
        {
          headers: authHeaders,
        }
      );

      showSuccess(
        'Fee structure deactivated successfully'
      );

      fetchFeeStructures();
    } catch (error) {
      console.error(
        'Error deleting fee structure:',
        error
      );

      showError(
        'Failed to delete fee structure'
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // TABLE COLUMNS
  // ============================================================

  const columns = [
    {
      key: 'academicYear',
      label: 'Academic Year',
      render: (val: any) => {
        return val ? (
          <span className="font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md text-xs">
            {val}
          </span>
        ) : (
          '-'
        );
      },
    },
    {
      key: 'name',
      label: 'Name',
    },
    {
      key: 'class',
      label: 'Class',
    },
    {
      key: 'section',
      label: 'Section',
      render: (val: any) => val || 'All',
    },
    {
      key: 'purpose',
      label: 'Purpose',
      render: (val: any) => (
        <span className="capitalize">
          {val || '-'}
        </span>
      ),
    },
    {
      key: 'totalAmount',
      label: 'Total Amount',
      render: (val: any) => (
        <span className="font-semibold">
          Rs. {Number(val || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (val: boolean) =>
        val ? (
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-green-50 text-green-700">
            Active
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-700">
            Inactive
          </span>
        ),
    },
  ];

  return (
    <div className="space-y-4">

      {/* =====================================================
                HEADER
            ====================================================== */}

      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Fee Structure Management
          </h1>

          <p className="text-sm text-gray-600">
            Manage class-wise fee structures,
            categories, amounts, and academic years.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={openCreateModal}
        >
          Add Fee Structure
        </Button>
      </div>

      {/* =====================================================
                TABLE
            ====================================================== */}

      <DataTable<FeeStructure>
        data={structures}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search fee structures..."
        actions={row => (
          <div className="flex items-center justify-end gap-2">

            <Button
              variant="outline"
              size="sm"
              icon={
                <Edit className="w-4 h-4" />
              }
              onClick={e => {
                e.stopPropagation();
                openEditModal(row);
              }}
            >
              Edit
            </Button>

            <Button
              variant="danger"
              size="sm"
              icon={
                <Trash2 className="w-4 h-4" />
              }
              onClick={e => {
                e.stopPropagation();
                handleDelete(row);
              }}
            >
              Delete
            </Button>

          </div>
        )}
      />

      {/* =====================================================
                MODAL
            ====================================================== */}

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        title={
          editingStructure
            ? 'Edit Fee Structure'
            : 'Add Fee Structure'
        }
        size="lg"
        footer={
          <div className="flex justify-end gap-2">

            <Button
              variant="secondary"
              onClick={() => {
                setModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              type="submit"
              onClick={handleSubmit as any}
              loading={loading}
            >
              {editingStructure
                ? 'Update'
                : 'Create'}
            </Button>

          </div>
        }
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* =================================================
                        ACTIVE ACADEMIC YEAR
                    ================================================== */}

          <div>
            <FormInput
              label="Academic Year (Active Session)"
              name="academicYearDisplay"
              value={
                currentYear?.year ||
                'No Active Session Set'
              }
              disabled
              className="bg-gray-100 text-gray-700 font-semibold cursor-not-allowed"
            />
          </div>

          {/* =================================================
                        BASIC INFORMATION
                    ================================================== */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <FormInput
              label="Fee Structure Name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Class 8 Annual Fee"
            />

            <FormInput
              label="Class"
              name="class"
              required
              value={formData.class}
              onChange={handleChange}
              placeholder="e.g. LKG, Nursery, 1, 2, 10"
            />

            <FormInput
              label="Section"
              name="section"
              value={formData.section}
              onChange={handleChange}
              placeholder="e.g. A, B"
            />

            <Select
              label="Purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              options={[
                {
                  value: 'admission',
                  label: 'Admission',
                },
                {
                  value: 'tuition',
                  label: 'Tuition',
                },
                {
                  value: 'examination',
                  label: 'Examination',
                },
                {
                  value: 'event',
                  label: 'Event',
                },
                {
                  value: 'transport',
                  label: 'Transport',
                },
                {
                  value: 'hostel',
                  label: 'Hostel',
                },
                {
                  value: 'library',
                  label: 'Library',
                },
                {
                  value: 'lab',
                  label: 'Lab',
                },
                {
                  value: 'sports',
                  label: 'Sports',
                },
                {
                  value: 'other',
                  label: 'Other',
                },
              ]}
            />

            <FormInput
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
            />

          </div>

          {/* =================================================
                        DESCRIPTION
                    ================================================== */}

          <FormInput
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional description or notes"
          />

          {/* =================================================
                        FEE ITEMS
                    ================================================== */}

          <div className="border rounded-lg p-4">

            <div className="flex items-center justify-between mb-4">

              <div>
                <h3 className="font-semibold text-gray-900">
                  Fee Items
                </h3>

                <p className="text-xs text-gray-500">
                  Add fee categories and their
                  amounts.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={
                  <Plus className="w-4 h-4" />
                }
                onClick={addFeeItem}
              >
                Add Item
              </Button>

            </div>

            <div className="space-y-3">

              {feeItems.map(
                (item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end"
                  >

                    {/* Category */}

                    <div className="md:col-span-4">

                      <Select
                        label={
                          index === 0
                            ? 'Fee Category'
                            : ''
                        }
                        name={`feeCategory-${index}`}
                        value={String(
                          item.feeCategoryId ||
                          ''
                        )}
                        onChange={e =>
                          handleFeeItemChange(
                            index,
                            'feeCategoryId',
                            Number(
                              e.target
                                .value
                            )
                          )
                        }
                        options={[
                          {
                            value: '',
                            label: 'Select Category',
                          },
                          ...categories.map(
                            category => ({
                              value: String(
                                category.id
                              ),
                              label:
                                category.name,
                            })
                          ),
                        ]}
                      />

                    </div>

                    {/* Amount */}

                    <div className="md:col-span-3">

                      <FormInput
                        label={
                          index === 0
                            ? 'Amount'
                            : ''
                        }
                        name={`amount-${index}`}
                        type="number"
                        min={0}
                        step="0.01"
                        value={
                          item.amount
                        }
                        onChange={e =>
                          handleFeeItemChange(
                            index,
                            'amount',
                            e.target
                              .value
                          )
                        }
                        placeholder="0.00"
                      />

                    </div>

                    {/* Description */}

                    <div className="md:col-span-3">

                      <FormInput
                        label={
                          index === 0
                            ? 'Description'
                            : ''
                        }
                        name={`itemDescription-${index}`}
                        value={
                          item.description ||
                          ''
                        }
                        onChange={e =>
                          handleFeeItemChange(
                            index,
                            'description',
                            e.target
                              .value
                          )
                        }
                        placeholder="Optional"
                      />

                    </div>

                    {/* Remove */}

                    <div className="md:col-span-1">

                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        icon={
                          <Trash2 className="w-5 h-7" />
                        }
                        onClick={() =>
                          removeFeeItem(
                            index
                          )
                        }
                        disabled={
                          feeItems.length ===
                          1
                        }
                      >
                      </Button>

                    </div>

                  </div>
                )
              )}

            </div>

            {/* Total */}

            <div className="flex justify-end mt-5 pt-4 border-t">

              <div className="text-right">

                <p className="text-sm text-gray-500">
                  Total Fee
                </p>

                <p className="text-xl font-bold text-gray-900">
                  Rs.{' '}
                  {totalAmount.toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
                        TEMPLATE
                    ================================================== */}

          <div className="flex items-center gap-2">

            <input
              id="isTemplate"
              type="checkbox"
              name="isTemplate"
              checked={formData.isTemplate}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  isTemplate:
                    e.target.checked,
                }))
              }
              className="w-4 h-4"
            />

            <label
              htmlFor="isTemplate"
              className="text-sm text-gray-700"
            >
              Save as template
            </label>

          </div>

        </form>
      </Modal>
    </div>
  );
};

export default FeeStructurePage;