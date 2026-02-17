import React, { useEffect, useState } from 'react';
import { Activity, Plus, Edit, Trash2 } from 'lucide-react';
import DataTable from '../shared/DataTable';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import FormInput from '../shared/FormInput';
import Select from '../shared/Select';
import Badge from '../shared/Badge';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';
import { showSuccess, showError, showDeleteConfirm } from '../../utils/sweetAlert';

interface Program {
  id: number;
  name: string;
  description: string;
  programType: string;
  level: string;
  duration: string;
  faculty?: string;
  eligibility: string;
  fees: number;
  totalSeats: number;
  availableSeats: number;
  startDate: string;
  endDate?: string;
  status: 'active' | 'inactive' | 'upcoming';
  syllabus?: string;
  createdAt: string;
}

const ProgramsManagement: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    programType: '',
    level: '',
    duration: '',
    faculty: '',
    eligibility: '',
    fees: '',
    totalSeats: '',
    startDate: '',
    endDate: '',
    status: 'active',
    syllabus: ''
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
      name: formData.name,
      description: formData.description,
      programType: formData.programType,
      level: formData.level,
      duration: formData.duration,
      faculty: formData.faculty,
      eligibility: formData.eligibility,
      fees: parseFloat(formData.fees),
      totalSeats: parseInt(formData.totalSeats),
      availableSeats: parseInt(formData.totalSeats),
      startDate: formData.startDate,
      endDate: formData.endDate || null,
      status: formData.status,
      syllabus: formData.syllabus
    };

    try {
      setLoading(true);
      if (editingProgram) {
        await axios.put(
          `${API_BASE_URL}/programs/${editingProgram.id}/update`,
          programData,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        showSuccess('Program has been updated successfully!');
      } else {
        await axios.post(
          `${API_BASE_URL}/programs/create`,
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
      name: program.name,
      description: program.description,
      programType: program.programType,
      level: program.level,
      duration: program.duration,
      faculty: program.faculty || '',
      eligibility: program.eligibility,
      fees: program.fees.toString(),
      totalSeats: program.totalSeats.toString(),
      startDate: program.startDate,
      endDate: program.endDate || '',
      status: program.status,
      syllabus: program.syllabus || ''
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const result = await showDeleteConfirm('this program');
    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/programs/${id}/delete`, {
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
      name: '',
      description: '',
      programType: '',
      level: '',
      duration: '',
      faculty: '',
      eligibility: '',
      fees: '',
      totalSeats: '',
      startDate: '',
      endDate: '',
      status: 'active',
      syllabus: ''
    });
    setEditingProgram(null);
  };

  const columns = [
    { key: 'name', label: 'Program Name', render: (program: Program) => (
      <div>
        <p className="font-medium">{program.name}</p>
        <p className="text-xs text-gray-600">{program.level} - {program.programType}</p>
      </div>
    )},
    { key: 'faculty', label: 'Faculty', render: (program: Program) => program.faculty || 'N/A' },
    { key: 'duration', label: 'Duration' },
    { key: 'fees', label: 'Fees', render: (program: Program) => `NPR ${program.fees.toLocaleString()}` },
    { key: 'seats', label: 'Seats', render: (program: Program) => `${program.availableSeats}/${program.totalSeats}` },
    { 
      key: 'status', 
      label: 'Status', 
      render: (program: Program) => {
        const variants: { [key: string]: any } = {
          active: 'success',
          inactive: 'danger',
          upcoming: 'info'
        };
        return <Badge variant={variants[program.status]}>{program.status.toUpperCase()}</Badge>;
      }
    }
  ];

  const programTypeOptions = [
    { value: 'Academic', label: 'Academic' },
    { value: 'Vocational', label: 'Vocational' },
    { value: 'Technical', label: 'Technical' },
    { value: 'Certificate', label: 'Certificate' },
    { value: 'Diploma', label: 'Diploma' }
  ];

  const levelOptions = [
    { value: 'Basic Level (1-8)', label: 'Basic Level (Grade 1-8)' },
    { value: 'Secondary Level (9-10)', label: 'Secondary Level (Grade 9-10)' },
    { value: 'Higher Secondary (11-12)', label: 'Higher Secondary (Grade 11-12)' },
    { value: 'Bachelor', label: 'Bachelor' },
    { value: 'Master', label: 'Master' }
  ];

  const facultyOptions = [
    { value: 'Science', label: 'Science' },
    { value: 'Management', label: 'Management' },
    { value: 'Education', label: 'Education' },
    { value: 'Humanities', label: 'Humanities' },
    { value: 'Agriculture', label: 'Agriculture' },
    { value: 'Engineering', label: 'Engineering' }
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
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Program Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Program Type"
              value={formData.programType}
              onChange={(e) => setFormData({ ...formData, programType: e.target.value })}
              options={programTypeOptions}
              required
            />
            <Select
              label="Level"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              options={levelOptions}
              required
            />
            <Select
              label="Faculty"
              value={formData.faculty}
              onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
              options={facultyOptions}
            />
            <FormInput
              label="Duration"
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="e.g., 2 years, 4 months"
              required
            />
            <FormInput
              label="Eligibility"
              type="text"
              value={formData.eligibility}
              onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
              placeholder="e.g., SEE Pass, +2 Pass"
              required
            />
            <FormInput
              label="Fees (NPR)"
              type="number"
              value={formData.fees}
              onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
              required
            />
            <FormInput
              label="Total Seats"
              type="number"
              value={formData.totalSeats}
              onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
              required
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'upcoming', label: 'Upcoming' }
              ]}
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

          <FormInput
            label="Syllabus URL (Optional)"
            type="url"
            value={formData.syllabus}
            onChange={(e) => setFormData({ ...formData, syllabus: e.target.value })}
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

export default ProgramsManagement;
