import React, { useState, useEffect, useRef } from 'react';
import {
  Search, User, CreditCard, Receipt, AlertCircle, Plus, Trash2, X, Printer, FileText, Download, Filter, Calendar, DollarSign, TrendingUp, TrendingDown, Clock, CheckCircle2, Loader,
} from 'lucide-react';

import Button from '../../components/shared/Button';
import FormInput from '../../components/shared/FormInput';
import Select from '../../components/shared/Select';
import FeeReceipt from '../../components/admin/FeeReceipt';

import axios from 'axios';
import { API_BASE_URL } from '../../api/config';
import { showSuccess, showError } from '../../utils/sweetAlert';
import { schoolProfileService } from '../../api';
import type { SchoolProfile } from '../../api/types';

/* ============================================================
   TYPES
============================================================ */
interface AcademicYear {
  id: number | string;
  year: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  isActive?: boolean;
}

interface ClassItem {
  id: number;
  name: string;
  academicYearId?: number;
  status?: string;
}
interface Student {
  id: number;
  fullName: string;
  rollNumber: string;
  currentClass: string;
  section: string;
  contactNumber: string;
  email: string;
  emisId?: string;

  paymentStatus?: {
    totalBalance: number;
    totalPaid: number;
    totalAllocated: number;
    pendingCount: number;
    status: 'paid' | 'partial' | 'pending' | 'none';
  };
}

interface FeeAllocation {
  id: number;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  status: string;
  dueDate: string;
  discount: number;
  discountReason?: string;
  purpose?: string;
  allocationBatch?: string;

  feeStructure: {
    name: string;
    academicYear: string;
    items: Array<{
      amount: number;
      category: {
        name: string;
      };
    }>;
  };

  transactions?: Array<{
    id: number;
    receiptNumber: string;
    amount: number;
    paymentMethod: string;
    paymentDate: string;
    collectedByName: string;
  }>;
}

interface FeeCategory {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

interface CustomFeeItem {
  categoryId: number;
  categoryName: string;
  amount: number;
}

interface PaymentData {
  amount: string;
  paymentMethod: string;
  paymentDate: string;
  bankName: string;
  bankAccountNumber: string;
  referenceNumber: string;
  remarks: string;
}

/* ============================================================
   CONSTANTS
============================================================ */

const getToday = () => new Date().toISOString().split('T')[0];

const INITIAL_PAYMENT_DATA: PaymentData = {
  amount: '',
  paymentMethod: 'cash',
  paymentDate: getToday(),
  bankName: '',
  bankAccountNumber: '',
  referenceNumber: '',
  remarks: '',
};

const INITIAL_SUMMARY = {
  totalAllocated: 0,
  totalPaid: 0,
  totalBalance: 0,
  totalDiscount: 0,
};

/* ============================================================
   COMPONENT
============================================================ */

const FeeCollection: React.FC = () => {
  /* ----------------------------------------------------------
     Student Search
  ---------------------------------------------------------- */

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const [selectedStudent, setSelectedStudent] =
    useState<Student | null>(null);

  /* ----------------------------------------------------------
     Fee Allocations
  ---------------------------------------------------------- */

  const [feeAllocations, setFeeAllocations] = useState<FeeAllocation[]>([]);
  const [pendingAllocations, setPendingAllocations] =
    useState<FeeAllocation[]>([]);
  const [paidAllocations, setPaidAllocations] =
    useState<FeeAllocation[]>([]);

  const [selectedAllocation, setSelectedAllocation] =
    useState<FeeAllocation | null>(null);

  /* ----------------------------------------------------------
     Loading
  ---------------------------------------------------------- */

  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  /* ----------------------------------------------------------
     Fee Summary
  ---------------------------------------------------------- */

  const [feeSummary, setFeeSummary] = useState(INITIAL_SUMMARY);

  /* ----------------------------------------------------------
     Custom Fees
  ---------------------------------------------------------- */

  const [showCustomFees, setShowCustomFees] = useState(false);
  const [categories, setCategories] = useState<FeeCategory[]>([]);
  const [customFees, setCustomFees] = useState<CustomFeeItem[]>([]);
  const [isFlexibleCollection, setIsFlexibleCollection] = useState(false);

  /* ----------------------------------------------------------
     Receipt
  ---------------------------------------------------------- */

  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  const [schoolProfile, setSchoolProfile] =
    useState<SchoolProfile | null>(null);

  const receiptRef = useRef<HTMLDivElement>(null);

  /* ----------------------------------------------------------
     Filters
  ---------------------------------------------------------- */
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);

  const [filterAcademicYear, setFilterAcademicYear] = useState<string>('all');

  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  /* ----------------------------------------------------------
     Payment Form
  ---------------------------------------------------------- */

  const [paymentData, setPaymentData] =
    useState<PaymentData>(INITIAL_PAYMENT_DATA);

  /* ============================================================
     AUTH
  ============================================================ */

  const getToken = () =>
    localStorage.getItem('token') ||
    sessionStorage.getItem('token');

  const authConfig = () => ({
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const fetchAcademicYears = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/academic-years`,
        authConfig()
      );

      const years: AcademicYear[] =
        response.data?.data || [];

      setAcademicYears(years);

      // Automatically select current academic year
      const currentYear = years.find(
        (year) => year.isCurrent
      );

      if (currentYear) {
        setFilterAcademicYear(String(currentYear.id));
      }
    } catch (error) {
      console.error(
        'Error fetching academic years:',
        error
      );
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/classes`,
        authConfig()
      );

      setClasses(response.data?.data || []);
    } catch (error) {
      console.error(
        'Error fetching classes:',
        error
      );
    }
  };
  /* ============================================================
     INITIAL DATA
  ============================================================ */

  useEffect(() => {
    fetchAcademicYears();
    fetchClasses();
    fetchCategories();
    fetchSchoolProfile();
  }, []);

  /* ============================================================
     SCHOOL PROFILE
  ============================================================ */

  const fetchSchoolProfile = async () => {
    try {
      const response = await schoolProfileService.get();

      if (response.data) {
        setSchoolProfile(response.data);
      }
    } catch (error) {
      console.error('Error fetching school profile:', error);
    }
  };

  /* ============================================================
     FEE CATEGORIES
  ============================================================ */

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/fee-management/categories`,
        authConfig()
      );

      const activeCategories = (
        response.data?.data || []
      ).filter((category: FeeCategory) => category.isActive);

      setCategories(activeCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  /* ============================================================
     SEARCH STUDENTS
     
     IMPORTANT:
     Backend student field = currentClass
  ============================================================ */

  const handleSearch = async () => {
    const query = searchQuery.trim();

    const hasSearchQuery = query.length > 0;
    const hasStatusFilter = filterStatus !== 'all';

    const hasDateFilter = Boolean(filterStartDate) || Boolean(filterEndDate);
    const hasAcademicYearFilter = filterAcademicYear !== 'all';

    const hasClassFilter = filterClass !== 'all';
    if (
      !hasSearchQuery &&
      !hasAcademicYearFilter &&
      !hasClassFilter &&
      !hasStatusFilter &&
      !hasDateFilter
    ) {
      showError(
        'Please enter student details or select at least one filter'
      );
      return;
    }

    try {
      setLoading(true);

      /*
       * Build backend query.
       *
       * IMPORTANT:
       * Use currentClass, NOT class.
       */
      const params: Record<string, string> = {};

      if (hasSearchQuery) {
        params.search = query;
      }

      if (hasAcademicYearFilter) {
        params.academicYearId = filterAcademicYear;
      }

      if (hasClassFilter) {
        params.currentClass = filterClass;
      }

      if (filterStartDate) {
        params.startDate = filterStartDate;
      }

      if (filterEndDate) {
        params.endDate = filterEndDate;
      }

      /*
       * If your backend supports these directly, they can be sent.
       * We still perform client-side status/date filtering below
       * because payment status belongs to fee allocations.
       */

      const response = await axios.get(
        `${API_BASE_URL}/students`,
        {
          ...authConfig(),
          params,
        }
      );

      let students: Student[] = response.data?.data || [];

      /* --------------------------------------------------------
         Defensive local class filtering

         This guarantees currentClass filtering even if the
         backend returns a broader result set.
      -------------------------------------------------------- */

      if (hasClassFilter) {
        students = students.filter(
          (student) =>
            String(student.currentClass) ===
            String(filterClass)
        );
      }

      /* --------------------------------------------------------
         Local search refinement
      -------------------------------------------------------- */

      if (hasSearchQuery) {
        const normalizedQuery = query.toLowerCase();

        students = students.filter((student) => {
          const fullName =
            student.fullName?.toLowerCase() || '';

          const emisId =
            student.emisId?.toLowerCase() || '';

          const rollNumber =
            String(student.rollNumber || '').toLowerCase();

          return (
            fullName.includes(normalizedQuery) ||
            emisId.includes(normalizedQuery) ||
            rollNumber.includes(normalizedQuery)
          );
        });

        /* Exact IEMIS match first */
        students.sort((a, b) => {
          const aExact =
            a.emisId?.toLowerCase() === normalizedQuery;

          const bExact =
            b.emisId?.toLowerCase() === normalizedQuery;

          if (aExact && !bExact) return -1;
          if (!aExact && bExact) return 1;

          return 0;
        });
      }

      setSearchResults(students);

      if (students.length === 0) {
        showError('No students found matching your criteria');
        return;
      }

      showSuccess(
        `Found ${students.length} student${students.length > 1 ? 's' : ''
        }`
      );

      /*
       * Fetch payment information so status filtering works.
       */
      await fetchPaymentStatusForStudents(students);
    } catch (error: any) {
      console.error('Error searching students:', error);

      showError(
        error.response?.data?.message ||
        'Error searching for students'
      );
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     FETCH PAYMENT STATUS FOR SEARCH RESULTS
  ============================================================ */

  const fetchPaymentStatusForStudents = async (
    students: Student[]
  ) => {
    try {
      setLoadingStatus(true);

      const statusPromises = students.map(async (student) => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/fee-management/allocations/student/${student.id}`,
            authConfig()
          );

          const allocations: FeeAllocation[] =
            response.data?.data?.allocations || [];

          const summary =
            response.data?.data?.summary || {
              totalAllocated: 0,
              totalPaid: 0,
              totalBalance: 0,
            };

          const pendingCount = allocations.filter(
            (allocation) =>
              Number(allocation.balance) > 0
          ).length;

          let status:
            | 'paid'
            | 'partial'
            | 'pending'
            | 'none' = 'none';

          if (Number(summary.totalAllocated) <= 0) {
            status = 'none';
          } else if (Number(summary.totalBalance) <= 0) {
            status = 'paid';
          } else if (Number(summary.totalPaid) > 0) {
            status = 'partial';
          } else {
            status = 'pending';
          }

          return {
            ...student,
            paymentStatus: {
              totalBalance:
                Number(summary.totalBalance) || 0,

              totalPaid:
                Number(summary.totalPaid) || 0,

              totalAllocated:
                Number(summary.totalAllocated) || 0,

              pendingCount,
              status,
            },
          };
        } catch (error) {
          console.error(
            `Error fetching status for student ${student.id}:`,
            error
          );

          return student;
        }
      });

      const studentsWithStatus =
        await Promise.all(statusPromises);

      /* --------------------------------------------------------
         Filter by payment status
      -------------------------------------------------------- */

      let filteredStudents = studentsWithStatus;

      if (filterStatus !== 'all') {
        const today = new Date();

        filteredStudents = studentsWithStatus.filter(
          (student) => {
            if (!student.paymentStatus) {
              return false;
            }

            switch (filterStatus) {
              case 'pending':
                return (
                  student.paymentStatus.status === 'pending'
                );

              case 'partial':
                return (
                  student.paymentStatus.status === 'partial'
                );

              case 'paid':
                return (
                  student.paymentStatus.status === 'paid'
                );

              case 'overdue':
                /*
                 * Overdue means there is at least one
                 * unpaid allocation whose due date has passed.
                 */
                return student.paymentStatus.status !== 'paid';

              default:
                return true;
            }
          }
        );

        /*
         * More accurate overdue filtering:
         * fetch allocations and check due dates.
         */
        if (filterStatus === 'overdue') {
          const overdueResults =
            await Promise.all(
              filteredStudents.map(async (student) => {
                try {
                  const response = await axios.get(
                    `${API_BASE_URL}/fee-management/allocations/student/${student.id}`,
                    authConfig()
                  );

                  const allocations: FeeAllocation[] =
                    response.data?.data?.allocations || [];

                  const hasOverdue =
                    allocations.some((allocation) => {
                      const balance =
                        Number(allocation.balance) || 0;

                      if (balance <= 0) {
                        return false;
                      }

                      return (
                        new Date(allocation.dueDate) <
                        today
                      );
                    });

                  return hasOverdue ? student : null;
                } catch {
                  return null;
                }
              })
            );

          filteredStudents =
            overdueResults.filter(
              Boolean
            ) as Student[];
        }
      }

      /*
       * Date filtering for student payment allocations.
       */
      if (filterStartDate || filterEndDate) {
        const dateFilteredResults =
          await Promise.all(
            filteredStudents.map(async (student) => {
              try {
                const response = await axios.get(
                  `${API_BASE_URL}/fee-management/allocations/student/${student.id}`,
                  authConfig()
                );

                const allocations: FeeAllocation[] =
                  response.data?.data?.allocations || [];

                const hasMatchingDate =
                  allocations.some((allocation) => {
                    const dueDate =
                      new Date(allocation.dueDate);

                    if (
                      filterStartDate &&
                      dueDate <
                      new Date(filterStartDate)
                    ) {
                      return false;
                    }

                    if (filterEndDate) {
                      const endDate = new Date(
                        filterEndDate
                      );

                      endDate.setHours(
                        23,
                        59,
                        59,
                        999
                      );

                      if (dueDate > endDate) {
                        return false;
                      }
                    }

                    return true;
                  });

                return hasMatchingDate ? student : null;
              } catch {
                return null;
              }
            })
          );

        filteredStudents =
          dateFilteredResults.filter(
            Boolean
          ) as Student[];
      }

      setSearchResults(filteredStudents);

      if (
        filteredStudents.length === 0 &&
        (filterStatus !== 'all' ||
          filterStartDate ||
          filterEndDate)
      ) {
        showError(
          'No students found matching the selected filters'
        );
      }
    } catch (error) {
      console.error(
        'Error fetching payment status:',
        error
      );
    } finally {
      setLoadingStatus(false);
    }
  };

  /* ============================================================
     SELECT STUDENT
  ============================================================ */

  const handleSelectStudent = async (
    student: Student
  ) => {
    setSelectedStudent(student);
    setSearchResults([]);
    setSearchQuery('');
    setSelectedAllocation(null);

    try {
      setLoading(true);

      const response = await axios.get(
        `${API_BASE_URL}/fee-management/allocations/student/${student.id}`,
        authConfig()
      );

      const allocations: FeeAllocation[] =
        response.data?.data?.allocations || [];

      const summary =
        response.data?.data?.summary || INITIAL_SUMMARY;

      const pending = allocations.filter(
        (allocation) =>
          Number(allocation.balance) > 0
      );

      const paid = allocations.filter(
        (allocation) =>
          Number(allocation.balance) <= 0
      );

      setFeeAllocations(allocations);
      setPendingAllocations(pending);
      setPaidAllocations(paid);

      setFeeSummary({
        totalAllocated:
          Number(summary.totalAllocated) || 0,

        totalPaid:
          Number(summary.totalPaid) || 0,

        totalBalance:
          Number(summary.totalBalance) || 0,

        totalDiscount:
          Number(summary.totalDiscount) || 0,
      });

      if (pending.length === 0 && paid.length > 0) {
        showSuccess(
          'All fees paid! Showing payment history below.'
        );
      }
    } catch (error) {
      console.error(
        'Error fetching fee allocations:',
        error
      );

      showError(
        'Error fetching student fee details'
      );
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     SELECT ALLOCATION
  ============================================================ */

  const handleSelectAllocation = (
    allocation: FeeAllocation
  ) => {
    if (Number(allocation.balance) <= 0) {
      showError(
        'This fee has already been fully paid!'
      );
      return;
    }

    setSelectedAllocation(allocation);

    setIsFlexibleCollection(false);
    setShowCustomFees(false);
    setCustomFees([]);

    setPaymentData((previous) => ({
      ...previous,
      amount: String(
        Number(allocation.balance) || 0
      ),
    }));
  };

  /* ============================================================
     CUSTOM FEE TOGGLE
  ============================================================ */

  const handleToggleCustomFees = () => {
    if (!showCustomFees) {
      setSelectedAllocation(null);
      setIsFlexibleCollection(true);

      if (customFees.length === 0) {
        setCustomFees([
          {
            categoryId: 0,
            categoryName: '',
            amount: 0,
          },
        ]);
      }
    } else {
      setIsFlexibleCollection(false);
      setCustomFees([]);
    }

    setShowCustomFees((previous) => !previous);
  };

  /* ============================================================
     CUSTOM FEE MANAGEMENT
  ============================================================ */

  const handleAddCustomFee = () => {
    setCustomFees((previous) => [
      ...previous,
      {
        categoryId: 0,
        categoryName: '',
        amount: 0,
      },
    ]);
  };

  const handleUpdateCustomFee = (
    index: number,
    field: string,
    value: any
  ) => {
    setCustomFees((previous) => {
      const updated = [...previous];

      if (field === 'categoryId') {
        const categoryId = parseInt(value, 10);

        const category = categories.find(
          (item) => item.id === categoryId
        );

        updated[index] = {
          ...updated[index],
          categoryId,
          categoryName: category?.name || '',
        };
      }

      if (field === 'amount') {
        updated[index] = {
          ...updated[index],
          amount: parseFloat(value) || 0,
        };
      }

      return updated;
    });
  };

  const handleRemoveCustomFee = (
    index: number
  ) => {
    setCustomFees((previous) => {
      const updated = previous.filter(
        (_, i) => i !== index
      );

      if (updated.length === 0) {
        setShowCustomFees(false);
        setIsFlexibleCollection(false);
      }

      return updated;
    });
  };

  /* ============================================================
     PAYMENT VALIDATION
  ============================================================ */

  const validatePaymentMethod = () => {
    if (paymentData.paymentMethod === 'cash') {
      return true;
    }

    if (!paymentData.referenceNumber.trim()) {
      showError(
        'Please enter the transaction/reference number'
      );
      return false;
    }

    return true;
  };

  /* ============================================================
     COLLECT PAYMENT
  ============================================================ */

  const handleCollectPayment = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!validatePaymentMethod()) {
      return;
    }

    /* --------------------------------------------------------
       Custom Fee Collection
    -------------------------------------------------------- */

    if (isFlexibleCollection) {
      if (!selectedStudent) {
        showError('Please select a student');
        return;
      }

      if (customFees.length === 0) {
        showError(
          'Please add at least one custom fee item'
        );
        return;
      }

      const invalidFees = customFees.filter(
        (fee) =>
          !fee.categoryId ||
          Number(fee.amount) <= 0
      );

      if (invalidFees.length > 0) {
        showError(
          'Please select category and enter valid amount for all fee items'
        );
        return;
      }

      await handleFlexibleCollection();
      return;
    }

    /* --------------------------------------------------------
       Regular Allocation
    -------------------------------------------------------- */

    if (!selectedAllocation) {
      showError(
        'Please select a fee allocation'
      );
      return;
    }

    if (!selectedStudent) {
      showError('Please select a student');
      return;
    }

    const amount = parseFloat(
      paymentData.amount
    );

    if (isNaN(amount) || amount <= 0) {
      showError(
        'Please enter a valid payment amount'
      );
      return;
    }

    const balance =
      Number(selectedAllocation.balance) || 0;

    if (amount > balance) {
      showError(
        `Payment amount cannot exceed balance of NPR ${balance.toFixed(
          2
        )}`
      );
      return;
    }

    try {
      setProcessing(true);

      const transactionData = {
        feeAllocationId:
          selectedAllocation.id,

        amount,

        paymentMethod:
          paymentData.paymentMethod,

        paymentDate:
          paymentData.paymentDate,

        bankName:
          paymentData.paymentMethod !== 'cash'
            ? paymentData.bankName
            : undefined,

        bankAccountNumber:
          paymentData.paymentMethod !== 'cash'
            ? paymentData.bankAccountNumber
            : undefined,

        referenceNumber:
          paymentData.paymentMethod !== 'cash'
            ? paymentData.referenceNumber
            : undefined,

        remarks:
          paymentData.remarks,
      };

      const response = await axios.post(
        `${API_BASE_URL}/fee-management/transactions/collect`,
        transactionData,
        authConfig()
      );

      const transaction =
        response.data?.data?.transaction;

      const updatedAllocation =
        response.data?.data?.allocation;

      if (!transaction || !updatedAllocation) {
        throw new Error(
          'Invalid payment response from server'
        );
      }

      /* ------------------------------------------------------
         Receipt
      ------------------------------------------------------ */

      const receipt = {
        receiptNumber:
          transaction.receiptNumber,

        date: paymentData.paymentDate,

        student: {
          fullName:
            selectedStudent.fullName,

          currentClass:
            selectedStudent.currentClass,

          section:
            selectedStudent.section,

          rollNumber:
            selectedStudent.rollNumber,

          emisId:
            selectedStudent.emisId || '',
        },

        feeItems: [
          {
            categoryName:
              selectedAllocation.feeStructure.name,

            amount,
          },
        ],

        totalAmount: amount,
        paidAmount: amount,
        dueAmount: 0,

        scholar: 0,
        penal: 0,
        tax: 0,

        paymentMethod:
          paymentData.paymentMethod,

        bankName:
          paymentData.paymentMethod !== 'cash'
            ? paymentData.bankName
            : undefined,

        referenceNumber:
          paymentData.paymentMethod !== 'cash'
            ? paymentData.referenceNumber
            : undefined,

        collectedBy:
          transaction.collectedByName ||
          'Admin',

        remarks:
          paymentData.remarks || undefined,
      };

      setReceiptData(receipt);
      setShowReceiptModal(true);

      showSuccess(
        `Payment collected successfully! Receipt No: ${transaction.receiptNumber}`
      );

      /* ------------------------------------------------------
         Update allocation lists using fresh values
      ------------------------------------------------------ */

      const mergedAllocation: FeeAllocation = {
        ...selectedAllocation,
        ...updatedAllocation,
      };

      const newBalance =
        Number(mergedAllocation.balance) || 0;

      setFeeAllocations((previous) =>
        previous.map((allocation) =>
          allocation.id === mergedAllocation.id
            ? mergedAllocation
            : allocation
        )
      );

      if (newBalance <= 0) {
        setPendingAllocations((previous) =>
          previous.filter(
            (allocation) =>
              allocation.id !== mergedAllocation.id
          )
        );

        setPaidAllocations((previous) => {
          const exists = previous.some(
            (allocation) =>
              allocation.id === mergedAllocation.id
          );

          if (exists) {
            return previous.map((allocation) =>
              allocation.id === mergedAllocation.id
                ? mergedAllocation
                : allocation
            );
          }

          return [
            ...previous,
            mergedAllocation,
          ];
        });

        setSelectedAllocation(null);
      } else {
        setPendingAllocations((previous) =>
          previous.map((allocation) =>
            allocation.id === mergedAllocation.id
              ? mergedAllocation
              : allocation
          )
        );
      }

      /* ------------------------------------------------------
         Update summary
      ------------------------------------------------------ */

      setFeeSummary((previous) => ({
        ...previous,
        totalPaid:
          Number(previous.totalPaid) + amount,

        totalBalance: Math.max(
          0,
          Number(previous.totalBalance) - amount
        ),
      }));

      /* ------------------------------------------------------
         Payment form
      ------------------------------------------------------ */

      setPaymentData((previous) => ({
        ...previous,
        amount:
          newBalance > 0
            ? newBalance.toFixed(2)
            : '',
        remarks: '',
      }));
    } catch (error: any) {
      console.error(
        'Error collecting payment:',
        error
      );

      showError(
        error.response?.data?.message ||
        error.message ||
        'Error collecting payment'
      );
    } finally {
      setProcessing(false);
    }
  };

  /* ============================================================
     FLEXIBLE / CUSTOM COLLECTION
  ============================================================ */

  const handleFlexibleCollection = async () => {
    if (!selectedStudent) {
      showError('Please select a student');
      return;
    }

    const totalAmount = customFees.reduce(
      (sum, fee) =>
        sum + (Number(fee.amount) || 0),
      0
    );

    const paidAmount = parseFloat(
      paymentData.amount
    );

    if (isNaN(paidAmount) || paidAmount <= 0) {
      showError(
        'Please enter a valid payment amount'
      );
      return;
    }

    if (paidAmount > totalAmount) {
      showError(
        `Payment amount cannot exceed total fee amount (NPR ${totalAmount.toFixed(
          2
        )})`
      );
      return;
    }

    try {
      setProcessing(true);

      const payloadData = {
        studentId: selectedStudent.id,

        emisId:
          selectedStudent.emisId,

        feeItems: customFees.map((fee) => ({
          feeCategoryId: fee.categoryId,
          amount: fee.amount,
        })),

        totalAmount,

        paidAmount,

        dueAmount:
          totalAmount - paidAmount,

        paymentMethod:
          paymentData.paymentMethod,

        paymentDate:
          paymentData.paymentDate,

        bankName:
          paymentData.paymentMethod !== 'cash'
            ? paymentData.bankName
            : undefined,

        bankAccountNumber:
          paymentData.paymentMethod !== 'cash'
            ? paymentData.bankAccountNumber
            : undefined,

        referenceNumber:
          paymentData.paymentMethod !== 'cash'
            ? paymentData.referenceNumber
            : undefined,

        remarks:
          paymentData.remarks,
      };

      const response = await axios.post(
        `${API_BASE_URL}/fee-management/transactions/collect-flexible`,
        payloadData,
        authConfig()
      );

      const data = response.data?.data;

      if (!data?.receiptNumber) {
        throw new Error(
          'Invalid receipt response from server'
        );
      }

      /* ------------------------------------------------------
         Receipt
      ------------------------------------------------------ */

      const receipt = {
        receiptNumber:
          data.receiptNumber,

        date: paymentData.paymentDate,

        student: {
          fullName:
            selectedStudent.fullName,

          currentClass:
            selectedStudent.currentClass,

          section:
            selectedStudent.section,

          rollNumber:
            selectedStudent.rollNumber,

          emisId:
            selectedStudent.emisId || '',
        },

        feeItems: customFees.map(
          (fee) => ({
            categoryName:
              fee.categoryName,

            amount:
              Number(fee.amount) || 0,
          })
        ),

        totalAmount,
        paidAmount,

        dueAmount:
          totalAmount - paidAmount,

        scholar: 0,
        penal: 0,
        tax: 0,

        paymentMethod:
          paymentData.paymentMethod,

        bankName:
          paymentData.paymentMethod !== 'cash'
            ? paymentData.bankName
            : undefined,

        referenceNumber:
          paymentData.paymentMethod !== 'cash'
            ? paymentData.referenceNumber
            : undefined,

        collectedBy:
          data.collectedByName ||
          'Admin',

        remarks:
          paymentData.remarks ||
          undefined,
      };

      setReceiptData(receipt);
      setShowReceiptModal(true);

      showSuccess(
        `Custom fee collected successfully! Receipt No: ${data.receiptNumber}`
      );

      /* ------------------------------------------------------
         Reset custom collection
      ------------------------------------------------------ */

      setCustomFees([]);
      setShowCustomFees(false);
      setIsFlexibleCollection(false);

      setPaymentData({
        ...INITIAL_PAYMENT_DATA,
      });

      /*
       * Refresh student's allocations/payment summary.
       * Custom fees can affect overall payment history even
       * though they do not modify regular allocation balance.
       */
      await refreshSelectedStudent();
    } catch (error: any) {
      console.error(
        'Error collecting custom fee:',
        error
      );

      showError(
        error.response?.data?.message ||
        error.message ||
        'Error collecting custom fee'
      );
    } finally {
      setProcessing(false);
    }
  };

  /* ============================================================
     REFRESH SELECTED STUDENT
  ============================================================ */

  const refreshSelectedStudent = async () => {
    if (!selectedStudent) {
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/fee-management/allocations/student/${selectedStudent.id}`,
        authConfig()
      );

      const allocations: FeeAllocation[] =
        response.data?.data?.allocations || [];

      const summary =
        response.data?.data?.summary ||
        INITIAL_SUMMARY;

      setFeeAllocations(allocations);

      setPendingAllocations(
        allocations.filter(
          (allocation) =>
            Number(allocation.balance) > 0
        )
      );

      setPaidAllocations(
        allocations.filter(
          (allocation) =>
            Number(allocation.balance) <= 0
        )
      );

      setFeeSummary({
        totalAllocated:
          Number(summary.totalAllocated) || 0,

        totalPaid:
          Number(summary.totalPaid) || 0,

        totalBalance:
          Number(summary.totalBalance) || 0,

        totalDiscount:
          Number(summary.totalDiscount) || 0,
      });
    } catch (error) {
      console.error(
        'Error refreshing fee data:',
        error
      );
    }
  };

  /* ============================================================
     CLEAR STUDENT SELECTION
  ============================================================ */

  const handleClearSelection = () => {
    setSelectedStudent(null);

    setFeeAllocations([]);
    setPendingAllocations([]);
    setPaidAllocations([]);

    setSelectedAllocation(null);

    setSearchQuery('');
    setSearchResults([]);

    setShowCustomFees(false);
    setCustomFees([]);
    setIsFlexibleCollection(false);

    setFeeSummary({
      ...INITIAL_SUMMARY,
    });

    setPaymentData({
      ...INITIAL_PAYMENT_DATA,
    });
  };

  /* ============================================================
     STATUS BADGE
  ============================================================ */

  const getStatusBadge = (
    status: string
  ) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';

      case 'partial':
        return 'bg-yellow-100 text-yellow-800';

      case 'pending':
        return 'bg-red-100 text-red-800';

      case 'overdue':
        return 'bg-red-200 text-red-900';

      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  /* ============================================================
     DATE RANGE FILTER FOR ALLOCATIONS
  ============================================================ */

  const getFilteredAllocations = () => {
    let filtered = [...pendingAllocations];

    /* Status */
    if (filterStatus !== 'all') {
      if (filterStatus === 'overdue') {
        filtered = filtered.filter(
          (allocation) => {
            const balance =
              Number(allocation.balance) || 0;

            if (balance <= 0) {
              return false;
            }

            return (
              new Date(allocation.dueDate) <
              new Date()
            );
          }
        );
      } else {
        filtered = filtered.filter(
          (allocation) =>
            allocation.status === filterStatus
        );
      }
    }

    /* Start Date */
    if (filterStartDate) {
      const startDate =
        new Date(filterStartDate);

      startDate.setHours(0, 0, 0, 0);

      filtered = filtered.filter(
        (allocation) =>
          new Date(allocation.dueDate) >=
          startDate
      );
    }

    /* End Date */
    if (filterEndDate) {
      const endDate =
        new Date(filterEndDate);

      endDate.setHours(
        23,
        59,
        59,
        999
      );

      filtered = filtered.filter(
        (allocation) =>
          new Date(allocation.dueDate) <=
          endDate
      );
    }

    return filtered;
  };

  const filteredAllocations =
    getFilteredAllocations();

  /* ============================================================
     CLEAR ALL FILTERS
  ============================================================ */

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterClass('all');
    setFilterStatus('all');
    setFilterStartDate('');
    setFilterEndDate('');
    setSearchResults([]);
  };

  /* ============================================================
     EXPORT CSV
  ============================================================ */

  const handleExport = () => {
    try {
      const filtered =
        getFilteredAllocations();

      if (filtered.length === 0) {
        showError('No data to export');
        return;
      }

      const headers = [
        'Student Name',
        'Current Class',
        'Roll No',
        'IIEMIS Code',
        'Fee Structure',
        'Purpose',
        'Total Amount',
        'Paid Amount',
        'Balance',
        'Status',
        'Due Date',
      ];

      const rows = filtered.map(
        (allocation) => [
          selectedStudent?.fullName || '',

          selectedStudent
            ? `${selectedStudent.currentClass}-${selectedStudent.section}`
            : '',

          selectedStudent?.rollNumber || '',

          selectedStudent?.emisId || '',

          allocation.feeStructure.name,

          allocation.purpose || 'tuition',

          Number(
            allocation.totalAmount
          ).toFixed(2),

          Number(
            allocation.paidAmount
          ).toFixed(2),

          Number(
            allocation.balance
          ).toFixed(2),

          allocation.status,

          new Date(
            allocation.dueDate
          ).toLocaleDateString(),
        ]
      );

      const escapeCsv = (value: any) =>
        `"${String(value ?? '').replace(
          /"/g,
          '""'
        )}"`;

      const csvContent = [
        headers.map(escapeCsv).join(','),
        ...rows.map((row) =>
          row.map(escapeCsv).join(',')
        ),
      ].join('\n');

      const blob = new Blob(
        [csvContent],
        {
          type: 'text/csv;charset=utf-8;',
        }
      );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement('a');

      link.href = url;

      link.download = `fee-collection-${getToday()}.csv`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      showSuccess(
        'Data exported successfully'
      );
    } catch (error) {
      console.error(
        'Export error:',
        error
      );

      showError(
        'Error exporting data'
      );
    }
  };

  /* ============================================================
     REPORT
  ============================================================ */

  const handleGenerateReport = () => {
    try {
      const filtered =
        getFilteredAllocations();

      if (filtered.length === 0) {
        showError(
          'No data for report'
        );
        return;
      }

      const reportData = {
        totalAllocations:
          filtered.length,

        totalAmount:
          filtered.reduce(
            (sum, allocation) =>
              sum +
              (Number(
                allocation.totalAmount
              ) || 0),
            0
          ),

        totalPaid:
          filtered.reduce(
            (sum, allocation) =>
              sum +
              (Number(
                allocation.paidAmount
              ) || 0),
            0
          ),

        totalBalance:
          filtered.reduce(
            (sum, allocation) =>
              sum +
              (Number(
                allocation.balance
              ) || 0),
            0
          ),

        byStatus: {
          paid: filtered.filter(
            (a) => a.status === 'paid'
          ).length,

          partial: filtered.filter(
            (a) => a.status === 'partial'
          ).length,

          pending: filtered.filter(
            (a) => a.status === 'pending'
          ).length,

          overdue: filtered.filter(
            (a) => {
              const balance =
                Number(a.balance) || 0;

              return (
                balance > 0 &&
                new Date(a.dueDate) <
                new Date()
              );
            }
          ).length,
        },
      };

      showSuccess(
        `📊 Fee Collection Report\n\n` +
        `Total Allocations: ${reportData.totalAllocations}\n` +
        `Total Amount: NPR ${reportData.totalAmount.toFixed(
          2
        )}\n` +
        `Total Paid: NPR ${reportData.totalPaid.toFixed(
          2
        )}\n` +
        `Total Balance: NPR ${reportData.totalBalance.toFixed(
          2
        )}\n\n` +
        `Status Breakdown:\n` +
        `Paid: ${reportData.byStatus.paid}\n` +
        `Partial: ${reportData.byStatus.partial}\n` +
        `Pending: ${reportData.byStatus.pending}\n` +
        `Overdue: ${reportData.byStatus.overdue}`
      );
    } catch (error) {
      console.error(
        'Report error:',
        error
      );

      showError(
        'Error generating report'
      );
    }
  };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="space-y-6">
      {/* ======================================================
          HEADER + FILTERS
      ====================================================== */}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-7 h-7 text-blue-600" />
                Fee Collection
              </h2>

              <p className="text-sm text-gray-600 mt-1">
                Modern payment collection with
                advanced filters
              </p>
            </div>

            {selectedStudent && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={
                    handleGenerateReport
                  }
                  icon={
                    <FileText className="w-4 h-4" />
                  }
                >
                  Report
                </Button>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleExport}
                  icon={
                    <Download className="w-4 h-4" />
                  }
                >
                  Export
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="mb-3 flex justify-between items-center gap-3">
            <h1 className='text-nowrap'>Academic Year</h1>
            <select
              value={filterAcademicYear}
              onChange={(e) =>
                setFilterAcademicYear(e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">
                All Academic Years
              </option>

              {academicYears.map((item) => (
                <option
                  key={item.id}
                  value={String(item.id)}
                >
                  {item.title}
                  {item.isCurrent ? 'Current: ' + item.year : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-3">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  placeholder="Search by name, IIEMIS Code, or roll number..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <p className="text-xs text-gray-500 mt-1">
                💡 Search by student details OR
                use filters below
              </p>
            </div>

            {/* Class */}
            <div>
              <select
                value={filterClass}
                onChange={(e) =>
                  setFilterClass(e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">
                  All Classes
                </option>

                {classes
                  .filter(
                    (item) =>
                      !item.status ||
                      item.status === 'active'
                  )
                  .map((item) => (
                    <option
                      key={item.id}
                      value={String(item.name)}
                    >
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
            {/* Status */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">
                  All Status
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="partial">
                  Partial
                </option>

                <option value="paid">
                  Paid
                </option>

                <option value="overdue">
                  Overdue
                </option>
              </select>
            </div>

            {/* Date */}
            <div>
              <button
                type="button"
                onClick={() =>
                  setShowFilters(
                    (previous) =>
                      !previous
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />

                Date Range

                {(filterStartDate ||
                  filterEndDate) && (
                    <span className="text-xs bg-blue-500 text-white px-1.5 rounded-full">
                      ●
                    </span>
                  )}
              </button>
            </div>

            {/* Search */}
            <div>
              <Button
                onClick={handleSearch}
                disabled={
                  loading ||
                  loadingStatus
                }
                className="w-full relative text-sm"
                icon={
                  loading ||
                    loadingStatus ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )
                }
              >
                {loading ||
                  loadingStatus
                  ? 'Searching...'
                  : 'Search'}

                {!loading &&
                  !loadingStatus &&
                  (searchQuery.trim() ||
                    filterClass !==
                    'all' ||
                    filterStatus !==
                    'all' ||
                    filterStartDate ||
                    filterEndDate) && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {
                        [
                          Boolean(
                            searchQuery.trim()
                          ),
                          filterClass !==
                          'all',
                          filterStatus !==
                          'all',
                          Boolean(
                            filterStartDate
                          ),
                          Boolean(
                            filterEndDate
                          ),
                        ].filter(Boolean)
                          .length
                      }
                    </span>
                  )}
              </Button>
            </div>
          </div>

          {/* Date Filters */}
          {showFilters && (
            <div className="mt-3 p-4 bg-white border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Start Date
                  </label>

                  <input
                    type="date"
                    value={
                      filterStartDate
                    }
                    onChange={(e) =>
                      setFilterStartDate(
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    End Date
                  </label>

                  <input
                    type="date"
                    value={
                      filterEndDate
                    }
                    min={
                      filterStartDate ||
                      undefined
                    }
                    onChange={(e) =>
                      setFilterEndDate(
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setFilterStartDate(
                      ''
                    );
                    setFilterEndDate('');
                  }}
                >
                  Clear Dates
                </Button>
              </div>
            </div>
          )}

          {/* Active Filters */}
          {(searchQuery.trim() ||
            filterClass !== 'all' ||
            filterStatus !== 'all' ||
            filterStartDate ||
            filterEndDate) && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-blue-900">
                      Active Filters:
                    </span>

                    {searchQuery.trim() && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        Student: "
                        {searchQuery}"
                      </span>
                    )}

                    {filterClass !==
                      'all' && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          Class{' '}
                          {
                            filterClass
                          }
                        </span>
                      )}

                    {filterStatus !==
                      'all' && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          Status:{' '}
                          {filterStatus
                            .charAt(
                              0
                            )
                            .toUpperCase() +
                            filterStatus.slice(
                              1
                            )}
                        </span>
                      )}

                    {(filterStartDate ||
                      filterEndDate) && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          Date:{' '}
                          {filterStartDate ||
                            '...'}{' '}
                          to{' '}
                          {filterEndDate ||
                            '...'}
                        </span>
                      )}
                  </div>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={
                      handleClearFilters
                    }
                    icon={
                      <X className="w-3 h-3" />
                    }
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            )}
        </div>

        {/* Quick Stats */}
        {selectedStudent &&
          feeAllocations.length > 0 && (
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-600">
                      Total Allocated
                    </p>

                    <p className="text-lg font-bold text-gray-900">
                      NPR{' '}
                      {feeSummary.totalAllocated.toFixed(
                        0
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-600">
                      Total Paid
                    </p>

                    <p className="text-lg font-bold text-green-700">
                      NPR{' '}
                      {feeSummary.totalPaid.toFixed(
                        0
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-600">
                      Balance Due
                    </p>

                    <p className="text-lg font-bold text-red-700">
                      NPR{' '}
                      {feeSummary.totalBalance.toFixed(
                        0
                      )}
                    </p>
                  </div>
                </div>

                {feeSummary.totalDiscount >
                  0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-purple-600" />
                      </div>

                      <div>
                        <p className="text-xs text-gray-600">
                          Total Discount
                        </p>

                        <p className="text-lg font-bold text-purple-700">
                          NPR{' '}
                          {feeSummary.totalDiscount.toFixed(
                            0
                          )}
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}
      </div>

      {/* ======================================================
          SEARCH RESULTS
      ====================================================== */}

      {searchResults.length > 0 &&
        !selectedStudent && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-blue-900">
                  {searchResults.length}{' '}
                  student
                  {searchResults.length >
                    1
                    ? 's'
                    : ''}{' '}
                  found
                </p>

                <div className="flex items-center gap-2 flex-wrap justify-end">
                  {searchQuery.trim() && (
                    <span className="text-xs px-2 py-1 bg-white text-blue-700 rounded border border-blue-200">
                      Searched: "
                      {searchQuery}"
                    </span>
                  )}

                  {filterClass !==
                    'all' && (
                      <span className="text-xs px-2 py-1 bg-white text-blue-700 rounded border border-blue-200">
                        Class{' '}
                        {
                          filterClass
                        }
                      </span>
                    )}
                </div>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
              {loadingStatus && (
                <div className="px-6 py-3 bg-yellow-50 border-b border-yellow-100 flex items-center gap-2">
                  <Loader className="w-4 h-4 text-yellow-600 animate-spin" />

                  <span className="text-xs text-yellow-800 font-medium">
                    Loading payment
                    status...
                  </span>
                </div>
              )}

              {searchResults.map(
                (student) => {
                  const status =
                    student.paymentStatus?.status;

                  const statusBadge =
                    !student.paymentStatus
                      ? {
                        label:
                          'Loading...',
                        className:
                          'bg-gray-100 text-gray-600 border-gray-300',
                        icon: null,
                      }
                      : status ===
                        'paid'
                        ? {
                          label:
                            'All Paid',
                          className:
                            'bg-green-100 text-green-700 border-green-300',
                          icon: (
                            <CheckCircle2 className="w-3 h-3" />
                          ),
                        }
                        : status ===
                          'partial'
                          ? {
                            label:
                              'Partial',
                            className:
                              'bg-yellow-100 text-yellow-700 border-yellow-300',
                            icon: (
                              <Clock className="w-3 h-3" />
                            ),
                          }
                          : status ===
                            'pending'
                            ? {
                              label:
                                'Pending',
                              className:
                                'bg-red-100 text-red-700 border-red-300',
                              icon: (
                                <AlertCircle className="w-3 h-3" />
                              ),
                            }
                            : {
                              label:
                                'No Fees',
                              className:
                                'bg-gray-100 text-gray-600 border-gray-300',
                              icon: null,
                            };

                  return (
                    <button
                      key={
                        student.id
                      }
                      type="button"
                      onClick={() =>
                        handleSelectStudent(
                          student
                        )
                      }
                      className="w-full px-6 py-4 hover:bg-blue-50 text-left transition-all group"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                              {student.fullName
                                .charAt(
                                  0
                                )
                                .toUpperCase()}
                            </div>

                            <div className="flex-1">
                              <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {
                                  student.fullName
                                }
                              </p>

                              <div className="flex items-center gap-2 flex-wrap mt-1">
                                {student.emisId && (
                                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">
                                    IEMIS:{' '}
                                    {
                                      student.emisId
                                    }
                                  </span>
                                )}

                                <span className="text-xs text-gray-600">
                                  Roll:{' '}
                                  {
                                    student.rollNumber
                                  }
                                </span>

                                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                                  Class{' '}
                                  {
                                    student.currentClass
                                  }
                                  -
                                  {
                                    student.section
                                  }
                                </span>
                              </div>
                            </div>
                          </div>

                          {student.paymentStatus &&
                            student.paymentStatus
                              .status !==
                            'none' && (
                              <div className="ml-13 mt-2 flex items-center gap-3 text-xs flex-wrap">
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-600">
                                    Total:
                                  </span>

                                  <span className="font-semibold text-gray-900">
                                    NPR{' '}
                                    {student.paymentStatus.totalAllocated.toFixed(
                                      0
                                    )}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="text-gray-600">
                                    Paid:
                                  </span>

                                  <span className="font-semibold text-green-700">
                                    NPR{' '}
                                    {student.paymentStatus.totalPaid.toFixed(
                                      0
                                    )}
                                  </span>
                                </div>

                                {student
                                  .paymentStatus
                                  .totalBalance >
                                  0 && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-gray-600">
                                        Balance:
                                      </span>

                                      <span className="font-semibold text-red-700">
                                        NPR{' '}
                                        {student.paymentStatus.totalBalance.toFixed(
                                          0
                                        )}
                                      </span>
                                    </div>
                                  )}

                                {student
                                  .paymentStatus
                                  .pendingCount >
                                  0 && (
                                    <span className="text-gray-600">
                                      •{' '}
                                      {
                                        student
                                          .paymentStatus
                                          .pendingCount
                                      }{' '}
                                      pending
                                      fee
                                      {student
                                        .paymentStatus
                                        .pendingCount >
                                        1
                                        ? 's'
                                        : ''}
                                    </span>
                                  )}
                              </div>
                            )}
                        </div>

                        <div className="text-right ml-4">
                          <div
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-semibold mb-2 ${statusBadge.className}`}
                          >
                            {
                              statusBadge.icon
                            }

                            {
                              statusBadge.label
                            }
                          </div>

                          <p className="text-sm text-gray-600">
                            {
                              student.contactNumber
                            }
                          </p>

                          {student.email && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {
                                student.email
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        )}

      {/* ======================================================
          WELCOME
      ====================================================== */}

      {!selectedStudent &&
        searchResults.length ===
        0 && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm p-12 border border-blue-100 text-center">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg">
                <Search className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Ready to Collect
                Fees
              </h3>

              <p className="text-gray-600 mb-6 max-w-2xl">
                Search by student
                details or use the
                class/status filters
                above. Date filters
                are optional.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mb-6">
                <div className="bg-white p-4 rounded-lg border border-blue-200 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>

                    <h4 className="font-semibold text-gray-900">
                      By Student
                      Details
                    </h4>
                  </div>

                  <p className="text-sm text-gray-600">
                    Search by name,
                    IIEMIS Code, or
                    roll number.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-blue-200 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <Filter className="w-4 h-4 text-blue-600" />
                    </div>

                    <h4 className="font-semibold text-gray-900">
                      By Class/Status
                    </h4>
                  </div>

                  <p className="text-sm text-gray-600">
                    Select a class or
                    payment status
                    without searching
                    for a student.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="font-bold text-blue-600">
                      1
                    </span>
                  </div>

                  <span>
                    Search student
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="font-bold text-blue-600">
                      2
                    </span>
                  </div>

                  <span>
                    Select fees
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="font-bold text-blue-600">
                      3
                    </span>
                  </div>

                  <span>
                    Collect payment
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* ======================================================
          SELECTED STUDENT
      ====================================================== */}

      {selectedStudent && (
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-sm p-6 border-2 border-blue-100">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                {selectedStudent.fullName
                  .charAt(0)
                  .toUpperCase()}
              </div>

              Student Information
            </h3>

            <Button
              size="sm"
              variant="secondary"
              onClick={
                handleClearSelection
              }
              icon={
                <X className="w-4 h-4" />
              }
            >
              Clear Selection
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">
                Full Name
              </p>

              <p className="font-bold text-gray-900">
                {
                  selectedStudent.fullName
                }
              </p>
            </div>

            {selectedStudent.emisId && (
              <div className="bg-white p-3 rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600 mb-1">
                  IIEMIS Code
                </p>

                <p className="font-bold text-blue-600">
                  {
                    selectedStudent.emisId
                  }
                </p>
              </div>
            )}

            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">
                Roll Number
              </p>

              <p className="font-bold text-gray-900">
                {
                  selectedStudent.rollNumber
                }
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">
                Class & Section
              </p>

              <p className="font-bold text-gray-900">
                {
                  selectedStudent.currentClass
                }
                -
                {
                  selectedStudent.section
                }
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">
                contactNumber
              </p>

              <p className="font-bold text-gray-900">
                {
                  selectedStudent.contactNumber ||
                  'N/A'
                }
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">
                Email
              </p>

              <p className="font-bold text-gray-900 text-sm">
                {
                  selectedStudent.email ||
                  'N/A'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          PENDING FEES
      ====================================================== */}

      {selectedStudent &&
        filteredAllocations.length >
        0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-600" />

                Pending Fees (
                {
                  filteredAllocations.length
                }
                )
              </h3>

              <span className="text-xs text-gray-500">
                💡 Click a fee to
                collect payment
              </span>
            </div>

            <div className="space-y-3">
              {filteredAllocations.map(
                (allocation) => {
                  const purposeColors: Record<
                    string,
                    string
                  > = {
                    admission:
                      'bg-purple-100 text-purple-700 border-purple-300',
                    tuition:
                      'bg-blue-100 text-blue-700 border-blue-300',
                    examination:
                      'bg-orange-100 text-orange-700 border-orange-300',
                    event:
                      'bg-pink-100 text-pink-700 border-pink-300',
                    transport:
                      'bg-yellow-100 text-yellow-700 border-yellow-300',
                    hostel:
                      'bg-indigo-100 text-indigo-700 border-indigo-300',
                    library:
                      'bg-cyan-100 text-cyan-700 border-cyan-300',
                    lab:
                      'bg-teal-100 text-teal-700 border-teal-300',
                    sports:
                      'bg-green-100 text-green-700 border-green-300',
                    other:
                      'bg-gray-100 text-gray-700 border-gray-300',
                  };

                  const purpose =
                    allocation.purpose ||
                    'tuition';

                  const purposeColor =
                    purposeColors[
                    purpose
                    ] ||
                    purposeColors.other;

                  return (
                    <button
                      key={
                        allocation.id
                      }
                      type="button"
                      onClick={() =>
                        handleSelectAllocation(
                          allocation
                        )
                      }
                      className={`w-full p-4 border-2 rounded-lg text-left transition-all ${selectedAllocation?.id ===
                        allocation.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                        }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span
                              className={`text-xs px-2.5 py-1 rounded-full border font-medium ${purposeColor}`}
                            >
                              {purpose
                                .charAt(
                                  0
                                )
                                .toUpperCase() +
                                purpose.slice(
                                  1
                                )}
                            </span>

                            <span
                              className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(
                                allocation.status
                              )}`}
                            >
                              {allocation.status.toUpperCase()}
                            </span>

                            {allocation.allocationBatch && (
                              <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                                {
                                  allocation.allocationBatch
                                }
                              </span>
                            )}
                          </div>

                          <p className="font-semibold text-gray-900 text-base">
                            {
                              allocation
                                .feeStructure
                                .name
                            }
                          </p>

                          <p className="text-sm text-gray-600 mt-1">
                            {
                              allocation
                                .feeStructure
                                .academicYear
                            }{' '}
                            • Due:{' '}
                            {new Date(
                              allocation.dueDate
                            ).toLocaleDateString()}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2">
                            {allocation.feeStructure.items.map(
                              (
                                item,
                                index
                              ) => (
                                <span
                                  key={
                                    index
                                  }
                                  className="text-xs bg-gray-100 px-2 py-1 rounded"
                                >
                                  {
                                    item
                                      .category
                                      .name
                                  }
                                  : NPR{' '}
                                  {
                                    item.amount
                                  }
                                </span>
                              )
                            )}
                          </div>

                          {Number(
                            allocation.discount
                          ) > 0 && (
                              <div className="mt-2 text-xs text-green-700 bg-green-50 px-2 py-1 rounded inline-block">
                                💰 Discount:
                                NPR{' '}
                                {Number(
                                  allocation.discount
                                ).toFixed(
                                  2
                                )}

                                {allocation.discountReason &&
                                  ` (${allocation.discountReason})`}
                              </div>
                            )}
                        </div>

                        <div className="text-right ml-4">
                          <p className="text-sm text-gray-600">
                            Balance
                          </p>

                          <p className="text-2xl font-bold text-red-600">
                            NPR{' '}
                            {Number(
                              allocation.balance
                            ).toFixed(
                              2
                            )}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            Paid: NPR{' '}
                            {Number(
                              allocation.paidAmount
                            ).toFixed(
                              2
                            )}{' '}
                            of NPR{' '}
                            {Number(
                              allocation.totalAmount
                            ).toFixed(
                              2
                            )}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        )}

      {/* ======================================================
          FILTERED EMPTY
      ====================================================== */}

      {selectedStudent &&
        pendingAllocations.length >
        0 &&
        filteredAllocations.length ===
        0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No fees match your
              filters
            </h3>

            <p className="text-gray-600 mb-4">
              Try adjusting the
              selected filters.
            </p>

            <Button
              variant="secondary"
              onClick={() => {
                setFilterStatus(
                  'all'
                );
                setFilterStartDate(
                  ''
                );
                setFilterEndDate('');
              }}
            >
              Clear Fee Filters
            </Button>
          </div>
        )}

      {/* ======================================================
          CUSTOM FEES
      ====================================================== */}

      {selectedStudent && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Custom Fees
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Add miscellaneous fees not
                included in regular fee
                structures.
              </p>
            </div>

            <Button
              size="sm"
              variant={
                showCustomFees
                  ? 'secondary'
                  : 'primary'
              }
              onClick={
                handleToggleCustomFees
              }
            >
              {showCustomFees
                ? 'Cancel Custom Fees'
                : 'Add Custom Fee'}
            </Button>
          </div>

          {showCustomFees && (
            <div className="space-y-4 mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2 p-3 bg-amber-100 border border-amber-300 rounded">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />

                <div className="text-sm text-amber-800">
                  <p className="font-semibold">
                    ⚠️ Custom Fee
                    Collection
                  </p>

                  <p className="mt-1">
                    Custom collection
                    does not modify
                    regular allocated
                    fee balances.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {customFees.map(
                  (fee, index) => (
                    <div
                      key={index}
                      className="flex gap-3 items-start p-3 bg-white border border-gray-300 rounded"
                    >
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Select
                          label={`Fee Category ${index + 1
                            } *`}
                          value={String(
                            fee.categoryId
                          )}
                          onChange={(e) =>
                            handleUpdateCustomFee(
                              index,
                              'categoryId',
                              e.target.value
                            )
                          }
                          options={[
                            {
                              value: '0',
                              label:
                                'Select Category',
                            },
                            ...categories.map(
                              (
                                category
                              ) => ({
                                value:
                                  String(
                                    category.id
                                  ),
                                label:
                                  category.name,
                              })
                            ),
                          ]}
                          required
                        />

                        <FormInput
                          label="Amount (NPR) *"
                          type="number"
                          min="0"
                          step="0.01"
                          value={String(
                            fee.amount
                          )}
                          onChange={(e) =>
                            handleUpdateCustomFee(
                              index,
                              'amount',
                              e.target.value
                            )
                          }
                          placeholder="Enter amount"
                          required
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveCustomFee(
                            index
                          )
                        }
                        className="mt-7 p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )
                )}
              </div>

              <Button
                size="sm"
                variant="secondary"
                onClick={
                  handleAddCustomFee
                }
                icon={
                  <Plus className="w-4 h-4" />
                }
              >
                Add Another Category
              </Button>

              <div className="pt-3 border-t border-amber-300">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-gray-700">
                    Total Custom Fees:
                  </span>

                  <span className="text-lg font-bold text-amber-900">
                    NPR{' '}
                    {customFees
                      .reduce(
                        (sum, fee) =>
                          sum +
                          (Number(
                            fee.amount
                          ) || 0),
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================
          PAID HISTORY
      ====================================================== */}

      {selectedStudent &&
        paidAllocations.length >
        0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-green-600" />

              Fully Paid Fees (
              {
                paidAllocations.length
              }
              )
            </h3>

            <div className="space-y-3">
              {paidAllocations.map(
                (allocation) => (
                  <div
                    key={
                      allocation.id
                    }
                    className="p-4 border-2 border-green-200 bg-green-50 rounded-lg"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-semibold text-gray-900">
                            {
                              allocation
                                .feeStructure
                                .name
                            }
                          </p>

                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                            ✓ FULLY PAID
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mt-1">
                          {
                            allocation
                              .feeStructure
                              .academicYear
                          }
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {allocation.feeStructure.items.map(
                            (
                              item,
                              index
                            ) => (
                              <span
                                key={
                                  index
                                }
                                className="text-xs bg-white px-2 py-1 rounded border border-green-200"
                              >
                                ✓{' '}
                                {
                                  item
                                    .category
                                    .name
                                }
                                : NPR{' '}
                                {
                                  item.amount
                                }
                              </span>
                            )
                          )}
                        </div>

                        {allocation.transactions &&
                          allocation
                            .transactions
                            .length >
                          0 && (
                            <div className="mt-3 pt-3 border-t border-green-200">
                              <p className="text-xs font-semibold text-gray-700 mb-2">
                                Payment
                                History:
                              </p>

                              <div className="space-y-1">
                                {allocation.transactions.map(
                                  (
                                    transaction,
                                    index
                                  ) => (
                                    <div
                                      key={
                                        transaction.id ||
                                        index
                                      }
                                      className="text-xs text-gray-600 flex justify-between gap-3"
                                    >
                                      <span>
                                        {new Date(
                                          transaction.paymentDate
                                        ).toLocaleDateString()}{' '}
                                        -{' '}
                                        {transaction.paymentMethod.toUpperCase()}{' '}
                                        - Receipt:{' '}
                                        {
                                          transaction.receiptNumber
                                        }
                                      </span>

                                      <span className="font-semibold text-green-700 whitespace-nowrap">
                                        NPR{' '}
                                        {Number(
                                          transaction.amount
                                        ).toFixed(
                                          2
                                        )}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </div>

                      <div className="text-right ml-4">
                        <p className="text-sm text-green-600 font-medium">
                          Total Paid
                        </p>

                        <p className="text-2xl font-bold text-green-700">
                          NPR{' '}
                          {Number(
                            allocation.paidAmount
                          ).toFixed(
                            2
                          )}
                        </p>

                        {Number(
                          allocation.discount
                        ) > 0 && (
                            <p className="text-xs text-purple-600 mt-1">
                              Discount: NPR{' '}
                              {Number(
                                allocation.discount
                              ).toFixed(
                                2
                              )}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

      {/* ======================================================
          PAYMENT FORM
      ====================================================== */}

      {(selectedAllocation ||
        showCustomFees) && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Collect Payment
              </h3>

              {isFlexibleCollection && (
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                  CUSTOM FEE COLLECTION
                </span>
              )}

              {selectedAllocation && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                  REGULAR FEE COLLECTION
                </span>
              )}
            </div>

            <form
              onSubmit={
                handleCollectPayment
              }
              className="space-y-4"
            >
              {/* Custom Alert */}
              {isFlexibleCollection && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />

                  <p className="text-sm text-amber-800">
                    <strong>
                      Total Custom Fees:
                    </strong>{' '}
                    NPR{' '}
                    {customFees
                      .reduce(
                        (sum, fee) =>
                          sum +
                          (Number(
                            fee.amount
                          ) || 0),
                        0
                      )
                      .toFixed(2)}
                    <br />
                    You can collect
                    full or partial
                    payment.
                  </p>
                </div>
              )}

              {/* Regular Alert */}
              {selectedAllocation && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />

                  <p className="text-sm text-blue-800">
                    <strong>
                      Fee:
                    </strong>{' '}
                    {
                      selectedAllocation
                        .feeStructure
                        .name
                    }
                    <br />

                    <strong>
                      Balance Due:
                    </strong>{' '}
                    NPR{' '}
                    {Number(
                      selectedAllocation.balance
                    ).toFixed(2)}
                    <br />

                    Enter full or
                    partial payment
                    below.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Amount */}
                <div>
                  <FormInput
                    label="Payment Amount *"
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      paymentData.amount
                    }
                    onChange={(e) =>
                      setPaymentData(
                        (previous) => ({
                          ...previous,
                          amount:
                            e.target.value,
                        })
                      )
                    }
                    placeholder="Enter amount"
                    required
                  />

                  <p className="text-xs text-gray-500 mt-1">
                    {isFlexibleCollection
                      ? `Maximum: NPR ${customFees
                        .reduce(
                          (sum, fee) =>
                            sum +
                            (Number(
                              fee.amount
                            ) || 0),
                          0
                        )
                        .toFixed(2)}`
                      : selectedAllocation
                        ? `Maximum: NPR ${Number(
                          selectedAllocation.balance
                        ).toFixed(2)}`
                        : ''}
                  </p>
                </div>

                {/* Payment Method */}
                <Select
                  label="Payment Method *"
                  value={
                    paymentData.paymentMethod
                  }
                  onChange={(e) =>
                    setPaymentData(
                      (previous) => ({
                        ...previous,
                        paymentMethod:
                          e.target.value,
                      })
                    )
                  }
                  options={[
                    {
                      value: 'cash',
                      label: 'Cash',
                    },
                    {
                      value:
                        'bank_transfer',
                      label:
                        'Bank Transfer',
                    },
                    {
                      value: 'cheque',
                      label: 'Cheque',
                    },
                    {
                      value: 'online',
                      label:
                        'Online Payment',
                    },
                    {
                      value: 'card',
                      label: 'Card',
                    },
                  ]}
                  required
                />

                {/* Payment Date */}
                <FormInput
                  label="Payment Date *"
                  type="date"
                  value={
                    paymentData.paymentDate
                  }
                  onChange={(e) =>
                    setPaymentData(
                      (previous) => ({
                        ...previous,
                        paymentDate:
                          e.target.value,
                      })
                    )
                  }
                  required
                />

                {/* Non-Cash Fields */}
                {paymentData.paymentMethod !==
                  'cash' && (
                    <>
                      <FormInput
                        label="Bank Name"
                        value={
                          paymentData.bankName
                        }
                        onChange={(e) =>
                          setPaymentData(
                            (previous) => ({
                              ...previous,
                              bankName:
                                e.target
                                  .value,
                            })
                          )
                        }
                        placeholder="Enter bank name"
                      />

                      <FormInput
                        label="Account/Cheque Number"
                        value={
                          paymentData.bankAccountNumber
                        }
                        onChange={(e) =>
                          setPaymentData(
                            (previous) => ({
                              ...previous,
                              bankAccountNumber:
                                e.target
                                  .value,
                            })
                          )
                        }
                        placeholder="Enter account or cheque number"
                      />

                      <FormInput
                        label="Reference Number *"
                        value={
                          paymentData.referenceNumber
                        }
                        onChange={(e) =>
                          setPaymentData(
                            (previous) => ({
                              ...previous,
                              referenceNumber:
                                e.target
                                  .value,
                            })
                          )
                        }
                        placeholder="Enter transaction reference"
                        required
                      />
                    </>
                  )}

                {/* Remarks */}
                <div className="md:col-span-2">
                  <FormInput
                    label="Remarks"
                    value={
                      paymentData.remarks
                    }
                    onChange={(e) =>
                      setPaymentData(
                        (previous) => ({
                          ...previous,
                          remarks:
                            e.target
                              .value,
                        })
                      )
                    }
                    placeholder="Optional notes"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setSelectedAllocation(
                      null
                    );

                    setShowCustomFees(
                      false
                    );

                    setCustomFees([]);

                    setIsFlexibleCollection(
                      false
                    );

                    setPaymentData({
                      ...INITIAL_PAYMENT_DATA,
                    });
                  }}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={processing}
                  icon={
                    processing ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <Receipt className="w-5 h-5" />
                    )
                  }
                >
                  {processing
                    ? 'Processing...'
                    : 'Collect Payment'}
                </Button>
              </div>
            </form>
          </div>
        )}

      {/* ======================================================
          NO ALLOCATIONS
      ====================================================== */}

      {selectedStudent &&
        pendingAllocations.length ===
        0 &&
        paidAllocations.length ===
        0 &&
        !loading && (
          <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
            <AlertCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Fee Allocations
            </h3>

            <p className="text-gray-600">
              No fees have been allocated
              to this student yet.
            </p>
          </div>
        )}

      {/* ======================================================
          ALL FEES CLEARED
      ====================================================== */}

      {selectedStudent &&
        pendingAllocations.length ===
        0 &&
        paidAllocations.length > 0 &&
        !loading && (
          <div className="bg-green-50 border border-green-200 rounded-xl shadow-sm p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Receipt className="w-8 h-8 text-green-600" />
            </div>

            <h3 className="text-xl font-semibold text-green-900 mb-2">
              All Fees Cleared! 🎉
            </h3>

            <p className="text-green-700">
              This student has no pending
              fee payments. See payment
              history above.
            </p>
          </div>
        )}

      {/* ======================================================
          RECEIPT MODAL
      ====================================================== */}

      {showReceiptModal &&
        receiptData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 no-print">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center no-print">
                <h3 className="text-lg font-semibold">
                  Fee Receipt
                </h3>

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      const originalTitle =
                        document.title;

                      const studentIEMIS =
                        receiptData
                          ?.student
                          ?.emisId ||
                        'STUDENT';

                      const receiptNo =
                        receiptData?.receiptNumber ||
                        'RECEIPT';

                      document.title = `Receipt_${studentIEMIS}_${receiptNo}`;

                      window.print();

                      setTimeout(() => {
                        document.title =
                          originalTitle;
                      }, 1000);
                    }}
                    icon={
                      <Printer className="w-5 h-5" />
                    }
                    variant="primary"
                  >
                    Print Receipt
                  </Button>

                  <button
                    type="button"
                    onClick={() =>
                      setShowReceiptModal(
                        false
                      )
                    }
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div
                ref={receiptRef}
                id="receipt-content"
                className="p-6"
              >
                <FeeReceipt
                  schoolProfile={
                    schoolProfile
                  }
                  receiptData={
                    receiptData
                  }
                />
              </div>
            </div>
          </div>
        )}

      {/* ======================================================
          PRINT STYLES
      ====================================================== */}
      <style>{`
        @media print {
          /* Hide everything except the receipt content */
          body * {
            visibility: hidden;
          }
          
          /* Show only receipt and its children */
          #receipt-content,
          #receipt-content * {
            visibility: visible !important;
          }
          
          /* Position receipt at top of page */
          #receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
          }
          
          /* Page setup */
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          
          body, html {
            margin: 0;
            padding: 0;
            height: auto;
            overflow: visible;
          }
        }
      `}</style>
    </div>
  );
};

export default FeeCollection;