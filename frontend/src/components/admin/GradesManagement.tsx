import React, { useEffect, useState } from 'react';
import { FileText, Plus, Edit, Trash2, Download } from 'lucide-react';
import DataTable from '../shared/DataTable';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import FormInput from '../shared/FormInput';
import Select from '../shared/Select';
import Badge from '../shared/Badge';
import axios from 'axios';
import { showSuccess, showError, showDeleteConfirm } from '../../utils/sweetAlert';

interface Grade {
  id: number;
  studentId: number;
  student?: {
    fullName: string;
    rollNumber: string;
    class: string;
    section: string;
  };
  subject: string;
  examType: string;
  fullMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  gpa: number;
  remarks?: string;
  academicYear: string;
  term: string;
}

const GradesManagement: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [filterClass, setFilterClass] = useState('');
  const [filterTerm, setFilterTerm] = useState('');

  const [formData, setFormData] = useState({
    studentId: '',
    subject: '',
    examType: '',
    fullMarks: '',
    obtainedMarks: '',
    academicYear: '2025-2026',
    term: '',
    remarks: ''
  });

  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  useEffect(() => {
    fetchGrades();
  }, [filterClass, filterTerm]);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filterClass) params.class = filterClass;
      if (filterTerm) params.term = filterTerm;

      const response = await axios.get('http://localhost:3000/api/grades', {
        headers: { Authorization: `Bearer ${getToken()}` },
        params
      });
      setGrades(response.data.data || []);
    } catch (error) {
      console.error('Error fetching grades:', error);
      setGrades([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateGrade = (percentage: number): { grade: string; gpa: number } => {
    // Nepal IEMIS Grading System
    if (percentage >= 90) return { grade: 'A+', gpa: 4.0 };
    if (percentage >= 80) return { grade: 'A', gpa: 3.6 };
    if (percentage >= 70) return { grade: 'B+', gpa: 3.2 };
    if (percentage >= 60) return { grade: 'B', gpa: 2.8 };
    if (percentage >= 50) return { grade: 'C+', gpa: 2.4 };
    if (percentage >= 40) return { grade: 'C', gpa: 2.0 };
    if (percentage >= 35) return { grade: 'D', gpa: 1.6 };
    return { grade: 'E', gpa: 0.8 };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const obtainedMarks = parseFloat(formData.obtainedMarks);
    const fullMarks = parseFloat(formData.fullMarks);
    const percentage = (obtainedMarks / fullMarks) * 100;
    const { grade, gpa } = calculateGrade(percentage);

    const gradeData = {
      studentId: parseInt(formData.studentId),
      subject: formData.subject,
      examType: formData.examType,
      fullMarks,
      obtainedMarks,
      percentage: parseFloat(percentage.toFixed(2)),
      grade,
      gpa,
      academicYear: formData.academicYear,
      term: formData.term,
      remarks: formData.remarks
    };

    try {
      setLoading(true);
      if (editingGrade) {
        await axios.put(
          `http://localhost:3000/api/grades/${editingGrade.id}/update`,
          gradeData,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        showSuccess('Grade has been updated successfully!');
      } else {
        await axios.post(
          'http://localhost:3000/api/grades/create',
          gradeData,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        showSuccess('New grade has been added successfully!');
      }
      
      setModalOpen(false);
      resetForm();
      fetchGrades();
    } catch (error) {
      console.error('Error saving grade:', error);
      showError('Failed to save grade. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (grade: Grade) => {
    setEditingGrade(grade);
    setFormData({
      studentId: grade.studentId.toString(),
      subject: grade.subject,
      examType: grade.examType,
      fullMarks: grade.fullMarks.toString(),
      obtainedMarks: grade.obtainedMarks.toString(),
      academicYear: grade.academicYear,
      term: grade.term,
      remarks: grade.remarks || ''
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const result = await showDeleteConfirm('this grade record');
    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/api/grades/${id}/delete`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      showSuccess('Grade has been deleted successfully!');
      fetchGrades();
    } catch (error) {
      console.error('Error deleting grade:', error);
      showError('Failed to delete grade. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      subject: '',
      examType: '',
      fullMarks: '',
      obtainedMarks: '',
      academicYear: '2025-2026',
      term: '',
      remarks: ''
    });
    setEditingGrade(null);
  };

  const exportGrades = () => {
    const csvContent = generateIEMISGradeReport();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grades_report_${filterTerm}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const generateIEMISGradeReport = () => {
    const headers = ['Student Name', 'Roll No', 'Class', 'Subject', 'Exam Type', 'Full Marks', 'Obtained Marks', 'Percentage', 'Grade', 'GPA', 'Term', 'Academic Year'];
    const rows = grades.map(grade => [
      grade.student?.fullName || '',
      grade.student?.rollNumber || '',
      grade.student?.class || '',
      grade.subject,
      grade.examType,
      grade.fullMarks,
      grade.obtainedMarks,
      grade.percentage,
      grade.grade,
      grade.gpa,
      grade.term,
      grade.academicYear
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const columns = [
    { key: 'student', label: 'Student', render: (grade: Grade) => (
      <div>
        <p className="font-medium">{grade.student?.fullName || 'N/A'}</p>
        <p className="text-sm text-gray-600">Roll: {grade.student?.rollNumber}</p>
      </div>
    )},
    { key: 'class', label: 'Class', render: (grade: Grade) => `${grade.student?.class} ${grade.student?.section || ''}` },
    { key: 'subject', label: 'Subject' },
    { key: 'examType', label: 'Exam Type' },
    { key: 'marks', label: 'Marks', render: (grade: Grade) => `${grade.obtainedMarks}/${grade.fullMarks}` },
    { key: 'percentage', label: '%', render: (grade: Grade) => `${grade.percentage}%` },
    { 
      key: 'grade', 
      label: 'Grade', 
      render: (grade: Grade) => {
        const variant = grade.grade === 'A+' || grade.grade === 'A' ? 'success' :
                       grade.grade === 'B+' || grade.grade === 'B' ? 'info' :
                       grade.grade === 'C+' || grade.grade === 'C' ? 'warning' : 'danger';
        return <Badge variant={variant}>{`${grade.grade} (${grade.gpa})`}</Badge>;
      }
    },
    { key: 'term', label: 'Term' }
  ];

  const subjectOptions = [
    { value: 'English', label: 'English' },
    { value: 'Nepali', label: 'Nepali' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Science', label: 'Science' },
    { value: 'Social Studies', label: 'Social Studies' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Optional Math', label: 'Optional Mathematics' },
    { value: 'Accountancy', label: 'Accountancy' },
    { value: 'Economics', label: 'Economics' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Biology', label: 'Biology' }
  ];

  const examTypeOptions = [
    { value: 'First Terminal', label: 'First Terminal' },
    { value: 'Second Terminal', label: 'Second Terminal' },
    { value: 'Third Terminal', label: 'Third Terminal' },
    { value: 'Final Exam', label: 'Final Exam' },
    { value: 'Pre-Board', label: 'Pre-Board' },
    { value: 'Unit Test', label: 'Unit Test' }
  ];

  const termOptions = [
    { value: 'First Term', label: 'First Term' },
    { value: 'Second Term', label: 'Second Term' },
    { value: 'Third Term', label: 'Third Term' },
    { value: 'Annual', label: 'Annual' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-7 h-7 text-yellow-600" />
              Grades Management
            </h2>
            <p className="text-sm text-gray-600 mt-1">Manage student grades and report cards (IEMIS Standard)</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => { resetForm(); setModalOpen(true); }} icon={<Plus />}>
              Add Grade
            </Button>
            {grades.length > 0 && (
              <Button onClick={exportGrades} variant="success" icon={<Download />}>
                Export Report
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Select
            label="Filter by Class"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            options={[
              { value: '', label: 'All Classes' },
              ...Array.from({ length: 12 }, (_, i) => ({ value: `${i + 1}`, label: `Class ${i + 1}` }))
            ]}
          />
          <Select
            label="Filter by Term"
            value={filterTerm}
            onChange={(e) => setFilterTerm(e.target.value)}
            options={[
              { value: '', label: 'All Terms' },
              ...termOptions
            ]}
          />
        </div>

        <DataTable
          data={grades}
          columns={columns}
          searchable={true}
          searchPlaceholder="Search by student name or subject..."
          actions={(grade) => (
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(grade)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(grade.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); resetForm(); }}
        title={editingGrade ? 'Edit Grade' : 'Add New Grade'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Student ID"
              type="number"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              required
            />
            <Select
              label="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              options={subjectOptions}
              required
            />
            <Select
              label="Exam Type"
              value={formData.examType}
              onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
              options={examTypeOptions}
              required
            />
            <Select
              label="Term"
              value={formData.term}
              onChange={(e) => setFormData({ ...formData, term: e.target.value })}
              options={termOptions}
              required
            />
            <FormInput
              label="Full Marks"
              type="number"
              value={formData.fullMarks}
              onChange={(e) => setFormData({ ...formData, fullMarks: e.target.value })}
              required
            />
            <FormInput
              label="Obtained Marks"
              type="number"
              value={formData.obtainedMarks}
              onChange={(e) => setFormData({ ...formData, obtainedMarks: e.target.value })}
              required
            />
            <FormInput
              label="Academic Year"
              type="text"
              value={formData.academicYear}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
              required
            />
            <FormInput
              label="Remarks"
              type="text"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            />
          </div>

          {formData.obtainedMarks && formData.fullMarks && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Auto-Calculated (IEMIS Standard):</p>
              <div className="mt-2 text-lg font-bold text-blue-600">
                Percentage: {((parseFloat(formData.obtainedMarks) / parseFloat(formData.fullMarks)) * 100).toFixed(2)}% | 
                Grade: {calculateGrade((parseFloat(formData.obtainedMarks) / parseFloat(formData.fullMarks)) * 100).grade} | 
                GPA: {calculateGrade((parseFloat(formData.obtainedMarks) / parseFloat(formData.fullMarks)) * 100).gpa}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" onClick={() => { setModalOpen(false); resetForm(); }} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {editingGrade ? 'Update Grade' : 'Add Grade'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GradesManagement;
