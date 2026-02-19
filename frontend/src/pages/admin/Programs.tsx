import React, { useEffect, useState } from 'react';
import { Activity, Plus, Edit, Trash2 } from 'lucide-react';
import Badge from '../../components/shared/Badge';
import Button from '../../components/shared/Button';
import DataTable from '../../components/shared/DataTable';
import Modal from '../../components/shared/Modal';
import FormInput from '../../components/shared/FormInput';
import Select from '../../components/shared/Select';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';
import { showSuccess, showError, showDeleteConfirm } from '../../utils/sweetAlert';

interface Program {
  id: number;
  programName: string;
  programDescription: string;
  programStatus: string;
  programImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

const Programs: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  const [formData, setFormData] = useState({
    programName: '',
    programDescription: '',
    programStatus: 'active',
    programImage: ''
  });

  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/programs`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setPrograms(response.data.data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const programData = {
      programName: formData.programName,
      programDescription: formData.programDescription,
      programStatus: formData.programStatus,
      programImage: formData.programImage
    };

    try {
      setLoading(true);
      if (editingProgram) {
        await axios.patch(
          `${API_BASE_URL}/programs/${editingProgram.id}`,
          programData,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        showSuccess('Program has been updated successfully!');
      } else {
        await axios.post(
          `${API_BASE_URL}/programs`,
          programData,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        showSuccess('New program has been created successfully!');
      }
      
      setModalOpen(false);
      resetForm();
      fetchPrograms();
    } catch (error) {
      console.error('Error saving program:', error);
      showError('Failed to save program. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setFormData({
      programName: program.programName,
      programDescription: program.programDescription,
      programStatus: program.programStatus,
      programImage: program.programImage || ''
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const result = await showDeleteConfirm('this program');
    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/programs/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      showSuccess('Program has been deleted successfully!');
      fetchPrograms();
    } catch (error) {
      console.error('Error deleting program:', error);
      showError('Failed to delete program. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      programName: '',
      programDescription: '',
      programStatus: 'active',
      programImage: ''
    });
    setEditingProgram(null);
  };

  const columns = [
    { 
      key: 'programName', 
      label: 'Program Name', 
      render: (_value: any, program: Program) => (
        <div>
          <p className="font-medium">{program.programName || '-'}</p>
        </div>
      )
    },
    { 
      key: 'programDescription', 
      label: 'Description', 
      render: (_value: any, program: Program) => (
        <div className="max-w-md truncate" title={program.programDescription}>
          {program.programDescription || '-'}
        </div>
      )
    },
    { 
      key: 'programStatus', 
      label: 'Status', 
      render: (_value: any, program: Program) => {
        if (!program.programStatus) return '-';
        const variants: { [key: string]: any } = {
          active: 'success',
          inactive: 'danger'
        };
        return <Badge variant={variants[program.programStatus] || 'default'}>{program.programStatus.toUpperCase()}</Badge>;
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-7 h-7 text-teal-600" />
              Programs Management
            </h2>
            <p className="text-sm text-gray-600 mt-1">Manage academic programs and courses</p>
          </div>
          <Button onClick={() => { resetForm(); setModalOpen(true); }} icon={<Plus />}>
            Add Program
          </Button>
        </div>

        <DataTable
          data={programs}
          columns={columns}
          searchable={true}
          searchPlaceholder="Search programs..."
          loading={loading && programs.length === 0}
          actions={(program) => (
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(program)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(program.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
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
        title={editingProgram ? 'Edit Program' : 'Add New Program'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Program Name"
            type="text"
            value={formData.programName}
            onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.programDescription}
              onChange={(e) => setFormData({ ...formData, programDescription: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <Select
            label="Status"
            value={formData.programStatus}
            onChange={(e) => setFormData({ ...formData, programStatus: e.target.value })}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]}
            required
          />

          <FormInput
            label="Program Image URL (Optional)"
            type="url"
            value={formData.programImage}
            onChange={(e) => setFormData({ ...formData, programImage: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" onClick={() => { setModalOpen(false); resetForm(); }} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {editingProgram ? 'Update' : 'Add'} Program
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Programs;
