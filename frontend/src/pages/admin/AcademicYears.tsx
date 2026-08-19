import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, CheckCircle2 } from 'lucide-react';
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

interface AcademicYearItem {
    id: number | string;
    year: string;
    title?: string;
    startDate?: string;
    endDate?: string;
    isCurrent?: boolean;
    isActive?: boolean;
}

const AcademicYears: React.FC = () => {
    const [academicYears, setAcademicYears] = useState<AcademicYearItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingYear, setEditingYear] = useState<AcademicYearItem | null>(null);

    const [formData, setFormData] = useState({
        year: '',
        title: '',
        startDate: '',
        endDate: '',
        isCurrent: 'false',
        isActive: 'true',
    });

    const token =
        typeof window !== 'undefined'
            ? localStorage.getItem('token') || sessionStorage.getItem('token')
            : null;

    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    const fetchAcademicYears = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/academic-years`, {
                headers: authHeaders,
            });
            setAcademicYears(res.data.data || []);
        } catch (error) {
            console.error('Error fetching academic years:', error);
            showError('Failed to load academic years');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAcademicYears();
    }, []);

    const resetForm = () => {
        setFormData({
            year: '',
            title: '',
            startDate: '',
            endDate: '',
            isCurrent: 'false',
            isActive: 'true',
        });
        setEditingYear(null);
    };

    const openCreateModal = () => {
        resetForm();
        setModalOpen(true);
    };

    const openEditModal = (item: AcademicYearItem) => {
        setEditingYear(item);
        setFormData({
            year: item.year || '',
            title: item.title || '',
            startDate: item.startDate || '',
            endDate: item.endDate || '',
            isCurrent: item.isCurrent ? 'true' : 'false',
            isActive: item.isActive ? 'true' : 'false',
        });
        setModalOpen(true);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.year.trim()) {
            showError('Academic year name/code is required');
            return;
        }

        const payload = {
            year: formData.year.trim(),
            title: formData.title.trim() || undefined,
            startDate: formData.startDate || undefined,
            endDate: formData.endDate || undefined,
            isCurrent: formData.isCurrent === 'true',
            isActive: formData.isActive === 'true',
        };

        try {
            setLoading(true);

            if (editingYear) {
                await axios.put(
                    `${API_BASE_URL}/academic-years/${editingYear.id}`,
                    payload,
                    { headers: authHeaders }
                );
                showSuccess('Academic year updated successfully');
            } else {
                await axios.post(`${API_BASE_URL}/academic-years`, payload, {
                    headers: authHeaders,
                });
                showSuccess('Academic year created successfully');
            }

            setModalOpen(false);
            resetForm();
            fetchAcademicYears();
        } catch (error: any) {
            console.error('Error saving academic year:', error);
            showError(error.response?.data?.message || 'Failed to save academic year');
        } finally {
            setLoading(false);
        }
    };

    const handleSetCurrent = async (item: AcademicYearItem) => {
        try {
            setLoading(true);
            await axios.patch(
                `${API_BASE_URL}/academic-years/${item.id}/set-current`,
                {},
                { headers: authHeaders }
            );
            showSuccess(`Academic year ${item.year} set as active current year`);
            fetchAcademicYears();
        } catch (error: any) {
            console.error('Error setting active academic year:', error);
            showError('Failed to set current academic year');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (item: AcademicYearItem) => {
        const result = await showDeleteConfirm('this academic year');
        if (!result.isConfirmed) return;

        try {
            setLoading(true);
            await axios.delete(`${API_BASE_URL}/academic-years/${item.id}`, {
                headers: authHeaders,
            });
            showSuccess('Academic year deleted successfully');
            fetchAcademicYears();
        } catch (error) {
            console.error('Error deleting academic year:', error);
            showError('Failed to delete academic year');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            key: 'year',
            label: 'Academic Year',
        },
        {
            key: 'title',
            label: 'Title / Session',
            render: (val: any) => val || '-',
        },
        {
            key: 'startDate',
            label: 'Start Date',
            render: (val: any) => val || '-',
        },
        {
            key: 'endDate',
            label: 'End Date',
            render: (val: any) => val || '-',
        },
        {
            key: 'isCurrent',
            label: 'Current Year',
            render: (val: any) => {
                const current = typeof val === 'object' && val !== null ? val.isCurrent : val;
                return current ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        <CheckCircle2 className="w-3 h-3" /> Active Session
                    </span>
                ) : (
                    <span className="text-gray-400 text-sm">-</span>
                );
            },
        },
        {
            key: 'isActive',
            label: 'Status',
            render: (val: any) => {
                const active = typeof val === 'object' && val !== null ? val.isActive : val;
                return (
                    <span className={active ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                        {active ? 'Active' : 'Inactive'}
                    </span>
                );
            },
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Academic Year Management
                    </h1>
                    <p className="text-sm text-gray-600">
                        Configure academic sessions and active school years.
                    </p>
                </div>

                <Button
                    variant="primary"
                    size="md"
                    icon={<Plus className="w-4 h-4" />}
                    onClick={openCreateModal}
                >
                    Add Academic Year
                </Button>
            </div>

            <DataTable<AcademicYearItem>
                data={academicYears}
                columns={columns}
                loading={loading}
                searchPlaceholder="Search academic year..."
                actions={row => (
                    <div className="flex items-center justify-end gap-2">
                        {!row.isCurrent && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={e => {
                                    e.stopPropagation();
                                    handleSetCurrent(row);
                                }}
                            >
                                Set Current
                            </Button>
                        )}

                        <Button
                            variant="outline"
                            size="sm"
                            icon={<Edit className="w-4 h-4" />}
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
                            icon={<Trash2 className="w-4 h-4" />}
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

            <Modal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    resetForm();
                }}
                title={editingYear ? 'Edit Academic Year' : 'Add Academic Year'}
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
                            {editingYear ? 'Update' : 'Create'}
                        </Button>
                    </div>
                }
            >
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        label="Academic Year"
                        name="year"
                        required
                        value={formData.year}
                        onChange={handleChange}
                        placeholder="e.g. 2081 or 2025-2026"
                    />

                    <FormInput
                        label="Title / Label"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Session 2081-2082"
                    />

                    <FormInput
                        label="Start Date"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange}
                    />

                    <FormInput
                        label="End Date"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleChange}
                    />

                    <Select
                        label="Set as Current Active Year"
                        name="isCurrent"
                        value={formData.isCurrent}
                        onChange={handleChange}
                        options={[
                            { value: 'false', label: 'No' },
                            { value: 'true', label: 'Yes' },
                        ]}
                    />

                    <Select
                        label="Status"
                        name="isActive"
                        value={formData.isActive}
                        onChange={handleChange}
                        options={[
                            { value: 'true', label: 'Active' },
                            { value: 'false', label: 'Inactive' },
                        ]}
                    />
                </form>
            </Modal>
        </div>
    );
};

export default AcademicYears;