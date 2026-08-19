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

interface SubjectItem {
    id: number | string;
    subjectName: string;
    subjectCode: string;
    subjectType?: string;
    description?: string;
    isOptional?: boolean;
    isActive?: boolean;
    academicYearId?: number;
    academicYear?: AcademicYear;
}

const Subjects: React.FC = () => {
    const [subjects, setSubjects] = useState<SubjectItem[]>([]);
    const [currentYear, setCurrentYear] = useState<AcademicYear | null>(null);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<SubjectItem | null>(null);

    const [formData, setFormData] = useState({
        subjectName: '',
        subjectCode: '',
        subjectType: 'THEORY',
        description: '',
        status: 'active',
        isOptional: 'false',
    });

    const token =
        typeof window !== 'undefined'
            ? localStorage.getItem('token') || sessionStorage.getItem('token')
            : null;

    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    const fetchCurrentAcademicYear = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/academic-years?isCurrent=true`, {
                headers: authHeaders,
            });
            if (res.data.data && res.data.data.length > 0) {
                setCurrentYear(res.data.data[0]);
            }
        } catch (error) {
            console.error('Error fetching current academic year:', error);
        }
    };

    const fetchSubjects = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/subjects`, {
                headers: authHeaders,
            });
            setSubjects(res.data.data || []);
        } catch (error) {
            console.error('Error fetching subjects:', error);
            showError('Failed to load subjects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentAcademicYear();
        fetchSubjects();
    }, []);

    const resetForm = () => {
        setFormData({
            subjectName: '',
            subjectCode: '',
            subjectType: 'THEORY',
            description: '',
            status: 'active',
            isOptional: 'false',
        });
        setEditingSubject(null);
    };

    const openCreateModal = () => {
        if (!currentYear) {
            showError('No active Academic Year found. Please configure an active Academic Year first.');
            return;
        }
        resetForm();
        setModalOpen(true);
    };

    const openEditModal = (subject: SubjectItem) => {
        setEditingSubject(subject);
        setFormData({
            subjectName: subject.subjectName || '',
            subjectCode: subject.subjectCode || '',
            subjectType: subject.subjectType || 'THEORY',
            description: subject.description || '',
            status: subject.isActive ? 'active' : 'inactive',
            isOptional: subject.isOptional ? 'true' : 'false',
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

        if (!formData.subjectName.trim()) {
            showError('Subject name is required');
            return;
        }

        if (!formData.subjectCode.trim()) {
            showError('Subject code is required');
            return;
        }

        const payload = {
            subjectName: formData.subjectName.trim(),
            subjectCode: formData.subjectCode.trim().toUpperCase(),
            subjectType: formData.subjectType,
            description: formData.description.trim() || undefined,
            isActive: formData.status === 'active',
            isOptional: formData.isOptional === 'true',
            academicYearId: currentYear?.id,
        };

        try {
            setLoading(true);

            if (editingSubject) {
                await axios.put(
                    `${API_BASE_URL}/subjects/${editingSubject.id}`,
                    payload,
                    { headers: authHeaders }
                );
                showSuccess('Subject updated successfully');
            } else {
                await axios.post(`${API_BASE_URL}/subjects`, payload, {
                    headers: authHeaders,
                });
                showSuccess('Subject created successfully');
            }

            setModalOpen(false);
            resetForm();
            fetchSubjects();
        } catch (error: any) {
            console.error('Error saving subject:', error);
            showError(error.response?.data?.message || 'Failed to save subject');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (subject: SubjectItem) => {
        const result = await showDeleteConfirm('this subject');
        if (!result.isConfirmed) return;

        try {
            setLoading(true);
            await axios.delete(`${API_BASE_URL}/subjects/${subject.id}`, {
                headers: authHeaders,
            });
            showSuccess('Subject deleted successfully');
            fetchSubjects();
        } catch (error) {
            console.error('Error deleting subject:', error);
            showError('Failed to delete subject');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            key: 'academicYear',
            label: 'Academic Year',
            render: (val: any, row?: SubjectItem) => {
                const yearObj = row?.academicYear || val;
                return yearObj?.year ? (
                    <span className="font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md text-xs">
                        {yearObj.year}
                    </span>
                ) : (
                    '-'
                );
            },
        },
        {
            key: 'subjectCode',
            label: 'Subject Code',
        },
        {
            key: 'subjectName',
            label: 'Subject Name',
        },
        {
            key: 'subjectType',
            label: 'Type',
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
        {
            key: 'isOptional',
            label: 'Is Optional',
            render: (val: any) => {
                const optional = typeof val === 'object' && val !== null ? val.isOptional : val;
                return (
                    <span className={optional ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                        {optional ? 'Yes' : 'No'}
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
                        Subject Management
                    </h1>
                    <p className="text-sm text-gray-600">
                        Manage subjects, codes, types, and academic year assignments.
                    </p>
                </div>

                <Button
                    variant="primary"
                    size="md"
                    icon={<Plus className="w-4 h-4" />}
                    onClick={openCreateModal}
                >
                    Add Subject
                </Button>
            </div>

            <DataTable<SubjectItem>
                data={subjects}
                columns={columns}
                loading={loading}
                searchPlaceholder="Search subjects..."
                actions={row => (
                    <div className="flex items-center justify-end gap-2">
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
                title={editingSubject ? 'Edit Subject' : 'Add Subject'}
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
                            {editingSubject ? 'Update' : 'Create'}
                        </Button>
                    </div>
                }
            >
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    {/* Read-Only Top Academic Year Field */}
                    <div className="md:col-span-2">
                        <FormInput
                            label="Academic Year (Active Session)"
                            name="academicYearDisplay"
                            value={
                                editingSubject?.academicYear?.year ||
                                currentYear?.year ||
                                'No Active Session Set'
                            }
                            disabled
                            className="bg-gray-100 text-gray-700 font-semibold cursor-not-allowed"
                        />
                    </div>

                    <FormInput
                        label="Subject Name"
                        name="subjectName"
                        required
                        value={formData.subjectName}
                        onChange={handleChange}
                        placeholder="e.g. Mathematics"
                    />

                    <FormInput
                        label="Subject Code"
                        name="subjectCode"
                        required
                        value={formData.subjectCode}
                        onChange={handleChange}
                        placeholder="e.g. MATH101"
                    />

                    <Select
                        label="Subject Type"
                        name="subjectType"
                        value={formData.subjectType}
                        onChange={handleChange}
                        options={[
                            { value: 'THEORY', label: 'Theory' },
                            { value: 'PRACTICAL', label: 'Practical' },
                            { value: 'BOTH', label: 'Both' },
                        ]}
                    />

                    <Select
                        label="Status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        options={[
                            { value: 'active', label: 'Active' },
                            { value: 'inactive', label: 'Inactive' },
                        ]}
                    />

                    <Select
                        label="Is Optional"
                        name="isOptional"
                        value={formData.isOptional}
                        onChange={handleChange}
                        options={[
                            { value: 'true', label: 'Yes' },
                            { value: 'false', label: 'No' },
                        ]}
                    />

                    <div className="md:col-span-2">
                        <FormInput
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Optional subject description"
                        />
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Subjects;