import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import DataTable from '../shared/DataTable';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import FormInput from '../shared/FormInput';
import Select from '../shared/Select';
import Badge from '../shared/Badge';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';
import { showError, showSuccess, showDeleteConfirm } from '../../utils/sweetAlert';

interface Student {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  class: string;
  section: string;
  rollNumber: string;
  iemisId: string;
  status: string;
  guardianName: string;
  guardianPhone: string;
  gender: string;
}

const StudentsManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    nationalIdNumber: '',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    class: '',
    admitYear: '',
    dateOfBirth: '',
    isForeignStudent: false,
    // Permanent Address
    permanentProvince: '',
    permanentDistrict: '',
    permanentMunicipality: '',
    permanentWard: '',
    // Temporary Address
    sameAsPermAddress: false,
    temporaryProvince: '',
    temporaryDistrict: '',
    temporaryMunicipality: '',
    temporaryWard: '',
    // Additional Information
    caste: '',
    motherTongue: '',
    disabilityType: '',
    schoolingSource: '',
    scholarship: '',
    subject: '',
    contactNumber: '',
    fatherName: '',
    motherName: '',
    guardianName: '',
    guardianContactNo: '',
    admissionDate: '',
    status: 'active'
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      // Create FormData for multipart/form-data with image upload
      const submitData = new FormData();
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          submitData.append(key, value.toString());
        }
      });
      
      // Append image file if selected
      if (selectedImage) {
        submitData.append('photo', selectedImage);
      }
      
      if (editingStudent) {
        await axios.put(
          `${API_BASE_URL}/students/${editingStudent.id}/update`,
          submitData,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            } 
          }
        );
      } else {
        await axios.post(
          `${API_BASE_URL}/students/create`,
          submitData,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            } 
          }
        );
      }
      
      setShowModal(false);
      setEditingStudent(null);
      resetForm();
      fetchStudents();
      showSuccess(`Student has been ${editingStudent ? 'updated' : 'added'} successfully!`);
    } catch (error) {
      console.error('Error saving student:', error);
      showError('Failed to save student. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    const result = await showDeleteConfirm('this student');
    if (!result.isConfirmed) return;
    
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/students/${id}/delete`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStudents();
      showSuccess('Student has been deleted successfully!');
    } catch (error) {
      console.error('Error deleting student:', error);
      showError('Failed to delete student. Please try again.');
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      nationalIdNumber: '',
      firstName: student.fullName?.split(' ')[0] || '',
      middleName: '',
      lastName: student.fullName?.split(' ').slice(1).join(' ') || '',
      gender: student.gender || '',
      class: student.class || '',
      admitYear: '',
      dateOfBirth: '',
      isForeignStudent: false,
      permanentProvince: '',
      permanentDistrict: '',
      permanentMunicipality: '',
      permanentWard: '',
      sameAsPermAddress: false,
      temporaryProvince: '',
      temporaryDistrict: '',
      temporaryMunicipality: '',
      temporaryWard: '',
      caste: '',
      motherTongue: '',
      disabilityType: '',
      schoolingSource: '',
      scholarship: '',
      subject: '',
      contactNumber: student.phone || '',
      fatherName: '',
      motherName: '',
      guardianName: student.guardianName || '',
      guardianContactNo: student.guardianPhone || '',
      admissionDate: '',
      status: student.status || 'active'
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      nationalIdNumber: '',
      firstName: '',
      middleName: '',
      lastName: '',
      gender: '',
      class: '',
      admitYear: '',
      dateOfBirth: '',
      isForeignStudent: false,
      permanentProvince: '',
      permanentDistrict: '',
      permanentMunicipality: '',
      permanentWard: '',
      sameAsPermAddress: false,
      temporaryProvince: '',
      temporaryDistrict: '',
      temporaryMunicipality: '',
      temporaryWard: '',
      caste: '',
      motherTongue: '',
      disabilityType: '',
      schoolingSource: '',
      scholarship: '',
      subject: '',
      contactNumber: '',
      fatherName: '',
      motherName: '',
      guardianName: '',
      guardianContactNo: '',
      admissionDate: '',
      status: 'active'
    });
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        showError('File size must be less than 2MB.');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showError('Please select an image file.');
        return;
      }
      
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSameAddressChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      sameAsPermAddress: checked,
      ...(checked ? {
        temporaryProvince: prev.permanentProvince,
        temporaryDistrict: prev.permanentDistrict,
        temporaryMunicipality: prev.permanentMunicipality,
        temporaryWard: prev.permanentWard
      } : {})
    }));
  };

  const columns = [
    { key: 'iemisId', label: 'IEMIS ID' },
    { key: 'rollNumber', label: 'Roll No.' },
    { key: 'fullName', label: 'Name' },
    { key: 'class', label: 'Class' },
    { key: 'section', label: 'Section' },
    { key: 'phone', label: 'Phone' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'success' : 'danger'}>
          {value}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Students Management</h2>
          <p className="text-gray-600">Manage student records and information</p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-5 h-5" />}
          onClick={() => {
            setEditingStudent(null);
            resetForm();
            setShowModal(true);
          }}
        >
          Add Student
        </Button>
      </div>

      {/* Students Table */}
      <DataTable
        data={students}
        columns={columns}
        searchPlaceholder="Search students by name, roll number..."
        loading={loading}
        actions={(student: Student) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(student)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(student.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingStudent(null);
          resetForm();
        }}
        title={editingStudent ? 'Edit Student' : 'Add Student Informations'}
        size="xl"
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowModal(false);
                setEditingStudent(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
            >
              {editingStudent ? 'Update' : 'Add'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: School, National ID, First Name, Middle Name, Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Selected School*</label>
              <input
                type="text"
                value="JKSS Pdampur"
                disabled
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
              />
            </div>
            
            <FormInput
              label="National ID Number"
              value={formData.nationalIdNumber}
              onChange={(e) => setFormData({ ...formData, nationalIdNumber: e.target.value })}
              placeholder="National Identity Number"
            />
            
            <FormInput
              label="First Name"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="First Name"
            />
            
            <FormInput
              label="Middle Name"
              value={formData.middleName}
              onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
              placeholder="Middle Name"
            />
            
            <FormInput
              label="Last Name"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Last Name"
            />
          </div>

          {/* Row 2: Gender, Class, Admit Year, DOB, Is Foreign Student */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender*</label>
              <div className="flex gap-4">
                {['Male', 'Female', 'Other'].map(gender => (
                  <label key={gender} className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={formData.gender === gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="mr-2"
                    />
                    {gender}
                  </label>
                ))}
              </div>
            </div>
            
            <Select
              label="Class"
              required
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              options={[
                { value: '', label: 'Select Class' },
                { value: '1', label: 'Class 1' },
                { value: '2', label: 'Class 2' },
                { value: '3', label: 'Class 3' },
                { value: '4', label: 'Class 4' },
                { value: '5', label: 'Class 5' },
                { value: '6', label: 'Class 6' },
                { value: '7', label: 'Class 7' },
                { value: '8', label: 'Class 8' },
                { value: '9', label: 'Class 9' },
                { value: '10', label: 'Class 10' }
              ]}
            />
            
            <Select
              label="Admit Year"
              required
              value={formData.admitYear}
              onChange={(e) => setFormData({ ...formData, admitYear: e.target.value })}
              options={[
                { value: '2082', label: '2082' },
                { value: '2081', label: '2081' },
                { value: '2080', label: '2080' },
                { value: '2079', label: '2079' },
                { value: '2078', label: '2078' }
              ]}
            />
            
            <FormInput
              label="Date of birth"
              type="date"
              required
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            />
            
            <div className="flex items-end pb-2">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={formData.isForeignStudent}
                  onChange={(e) => setFormData({ ...formData, isForeignStudent: e.target.checked })}
                  className="mr-2"
                />
                Is Foreign Student?
              </label>
            </div>
          </div>

          {/* Permanent Address */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <Select
              label="Permanent Province"
              required
              value={formData.permanentProvince}
              onChange={(e) => setFormData({ ...formData, permanentProvince: e.target.value })}
              options={[
                { value: '', label: 'Select Province' },
                { value: 'Province 1', label: 'Province 1' },
                { value: 'Madhesh', label: 'Madhesh' },
                { value: 'Bagmati', label: 'Bagmati' },
                { value: 'Gandaki', label: 'Gandaki' },
                { value: 'Lumbini', label: 'Lumbini' },
                { value: 'Karnali', label: 'Karnali' },
                { value: 'Sudurpashchim', label: 'Sudurpashchim' }
              ]}
            />
            
            <Select
              label="Permanent District"
              required
              value={formData.permanentDistrict}
              onChange={(e) => setFormData({ ...formData, permanentDistrict: e.target.value })}
              options={[
                { value: '', label: 'Select District' },
                { value: 'Kathmandu', label: 'Kathmandu' },
                { value: 'Lalitpur', label: 'Lalitpur' },
                { value: 'Bhaktapur', label: 'Bhaktapur' }
              ]}
            />
            
            <Select
              label="Permanent Municipality"
              required
              value={formData.permanentMunicipality}
              onChange={(e) => setFormData({ ...formData, permanentMunicipality: e.target.value })}
              options={[
                { value: '', label: 'Select Municipality' }
              ]}
            />
            
            <FormInput
              label="Permanent Ward"
              required
              type="number"
              value={formData.permanentWard}
              onChange={(e) => setFormData({ ...formData, permanentWard: e.target.value })}
              placeholder="0"
            />
          </div>

          {/* Same Address Checkbox */}
          <div>
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={formData.sameAsPermAddress}
                onChange={(e) => handleSameAddressChange(e.target.checked)}
                className="mr-2"
              />
              Has Temporary address same as Permanent Address ?
            </label>
          </div>

          {/* Temporary Address */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <Select
              label="Temporary Province"
              required
              value={formData.temporaryProvince}
              onChange={(e) => setFormData({ ...formData, temporaryProvince: e.target.value })}
              disabled={formData.sameAsPermAddress}
              options={[
                { value: '', label: 'Select Province' },
                { value: 'Province 1', label: 'Province 1' },
                { value: 'Madhesh', label: 'Madhesh' },
                { value: 'Bagmati', label: 'Bagmati' },
                { value: 'Gandaki', label: 'Gandaki' },
                { value: 'Lumbini', label: 'Lumbini' },
                { value: 'Karnali', label: 'Karnali' },
                { value: 'Sudurpashchim', label: 'Sudurpashchim' }
              ]}
            />
            
            <Select
              label="Temporary District"
              required
              value={formData.temporaryDistrict}
              onChange={(e) => setFormData({ ...formData, temporaryDistrict: e.target.value })}
              disabled={formData.sameAsPermAddress}
              options={[
                { value: '', label: 'Select District' },
                { value: 'Kathmandu', label: 'Kathmandu' },
                { value: 'Lalitpur', label: 'Lalitpur' },
                { value: 'Bhaktapur', label: 'Bhaktapur' }
              ]}
            />
            
            <Select
              label="Temporary Municipality"
              required
              value={formData.temporaryMunicipality}
              onChange={(e) => setFormData({ ...formData, temporaryMunicipality: e.target.value })}
              disabled={formData.sameAsPermAddress}
              options={[
                { value: '', label: 'Select Municipality' }
              ]}
            />
            
            <FormInput
              label="Temporary Ward"
              required
              type="number"
              value={formData.temporaryWard}
              onChange={(e) => setFormData({ ...formData, temporaryWard: e.target.value })}
              disabled={formData.sameAsPermAddress}
              placeholder="0"
            />
          </div>

          {/* Row: Caste, Mother Tongue, Disability, Schooling Source */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <Select
              label="Caste"
              required
              value={formData.caste}
              onChange={(e) => setFormData({ ...formData, caste: e.target.value })}
              options={[
                { value: '', label: 'Select Caste' },
                { value: 'Brahmin', label: 'Brahmin' },
                { value: 'Chhetri', label: 'Chhetri' },
                { value: 'Newar', label: 'Newar' },
                { value: 'Tharu', label: 'Tharu' },
                { value: 'Magar', label: 'Magar' },
                { value: 'Tamang', label: 'Tamang' },
                { value: 'Other', label: 'Other' }
              ]}
            />
            
            <Select
              label="Mother Tongue"
              required
              value={formData.motherTongue}
              onChange={(e) => setFormData({ ...formData, motherTongue: e.target.value })}
              options={[
                { value: '', label: 'Select Mother Tongue' },
                { value: 'Nepali', label: 'Nepali' },
                { value: 'Maithili', label: 'Maithili' },
                { value: 'Bhojpuri', label: 'Bhojpuri' },
                { value: 'Tharu', label: 'Tharu' },
                { value: 'Tamang', label: 'Tamang' },
                { value: 'Newari', label: 'Newari' },
                { value: 'Other', label: 'Other' }
              ]}
            />
            
            <Select
              label="Disability Type"
              required
              value={formData.disabilityType}
              onChange={(e) => setFormData({ ...formData, disabilityType: e.target.value })}
              options={[
                { value: '', label: 'Select Disability Type' },
                { value: 'None', label: 'None' },
                { value: 'Physical', label: 'Physical' },
                { value: 'Visual', label: 'Visual' },
                { value: 'Hearing', label: 'Hearing' },
                { value: 'Mental', label: 'Mental' },
                { value: 'Other', label: 'Other' }
              ]}
            />
            
            <Select
              label="Schooling Source"
              value={formData.schoolingSource}
              onChange={(e) => setFormData({ ...formData, schoolingSource: e.target.value })}
              options={[
                { value: '', label: 'Select Schooling Source' },
                { value: 'Government', label: 'Government' },
                { value: 'Private', label: 'Private' },
                { value: 'Community', label: 'Community' }
              ]}
            />
          </div>

          {/* Row: Scholarship, Subject, Contact, Father's Name */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <Select
              label="Scholarship"
              value={formData.scholarship}
              onChange={(e) => setFormData({ ...formData, scholarship: e.target.value })}
              options={[
                { value: '', label: 'Select Scholarship' },
                { value: 'None', label: 'None' },
                { value: 'Full', label: 'Full Scholarship' },
                { value: 'Partial', label: 'Partial Scholarship' }
              ]}
            />
            
            <Select
              label="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              options={[
                { value: '', label: 'Select Subject' },
                { value: 'Science', label: 'Science' },
                { value: 'Management', label: 'Management' },
                { value: 'Humanities', label: 'Humanities' }
              ]}
            />
            
            <FormInput
              label="Contact Number"
              required
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              placeholder="Contact Number"
            />
            
            <FormInput
              label="Father's Name"
              value={formData.fatherName}
              onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
              placeholder="Father Name"
            />
          </div>

          {/* Row: Mother's Name, Guardian Name, Guardian Contact, Admission Date */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <FormInput
              label="Mother's Name"
              value={formData.motherName}
              onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
              placeholder="Mother Name"
            />
            
            <FormInput
              label="Guardian's Name"
              required
              value={formData.guardianName}
              onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
              placeholder="Guardian Name"
            />
            
            <FormInput
              label="Guardian Contact No."
              required
              value={formData.guardianContactNo}
              onChange={(e) => setFormData({ ...formData, guardianContactNo: e.target.value })}
              placeholder="Guardian Contact No."
            />
            
            <FormInput
              label="Admission Date"
              type="date"
              required
              value={formData.admissionDate}
              onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
            />
          </div>

          {/* Upload Photo */}
          <div className="text-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                cursor-pointer"
            />
            <p className="mt-1 text-xs text-red-500 italic">
              Only image files (not more than 2MB) are allowed.
            </p>
            {imagePreview && (
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="mt-2 w-24 h-24 rounded object-cover border-2 border-gray-200"
              />
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentsManagement;
