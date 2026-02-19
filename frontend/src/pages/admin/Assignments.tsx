import React, { useEffect, useState } from 'react';
import { BookOpen, Plus, Edit, Trash2 } from 'lucide-react';
import Badge from '../../components/shared/Badge';
import Button from '../../components/shared/Button';
import DataTable from '../../components/shared/DataTable';
import Modal from '../../components/shared/Modal';
import FormInput from '../../components/shared/FormInput';
import Select from '../../components/shared/Select';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';
import { showSuccess, showError, showDeleteConfirm } from '../../utils/sweetAlert';

interface Assignment {
  id: number;
  title: string;
  description: string;
  class: string;
  section: string;
  subject: string;
  teacherId: number;
  teacher?: {
    fullName: string;
  };
  dueDate: string;
  totalMarks: number;
  attachmentUrl?: string;
  status: 'active' | 'completed' | 'expired';
  createdAt: string;
}

const Assignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    class: '',
    section: '',
    subject: '',
    teacherId: '',
    dueDate: '',
    totalMarks: '',
    attachmentUrl: ''
  });

  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/assignments`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setAssignments(response.data.data || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const assignmentData = {
      title: formData.title,
      description: formData.description,
      class: formData.class,
      section: formData.section,
      subject: formData.subject,
      teacherId: parseInt(formData.teacherId),
      dueDate: formData.dueDate,
      totalMarks: parseInt(formData.totalMarks),
      attachmentUrl: formData.attachmentUrl,
      status: 'active'
    };

    try {
      setLoading(true);
      if (editingAssignment) {
        await axios.put(
          `${API_BASE_URL}/assignments/${editingAssignment.id}/update`,
          assignmentData,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        showSuccess('Assignment has been updated successfully!');
      } else {
        await axios.post(
          `${API_BASE_URL}/assignments/create`,
          assignmentData,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        showSuccess('New assignment has been created successfully!');
      }
      
      setModalOpen(false);
      resetForm();
      fetchAssignments();
    } catch (error) {
      console.error('Error saving assignment:', error);
      showError('Failed to save assignment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      class: assignment.class,
      section: assignment.section,
      subject: assignment.subject,
      teacherId: assignment.teacherId.toString(),
      dueDate: assignment.dueDate,
      totalMarks: assignment.totalMarks.toString(),
      attachmentUrl: assignment.attachmentUrl || ''
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const result = await showDeleteConfirm('this assignment');
    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/assignments/${id}/delete`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      showSuccess('Assignment has been deleted successfully!');
      fetchAssignments();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      showError('Failed to delete assignment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      class: '',
      section: '',
      subject: '',
      teacherId: '',
      dueDate: '',
      totalMarks: '',
      attachmentUrl: ''
    });
    setEditingAssignment(null);
  };

  const columns = [
    { key: 'title', label: 'Assignment Title' },
    { key: 'class', label: 'Class', render: (_value: any, assignment: Assignment) => `${assignment.class} ${assignment.section}` },
    { key: 'subject', label: 'Subject' },
    { key: 'teacher', label: 'Teacher', render: (_value: any, assignment: Assignment) => assignment.teacher?.fullName || 'N/A' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'totalMarks', label: 'Total Marks' },
    { 
      key: 'status', 
      label: 'Status', 
      render: (_value: any, assignment: Assignment) => {
        const variants: { [key: string]: any } = {
          active: 'info',
          completed: 'success',
          expired: 'danger'
        };
        return <Badge variant={variants[assignment.status]}>{assignment.status.toUpperCase()}</Badge>;
      }
    }
  ];

  const classOptions = Array.from({ length: 12 }, (_, i) => ({ 
    value: `${i + 1}`, 
    label: `Class ${i + 1}` 
  }));

  const sectionOptions = [
    { value: 'A', label: 'Section A' },
    { value: 'B', label: 'Section B' },
    { value: 'C', label: 'Section C' }
  ];

  const subjectOptions = [
    { value: 'English', label: 'English' },
    { value: 'Nepali', label: 'Nepali' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Science', label: 'Science' },
    { value: 'Social Studies', label: 'Social Studies' },
    { value: 'Computer Science', label: 'Computer Science' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-indigo-600" />
              Assignments Management
            </h2>
            <p className="text-sm text-gray-600 mt-1">Create and manage student assignments</p>
          </div>
          <Button onClick={() => { resetForm(); setModalOpen(true); }} icon={<Plus />}>
            Create Assignment
          </Button>
        </div>

        <DataTable
          data={assignments}
          columns={columns}
          searchable={true}
          searchPlaceholder="Search assignments..."
          loading={loading && assignments.length === 0}
          actions={(assignment) => (
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(assignment)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(assignment.id)}
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
        title={editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Assignment Title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              label="Class"
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              options={classOptions}
              required
            />
            <Select
              label="Section"
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              options={sectionOptions}
              required
            />
            <Select
              label="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              options={subjectOptions}
              required
            />
            <FormInput
              label="Teacher ID"
              type="number"
              value={formData.teacherId}
              onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
              required
            />
            <FormInput
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />
            <FormInput
              label="Total Marks"
              type="number"
              value={formData.totalMarks}
              onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
              required
            />
          </div>

          <FormInput
            label="Attachment URL (Optional)"
            type="url"
            value={formData.attachmentUrl}
            onChange={(e) => setFormData({ ...formData, attachmentUrl: e.target.value })}
          />

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" onClick={() => { setModalOpen(false); resetForm(); }} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Assignments;
