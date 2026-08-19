import React, { useEffect, useMemo, useState } from 'react';
import {
  Users,
  CheckCircle,
  UserPlus,
  // UserMinus,
  GraduationCap,
  Search,
  X,
  Wallet,
} from 'lucide-react';
import axios from 'axios';

import Button from '../../components/shared/Button';
import Select from '../../components/shared/Select';
import FormInput from '../../components/shared/FormInput';

import { API_BASE_URL } from '../../api/config';
import { showSuccess, showError } from '../../utils/sweetAlert';


// ============================================================
// TYPES
// ============================================================

interface ClassItem {
  id: string | number;
  name: string;
  status?: string;
}

interface FeeStructure {
  id: number;
  name: string;
  academicYear: string;
  class: string;
  section?: string;
  totalAmount: number | string;
  isActive: boolean;
  dueDate?: string;
  purpose?: string;
}

interface Student {
  id: number;
  fullName: string;
  rollNumber?: string;
  currentClass: string;
  section?: string;
  studentId?: string;
  contactNumber?: string;
}

interface AllocationResult {
  id: number;
  student: Student;
  totalAmount: number;
  balance: number;
  status: string;
}


// ============================================================
// COMPONENT
// ============================================================

const FeeAllocation: React.FC = () => {
  // ----------------------------------------------------------
  // Fee structures
  // ----------------------------------------------------------

  const [structures, setStructures] = useState<FeeStructure[]>([]);
  const [selectedStructure, setSelectedStructure] = useState<number | ''>('');

  // ----------------------------------------------------------
  // Allocation
  // ----------------------------------------------------------

  const [allocationType, setAllocationType] =
    useState<'class' | 'individual'>('class');

  // ----------------------------------------------------------
  // Classes
  // ----------------------------------------------------------

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');

  // ----------------------------------------------------------
  // Students
  // ----------------------------------------------------------

  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

  // Individual student search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Student[]>([]);

  // ----------------------------------------------------------
  // Other fields
  // ----------------------------------------------------------

  const [loading, setLoading] = useState(false);
  const [allocating, setAllocating] = useState(false);

  const [discount, setDiscount] = useState('0');
  const [discountReason, setDiscountReason] = useState('');

  const [allocationBatch, setAllocationBatch] = useState('');
  const [purpose, setPurpose] = useState('tuition');

  const [allocatedResults, setAllocatedResults] = useState<
    AllocationResult[]
  >([]);


  // ==========================================================
  // TOKEN
  // ==========================================================

  const getToken = () =>
    localStorage.getItem('token') ||
    sessionStorage.getItem('token');


  // ==========================================================
  // FETCH CLASSES
  // ==========================================================

  const fetchClasses = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/classes`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const classData: ClassItem[] =
        response.data?.data || [];

      const activeClasses = classData.filter(
        (classItem) =>
          !classItem.status ||
          classItem.status.toLowerCase() === 'active'
      );

      setClasses(activeClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
      showError('Failed to load classes');
      setClasses([]);
    }
  };


  // ==========================================================
  // FETCH FEE STRUCTURES
  // ==========================================================

  const fetchFeeStructures = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_BASE_URL}/fee-management/structures`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const allStructures: FeeStructure[] =
        response.data?.data || [];

      setStructures(
        allStructures.filter(
          (structure) => structure.isActive
        )
      );
    } catch (error) {
      console.error(
        'Error fetching fee structures:',
        error
      );

      showError('Error fetching fee structures');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    fetchClasses();
    fetchFeeStructures();
  }, []);

  // ==========================================================
  // FETCH STUDENTS BY CLASS
  // ==========================================================

  const fetchStudentsByClass = async () => {
    if (!className) {
      setStudents([]);
      setSelectedStudents([]);
      return;
    }

    try {
      setLoading(true);

      // Clear old students immediately
      setStudents([]);
      setSelectedStudents([]);

      const response = await axios.get(
        `${API_BASE_URL}/students`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          params: {
            // IMPORTANT:
            // Student.currentClass stores:
            // "1", "2", "LKG", "Nursery", etc.
            currentClass: className,
          },
        }
      );

      let fetchedStudents: Student[] =
        response.data?.data || [];

      // Defensive class filtering
      fetchedStudents = fetchedStudents.filter(
        (student) =>
          String(student.currentClass).trim().toLowerCase() ===
          String(className).trim().toLowerCase()
      );

      // Section filtering
      if (section.trim()) {
        fetchedStudents = fetchedStudents.filter(
          (student) =>
            String(student.section || '')
              .trim()
              .toUpperCase() ===
            section.trim().toUpperCase()
        );
      }

      setStudents(fetchedStudents);

      // For entire-class allocation,
      // automatically select all students.
      if (allocationType === 'class') {
        setSelectedStudents(
          fetchedStudents.map((student) => student.id)
        );
      }
    } catch (error: any) {
      console.error(
        'Error fetching students:',
        error
      );

      showError(
        error.response?.data?.message ||
        'Error fetching students for this class'
      );

      setStudents([]);
      setSelectedStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // CLASS / SECTION CHANGE
  // ==========================================================

  useEffect(() => {
    if (
      allocationType === 'class' &&
      className
    ) {
      fetchStudentsByClass();
    } else if (allocationType !== 'class') {
      setStudents([]);
    }
  }, [className, section, allocationType]);


  // ==========================================================
  // SEARCH STUDENTS
  // ==========================================================
  const handleSearchStudents = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/students`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const allStudents: Student[] =
        response.data?.data || [];

      const query = searchQuery
        .trim()
        .toLowerCase();

      const filtered = allStudents.filter(
        (student) =>
          student.fullName
            ?.toLowerCase()
            .includes(query) ||
          student.rollNumber
            ?.toLowerCase()
            .includes(query) ||
          student.studentId
            ?.toLowerCase()
            .includes(query) ||
          student.currentClass
            ?.toLowerCase()
            .includes(query)
      );

      setSearchResults(filtered.slice(0, 10));
    } catch (error) {
      console.error(
        'Error searching students:',
        error
      );

      showError('Error searching students');
    }
  };

  // ==========================================================
  // ADD INDIVIDUAL STUDENT
  // ==========================================================

  const handleAddStudent = (student: Student) => {
    if (!selectedStudents.includes(student.id)) {
      setSelectedStudents((prev) => [
        ...prev,
        student.id,
      ]);
    }

    // Add to preview list if not already there
    setStudents((prev) => {
      if (
        prev.some(
          (item) => item.id === student.id
        )
      ) {
        return prev;
      }

      return [...prev, student];
    });

    setSearchQuery('');
    setSearchResults([]);
  };

  // ==========================================================
  // REMOVE INDIVIDUAL STUDENT
  // ==========================================================

  const handleRemoveStudent = (
    studentId: number
  ) => {
    setSelectedStudents((prev) =>
      prev.filter((id) => id !== studentId)
    );

    if (allocationType === 'individual') {
      setStudents((prev) =>
        prev.filter(
          (student) =>
            student.id !== studentId
        )
      );
    }
  };

  // ==========================================================
  // SELECT ALL
  // ==========================================================

  const handleSelectAll = () => {
    if (students.length === 0) return;

    setSelectedStudents(
      students.map((student) => student.id)
    );
  };

  // ==========================================================
  // UNSELECT ALL
  // ==========================================================

  const handleUnselectAll = () => {
    setSelectedStudents([]);
  };

  // ==========================================================
  // ALLOCATION TYPE CHANGE
  // ==========================================================

  const handleAllocationTypeChange = (
    type: 'class' | 'individual'
  ) => {
    setAllocationType(type);

    setClassName('');
    setSection('');
    setStudents([]);
    setSelectedStudents([]);

    setSearchQuery('');
    setSearchResults([]);
  };


  // ==========================================================
  // ALLOCATE FEES
  // ==========================================================

  const handleAllocate = async () => {
    if (!selectedStructure) {
      showError('Please select a fee structure');
      return;
    }

    const discountAmount =
      parseFloat(discount) || 0;

    if (discountAmount < 0) {
      showError('Discount cannot be negative');
      return;
    }

    try {
      setAllocating(true);

      let response;

      // ------------------------------------------------------
      // CLASS ALLOCATION
      // ------------------------------------------------------

      if (allocationType === 'class') {
        if (!className) {
          showError('Please select a class');
          return;
        }

        if (students.length === 0) {
          showError(
            'No students found in the selected class'
          );
          return;
        }

        response = await axios.post(
          `${API_BASE_URL}/fee-management/allocations/class`,
          {
            className: className,
            feeStructureId: selectedStructure,
            section: section || undefined,
            discount: discountAmount,
            discountReason: discountReason || undefined,
            allocationBatch: allocationBatch || undefined,
            purpose: purpose || 'tuition',
          },
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );
      }

      // ------------------------------------------------------
      // INDIVIDUAL ALLOCATION
      // ------------------------------------------------------

      else {
        if (selectedStudents.length === 0) {
          showError(
            'Please select at least one student'
          );
          return;
        }

        response = await axios.post(
          `${API_BASE_URL}/fee-management/allocations/bulk`,
          {
            studentIds: selectedStudents,

            feeStructureId:
              selectedStructure,

            discount: discountAmount,

            discountReason:
              discountReason.trim() ||
              undefined,

            allocationBatch:
              allocationBatch.trim() ||
              undefined,

            purpose:
              purpose || 'tuition',
          },
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );
      }

      const {
        successful,
        failed,
        allocations,
      } =
        response.data?.data || {};

      setAllocatedResults(
        allocations || []
      );

      showSuccess(
        `Successfully allocated to ${successful || 0} student(s)${failed > 0
          ? `. ${failed} failed.`
          : ''
        }`
      );

      // ------------------------------------------------------
      // RESET
      // ------------------------------------------------------

      setSelectedStructure('');
      setClassName('');
      setSection('');
      setStudents([]);
      setSelectedStudents([]);

      setDiscount('0');
      setDiscountReason('');
      setAllocationBatch('');
      setPurpose('tuition');

      setSearchQuery('');
      setSearchResults([]);

    } catch (error: any) {
      console.error(
        'Error allocating fees:',
        error
      );

      showError(
        error.response?.data?.message ||
        'Error allocating fees'
      );
    } finally {
      setAllocating(false);
    }
  };


  // ==========================================================
  // SELECTED STRUCTURE
  // ==========================================================

  const selectedStructureDetails =
    structures.find(
      (structure) =>
        structure.id === selectedStructure
    );


  // ==========================================================
  // DISPLAYED STUDENTS
  // ==========================================================

  const displayedStudents = useMemo(() => {
    if (allocationType === 'class') {
      return students;
    }

    return students.filter((student) =>
      selectedStudents.includes(student.id)
    );
  }, [
    students,
    selectedStudents,
    allocationType,
  ]);


  // ==========================================================
  // TOTAL
  // ==========================================================

  const structureAmount = selectedStructureDetails
    ? Number(
      selectedStructureDetails.totalAmount
    )
    : 0;

  const discountAmount =
    Number(discount) || 0;

  const finalAmount = Math.max(
    0,
    structureAmount - discountAmount
  );

  const totalAmount =
    displayedStudents.length *
    finalAmount;


  // ==========================================================
  // JSX
  // ==========================================================

  return (
    <div className="space-y-6">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Fee Allocation
        </h1>

        <p className="mt-1 text-gray-600">
          Allocate fee structures to students
        </p>
      </div>


      {/* ====================================================
          LOADING
      ==================================================== */}

      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="h-7 w-7 animate-spin rounded-full border-b-2 border-blue-600" />
          <span className="ml-3 text-gray-600">
            Loading...
          </span>
        </div>
      )}


      {/* ====================================================
          ALLOCATION FORM
      ==================================================== */}

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
            <Wallet className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Allocation Details
            </h2>

            <p className="text-sm text-gray-500">
              Select a fee structure and students
            </p>
          </div>
        </div>


        <div className="space-y-6">

          {/* ==================================================
              FEE STRUCTURE
          ================================================== */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Fee Structure *
            </label>

            <Select
              value={
                selectedStructure.toString()
              }
              onChange={(e) =>
                setSelectedStructure(
                  e.target.value
                    ? parseInt(
                      e.target.value,
                      10
                    )
                    : ''
                )
              }
              options={[
                {
                  value: '',
                  label:
                    'Select Fee Structure',
                },

                ...structures.map(
                  (structure) => ({
                    value:
                      structure.id.toString(),

                    label:
                      `${structure.name} — ${structure.academicYear} — NPR ${Number(
                        structure.totalAmount
                      ).toLocaleString()}`,
                  })
                ),
              ]}
              required
            />


            {/* Structure information */}

            {selectedStructureDetails && (
              <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-4">

                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">

                  <div>
                    <p className="text-xs font-medium text-blue-600">
                      Academic Year
                    </p>

                    <p className="font-bold text-blue-950">
                      {
                        selectedStructureDetails.academicYear
                      }
                    </p>
                  </div>


                  <div>
                    <p className="text-xs font-medium text-blue-600">
                      Class
                    </p>

                    <p className="font-bold text-blue-950">
                      {
                        selectedStructureDetails.class
                      }
                    </p>
                  </div>


                  <div>
                    <p className="text-xs font-medium text-blue-600">
                      Total Fee
                    </p>

                    <p className="font-bold text-blue-950">
                      NPR{' '}
                      {structureAmount.toLocaleString()}
                    </p>
                  </div>


                  <div>
                    <p className="text-xs font-medium text-blue-600">
                      Due Date
                    </p>

                    <p className="font-bold text-blue-950">
                      {selectedStructureDetails.dueDate
                        ? new Date(
                          selectedStructureDetails.dueDate
                        ).toLocaleDateString()
                        : 'Not set'}
                    </p>
                  </div>

                </div>

              </div>
            )}
          </div>


          {/* ==================================================
              ALLOCATION TYPE
          ================================================== */}

          <div>
            <label className="mb-3 block text-sm font-semibold text-gray-700">
              Allocation Type *
            </label>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              {/* CLASS */}

              <button
                type="button"
                onClick={() =>
                  handleAllocationTypeChange(
                    'class'
                  )
                }
                className={`rounded-xl border-2 p-5 text-left transition ${allocationType === 'class'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
              >

                <div className="flex items-center gap-4">

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${allocationType === 'class'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-500'
                      }`}
                  >
                    <GraduationCap className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="font-bold text-gray-900">
                      Entire Class
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Allocate to all students
                      in a class
                    </p>
                  </div>

                </div>

              </button>


              {/* INDIVIDUAL */}

              <button
                type="button"
                onClick={() =>
                  handleAllocationTypeChange(
                    'individual'
                  )
                }
                className={`rounded-xl border-2 p-5 text-left transition ${allocationType ===
                  'individual'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
              >

                <div className="flex items-center gap-4">

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${allocationType ===
                      'individual'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-500'
                      }`}
                  >
                    <Users className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="font-bold text-gray-900">
                      Individual Students
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Select specific students
                    </p>
                  </div>

                </div>

              </button>

            </div>
          </div>


          {/* ==================================================
              CLASS SELECTION
          ================================================== */}

          {allocationType === 'class' && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Class *
                </label>

                <Select
                  value={className}
                  onChange={(e) => {
                    const value =
                      e.target.value;

                    setClassName(value);
                    setSelectedStudents([]);
                    setStudents([]);
                  }}
                  options={[
                    {
                      value: '',
                      label:
                        'Select Class',
                    },

                    ...classes.map(
                      (classItem) => ({
                        // IMPORTANT:
                        // currentClass contains
                        // "1", "LKG", "Nursery"
                        value: String(
                          classItem.name
                        ),

                        label:
                          classItem.name,
                      })
                    ),
                  ]}
                  required
                />

                {className && (
                  <p className="mt-2 text-xs text-gray-500">
                    Students with current class{' '}
                    <strong>
                      {className}
                    </strong>{' '}
                    will be loaded.
                  </p>
                )}
              </div>


              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Section
                  <span className="ml-1 font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>

                <FormInput
                  value={section}
                  onChange={(e) =>
                    setSection(
                      e.target.value.toUpperCase()
                    )
                  }
                  placeholder="e.g. A, B, C"
                />
              </div>

            </div>
          )}


          {/* ==================================================
              INDIVIDUAL SEARCH
          ================================================== */}

          {allocationType === 'individual' && (
            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Search Students
              </label>

              <div className="flex gap-2">

                <FormInput
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(
                      e.target.value
                    )
                  }
                  placeholder="Search by name, student ID or roll number"
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Enter'
                    ) {
                      handleSearchStudents();
                    }
                  }}
                />

                <Button
                  onClick={
                    handleSearchStudents
                  }
                  icon={
                    <Search className="h-5 w-5" />
                  }
                >
                  Search
                </Button>

              </div>


              {/* Search results */}

              {searchResults.length > 0 && (
                <div className="mt-3 max-h-64 overflow-y-auto rounded-xl border border-gray-200">

                  {searchResults.map(
                    (student) => {
                      const alreadySelected =
                        selectedStudents.includes(
                          student.id
                        );

                      return (
                        <button
                          type="button"
                          key={student.id}
                          onClick={() =>
                            !alreadySelected &&
                            handleAddStudent(
                              student
                            )
                          }
                          disabled={
                            alreadySelected
                          }
                          className={`flex w-full items-center justify-between border-b border-gray-100 p-4 text-left last:border-b-0 ${alreadySelected
                            ? 'bg-gray-50 opacity-60'
                            : 'hover:bg-blue-50'
                            }`}
                        >

                          <div>
                            <p className="font-semibold text-gray-900">
                              {
                                student.fullName
                              }
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              Roll:{' '}
                              {student.rollNumber ||
                                'N/A'}
                              {' · '}
                              Class{' '}
                              {
                                student.currentClass
                              }
                              {student.section
                                ? `-${student.section}`
                                : ''}
                            </p>
                          </div>

                          {alreadySelected ? (
                            <span className="text-sm font-medium text-green-600">
                              Selected
                            </span>
                          ) : (
                            <UserPlus className="h-5 w-5 text-blue-600" />
                          )}

                        </button>
                      );
                    }
                  )}

                </div>
              )}

            </div>
          )}


          {/* ==================================================
              DISCOUNT
          ================================================== */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Discount
              </label>

              <FormInput
                type="number"
                value={discount}
                onChange={(e) =>
                  setDiscount(
                    e.target.value
                  )
                }
                placeholder="0"
                min="0"
              />
            </div>


            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Discount Reason
              </label>

              <FormInput
                value={discountReason}
                onChange={(e) =>
                  setDiscountReason(
                    e.target.value
                  )
                }
                placeholder="e.g. Scholarship, sibling discount"
              />
            </div>

          </div>


          {/* ==================================================
              BATCH + PURPOSE
          ================================================== */}

          <div className="grid grid-cols-1 gap-4 rounded-xl border border-blue-200 bg-blue-50 p-4 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-semibold text-blue-900">
                Allocation Batch
              </label>

              <FormInput
                value={allocationBatch}
                onChange={(e) =>
                  setAllocationBatch(
                    e.target.value.toUpperCase()
                  )
                }
                placeholder="2082-ANNUAL-FEE"
              />
            </div>


            <div>
              <label className="mb-2 block text-sm font-semibold text-blue-900">
                Purpose
              </label>

              <Select
                value={purpose}
                onChange={(e) =>
                  setPurpose(
                    e.target.value
                  )
                }
                options={[
                  {
                    value: 'admission',
                    label: 'Admission Fee',
                  },
                  {
                    value: 'tuition',
                    label: 'Tuition / Regular Fee',
                  },
                  {
                    value: 'examination',
                    label: 'Examination Fee',
                  },
                  {
                    value: 'event',
                    label: 'Event / Program Fee',
                  },
                  {
                    value: 'transport',
                    label: 'Transport / Bus Fee',
                  },
                  {
                    value: 'hostel',
                    label: 'Hostel Fee',
                  },
                  {
                    value: 'library',
                    label: 'Library Fee',
                  },
                  {
                    value: 'lab',
                    label: 'Laboratory Fee',
                  },
                  {
                    value: 'sports',
                    label: 'Sports Fee',
                  },
                  {
                    value: 'other',
                    label: 'Other',
                  },
                ]}
              />
            </div>

          </div>

        </div>
      </div>


      {/* ======================================================
          STUDENT PREVIEW
      ====================================================== */}

      {displayedStudents.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

          {/* Header */}

          <div className="flex flex-col gap-4 border-b border-gray-200 bg-gray-50 p-5 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white">
                <Users className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Students to Allocate
                </h3>

                <p className="text-sm text-gray-500">
                  {displayedStudents.length}{' '}
                  student
                  {displayedStudents.length !==
                    1
                    ? 's'
                    : ''}{' '}
                  selected
                </p>
              </div>

            </div>


            <div className="flex items-center gap-4">

              {/* Select / Unselect */}

              {allocationType ===
                'class' && (
                  <div className="flex gap-2">

                    <button
                      type="button"
                      onClick={
                        handleSelectAll
                      }
                      className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                    >
                      Select All
                    </button>

                    <button
                      type="button"
                      onClick={
                        handleUnselectAll
                      }
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                      Unselect
                    </button>

                  </div>
                )}


              {/* Total */}

              {selectedStructureDetails && (
                <div className="text-right">

                  <p className="text-xs text-gray-500">
                    Total Amount
                  </p>

                  <p className="text-xl font-bold text-gray-900">
                    NPR{' '}
                    {totalAmount.toLocaleString()}
                  </p>

                </div>
              )}

            </div>

          </div>


          {/* ==================================================
              STUDENT LIST
          ================================================== */}

          <div className="max-h-[500px] overflow-y-auto">

            {displayedStudents.map(
              (student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between border-b border-gray-100 p-5 last:border-b-0 hover:bg-gray-50"
                >

                  {/* Student */}

                  <div className="flex min-w-0 items-center gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white">
                      {student.fullName
                        ?.charAt(0)
                        .toUpperCase() ||
                        'S'}
                    </div>


                    <div className="min-w-0">

                      <p className="truncate font-bold text-gray-900">
                        {
                          student.fullName
                        }
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">

                        <span>
                          Roll:{' '}
                          {student.rollNumber ||
                            'N/A'}
                        </span>

                        <span>•</span>

                        <span>
                          Class{' '}
                          {
                            student.currentClass
                          }
                          {student.section
                            ? `-${student.section}`
                            : ''}
                        </span>

                      </div>

                    </div>

                  </div>


                  {/* Amount + Remove */}

                  <div className="ml-4 flex shrink-0 items-center gap-4">

                    <div className="text-right">

                      <p className="text-xs text-gray-500">
                        Fee
                      </p>

                      <p className="font-bold text-gray-900">
                        NPR{' '}
                        {finalAmount.toLocaleString()}
                      </p>

                    </div>


                    {/* Individual remove */}

                    {allocationType ===
                      'individual' && (
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveStudent(
                              student.id
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700"
                          title="Remove student"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}

                  </div>

                </div>
              )
            )}

          </div>


          {/* ==================================================
              EMPTY AFTER UNSELECT
          ================================================== */}

          {displayedStudents.length ===
            0 && (
              <div className="p-10 text-center">

                <Users className="mx-auto h-10 w-10 text-gray-300" />

                <p className="mt-3 font-medium text-gray-600">
                  No students selected
                </p>

              </div>
            )}


          {/* ==================================================
              FOOTER
          ================================================== */}

          <div className="flex flex-col gap-4 border-t border-gray-200 bg-gray-50 p-5 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-sm text-gray-500">
                {displayedStudents.length}{' '}
                student
                {displayedStudents.length !==
                  1
                  ? 's'
                  : ''}{' '}
                will receive this fee
              </p>

              {discountAmount > 0 && (
                <p className="text-xs text-green-600">
                  NPR{' '}
                  {discountAmount.toLocaleString()}{' '}
                  discount applied per student
                </p>
              )}

            </div>


            <Button
              onClick={handleAllocate}
              disabled={
                allocating ||
                !selectedStructure ||
                displayedStudents.length ===
                0
              }
              variant="primary"
              icon={
                allocating ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Wallet className="h-5 w-5" />
                )
              }
            >
              {allocating
                ? 'Allocating...'
                : `Allocate to ${displayedStudents.length} Student${displayedStudents.length !==
                  1
                  ? 's'
                  : ''
                }`}
            </Button>

          </div>

        </div>
      )}


      {/* ======================================================
          NO STUDENTS
      ====================================================== */}

      {className &&
        allocationType === 'class' &&
        !loading &&
        students.length === 0 && (
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-8 text-center">

            <Users className="mx-auto h-10 w-10 text-yellow-500" />

            <h3 className="mt-3 font-bold text-yellow-900">
              No students found
            </h3>

            <p className="mt-1 text-sm text-yellow-700">
              No students were found for class{' '}
              <strong>
                {className}
              </strong>
              {section
                ? ` and section ${section}`
                : ''}
              .
            </p>

          </div>
        )}


      {/* ======================================================
          ALLOCATION RESULT
      ====================================================== */}

      {allocatedResults.length > 0 && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-6">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>

            <div>

              <h3 className="font-bold text-green-900">
                Successfully Allocated!
              </h3>

              <p className="mt-1 text-sm text-green-700">
                Fee structure has been allocated
                to{' '}
                <strong>
                  {
                    allocatedResults.length
                  }
                </strong>{' '}
                student(s).
              </p>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default FeeAllocation;