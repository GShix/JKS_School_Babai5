import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Upload, Download } from 'lucide-react';
import Badge from '../../components/shared/Badge';
import Button from '../../components/shared/Button';
import DataTable from '../../components/shared/DataTable';
import Modal from '../../components/shared/Modal';
import FormInput from '../../components/shared/FormInput';
import Select from '../../components/shared/Select';
import { teacherService } from '../../api';
import type { Teacher } from '../../api';
import { getErrorMessage } from '../../utils/errorHandler';
import { showSuccess, showError, showWarning, showDeleteConfirm } from '../../utils/sweetAlert';
import * as XLSX from 'xlsx';

const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Filter states
  const [filterGender, setFilterGender] = useState('');
  const [filterTeacherLevel, setFilterTeacherLevel] = useState('');
  const [formData, setFormData] = useState({
    // Basic Information
    firstName: '',
    middleName: '',
    lastName: '',
    nin: '',
    dateOfBirth: '',
    gender: '',
    citizenship: '',
    // Permanent Address
    permanentProvince: '',
    permanentDistrict: '',
    permanentMunicipality: '',
    permanentWard: '',
    // Temporary Address
    temporaryProvince: '',
    temporaryDistrict: '',
    temporaryMunicipality: '',
    temporaryWard: '',
    // Family Information
    fatherName: '',
    motherName: '',
    spouseName: '',
    willPerson: '',
    // Additional Information
    caste: '',
    motherTongue: '',
    disability: '',
    mobile: '',
    email: '',
    pan: '',
    bankName: '',
    bankAccount: '',
    // Professional Information
    employeeId: '',
    department: 'Teaching',
    subjects: '',
    teachingLicense: '',
    joiningDate: '',
    qualification: '',
    experience: '',
    bloodGroup: '',
    // Government Schemes
    karmachariSanachayakosh: '',
    sabadhikBimaKosh: '',
    ssf: '',
    nagarikLaganiKosh: '',
    // Status
    status: 'active',
    notes: '',
    // Position
    position: 'Teacher',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await teacherService.getAll();
      setTeachers(response.data || []);
      setFilteredTeachers(response.data || []);
    } catch (error) {
      console.error('Error fetching teachers:', getErrorMessage(error));
      showError(`Failed to fetch teachers: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadFilters = () => {
    let filtered = [...teachers];

    // Apply gender filter
    if (filterGender) {
      filtered = filtered.filter(teacher => teacher.gender?.toLowerCase() === filterGender.toLowerCase());
    }

    // Apply teacher level filter (assuming qualification field)
    if (filterTeacherLevel) {
      filtered = filtered.filter(teacher => teacher.qualification?.toLowerCase().includes(filterTeacherLevel.toLowerCase()));
    }

    setFilteredTeachers(filtered);
    // showSuccess(`Loaded ${filtered.length} teacher(s) matching filters`);
  };

  const handleResetFilters = () => {
    setFilterGender('');
    setFilterTeacherLevel('');
    setFilteredTeachers(teachers);
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

      // Always ensure position is sent (even if value somehow became empty)
      submitData.set('position', formData.position || 'Teacher');

      // Append image file if selected
      if (selectedImage) {
        submitData.append('profileImage', selectedImage);
      }

      if (editingTeacher) {
        await teacherService.update(editingTeacher.id, submitData);
      } else {
        await teacherService.create(submitData);
      }

      setShowModal(false);
      setEditingTeacher(null);
      resetForm();
      fetchTeachers();
      showSuccess(`Teacher has been ${editingTeacher ? 'updated' : 'added'} successfully!`);
    } catch (error) {
      console.error('Error saving teacher:', error);
      showError(`Failed to save teacher: ${getErrorMessage(error)}`);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await showDeleteConfirm('this teacher');
    if (!result.isConfirmed) return;

    try {
      await teacherService.delete(id);
      fetchTeachers();
      showSuccess('Teacher has been deleted successfully!');
    } catch (error) {
      console.error('Error deleting teacher:', error);
      showError(`Failed to delete teacher: ${getErrorMessage(error)}`);
    }
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      firstName: teacher.firstName || '',
      middleName: teacher.middleName || '',
      lastName: teacher.lastName || '',
      nin: teacher.nin || '',
      dateOfBirth: teacher.dateOfBirth || '',
      gender: teacher.gender || '',
      citizenship: teacher.citizenship || '',
      permanentProvince: teacher.permanentProvince || '',
      permanentDistrict: teacher.permanentDistrict || '',
      permanentMunicipality: teacher.permanentMunicipality || '',
      permanentWard: teacher.permanentWard || '',
      temporaryProvince: teacher.temporaryProvince || '',
      temporaryDistrict: teacher.temporaryDistrict || '',
      temporaryMunicipality: teacher.temporaryMunicipality || '',
      temporaryWard: teacher.temporaryWard || '',
      fatherName: teacher.fatherName || '',
      motherName: teacher.motherName || '',
      spouseName: teacher.spouseName || '',
      willPerson: teacher.willPerson || '',
      caste: teacher.caste || '',
      motherTongue: teacher.motherTongue || '',
      disability: teacher.disability || '',
      mobile: teacher.mobile || '',
      email: teacher.email || '',
      pan: teacher.pan || '',
      bankName: teacher.bankName || '',
      bankAccount: teacher.bankAccount || '',
      employeeId: teacher.employeeId || '',
      department: teacher.department || 'Teaching',
      subjects: teacher.subjects || '',
      teachingLicense: teacher.teachingLicense || '',
      joiningDate: teacher.joiningDate || '',
      qualification: teacher.qualification || '',
      experience: teacher.experience || '',
      bloodGroup: teacher.bloodGroup || '',
      karmachariSanachayakosh: teacher.karmachariSanachayakosh || '',
      sabadhikBimaKosh: teacher.sabadhikBimaKosh || '',
      ssf: teacher.ssf || '',
      nagarikLaganiKosh: teacher.nagarikLaganiKosh || '',
      status: teacher.status || 'active',
      notes: teacher.notes || '',
      position: teacher.position || 'Teacher',
    });
    // Set image preview if teacher has profile image
    if (teacher.profileImage) {
      setImagePreview(teacher.profileImage);
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      middleName: '',
      lastName: '',
      nin: '',
      dateOfBirth: '',
      gender: '',
      citizenship: '',
      permanentProvince: '',
      permanentDistrict: '',
      permanentMunicipality: '',
      permanentWard: '',
      temporaryProvince: '',
      temporaryDistrict: '',
      temporaryMunicipality: '',
      temporaryWard: '',
      fatherName: '',
      motherName: '',
      spouseName: '',
      willPerson: '',
      caste: '',
      motherTongue: '',
      disability: '',
      mobile: '',
      email: '',
      pan: '',
      bankName: '',
      bankAccount: '',
      employeeId: '',
      department: 'Teaching',
      subjects: '',
      teachingLicense: '',
      joiningDate: '',
      qualification: '',
      experience: '',
      bloodGroup: '',
      karmachariSanachayakosh: '',
      sabadhikBimaKosh: '',
      ssf: '',
      nagarikLaganiKosh: '',
      status: 'active',
      notes: '',
      position: 'Teacher',
    });
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        showWarning('File size too large', 'File size must be less than 2MB.');
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

  const downloadSampleTemplate = () => {
    // Define sample data with proper column headers
    const sampleData = [
      {
        'First Name*': 'John',
        'Middle Name': 'Kumar',
        'Last Name*': 'Sharma',
        'NIN': '123456789',
        'Date of Birth*': '1990-01-15',
        'Gender*': 'Male',
        'Citizenship': 'CIT123456',
        'Permanent Province': 'Lumbini',
        'Permanent District': 'Dang',
        'Permanent Municipality': 'Ghorahi',
        'Permanent Ward': '5',
        'Temporary Province': 'Lumbini',
        'Temporary District': 'Dang',
        'Temporary Municipality': 'Ghorahi',
        'Temporary Ward': '5',
        'Father Name': 'Ram Sharma',
        'Mother Name': 'Sita Sharma',
        'Spouse Name': 'Maya Sharma',
        'Will Person': 'Brother Name',
        'Disability': 'No',
        'Mobile*': '9812345678',
        'Email*': 'john.sharma@example.com',
        'PAN': 'PAN123456',
        'Bank Name': 'Nepal Bank',
        'Bank Account': '1234567890',
        'Employee ID': 'EMP001',
        'Department*': 'Mathematics',
        'Subjects': 'Mathematics, Physics',
        'Teaching License': 'TL123456',
        'Joining Date': '2020-01-01',
        'Qualification': 'M.Ed',
        'Experience': '5',
        'Blood Group': 'A+',
        'Status*': 'active',
        'Notes': 'Sample teacher data'
      }
    ];

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(sampleData);

    // Set column widths
    const colWidths = [
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
      { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
      { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 10 },
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
      { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 20 }, { wch: 15 },
      { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 20 },
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
      { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 10 },
      { wch: 20 }
    ];
    ws['!cols'] = colWidths;

    // Create workbook and add worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Teachers');

    // Download file
    XLSX.writeFile(wb, 'Teacher_Import_Template.xlsx');
    showSuccess('Sample template downloaded successfully!');
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];

      if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/)) {
        showWarning('Invalid file type', 'Please select an Excel file (.xlsx or .xls)');
        return;
      }

      setImportFile(file);
      parseExcelFile(file);
    }
  };

  const parseExcelFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        // Get first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          showWarning('Empty file', 'The Excel file is empty. Please add data and try again.');
          return;
        }

        // Validate and transform data
        const { validData, errors } = validateImportData(jsonData);

        setImportData(validData);
        setValidationErrors(errors);

        if (errors.length > 0) {
          showWarning('Validation warnings', `Found ${errors.length} validation issue(s). Please review before importing.`);
        }
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        showError('Failed to parse Excel file. Please ensure it is a valid Excel file.');
      }
    };

    reader.readAsBinaryString(file);
  };

  const validateImportData = (data: any[]) => {
    const errors: string[] = [];
    const validData: any[] = [];

    // Define column mappings (Excel column name -> form field name)
    const columnMap: { [key: string]: string } = {
      'First Name*': 'firstName',
      'First Name': 'firstName',
      'Middle Name': 'middleName',
      'Last Name*': 'lastName',
      'Last Name': 'lastName',
      'NIN': 'nin',
      'Date of Birth*': 'dateOfBirth',
      'Date of Birth': 'dateOfBirth',
      'Gender*': 'gender',
      'Gender': 'gender',
      'Citizenship': 'citizenship',
      'Permanent Province': 'permanentProvince',
      'Permanent District': 'permanentDistrict',
      'Permanent Municipality': 'permanentMunicipality',
      'Permanent Ward': 'permanentWard',
      'Temporary Province': 'temporaryProvince',
      'Temporary District': 'temporaryDistrict',
      'Temporary Municipality': 'temporaryMunicipality',
      'Temporary Ward': 'temporaryWard',
      'Father Name': 'fatherName',
      'Mother Name': 'motherName',
      'Spouse Name': 'spouseName',
      'Will Person': 'willPerson',
      'Caste': 'caste',
      'Mother Tongue': 'motherTongue',
      'Disability': 'disability',
      'Mobile*': 'mobile',
      'Mobile': 'mobile',
      'Email*': 'email',
      'Email': 'email',
      'PAN': 'pan',
      'Bank Name': 'bankName',
      'Bank Account': 'bankAccount',
      'Employee ID': 'employeeId',
      'Department*': 'department',
      'Department': 'department',
      'Subjects': 'subjects',
      'Teaching License': 'teachingLicense',
      'Joining Date': 'joiningDate',
      'Qualification': 'qualification',
      'Experience': 'experience',
      'Blood Group': 'bloodGroup',
      'Karmachari Sanachayakosh': 'karmachariSanachayakosh',
      'Sabadhik Bima Kosh': 'sabadhikBimaKosh',
      'SSF': 'ssf',
      'Nagarik Lagani Kosh': 'nagarikLaganiKosh',
      'Status*': 'status',
      'Status': 'status',
      'Notes': 'notes'
    };

    data.forEach((row, index) => {
      const rowNum = index + 2; // +2 because Excel rows start at 1 and first row is header
      const transformedRow: any = {};

      // Transform column names
      Object.keys(row).forEach(key => {
        const mappedKey = columnMap[key] || key;
        transformedRow[mappedKey] = row[key];
      });

      // Validate required fields
      if (!transformedRow.firstName) {
        errors.push(`Row ${rowNum}: First Name is required`);
      }
      if (!transformedRow.lastName) {
        errors.push(`Row ${rowNum}: Last Name is required`);
      }
      if (!transformedRow.gender) {
        errors.push(`Row ${rowNum}: Gender is required`);
      }
      if (!transformedRow.dateOfBirth) {
        errors.push(`Row ${rowNum}: Date of Birth is required`);
      }
      if (!transformedRow.mobile) {
        errors.push(`Row ${rowNum}: Mobile is required`);
      }
      if (!transformedRow.email) {
        errors.push(`Row ${rowNum}: Email is required`);
      }
      if (!transformedRow.department) {
        transformedRow.department = 'Teaching'; // Default value
      }
      if (!transformedRow.status) {
        transformedRow.status = 'active'; // Default value
      }

      // Validate gender values
      if (transformedRow.gender && !['Male', 'Female', 'Other'].includes(transformedRow.gender)) {
        errors.push(`Row ${rowNum}: Invalid gender value. Must be Male, Female, or Other`);
      }

      // Validate status values
      if (transformedRow.status && !['active', 'inactive', 'on-leave', 'terminated'].includes(transformedRow.status)) {
        errors.push(`Row ${rowNum}: Invalid status value. Must be active, inactive, on-leave, or terminated`);
      }

      validData.push(transformedRow);
    });

    return { validData, errors };
  };

  const handleImportConfirm = async () => {
    if (importData.length === 0) {
      showWarning('No data to import', 'Please select a valid Excel file with teacher data.');
      return;
    }

    try {
      setLoading(true);
      let successCount = 0;
      let failCount = 0;
      const failedRows: number[] = [];

      // Import each teacher record
      for (let i = 0; i < importData.length; i++) {
        try {
          const teacherData = importData[i];
          await teacherService.create(teacherData);
          successCount++;
        } catch (error) {
          console.error(`Error importing row ${i + 2}:`, error);
          failCount++;
          failedRows.push(i + 2);
        }
      }

      setShowImportModal(false);
      setImportFile(null);
      setImportData([]);
      setValidationErrors([]);
      fetchTeachers();

      if (failCount === 0) {
        showSuccess(`Successfully imported ${successCount} teacher(s)!`);
      } else {
        showWarning(
          'Import completed with errors',
          `Successfully imported: ${successCount}\nFailed: ${failCount}\nFailed rows: ${failedRows.join(', ')}`
        );
      }
    } catch (error) {
      console.error('Error importing teachers:', error);
      showError(`Failed to import teachers: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'profileImage',
      label: 'Photo',
      render: (_value: string, row: Teacher) => (
        <img
          src={row.profileImage || '/img/default-avatar.svg'}
          alt={`${row.firstName} ${row.lastName}`}
          className="w-10 h-10 rounded-full object-cover border border-gray-200"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/img/default-avatar.svg';
          }}
        />
      )
    },
    { key: 'position', label: 'Position' },
    { key: 'employeeId', label: 'Employee ID' },
    {
      key: 'firstName',
      label: 'Name',
      render: (_value: string, row: Teacher) => `${row.firstName} ${row.middleName || ''} ${row.lastName}`.trim()
    },
    { key: 'department', label: 'Department' },
    { key: 'mobile', label: 'Phone' },
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-4 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select School*</label>
            <input
              type="text"
              value="JKSS, Padampur"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Teacher Level</label>
            <Select
              value={filterTeacherLevel}
              onChange={(e) => setFilterTeacherLevel(e.target.value)}
              options={[
                { value: '', label: 'Select Teacher Level' },
                { value: 'bachelor', label: 'Bachelor' },
                { value: 'master', label: 'Master' },
                { value: 'phd', label: 'PhD' },
                { value: 'diploma', label: 'Diploma' },
                { value: 'certificate', label: 'Certificate' }
              ]}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={handleLoadFilters}
              className="flex-1 text-sm"
            >
              Load
            </Button>
            {(filterGender || filterTeacherLevel) && (
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="flex-1 text-sm"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center max-sm:flex-col max-sm:gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Teacher Information List</h2>
          <p className="text-sm text-gray-600">Showing {filteredTeachers.length} of {teachers.length} teacher(s)</p>
        </div>
        <div className="flex gap-2">
          <Button
            className='text-sm'
            variant="outline"
            icon={<Download className="w-5 h-5" />}
            onClick={downloadSampleTemplate}
          >
            Template
          </Button>
          <Button
            className='text-sm'
            variant="outline"
            icon={<Upload className="w-5 h-5" />}
            onClick={() => setShowImportModal(true)}
          >
            Import
          </Button>
          <Button
            className='text-sm'
            variant="primary"
            icon={<Plus className="w-5 h-5" />}
            onClick={() => {
              setEditingTeacher(null);
              resetForm();
              setShowModal(true);
            }}
          >
            Add New
          </Button>
        </div>
      </div>

      {/* Teachers Table */}
      <DataTable
        data={filteredTeachers}
        columns={columns}
        searchPlaceholder="Search teachers by name, employee ID, subject..."
        loading={loading}
        actions={(teacher: Teacher) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(teacher)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(teacher.id)}
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
          setEditingTeacher(null);
          resetForm();
        }}
        title={editingTeacher ? 'Edit Teacher Information' : 'Add Teacher Information'}
        size="xl"
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowModal(false);
                setEditingTeacher(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
            >
              {editingTeacher ? 'Update' : 'Save'} Teacher Information
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Photo
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
                  Only image files (not more than 2MB) are allowed.
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information Section */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

              <Select
                label="Position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                options={[
                  { value: 'Principal', label: 'Principal' },
                  { value: 'Vice-Principal', label: 'Vice-Principal' },
                  { value: 'Co-ordinator (Primary Level)', label: 'Co-ordinator (Primary Level)' },
                  { value: 'Co-ordinator (Basic Level)', label: 'Co-ordinator (Basic Level)' },
                  { value: 'Co-ordinator (Secondary Level)', label: 'Co-ordinator (Secondary Level)' },
                  { value: 'Teacher', label: 'Teacher' },
                ]}
              />

              <FormInput
                label="National Identity Number"
                value={formData.nin}
                onChange={(e) => setFormData({ ...formData, nin: e.target.value })}
                placeholder="National Identity Number"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === 'Male'}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">Male</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === 'Female'}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">Female</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Other"
                      checked={formData.gender === 'Other'}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">Other</span>
                  </label>
                </div>
              </div>

              <FormInput
                label="Date of Birth (BS)"
                required
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                placeholder="e.g. 2050-01-15"
              />

              <FormInput
                label="Citizenship No."
                value={formData.citizenship}
                onChange={(e) => setFormData({ ...formData, citizenship: e.target.value })}
                placeholder="Citizenship No."
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>

            {/* Permanent Address */}
            <h4 className="text-sm font-medium text-gray-700 mb-3">Permanent Address</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Select
                label="Province"
                value={formData.permanentProvince}
                onChange={(e) => setFormData({ ...formData, permanentProvince: e.target.value })}
                options={[
                  { value: 'Province 1', label: 'Province 1' },
                  { value: 'Madhesh', label: 'Madhesh' },
                  { value: 'Bagmati', label: 'Bagmati' },
                  { value: 'Gandaki', label: 'Gandaki' },
                  { value: 'Lumbini', label: 'Lumbini' },
                  { value: 'Karnali', label: 'Karnali' },
                  { value: 'Sudurpashchim', label: 'Sudurpashchim' },
                ]}
              />

              <FormInput
                label="District"
                value={formData.permanentDistrict}
                onChange={(e) => setFormData({ ...formData, permanentDistrict: e.target.value })}
                placeholder="District"
              />

              <FormInput
                label="Municipality"
                value={formData.permanentMunicipality}
                onChange={(e) => setFormData({ ...formData, permanentMunicipality: e.target.value })}
                placeholder="Municipality"
              />

              <FormInput
                label="Ward No."
                value={formData.permanentWard}
                onChange={(e) => setFormData({ ...formData, permanentWard: e.target.value })}
                placeholder="Ward No."
              />
            </div>

            {/* Temporary Address */}
            <h4 className="text-sm font-medium text-gray-700 mb-3 mt-4">Temporary Address</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select
                label="Province"
                value={formData.temporaryProvince}
                onChange={(e) => setFormData({ ...formData, temporaryProvince: e.target.value })}
                options={[
                  { value: 'Province 1', label: 'Province 1' },
                  { value: 'Madhesh', label: 'Madhesh' },
                  { value: 'Bagmati', label: 'Bagmati' },
                  { value: 'Gandaki', label: 'Gandaki' },
                  { value: 'Lumbini', label: 'Lumbini' },
                  { value: 'Karnali', label: 'Karnali' },
                  { value: 'Sudurpashchim', label: 'Sudurpashchim' },
                ]}
              />

              <FormInput
                label="District"
                value={formData.temporaryDistrict}
                onChange={(e) => setFormData({ ...formData, temporaryDistrict: e.target.value })}
                placeholder="District"
              />

              <FormInput
                label="Municipality"
                value={formData.temporaryMunicipality}
                onChange={(e) => setFormData({ ...formData, temporaryMunicipality: e.target.value })}
                placeholder="Municipality"
              />

              <FormInput
                label="Ward No."
                value={formData.temporaryWard}
                onChange={(e) => setFormData({ ...formData, temporaryWard: e.target.value })}
                placeholder="Ward No."
              />
            </div>
          </div>

          {/* Family Information */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Family Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormInput
                label="Father Name"
                value={formData.fatherName}
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                placeholder="Father Name"
              />

              <FormInput
                label="Mother Name"
                value={formData.motherName}
                onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                placeholder="Mother Name"
              />

              <FormInput
                label="Spouse Name"
                value={formData.spouseName}
                onChange={(e) => setFormData({ ...formData, spouseName: e.target.value })}
                placeholder="Spouse Name"
              />

              <FormInput
                label="Will Person Name"
                value={formData.willPerson}
                onChange={(e) => setFormData({ ...formData, willPerson: e.target.value })}
                placeholder="Will Person Name"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select
                label="Caste"
                value={formData.caste}
                onChange={(e) => setFormData({ ...formData, caste: e.target.value })}
                options={[
                  { value: 'Brahmin', label: 'Brahmin' },
                  { value: 'Chhetri', label: 'Chhetri' },
                  { value: 'Newar', label: 'Newar' },
                  { value: 'Tharu', label: 'Tharu' },
                  { value: 'Magar', label: 'Magar' },
                  { value: 'Tamang', label: 'Tamang' },
                  { value: 'Rai', label: 'Rai' },
                  { value: 'Gurung', label: 'Gurung' },
                  { value: 'Other', label: 'Other' },
                ]}
              />

              <Select
                label="Mother Tongue"
                value={formData.motherTongue}
                onChange={(e) => setFormData({ ...formData, motherTongue: e.target.value })}
                options={[
                  { value: 'Nepali', label: 'Nepali' },
                  { value: 'Maithili', label: 'Maithili' },
                  { value: 'Bhojpuri', label: 'Bhojpuri' },
                  { value: 'Tharu', label: 'Tharu' },
                  { value: 'Tamang', label: 'Tamang' },
                  { value: 'Newari', label: 'Newari' },
                  { value: 'Magar', label: 'Magar' },
                  { value: 'Other', label: 'Other' },
                ]}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Has Disability?
                </label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="disability"
                      value="Yes"
                      checked={formData.disability === 'Yes'}
                      onChange={(e) => setFormData({ ...formData, disability: e.target.value })}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="disability"
                      value="No"
                      checked={formData.disability === 'No'}
                      onChange={(e) => setFormData({ ...formData, disability: e.target.value })}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>

              <FormInput
                label="Mobile No."
                required
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="Contact No."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <FormInput
                label="Email Address"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email Address"
              />

              <FormInput
                label="PAN Number"
                value={formData.pan}
                onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                placeholder="PAN Number"
              />

              <FormInput
                label="Bank Name"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                placeholder="Bank Name"
              />

              <FormInput
                label="Bank Account Number"
                value={formData.bankAccount}
                onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                placeholder="BANK ACCOUNT NUMBER"
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormInput
                label="Employee ID"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                placeholder="Employee ID"
              />

              <Select
                label="Department"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                options={[
                  { value: 'Science', label: 'Science' },
                  { value: 'Mathematics', label: 'Mathematics' },
                  { value: 'English', label: 'English' },
                  { value: 'Languages', label: 'Languages' },
                  { value: 'Social Studies', label: 'Social Studies' },
                  { value: 'Arts', label: 'Arts' },
                  { value: 'Sports', label: 'Sports' },
                ]}
              />

              <FormInput
                label="Subjects (comma separated)"
                value={formData.subjects}
                onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                placeholder="Mathematics, Physics"
              />

              <FormInput
                label="Teaching License Number"
                value={formData.teachingLicense}
                onChange={(e) => setFormData({ ...formData, teachingLicense: e.target.value })}
                placeholder="LICENSE NO."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
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
                placeholder="B.Ed, M.Ed"
              />

              <FormInput
                label="Experience (years)"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="5 years"
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
                  { value: 'O-', label: 'O-' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <FormInput
                label="Karmachari Sanachayakosh Number"
                value={formData.karmachariSanachayakosh}
                onChange={(e) => setFormData({ ...formData, karmachariSanachayakosh: e.target.value })}
                placeholder="Sanachayakosh Number"
              />

              <FormInput
                label="Sabadhik Bima Kosh Number"
                value={formData.sabadhikBimaKosh}
                onChange={(e) => setFormData({ ...formData, sabadhikBimaKosh: e.target.value })}
                placeholder="SABADHIK BIMA KOSH NUMBER"
              />

              <FormInput
                label="SSF Number"
                value={formData.ssf}
                onChange={(e) => setFormData({ ...formData, ssf: e.target.value })}
                placeholder="SSF NUMBER"
              />

              <FormInput
                label="Nagarik Lagani Kosh Number"
                value={formData.nagarikLaganiKosh}
                onChange={(e) => setFormData({ ...formData, nagarikLaganiKosh: e.target.value })}
                placeholder="NAGARIK LAGANI KOSH NUMBER"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Select
                label="Status"
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'on-leave', label: 'On Leave' },
                  { value: 'terminated', label: 'Terminated' },
                ]}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Import Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => {
          setShowImportModal(false);
          setImportFile(null);
          setImportData([]);
          setValidationErrors([]);
        }}
        title="Import Teachers from Excel"
        size="lg"
        footer=""
      >
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">📋 Instructions</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Download the Excel template first using the "Download Template" button</li>
              <li>Fill in the teacher data following the column headers</li>
              <li>Fields marked with * are required</li>
              <li>Upload the completed Excel file below</li>
              <li>Review the preview and validation errors</li>
              <li>Click "Import" to add teachers to the system</li>
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Excel File
            </label>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImportFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                cursor-pointer"
            />
            {importFile && (
              <p className="mt-2 text-sm text-gray-600">
                Selected file: <strong>{importFile.name}</strong>
              </p>
            )}
          </div>

          {validationErrors.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-h-60 overflow-y-auto">
              <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Validation Warnings ({validationErrors.length})</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-0.5">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {importData.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">📊 Preview ({importData.length} records)</h4>
              <div className="max-h-60 overflow-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {importData.slice(0, 10).map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-2 whitespace-nowrap text-gray-900">{index + 1}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-gray-900">
                          {`${row.firstName || ''} ${row.middleName || ''} ${row.lastName || ''}`.trim()}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-gray-700">{row.gender || '-'}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-gray-700">{row.mobile || '-'}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-gray-700">{row.email || '-'}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-gray-700">{row.department || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {importData.length > 10 && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Showing first 10 of {importData.length} records
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowImportModal(false);
                setImportFile(null);
                setImportData([]);
                setValidationErrors([]);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleImportConfirm}
              disabled={importData.length === 0 || loading}
            >
              {loading ? 'Importing...' : `Import ${importData.length} Teacher(s)`}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Teachers;
