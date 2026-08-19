import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Badge from '../../components/shared/Badge';
import Button from '../../components/shared/Button';
import DataTable from '../../components/shared/DataTable';
import Modal from '../../components/shared/Modal';
import FormInput from '../../components/shared/FormInput';
import Select from '../../components/shared/Select';
import { staffService } from '../../api';
import type { Staff as StaffType } from '../../api';
import { getErrorMessage } from '../../utils/errorHandler';
import { showSuccess, showError, showWarning, showDeleteConfirm } from '../../utils/sweetAlert';

const StaffPage: React.FC = () => {
  const [staff, setStaff] = useState<StaffType[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<StaffType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffType | null>(null);

  // Filter states
  const [filterGender, setFilterGender] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    position: '',
    department: '',
    employeeId: '',
    joiningDate: '',
    qualification: '',
    experience: '',
    salary: '',
    bloodGroup: '',
    status: 'active',
    subjects: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await staffService.getAll();
      // Filter out teachers - only show non-teaching staff
      const nonTeachingStaff = response.data?.filter((staff: StaffType) => staff.position !== 'Teacher') || [];
      setStaff(nonTeachingStaff);
      setFilteredStaff(nonTeachingStaff);
    } catch (error) {
      console.error('Error fetching staff:', getErrorMessage(error));
      showError(`Failed to fetch staff: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadFilters = () => {
    let filtered = [...staff];

    // Apply gender filter
    if (filterGender) {
      filtered = filtered.filter(member => member.gender?.toLowerCase() === filterGender.toLowerCase());
    }

    // Apply position filter
    if (filterPosition) {
      filtered = filtered.filter(member => member.position?.toLowerCase().includes(filterPosition.toLowerCase()));
    }

    setFilteredStaff(filtered);
  };

  const handleResetFilters = () => {
    setFilterGender('');
    setFilterPosition('');
    setFilteredStaff(staff);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create FormData for multipart/form-data
      const submitData = new FormData();

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          submitData.append(key, value);
        }
      });

      // Append image file if selected
      if (selectedImage) {
        submitData.append('profileImage', selectedImage);
      }

      if (editingStaff) {
        await staffService.update(editingStaff.id, submitData);
      } else {
        await staffService.create(submitData);
      }

      setShowModal(false);
      setEditingStaff(null);
      resetForm();
      fetchStaff();
      showSuccess(`Staff member has been ${editingStaff ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      console.error('Error saving staff:', error);
      showError(`Failed to save staff member: ${getErrorMessage(error)}`);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await showDeleteConfirm('this staff member');
    if (!result.isConfirmed) return;

    try {
      await staffService.delete(id);
      fetchStaff();
      showSuccess('Staff member has been deleted successfully!');
    } catch (error) {
      console.error('Error deleting staff:', error);
      showError(`Failed to delete staff member: ${getErrorMessage(error)}`);
    }
  };

  const handleEdit = (staffMember: StaffType) => {
    setEditingStaff(staffMember);
    setFormData({
      fullName: staffMember.fullName || '',
      email: staffMember.email || '',
      phone: staffMember.phone || '',
      dateOfBirth: '',
      gender: '',
      address: '',
      position: staffMember.position || '',
      department: staffMember.department || '',
      employeeId: staffMember.employeeId || '',
      joiningDate: '',
      qualification: '',
      experience: '',
      salary: '',
      bloodGroup: '',
      status: staffMember.status || 'active',
      subjects: ''
    });
    // Set image preview if staff has profile image
    if (staffMember.profileImage) {
      setImagePreview(staffMember.profileImage);
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      position: '',
      department: '',
      employeeId: '',
      joiningDate: '',
      qualification: '',
      experience: '',
      salary: '',
      bloodGroup: '',
      status: 'active',
      subjects: ''
    });
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showWarning('File size too large', 'File size must be less than 5MB.');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        showWarning('Invalid file type', 'Please select an image file.');
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

  const columns = [
    {
      key: 'profileImage',
      label: 'Photo',
      render: (_value: string, row: StaffType) => (
        <img
          src={row.profileImage || '/img/default-avatar.svg'}
          alt={row.fullName}
          className="w-10 h-10 rounded-full object-cover border border-gray-200"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/img/default-avatar.svg';
          }}
        />
      )
    },
    { key: 'employeeId', label: 'Employee ID' },
    { key: 'fullName', label: 'Name' },
    { key: 'position', label: 'Position' },
    { key: 'department', label: 'Department' },
    { key: 'phone', label: 'Phone' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string, _row: any) => {
        const getStatusVariant = (status: string) => {
          switch (status) {
            case 'active': return 'success';
            case 'on-leave': return 'warning';
            case 'inactive': return 'info';
            case 'terminated': return 'danger';
            default: return 'info';
          }
        };
        return (
          <Badge variant={getStatusVariant(value)}>
            {value === 'on-leave' ? 'On Leave' : value.charAt(0).toUpperCase() + value.slice(1)}
          </Badge>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select School*</label>
            <input
              type="text"
              value="JKBS, Bhangabari"
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <Select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              options={[
                { value: '', label: 'All' },
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' }
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
            <Select
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              options={[
                { value: '', label: 'Select Position' },
                { value: 'peon', label: 'Peon' },
                { value: 'accountant', label: 'Accountant' },
                { value: 'librarian', label: 'Librarian' },
                { value: 'security', label: 'Security Guard' },
                { value: 'cleaner', label: 'Cleaner' },
                { value: 'admin', label: 'Admin Staff' }
              ]}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={handleLoadFilters}
              className="flex-1"
            >
              Load
            </Button>
            {(filterGender || filterPosition) && (
              <Button
                variant="outline"
                onClick={handleResetFilters}
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Staff Information List</h2>
          <p className="text-sm text-gray-600">Showing {filteredStaff.length} of {staff.length} staff member(s)</p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-5 h-5" />}
          onClick={() => {
            setEditingStaff(null);
            resetForm();
            setShowModal(true);
          }}
        >
          Add New
        </Button>
      </div>

      {/* Staff Table */}
      <DataTable
        data={filteredStaff}
        columns={columns}
        searchPlaceholder="Search staff by name, employee ID..."
        loading={loading}
        actions={(staffMember: StaffType) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(staffMember)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(staffMember.id)}
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
          setEditingStaff(null);
          resetForm();
        }}
        title={editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
        size="lg"
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowModal(false);
                setEditingStaff(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
            >
              {editingStaff ? 'Update' : 'Create'} Staff Member
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Profile Image Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image
            </label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                />
              )}
              <div className="flex-1">
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
                <p className="mt-1 text-xs text-gray-500">
                  Recommended: Square image, max 5MB (JPG, PNG, GIF, WebP)
                </p>
              </div>
            </div>
          </div>

          <FormInput
            label="Full Name"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />

          <FormInput
            label="Email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <FormInput
            label="Phone"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <FormInput
            label="Employee ID"
            value={formData.employeeId}
            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
          />

          <Select
            label="Position"
            required
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            options={[
              { value: 'Principal', label: 'Principal' },
              { value: 'Vice Principal', label: 'Vice Principal' },
              { value: 'Lab Assistant', label: 'Lab Assistant' },
              { value: 'Librarian', label: 'Librarian' },
              { value: 'Accountant', label: 'Accountant' },
              { value: 'Admin Staff', label: 'Admin Staff' },
              { value: 'Peon', label: 'Peon' },
              { value: 'Security Guard', label: 'Security Guard' },
              { value: 'Cleaner', label: 'Cleaner' },
              { value: 'Cook', label: 'Cook' },
              { value: 'Driver', label: 'Driver' },
              { value: 'Other', label: 'Other' }
            ]}
          />

          <Select
            label="Department"
            required
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            options={[
              { value: 'Academic', label: 'Academic' },
              { value: 'Administration', label: 'Administration' },
              { value: 'Science', label: 'Science' },
              { value: 'Mathematics', label: 'Mathematics' },
              { value: 'Languages', label: 'Languages' },
              { value: 'Social Studies', label: 'Social Studies' },
              { value: 'Arts', label: 'Arts' },
              { value: 'Sports', label: 'Sports' },
              { value: 'Library', label: 'Library' },
              { value: 'Accounts', label: 'Accounts' },
              { value: 'Support', label: 'Support' }
            ]}
          />

          <FormInput
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
          />

          <Select
            label="Gender"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            options={[
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
              { value: 'Other', label: 'Other' }
            ]}
          />

          <FormInput
            label="Joining Date"
            type="date"
            value={formData.joiningDate}
            onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
          />

          <FormInput
            label="Qualification"
            value={formData.qualification}
            onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
          />

          <FormInput
            label="Experience (years)"
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            placeholder="5 years"
          />

          <FormInput
            label="Salary"
            type="number"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
          />

          <Select
            label="Blood Group"
            value={formData.bloodGroup}
            onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
            options={[
              { value: 'A+', label: 'A+' },
              { value: 'A-', label: 'A-' },
              { value: 'B+', label: 'B+' },
              { value: 'B-', label: 'B-' },
              { value: 'AB+', label: 'AB+' },
              { value: 'AB-', label: 'AB-' },
              { value: 'O+', label: 'O+' },
              { value: 'O-', label: 'O-' }
            ]}
          />

          <Select
            label="Status"
            required
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'on-leave', label: 'On Leave' },
              { value: 'terminated', label: 'Terminated' }
            ]}
          />

          <div className="md:col-span-2">
            <FormInput
              label="Subjects (comma separated)"
              value={formData.subjects}
              onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
              placeholder="Mathematics, Physics, Chemistry"
            />
          </div>

          <div className="md:col-span-2">
            <FormInput
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StaffPage;
