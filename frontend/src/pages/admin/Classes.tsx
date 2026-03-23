import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import DataTable from '../../components/shared/DataTable';
import Button from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import FormInput from '../../components/shared/FormInput';
import Select from '../../components/shared/Select';
import { API_BASE_URL } from '../../api/config';
import { showError, showSuccess, showDeleteConfirm } from '../../utils/sweetAlert';

interface ClassItem {
    id: number;
    name: string;
    medium?: string;
    section?: string;
    department?: string;
    status: string;
    totalStudents?: number;
}

const Classes: React.FC = () => {
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        medium: '',
        section: '',
        department: '',
        status: 'active',
        totalStudents: '' as string | number,
    });

    const token =
        typeof window !== 'undefined'
            ? localStorage.getItem('token') || sessionStorage.getItem('token')
            : null;

    const authHeaders = token
        ? {
            Authorization: `Bearer ${token}`,
        }
        : {};

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/classes`, {
                headers: authHeaders,
            });
            setClasses(res.data.data || []);
        } catch (error) {
            console.error('Error fetching classes:', error);
            showError('Failed to load classes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const resetForm = () => {
        setFormData({
            name: '',
            medium: '',
            section: '',
            department: '',
            status: 'active',
            totalStudents: '',
        });
        setEditingClass(null);
    };

    const openCreateModal = () => {
        resetForm();
        setModalOpen(true);
    };

    const openEditModal = (item: ClassItem) => {
        setEditingClass(item);
        setFormData({
            name: item.name || '',
            medium: item.medium || '',
            section: item.section || '',
            department: item.department || '',
            status: item.status || 'active',
            totalStudents:
                typeof item.totalStudents === 'number' ? item.totalStudents : '',
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

        if (!formData.name.trim()) {
            showError('Class name is required');
            return;
        }

        const payload: any = {
            name: formData.name.trim(),
            medium: formData.medium || undefined,
            section: formData.section || undefined,
            department: formData.department || undefined,
            status: formData.status,
            totalStudents:
                formData.totalStudents !== ''
                    ? Number(formData.totalStudents)
                    : undefined,
        };

        try {
            setLoading(true);
            if (editingClass) {
                await axios.put(`${API_BASE_URL}/classes/${editingClass.id}`, payload, {
                    headers: authHeaders,
                });
                showSuccess('Class updated successfully');
            } else {
                await axios.post(`${API_BASE_URL}/classes`, payload, {
                    headers: authHeaders,
                });
                showSuccess('Class created successfully');
            }
            setModalOpen(false);
            resetForm();
            fetchClasses();
        } catch (error) {
            console.error('Error saving class:', error);
            showError('Failed to save class');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (item: ClassItem) => {
        const result = await showDeleteConfirm('this class');
        if (!result.isConfirmed) return;

        try {
            setLoading(true);
            await axios.delete(`${API_BASE_URL}/classes/${item.id}`, {
                headers: authHeaders,
            });
            showSuccess('Class deleted successfully');
            fetchClasses();
        } catch (error) {
            console.error('Error deleting class:', error);
            showError('Failed to delete class');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { key: 'name', label: 'Class Name' },
        { key: 'medium', label: 'Medium' },
        { key: 'section', label: 'Section' },
        { key: 'department', label: 'Department' },
        { key: 'status', label: 'Status' },
        { key: 'totalStudents', label: 'Total Students' },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Class Management</h1>
                    <p className="text-sm text-gray-600">
                        Manage classes, sections, mediums, and class teachers.
                    </p>
                </div>
                <Button
                    variant="primary"
                    size="md"
                    icon={<Plus className="w-4 h-4" />}
                    onClick={openCreateModal}
                >
                    Add Class
                </Button>
            </div>

            <DataTable<ClassItem>
                data={classes}
                columns={columns}
                loading={loading}
                searchPlaceholder="Search classes..."
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
                title={editingClass ? 'Edit Class' : 'Add Class'}
                size="md"
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
                            {editingClass ? 'Update' : 'Create'}
                        </Button>
                    </div>
                }
            >
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <FormInput
                        label="Class Name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <FormInput
                        label="Medium"
                        name="medium"
                        value={formData.medium}
                        onChange={handleChange}
                        placeholder="e.g. English, Nepali"
                    />
                    <FormInput
                        label="Section"
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                        placeholder="e.g. A, B"
                    />
                    <FormInput
                        label="Department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        placeholder="e.g. Science, Management"
                    />
                    <FormInput
                        label="Total Students"
                        name="totalStudents"
                        type="number"
                        min={0}
                        value={formData.totalStudents}
                        onChange={handleChange}
                    />
                    <div className="md:col-span-2">
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
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Classes;
