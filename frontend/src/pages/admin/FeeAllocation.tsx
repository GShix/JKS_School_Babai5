import React, { useState, useEffect } from 'react';
import { Users, CheckCircle } from 'lucide-react';
import Button from '../../components/shared/Button';
import Select from '../../components/shared/Select';
import FormInput from '../../components/shared/FormInput';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';
import { showSuccess, showError } from '../../utils/sweetAlert';
// interface ClassItem {
//   id: string | number;
//   name: string;
//   status?: string;
// }

interface FeeStructure {
  id: number;
  name: string;
  academicYear: string;
  class: string;
  totalAmount: number;
  isActive: boolean;
  dueDate: string;
}

interface Student {
  id: number;
  fullName: string;
  rollNumber: string;
  currentClass: string;
  section: string;
}

interface AllocationResult {
  id: number;
  student: Student;
  totalAmount: number;
  balance: number;
  status: string;
}

const FeeAllocation: React.FC = () => {
  const [structures, setStructures] = useState<FeeStructure[]>([]);
  const [selectedStructure, setSelectedStructure] = useState<number | ''>('');
  const [allocationType, setAllocationType] = useState<'class' | 'individual'>('class');
  const [className, setClassName] = useState('');
  // const [classes, setClasses] = useState<ClassItem[]>([]);
  const [section, setSection] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [allocating, setAllocating] = useState(false);
  const [discount, setDiscount] = useState('0');
  const [discountReason, setDiscountReason] = useState('');
  const [allocationBatch, setAllocationBatch] = useState('');
  const [purpose, setPurpose] = useState('tuition');
  const [allocatedResults, setAllocatedResults] = useState<AllocationResult[]>([]);

  const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');
  // const fetchClasses = async () => {
  //   try {
  //     const response = await axios.get(`${API_BASE_URL}/classes`, {
  //       headers: {
  //         Authorization: `Bearer ${getToken()}`,
  //       },
  //     });

  //     const classData = response.data?.data || [];

  //     setClasses(
  //       classData.filter(
  //         (classItem: ClassItem) =>
  //           !classItem.status ||
  //           classItem.status.toLowerCase() === 'active'
  //       )
  //     );
  //   } catch (error) {
  //     console.error('Error fetching classes:', error);
  //     showError('Failed to load classes');
  //     setClasses([]);
  //   }
  // };
  useEffect(() => {
    // fetchClasses();
    fetchFeeStructures();
  }, []);

  useEffect(() => {
    if (allocationType === 'class' && className) {
      fetchStudentsByClass();
    }
  }, [className, section, allocationType]);

  // Fetch active fee structures
  const fetchFeeStructures = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/fee-management/structures`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const activeStructures = response.data.data.filter((s: FeeStructure) => s.isActive);
      setStructures(activeStructures);
    } catch (error) {
      console.error('Error fetching fee structures:', error);
      showError('Error fetching fee structures');
    } finally {
      setLoading(false);
    }
  };

  // Fetch students by class
  const fetchStudentsByClass = async () => {
    if (!className) {
      setStudents([]);
      setSelectedStudents([]);
      return;
    }

    try {
      setLoading(true);
      setSelectedStudents([]);

      const response = await axios.get(
        `${API_BASE_URL}/students`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          params: {
            currentClass: className,
          },
        }
      );

      let fetchedStudents: Student[] =
        response.data?.data || [];

      // Defensive filtering
      fetchedStudents = fetchedStudents.filter(
        (student) =>
          String(student.currentClass) ===
          String(className)
      );

      // Filter section if selected
      if (section.trim()) {
        fetchedStudents = fetchedStudents.filter(
          (student) =>
            student.section?.toUpperCase() ===
            section.trim().toUpperCase()
        );
      }

      setStudents(fetchedStudents);
    } catch (error: any) {
      console.error('Error fetching students:', error);

      showError(
        error.response?.data?.message ||
        'Error fetching students for this class'
      );

      setStudents([]);
    } finally {
      setLoading(false);
    }
  };
  // Search students for individual allocation
  const handleSearchStudents = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/students`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const allStudents = response.data.data || [];
      const query = searchQuery.toLowerCase();

      // Search by name or roll number
      const filtered = allStudents.filter((s: Student) =>
        s.fullName?.toLowerCase().includes(query) ||
        s.rollNumber?.toLowerCase().includes(query)
      );

      setSearchResults(filtered.slice(0, 10)); // Limit to 10 results
    } catch (error) {
      console.error('Error searching students:', error);
      showError('Error searching students');
    }
  };

  // Add student to selection
  const handleAddStudent = (student: Student) => {
    if (!selectedStudents.includes(student.id)) {
      setSelectedStudents([...selectedStudents, student.id]);
      if (!students.find(s => s.id === student.id)) {
        setStudents([...students, student]);
      }
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  // Remove student from selection
  const handleRemoveStudent = (studentId: number) => {
    setSelectedStudents(selectedStudents.filter(id => id !== studentId));
  };

  // Allocate fees
  const handleAllocate = async () => {
    if (!selectedStructure) {
      showError('Please select a fee structure');
      return;
    }

    const discountAmount = parseFloat(discount) || 0;
    if (discountAmount < 0) {
      showError('Discount cannot be negative');
      return;
    }

    try {
      setAllocating(true);
      let response;

      if (allocationType === 'class') {
        if (!className) {
          showError('Please select a class');
          return;
        }

        response = await axios.post(
          `${API_BASE_URL}/fee-management/allocations/class`,
          {
            class: className,
            section: section || undefined,
            feeStructureId: selectedStructure,
            discount: discountAmount,
            discountReason: discountReason || undefined,
            allocationBatch: allocationBatch || undefined,
            purpose: purpose || 'tuition',
          },
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
      } else {
        if (selectedStudents.length === 0) {
          showError('Please select at least one student');
          return;
        }

        response = await axios.post(
          `${API_BASE_URL}/fee-management/allocations/bulk`,
          {
            studentIds: selectedStudents,
            feeStructureId: selectedStructure,
            discount: discountAmount,
            discountReason: discountReason || undefined,
            allocationBatch: allocationBatch || undefined,
            purpose: purpose || 'tuition',
          },
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
      }

      const { successful, failed, allocations } = response.data.data;
      setAllocatedResults(allocations || []);

      showSuccess(
        `Successfully allocated to ${successful} student(s)${failed > 0 ? `. ${failed} failed.` : ''}`
      );

      // Reset form
      setSelectedStructure('');
      setClassName('');
      setSection('');
      setSelectedStudents([]);
      setStudents([]);
      setDiscount('0');
      setDiscountReason('');
      setAllocationBatch('');
      setPurpose('tuition');
    } catch (error: any) {
      console.error('Error allocating fees:', error);
      showError(error.response?.data?.message || 'Error allocating fees');
    } finally {
      setAllocating(false);
    }
  };

  const selectedStructureDetails = structures.find(s => s.id === selectedStructure);
  const displayedStudents = allocationType === 'class'
    ? students
    : students.filter(s => selectedStudents.includes(s.id));

  return (
    <div className="space-y-6">
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-2">Loading...</p>
        </div>
      )}
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fee Allocation</h1>
          <p className="text-gray-600 mt-1">Allocate fee structures to students</p>
        </div>
      </div>

      {/* Allocation Form */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Allocation Details
        </h3>

        <div className="space-y-4">
          {/* Fee Structure Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fee Structure *
            </label>
            <Select
              value={selectedStructure.toString()}
              onChange={(e) => setSelectedStructure(e.target.value ? parseInt(e.target.value) : '')}
              options={[
                { value: '', label: 'Select Fee Structure' },
                ...structures.map((structure) => ({
                  value: structure.id.toString(),
                  label: `${structure.name} - ${structure.academicYear} (NPR ${structure.totalAmount})`
                }))
              ]}
              required
            />
            {selectedStructureDetails && (
              <div className="mt-2 p-3 bg-blue-50 rounded border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>Academic Year:</strong> {selectedStructureDetails.academicYear} |
                  <strong> Amount:</strong> NPR {selectedStructureDetails.totalAmount.toLocaleString()} |
                  <strong> Due Date:</strong> {new Date(selectedStructureDetails.dueDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Allocation Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allocation Type *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="class"
                  checked={allocationType === 'class'}
                  onChange={(e) => setAllocationType(e.target.value as 'class')}
                  className="mr-2"
                />
                <span>Allocate to Entire Class</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="individual"
                  checked={allocationType === 'individual'}
                  onChange={(e) => setAllocationType(e.target.value as 'individual')}
                  className="mr-2"
                />
                <span>Select Individual Students</span>
              </label>
            </div>
          </div>

          {/* Class Selection (for class allocation) */}
          {/* {allocationType === 'class' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class *
                </label>
                <Select
                  value={className}
                  onChange={(e) => {
                    setClassName(e.target.value);
                    setSelectedStudents([]);
                    setStudents([]);
                  }}
                  options={[
                    {
                      value: '',
                      label: 'Select Class',
                    },
                    ...classes.map((classItem) => ({
                      // IMPORTANT:
                      // currentClass stores values like "1", "LKG", "Nursery"
                      value: String(classItem.name),
                      label: classItem.name,
                    })),
                  ]}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section (Optional)
                </label>
                <FormInput
                  value={section}
                  onChange={(e) => setSection(e.target.value.toUpperCase())}
                  placeholder="e.g., A, B, C"
                />
              </div>
            </div>
          )} */}

          {/* Student Search (for individual allocation) */}
          {allocationType === 'individual' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Students *
              </label>
              <div className="flex gap-2">
                <FormInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter student name or roll number"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchStudents()}
                />
                <Button onClick={handleSearchStudents} icon={<Users className="w-5 h-5" />}>
                  Search
                </Button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-2 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                  {searchResults.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => handleAddStudent(student)}
                      className="w-full p-3 text-left hover:bg-gray-50 border-b last:border-b-0"
                    >
                      <p className="font-medium">{student.fullName}</p>
                      <p className="text-sm text-gray-600">
                        {student.rollNumber} | Class {student.currentClass}-{student.section}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Discount (Optional) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount (Optional)
              </label>
              <FormInput
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Reason
              </label>
              <FormInput
                value={discountReason}
                onChange={(e) => setDiscountReason(e.target.value)}
                placeholder="e.g., Scholarship, Sibling discount"
              />
            </div>
          </div>

          {/* Multi-Allocation Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Allocation Batch (for multiple allocations)
                <span className="text-xs text-blue-700 block mt-1">
                  e.g., 2081-MIDTERM-EXAM, 2081-SPORTS-DAY
                </span>
              </label>
              <FormInput
                value={allocationBatch}
                onChange={(e) => setAllocationBatch(e.target.value.toUpperCase())}
                placeholder="2081-ANNUAL-FEE"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Purpose
              </label>
              <Select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                options={[
                  { value: 'admission', label: 'Admission Fee' },
                  { value: 'tuition', label: 'Tuition/Regular Fee' },
                  { value: 'examination', label: 'Exam Fee' },
                  { value: 'event', label: 'Event/Program Fee' },
                  { value: 'transport', label: 'Transport/Bus Fee' },
                  { value: 'hostel', label: 'Hostel Fee' },
                  { value: 'library', label: 'Library Fee' },
                  { value: 'lab', label: 'Laboratory Fee' },
                  { value: 'sports', label: 'Sports Fee' },
                  { value: 'other', label: 'Other' },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Students Preview */}
      {displayedStudents.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Students to Allocate ({displayedStudents.length})
            </h3>
            {selectedStructureDetails && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  NPR {(displayedStudents.length * (selectedStructureDetails.totalAmount - parseFloat(discount || '0'))).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Roll #</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Class</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
                  {allocationType === 'individual' && (
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Action</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayedStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="px-4 py-3 text-sm">{student.rollNumber}</td>
                    <td className="px-4 py-3 text-sm font-medium">{student.fullName}</td>
                    <td className="px-4 py-3 text-sm">
                      {student.currentClass}-{student.section}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      NPR {selectedStructureDetails
                        ? (selectedStructureDetails.totalAmount - parseFloat(discount || '0')).toLocaleString()
                        : '-'}
                    </td>
                    {allocationType === 'individual' && (
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => handleRemoveStudent(student.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleAllocate}
              disabled={allocating || !selectedStructure || displayedStudents.length === 0}
              variant="primary"
              icon={<span className="text-xl font-bold">रु</span>}
            >
              {allocating ? 'Allocating...' : `Allocate to ${displayedStudents.length} Student(s)`}
            </Button>
          </div>
        </div>
      )}

      {/* Allocation Results */}
      {allocatedResults.length > 0 && (
        <div className="bg-green-50 rounded-xl border border-green-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">
              Successfully Allocated!
            </h3>
          </div>
          <p className="text-green-800">
            Fee structure has been allocated to {allocatedResults.length} student(s).
            Students can now see their pending fees and make payments.
          </p>
        </div>
      )}
    </div>
  );
};

export default FeeAllocation;
