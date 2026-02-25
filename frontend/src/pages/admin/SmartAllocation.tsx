/**
 * Smart Fee Allocation Component
 * Professional two-step workflow - Step 2: Allocation with Preview
 */

import React, { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle,
  Eye,
  Search,
  X,
  Layers,
  TrendingUp,
  Plus,
} from 'lucide-react';
import Button from '../../components/shared/Button';
import Select from '../../components/shared/Select';
import FormInput from '../../components/shared/FormInput';
import Badge from '../../components/shared/Badge';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';
import { showSuccess, showError } from '../../utils/sweetAlert';

interface FeeStructure {
  id: number;
  name: string;
  academicYear: string;
  class: string;
  section: string;
  totalAmount: number;
  purpose: string;
  dueDate: string;
  isActive: boolean;
  items?: Array<{
    category: { name: string };
    amount: number;
  }>;
}

interface Student {
  id: number;
  fullName: string;
  rollNumber: string;
  class: string;
  section: string;
  phone: string;
}

interface AllocationPreview {
  student: Student;
  totalAmount: number;
  finalAmount: number;
  discount: number;
}

const SmartAllocation: React.FC = () => {
  const [structures, setStructures] = useState<FeeStructure[]>([]);
  const [selectedStructure, setSelectedStructure] = useState<number | ''>('');
  const [allocationType, setAllocationType] = useState<'class' | 'individual' | 'school' | 'multiple-classes'>('class');
  const [classValue, setClassValue] = useState('');
  const [section, setSection] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  
  // Multiple classes state
  const [multipleClasses, setMultipleClasses] = useState<Array<{class: string, section: string}>>([]);
  const [tempClass, setTempClass] = useState('');
  const [tempSection, setTempSection] = useState('');
  const [preview, setPreview] = useState<AllocationPreview[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [allocating, setAllocating] = useState(false);

  // Allocation options
  const [discount, setDiscount] = useState('0');
  const [discountReason, setDiscountReason] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [allocationBatch, setAllocationBatch] = useState('');
  const [notes, setNotes] = useState('');

  // Success state
  const [allocationSuccess, setAllocationSuccess] = useState(false);
  const [allocatedCount, setAllocatedCount] = useState(0);

  const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

  useEffect(() => {
    fetchStructures();
  }, []);

  useEffect(() => {
    if (allocationType === 'class' && classValue) {
      fetchStudentsByClass();
    } else if (allocationType === 'school') {
      fetchAllStudents();
    } else if (allocationType === 'multiple-classes' && multipleClasses.length > 0) {
      fetchStudentsByMultipleClasses();
    }
  }, [classValue, section, allocationType, multipleClasses]);

  const fetchStructures = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/fee-management/structures`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      // Only show active structures
      setStructures(response.data.data?.filter((s: FeeStructure) => s.isActive) || []);
    } catch (error) {
      console.error('Error fetching structures:', error);
      showError('Error fetching fee structures');
    }
  };

  const fetchStudentsByClass = async () => {
    try {
      const params: any = { class: classValue };
      if (section) params.section = section;

      const response = await axios.get(`${API_BASE_URL}/students`, {
        params,
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setStudents(response.data.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      showError('Error fetching students');
    }
  };

  const fetchAllStudents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/students`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setStudents(response.data.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      showError('Error fetching students');
    }
  };

  const fetchStudentsByMultipleClasses = async () => {
    try {
      // Fetch students for each class and combine them
      const allStudentsPromises = multipleClasses.map(async (cls) => {
        const params: any = { class: cls.class };
        if (cls.section) params.section = cls.section;
        
        const response = await axios.get(`${API_BASE_URL}/students`, {
          params,
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        return response.data.data || [];
      });

      const allStudentsArrays = await Promise.all(allStudentsPromises);
      // Flatten and remove duplicates based on student ID
      const uniqueStudents = allStudentsArrays
        .flat()
        .filter((student, index, self) => 
          index === self.findIndex((s) => s.id === student.id)
        );
      
      setStudents(uniqueStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
      showError('Error fetching students from multiple classes');
    }
  };

  const handleAddClass = () => {
    if (!tempClass) {
      showError('Please select a class');
      return;
    }

    // Check if this class-section combination already exists
    const exists = multipleClasses.some(
      (cls) => cls.class === tempClass && cls.section === tempSection
    );

    if (exists) {
      showError('This class-section combination is already added');
      return;
    }

    setMultipleClasses([...multipleClasses, { class: tempClass, section: tempSection }]);
    setTempClass('');
    setTempSection('');
  };

  const handleRemoveClass = (index: number) => {
    setMultipleClasses(multipleClasses.filter((_, i) => i !== index));
  };

  const searchStudents = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/students`, {
        params: { search: searchQuery },
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setSearchResults(response.data.data || []);
    } catch (error) {
      console.error('Error searching students:', error);
      showError('Error searching students');
    }
  };

  const handleAddStudent = (student: Student) => {
    if (!selectedStudents.includes(student.id)) {
      setSelectedStudents([...selectedStudents, student.id]);
      if (!students.find((s) => s.id === student.id)) {
        setStudents([...students, student]);
      }
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleRemoveStudent = (studentId: number) => {
    setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
  };

  const generatePreview = () => {
    const targetStudents = allocationType === 'individual' 
      ? students.filter((s) => selectedStudents.includes(s.id))
      : students;

    const structure = structures.find((s) => s.id === selectedStructure);
    if (!structure) return;

    const discountAmount = parseFloat(discount) || 0;
    const previews: AllocationPreview[] = targetStudents.map((student) => ({
      student,
      totalAmount: structure.totalAmount,
      discount: discountAmount,
      finalAmount: structure.totalAmount - discountAmount,
    }));

    setPreview(previews);
    setShowPreview(true);
  };

  const handleAllocate = async () => {
    if (!selectedStructure) {
      showError('Please select a fee structure');
      return;
    }

    const targetStudents = allocationType === 'individual'
      ? students.filter((s) => selectedStudents.includes(s.id))
      : students;

    if (targetStudents.length === 0) {
      showError('No students selected for allocation');
      return;
    }

    const discountAmount = parseFloat(discount) || 0;
    if (discountAmount < 0) {
      showError('Discount cannot be negative');
      return;
    }

    try {
      setAllocating(true);
      const structure = structures.find((s) => s.id === selectedStructure);
      
      let response;
      
      if (allocationType === 'class' || allocationType === 'school') {
        response = await axios.post(
          `${API_BASE_URL}/fee-management/allocations/class`,
          {
            feeStructureId: selectedStructure,
            class: allocationType === 'school' ? null : classValue,
            section: section || null,
            discount: discountAmount,
            discountReason: discountReason || undefined,
            dueDate: dueDate || structure?.dueDate || undefined,
            notes: notes || undefined,
            allocationBatch: allocationBatch || undefined,
            purpose: structure?.purpose || 'tuition',
          },
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
      } else if (allocationType === 'multiple-classes') {
        // Allocate to each class-section combination
        const allocationPromises = multipleClasses.map(async (cls) => {
          return axios.post(
            `${API_BASE_URL}/fee-management/allocations/class`,
            {
              feeStructureId: selectedStructure,
              class: cls.class,
              section: cls.section || null,
              discount: discountAmount,
              discountReason: discountReason || undefined,
              dueDate: dueDate || structure?.dueDate || undefined,
              notes: notes || undefined,
              allocationBatch: allocationBatch || undefined,
              purpose: structure?.purpose || 'tuition',
            },
            {
              headers: { Authorization: `Bearer ${getToken()}` },
            }
          );
        });
        
        const responses = await Promise.all(allocationPromises);
        response = responses[0]; // Use first response for success count
        // Sum up allocations from all responses
        const totalAllocated = responses.reduce((sum, res) => sum + (res.data.data?.allocated || 0), 0);
        response.data.data.allocated = totalAllocated;
      } else {
        response = await axios.post(
          `${API_BASE_URL}/fee-management/allocations/bulk`,
          {
            feeStructureId: selectedStructure,
            studentIds: selectedStudents,
            discount: discountAmount,
            discountReason: discountReason || undefined,
            dueDate: dueDate || structure?.dueDate || undefined,
            notes: notes || undefined,
            allocationBatch: allocationBatch || undefined,
            purpose: structure?.purpose || 'tuition',
          },
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
      }

      const { successful, failed } = response.data.data;
      setAllocatedCount(successful);
      setAllocationSuccess(true);
      
      showSuccess(
        `Successfully allocated to ${successful} student(s)${failed > 0 ? `. ${failed} failed.` : ''}`
      );

      // Reset form after short delay
      setTimeout(() => {
        resetForm();
      }, 3000);
    } catch (error: any) {
      console.error('Error allocating fees:', error);
      showError(error.response?.data?.message || 'Error allocating fees');
    } finally {
      setAllocating(false);
    }
  };

  const resetForm = () => {
    setSelectedStructure('');
    setAllocationType('class');
    setClassValue('');
    setSection('');
    setSelectedStudents([]);
    setStudents([]);
    setDiscount('0');
    setDiscountReason('');
    setDueDate('');
    setAllocationBatch('');
    setNotes('');
    setShowPreview(false);
    setPreview([]);
    setAllocationSuccess(false);
    setAllocatedCount(0);
  };

  const selectedStructureDetails = structures.find((s) => s.id === selectedStructure);
  const displayedStudents = allocationType === 'individual'
    ? students.filter((s) => selectedStudents.includes(s.id))
    : students;

  const totalAllocationAmount = displayedStudents.length * 
    ((selectedStructureDetails?.totalAmount || 0) - (parseFloat(discount) || 0));

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {allocationSuccess && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-12 h-12 text-green-600" />
            <div>
              <h3 className="text-xl font-bold text-green-900">Allocation Successful!</h3>
              <p className="text-green-700 mt-1">
                Fee structure has been allocated to {allocatedCount} student(s). Students can now see their pending fees
                and make payments.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-blue-600" />
            Smart Fee Allocation
          </h1>
          <p className="text-gray-600 mt-1">Allocate fee structures to students with preview</p>
        </div>
      </div>

      {/* Step 1: Select Structure */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            1
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Select Fee Structure</h3>
        </div>

        <Select
          label="Fee Structure *"
          value={selectedStructure.toString()}
          onChange={(e) => setSelectedStructure(e.target.value ? parseInt(e.target.value) : '')}
          options={[
            { value: '', label: 'Select Fee Structure' },
            ...structures.map((structure) => ({
              value: structure.id.toString(),
              label: `${structure.name} - ${structure.academicYear} (NPR ${structure.totalAmount.toLocaleString()}) - ${structure.purpose}`,
            })),
          ]}
          required
        />

        {selectedStructureDetails && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-blue-600 font-medium mb-1">Structure Details</p>
                <p className="text-sm font-semibold text-blue-900">{selectedStructureDetails.name}</p>
                <p className="text-xs text-blue-700">{selectedStructureDetails.academicYear}</p>
              </div>
              <div>
                <p className="text-xs text-blue-600 font-medium mb-1">Total Amount</p>
                <p className="text-xl font-bold text-blue-900">
                  NPR {selectedStructureDetails.totalAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-600 font-medium mb-1">Purpose</p>
                <Badge variant="info">
                  {selectedStructureDetails.purpose.charAt(0).toUpperCase() + selectedStructureDetails.purpose.slice(1)}
                </Badge>
              </div>
            </div>
            {selectedStructureDetails.items && selectedStructureDetails.items.length > 0 && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-xs text-blue-600 font-medium mb-2">Breakdown:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedStructureDetails.items.map((item, idx) => (
                    <span key={idx} className="text-xs bg-white px-2 py-1 rounded border border-blue-200">
                      {item.category.name}: NPR {item.amount}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Step 2: Select Students */}
      {selectedStructure && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Select Students</h3>
          </div>

          {/* Allocation Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Allocation Type *</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => setAllocationType('class')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  allocationType === 'class'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <p className="font-medium text-gray-900">Specific Class</p>
                <p className="text-xs text-gray-600 mt-1">Allocate to one class/section</p>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAllocationType('multiple-classes');
                  setStudents([]);
                  setMultipleClasses([]);
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  allocationType === 'multiple-classes'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <Layers className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <p className="font-medium text-gray-900">Multiple Classes</p>
                <p className="text-xs text-gray-600 mt-1">Allocate to multiple classes</p>
              </button>
              <button
                type="button"
                onClick={() => setAllocationType('school')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  allocationType === 'school'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <p className="font-medium text-gray-900">Entire School</p>
                <p className="text-xs text-gray-600 mt-1">Allocate to all students</p>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAllocationType('individual');
                  setStudents([]);
                  setSelectedStudents([]);
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  allocationType === 'individual'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <Search className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <p className="font-medium text-gray-900">Individual Students</p>
                <p className="text-xs text-gray-600 mt-1">Search and select specific students</p>
              </button>
            </div>
          </div>

          {/* Class Selection */}
          {allocationType === 'class' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Class *"
                value={classValue}
                onChange={(e) => setClassValue(e.target.value)}
                options={[
                  { value: '', label: 'Select Class' },
                  ...[...Array(12)].map((_, i) => ({ 
                    value: `${i + 1}`, 
                    label: `Class ${i + 1}` 
                  })),
                ]}
                required
              />
              <FormInput
                label="Section (Optional)"
                value={section}
                onChange={(e) => setSection(e.target.value.toUpperCase())}
                placeholder="e.g., A, B, C (leave empty for all sections)"
              />
            </div>
          )}

          {/* Multiple Classes Selection */}
          {allocationType === 'multiple-classes' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Class *"
                  value={tempClass}
                  onChange={(e) => setTempClass(e.target.value)}
                  options={[
                    { value: '', label: 'Select Class' },
                    ...[...Array(12)].map((_, i) => ({ 
                      value: `${i + 1}`, 
                      label: `Class ${i + 1}` 
                    })),
                  ]}
                />
                <FormInput
                  label="Section (Optional)"
                  value={tempSection}
                  onChange={(e) => setTempSection(e.target.value.toUpperCase())}
                  placeholder="e.g., A, B, C"
                />
                <div className="flex items-end">
                  <Button 
                    onClick={handleAddClass} 
                    icon={<Plus className="w-4 h-4" />}
                    className="w-full"
                  >
                    Add Class
                  </Button>
                </div>
              </div>

              {/* Selected Classes List */}
              {multipleClasses.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-900 mb-2">
                    Selected Classes ({multipleClasses.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {multipleClasses.map((cls, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-blue-300"
                      >
                        <span className="text-sm font-medium text-gray-900">
                          Class {cls.class}{cls.section ? `-${cls.section}` : ' (All Sections)'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveClass(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Individual Student Search */}
          {allocationType === 'individual' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Students</label>
              <div className="flex gap-2">
                <FormInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or roll number"
                  onKeyPress={(e) => e.key === 'Enter' && searchStudents()}
                />
                <Button onClick={searchStudents} icon={<Search className="w-5 h-5" />}>
                  Search
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="mt-2 bg-white border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                  {searchResults.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => handleAddStudent(student)}
                      className="w-full px-4 py-2 text-left hover:bg-blue-50 border-b border-gray-100 last:border-0"
                    >
                      <p className="font-medium text-gray-900">{student.fullName}</p>
                      <p className="text-xs text-gray-600">
                        Roll: {student.rollNumber} | Class {student.class}-{student.section}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Student Count */}
          {displayedStudents.length > 0 && (
            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span className="font-semibold text-gray-900">{displayedStudents.length} students selected</span>
                </div>
                <Button size="sm" variant="secondary" onClick={generatePreview} icon={<Eye className="w-4 h-4" />}>
                  Preview Allocation
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Allocation Options */}
      {selectedStructure && displayedStudents.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Allocation Options</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Discount per Student"
              type="number"
              step="0.01"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="0"
            />
            <FormInput
              label="Discount Reason"
              value={discountReason}
              onChange={(e) => setDiscountReason(e.target.value)}
              placeholder="e.g., Scholarship, Sibling discount"
            />
            <FormInput
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              placeholder="Leave empty to use structure default"
            />
            <FormInput
              label="Allocation Batch (Optional)"
              value={allocationBatch}
              onChange={(e) => setAllocationBatch(e.target.value)}
              placeholder="e.g., 2081-MIDTERM-EXAM"
            />
            <div className="md:col-span-2">
              <FormInput
                label="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes about this allocation"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-blue-600 font-medium mb-1">Students</p>
                <p className="text-2xl font-bold text-blue-900">{displayedStudents.length}</p>
              </div>
              <div>
                <p className="text-xs text-blue-600 font-medium mb-1">Amount per Student</p>
                <p className="text-2xl font-bold text-blue-900">
                  NPR {((selectedStructureDetails?.totalAmount || 0) - (parseFloat(discount) || 0)).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-600 font-medium mb-1">Total Allocation</p>
                <p className="text-2xl font-bold text-purple-900">
                  NPR {totalAllocationAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
            <Button
              onClick={handleAllocate}
              disabled={allocating}
              icon={allocating ? undefined : <CheckCircle className="w-5 h-5" />}
            >
              {allocating ? 'Allocating...' : `Allocate to ${displayedStudents.length} Student(s)`}
            </Button>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && preview.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Allocation Preview</h3>
              <button onClick={() => setShowPreview(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
              <div className="space-y-3">
                {preview.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">{item.student.fullName}</p>
                      <p className="text-sm text-gray-600">
                        Roll: {item.student.rollNumber} | Class {item.student.class}-{item.student.section}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        NPR {item.totalAmount.toLocaleString()}
                        {item.discount > 0 && <span className="text-green-600"> -{item.discount}</span>}
                      </p>
                      <p className="font-bold text-blue-900">NPR {item.finalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <p className="text-gray-700">
                  Total: <span className="font-bold text-xl">NPR {totalAllocationAmount.toLocaleString()}</span>
                </p>
                <Button onClick={() => setShowPreview(false)} variant="primary">
                  Close Preview
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Individual Students List */}
      {allocationType === 'individual' && displayedStudents.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Students ({displayedStudents.length})</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {displayedStudents.map((student) => (
              <div key={student.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{student.fullName}</p>
                  <p className="text-xs text-gray-600">
                    Roll: {student.rollNumber} | Class {student.class}-{student.section}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleRemoveStudent(student.id)}
                  icon={<X className="w-4 h-4" />}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartAllocation;
