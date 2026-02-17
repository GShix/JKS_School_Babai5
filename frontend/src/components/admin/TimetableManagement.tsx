import React, { useEffect, useState } from 'react';
import { Calendar, Plus, Edit, Trash2, Download } from 'lucide-react';
import DataTable from '../shared/DataTable';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import FormInput from '../shared/FormInput';
import Select from '../shared/Select';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';
import { showSuccess, showError, showDeleteConfirm } from '../../utils/sweetAlert';

interface TimetableEntry {
  id: number;
  class: string;
  section: string;
  day: string;
  period: number;
  subject: string;
  teacher: string;
  teacherId?: number;
  startTime: string;
  endTime: string;
  room?: string;
  academicYear: string;
}

const TimetableManagement: React.FC = () => {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [filterClass, setFilterClass] = useState('');
  const [filterDay, setFilterDay] = useState('');

  const [formData, setFormData] = useState({
    class: '',
    section: 'A',
    day: '',
    period: '',
    subject: '',
    teacher: '',
    teacherId: '',
    startTime: '',
    endTime: '',
    room: '',
    academicYear: '2025-2026'
  });

  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  useEffect(() => {
    fetchTimetable();
  }, [filterClass, filterDay]);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filterClass) params.class = filterClass;
      if (filterDay) params.day = filterDay;

      const response = await axios.get(`${API_BASE_URL}/timetable`, {
        headers: { Authorization: `Bearer ${getToken()}` },
        params
      });
      setTimetable(response.data.data || []);
    } catch (error) {
      console.error('Error fetching timetable:', error);
      setTimetable([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const entryData = {
      class: formData.class,
      section: formData.section,
      day: formData.day,
      period: parseInt(formData.period),
      subject: formData.subject,
      teacher: formData.teacher,
      teacherId: formData.teacherId ? parseInt(formData.teacherId) : undefined,
      startTime: formData.startTime,
      endTime: formData.endTime,
      room: formData.room,
      academicYear: formData.academicYear
    };

    try {
      setLoading(true);
      if (editingEntry) {
        await axios.put(
          `${API_BASE_URL}/timetable/${editingEntry.id}/update`,
          entryData,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        showSuccess('Timetable entry has been updated successfully!');
      } else {
        await axios.post(
          `${API_BASE_URL}/timetable/create`,
          entryData,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        showSuccess('New timetable entry has been added successfully!');
      }
      
      setModalOpen(false);
      resetForm();
      fetchTimetable();
    } catch (error) {
      console.error('Error saving timetable:', error);
      showError('Failed to save timetable entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    setFormData({
      class: entry.class,
      section: entry.section,
      day: entry.day,
      period: entry.period.toString(),
      subject: entry.subject,
      teacher: entry.teacher,
      teacherId: entry.teacherId?.toString() || '',
      startTime: entry.startTime,
      endTime: entry.endTime,
      room: entry.room || '',
      academicYear: entry.academicYear
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const result = await showDeleteConfirm('this timetable entry');
    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/timetable/${id}/delete`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      showSuccess('Timetable entry has been deleted successfully!');
      fetchTimetable();
    } catch (error) {
      console.error('Error deleting timetable:', error);
      showError('Failed to delete timetable entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      class: '',
      section: 'A',
      day: '',
      period: '',
      subject: '',
      teacher: '',
      teacherId: '',
      startTime: '',
      endTime: '',
      room: '',
      academicYear: '2025-2026'
    });
    setEditingEntry(null);
  };

  const exportTimetable = () => {
    const csvContent = [
      ['Class', 'Section', 'Day', 'Period', 'Subject', 'Teacher', 'Time', 'Room'],
      ...timetable.map(entry => [
        entry.class,
        entry.section,
        entry.day,
        entry.period,
        entry.subject,
        entry.teacher,
        `${entry.startTime} - ${entry.endTime}`,
        entry.room || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timetable_${filterClass || 'all'}.csv`;
    a.click();
  };

  const columns = [
    { key: 'class', label: 'Class', render: (entry: TimetableEntry) => `${entry.class} ${entry.section}` },
    { key: 'day', label: 'Day' },
    { key: 'period', label: 'Period' },
    { key: 'subject', label: 'Subject' },
    { key: 'teacher', label: 'Teacher' },
    { key: 'time', label: 'Time', render: (entry: TimetableEntry) => `${entry.startTime} - ${entry.endTime}` },
    { key: 'room', label: 'Room', render: (entry: TimetableEntry) => entry.room || '-' }
  ];

  const dayOptions = [
    { value: 'Sunday', label: 'Sunday' },
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' }
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

  const periodOptions = Array.from({ length: 8 }, (_, i) => ({ 
    value: `${i + 1}`, 
    label: `Period ${i + 1}` 
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-7 h-7 text-indigo-600" />
              Timetable Management
            </h2>
            <p className="text-sm text-gray-600 mt-1">Manage class schedules and teacher assignments</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => { resetForm(); setModalOpen(true); }} icon={<Plus />}>
              Add Schedule
            </Button>
            {timetable.length > 0 && (
              <Button onClick={exportTimetable} variant="success" icon={<Download />}>
                Export
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Select
            label="Filter by Class"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            options={[{ value: '', label: 'All Classes' }, ...classOptions]}
          />
          <Select
            label="Filter by Day"
            value={filterDay}
            onChange={(e) => setFilterDay(e.target.value)}
            options={[{ value: '', label: 'All Days' }, ...dayOptions]}
          />
        </div>

        <DataTable
          data={timetable}
          columns={columns}
          searchable={true}
          searchPlaceholder="Search by subject or teacher..."
          loading={loading && timetable.length === 0}
          actions={(entry) => (
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(entry)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(entry.id)}
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
        title={editingEntry ? 'Edit Timetable Entry' : 'Add New Timetable Entry'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
              label="Day"
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: e.target.value })}
              options={dayOptions}
              required
            />
            <Select
              label="Period"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              options={periodOptions}
              required
            />
            <FormInput
              label="Subject"
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
            <FormInput
              label="Teacher Name"
              type="text"
              value={formData.teacher}
              onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
              required
            />
            <FormInput
              label="Start Time"
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
            />
            <FormInput
              label="End Time"
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              required
            />
            <FormInput
              label="Room/Classroom"
              type="text"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
            />
            <FormInput
              label="Academic Year"
              type="text"
              value={formData.academicYear}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" onClick={() => { setModalOpen(false); resetForm(); }} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {editingEntry ? 'Update Entry' : 'Add Entry'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TimetableManagement;
