import React, { useState, useEffect, useRef } from 'react';
import { Search, User, CreditCard, Receipt, AlertCircle, Plus, Trash2, X, Printer, FileText, Download, Filter, Calendar, DollarSign, TrendingUp, TrendingDown, Clock, CheckCircle2, Loader } from 'lucide-react';
import Button from '../../components/shared/Button';
import FormInput from '../../components/shared/FormInput';
import Select from '../../components/shared/Select';
import FeeReceipt from '../../components/admin/FeeReceipt';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';
import { showSuccess, showError } from '../../utils/sweetAlert';
import { schoolProfileService } from '../../api';
import type { SchoolProfile } from '../../api/types';

interface Student {
  id: number;
  fullName: string;
  rollNumber: string;
  class: string;
  section: string;
  phone: string;
  email: string;
  emisId?: string;
  // Payment status info
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

const FeeCollection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [feeAllocations, setFeeAllocations] = useState<FeeAllocation[]>([]);
  const [pendingAllocations, setPendingAllocations] = useState<FeeAllocation[]>([]);
  const [paidAllocations, setPaidAllocations] = useState<FeeAllocation[]>([]);
  const [selectedAllocation, setSelectedAllocation] = useState<FeeAllocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [feeSummary, setFeeSummary] = useState({
    totalAllocated: 0,
    totalPaid: 0,
    totalBalance: 0,
    totalDiscount: 0,
  });

  // Custom fee collection (for miscellaneous fees)
  const [showCustomFees, setShowCustomFees] = useState(false);
  const [categories, setCategories] = useState<FeeCategory[]>([]);
  const [customFees, setCustomFees] = useState<CustomFeeItem[]>([]);
  const [isFlexibleCollection, setIsFlexibleCollection] = useState(false);

  // Receipt modal state
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Modern Filters and View State
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'cash',
    paymentDate: new Date().toISOString().split('T')[0],
    bankName: '',
    bankAccountNumber: '',
    referenceNumber: '',
    remarks: '',
  });

  const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

  // Fetch fee categories for custom fees
  useEffect(() => {
    fetchCategories();
    fetchSchoolProfile();
  }, []);

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

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/fee-management/categories`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const activeCategories = (response.data.data || []).filter((c: FeeCategory) => c.isActive);
      setCategories(activeCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Flexible search for students - can search by student details, filters, or both
  const handleSearch = async () => {
    const hasSearchQuery = searchQuery.trim().length > 0;
    const hasClassFilter = filterClass !== 'all';
    const hasStatusFilter = filterStatus !== 'all';

    // Must have at least one search criteria
    if (!hasSearchQuery && !hasClassFilter && !hasStatusFilter) {
      showError('Please enter student details OR select class/status filter');
      return;
    }

    try {
      setLoading(true);

      // Build query parameters
      const params: any = {};

      // Add class filter if selected
      if (hasClassFilter) {
        params.class = filterClass;
      }

      // Add search query for student details if provided
      if (hasSearchQuery) {
        params.search = searchQuery.trim();
      }

      const response = await axios.get(`${API_BASE_URL}/students`, {
        params,
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      let students = response.data.data || [];

      // If search query is provided, filter locally for better matching
      if (hasSearchQuery) {
        const query = searchQuery.toLowerCase().trim();

        // Prioritize IEMIS ID search, then name and roll number
        students = students.filter((student: Student) =>
          (student.emisId && student.emisId.toLowerCase().includes(query)) ||
          student.fullName.toLowerCase().includes(query) ||
          student.rollNumber.toLowerCase().includes(query)
        );

        // Sort: exact IEMIS match first
        students.sort((a: Student, b: Student) => {
          const aIemisMatch = a.emisId?.toLowerCase() === query;
          const bIemisMatch = b.emisId?.toLowerCase() === query;
          if (aIemisMatch && !bIemisMatch) return -1;
          if (!aIemisMatch && bIemisMatch) return 1;
          return 0;
        });
      }

      setSearchResults(students);

      if (students.length === 0) {
        showError('No students found matching your criteria');
      } else {
        showSuccess(`Found ${students.length} student${students.length > 1 ? 's' : ''}`);
        // Fetch payment status for each student
        fetchPaymentStatusForStudents(students);
      }
    } catch (error) {
      console.error('Error searching students:', error);
      showError('Error searching for students');
    } finally {
      setLoading(false);
    }
  };

  // Fetch payment status for multiple students
  const fetchPaymentStatusForStudents = async (students: Student[]) => {
    try {
      setLoadingStatus(true);

      // Fetch status for each student in parallel
      const statusPromises = students.map(async (student) => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/fee-management/allocations/student/${student.id}`,
            {
              headers: { Authorization: `Bearer ${getToken()}` },
            }
          );

          const allocations = response.data.data.allocations || [];
          const summary = response.data.data.summary || {
            totalAllocated: 0,
            totalPaid: 0,
            totalBalance: 0,
          };

          const pendingCount = allocations.filter((a: FeeAllocation) => a.balance > 0).length;

          let status: 'paid' | 'partial' | 'pending' | 'none' = 'none';
          if (summary.totalAllocated === 0) {
            status = 'none';
          } else if (summary.totalBalance === 0) {
            status = 'paid';
          } else if (summary.totalPaid > 0) {
            status = 'partial';
          } else {
            status = 'pending';
          }

          return {
            ...student,
            paymentStatus: {
              totalBalance: summary.totalBalance,
              totalPaid: summary.totalPaid,
              totalAllocated: summary.totalAllocated,
              pendingCount,
              status,
            },
          };
        } catch (error) {
          console.error(`Error fetching status for student ${student.id}:`, error);
          return student; // Return student without status on error
        }
      });

      const studentsWithStatus = await Promise.all(statusPromises);

      // Filter by payment status if specified
      let filteredStudents = studentsWithStatus;
      if (filterStatus !== 'all') {
        filteredStudents = studentsWithStatus.filter((student) => {
          if (!student.paymentStatus) return false;

          // Map status filter to payment status
          switch (filterStatus) {
            case 'pending':
              return student.paymentStatus.status === 'pending';
            case 'partial':
              return student.paymentStatus.status === 'partial';
            case 'paid':
              return student.paymentStatus.status === 'paid';
            case 'overdue':
              // Check if any allocation is overdue (you can add more logic here)
              return student.paymentStatus.status === 'pending' || student.paymentStatus.status === 'partial';
            default:
              return true;
          }
        });

        if (filteredStudents.length < studentsWithStatus.length) {
          showSuccess(
            `Filtered to ${filteredStudents.length} student${filteredStudents.length !== 1 ? 's' : ''} with ${filterStatus} status`
          );
        }
      }

      setSearchResults(filteredStudents);
    } catch (error) {
      console.error('Error fetching payment status:', error);
    } finally {
      setLoadingStatus(false);
    }
  };

  // Select student and fetch their fee allocations
  const handleSelectStudent = async (student: Student) => {
    setSelectedStudent(student);
    setSearchResults([]);
    setSearchQuery('');
    setSelectedAllocation(null);

    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/fee-management/allocations/student/${student.id}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      const allocations = response.data.data.allocations || [];
      const summary = response.data.data.summary || {
        totalAllocated: 0,
        totalPaid: 0,
        totalBalance: 0,
        totalDiscount: 0,
      };

      // Separate pending and paid allocations
      const pending = allocations.filter((a: FeeAllocation) => a.balance > 0);
      const paid = allocations.filter((a: FeeAllocation) => a.balance <= 0);

      setFeeAllocations(allocations);
      setPendingAllocations(pending);
      setPaidAllocations(paid);
      setFeeSummary(summary);

      if (pending.length === 0 && paid.length > 0) {
        showSuccess('All fees paid! Showing payment history below.');
      }
    } catch (error) {
      console.error('Error fetching fee allocations:', error);
      showError('Error fetching student fee details');
    } finally {
      setLoading(false);
    }
  };

  // Select fee allocation
  const handleSelectAllocation = (allocation: FeeAllocation) => {
    if (allocation.balance <= 0) {
      showError('This fee has already been fully paid!');
      return;
    }
    setSelectedAllocation(allocation);
    setIsFlexibleCollection(false);
    setShowCustomFees(false);
    setCustomFees([]);
    setPaymentData({
      ...paymentData,
      amount: allocation.balance.toString(),
    });
  };

  // Toggle custom fee mode
  const handleToggleCustomFees = () => {
    if (!showCustomFees) {
      setSelectedAllocation(null);
      setIsFlexibleCollection(true);
      if (customFees.length === 0) {
        setCustomFees([{ categoryId: 0, categoryName: '', amount: 0 }]);
      }
    } else {
      setIsFlexibleCollection(false);
      setCustomFees([]);
    }
    setShowCustomFees(!showCustomFees);
  };

  // Add custom fee item
  const handleAddCustomFee = () => {
    setCustomFees([...customFees, { categoryId: 0, categoryName: '', amount: 0 }]);
  };

  // Update custom fee item
  const handleUpdateCustomFee = (index: number, field: string, value: any) => {
    const updated = [...customFees];
    if (field === 'categoryId') {
      const categoryId = parseInt(value);
      const category = categories.find((c) => c.id === categoryId);
      updated[index].categoryId = categoryId;
      updated[index].categoryName = category?.name || '';
    } else if (field === 'amount') {
      updated[index].amount = parseFloat(value) || 0;
    }
    setCustomFees(updated);
  };

  // Remove custom fee item
  const handleRemoveCustomFee = (index: number) => {
    setCustomFees(customFees.filter((_, i) => i !== index));
    if (customFees.length === 1) {
      setShowCustomFees(false);
      setIsFlexibleCollection(false);
    }
  };

  // Collect payment
  const handleCollectPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate based on collection type
    if (!isFlexibleCollection && !selectedAllocation) {
      showError('Please select a fee allocation or add custom fees');
      return;
    }

    if (isFlexibleCollection && customFees.length === 0) {
      showError('Please add at least one custom fee item');
      return;
    }

    if (isFlexibleCollection) {
      // Validate custom fees
      const invalidFees = customFees.filter(f => !f.categoryId || f.amount <= 0);
      if (invalidFees.length > 0) {
        showError('Please select category and enter valid amount for all fee items');
        return;
      }
      await handleFlexibleCollection();
      return;
    }

    if (!selectedAllocation) {
      showError('Please select a fee allocation');
      return;
    }

    if (!selectedStudent) {
      showError('Please select a student');
      return;
    }

    const amount = parseFloat(paymentData.amount);
    if (isNaN(amount) || amount <= 0) {
      showError('Please enter a valid payment amount');
      return;
    }

    if (amount > selectedAllocation.balance) {
      showError(`Payment amount cannot exceed balance of ${selectedAllocation.balance}`);
      return;
    }

    try {
      setProcessing(true);

      const transactionData = {
        feeAllocationId: selectedAllocation.id,
        amount,
        paymentMethod: paymentData.paymentMethod,
        paymentDate: paymentData.paymentDate,
        bankName: paymentData.paymentMethod !== 'cash' ? paymentData.bankName : undefined,
        bankAccountNumber:
          paymentData.paymentMethod !== 'cash' ? paymentData.bankAccountNumber : undefined,
        referenceNumber:
          paymentData.paymentMethod !== 'cash' ? paymentData.referenceNumber : undefined,
        remarks: paymentData.remarks,
      };

      const response = await axios.post(
        `${API_BASE_URL}/fee-management/transactions/collect`,
        transactionData,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      const transaction = response.data.data.transaction;
      const updatedAllocation = response.data.data.allocation;

      // Prepare receipt data
      const receipt = {
        receiptNumber: transaction.receiptNumber,
        date: paymentData.paymentDate,
        student: {
          fullName: selectedStudent.fullName,
          class: selectedStudent.class,
          section: selectedStudent.section,
          rollNumber: selectedStudent.rollNumber,
          emisId: selectedStudent.emisId || '',
        },
        feeItems: [{
          categoryName: selectedAllocation.feeStructure.name,
          amount: amount,
        }],
        totalAmount: amount,
        paidAmount: amount,
        dueAmount: 0,
        scholar: 0,
        penal: 0,
        tax: 0,
        paymentMethod: paymentData.paymentMethod,
        bankName: paymentData.paymentMethod !== 'cash' ? paymentData.bankName : undefined,
        referenceNumber: paymentData.paymentMethod !== 'cash' ? paymentData.referenceNumber : undefined,
        collectedBy: transaction.collectedByName || 'Admin',
        remarks: paymentData.remarks || undefined,
      };

      setReceiptData(receipt);
      setShowReceiptModal(true);

      showSuccess(
        `Payment collected successfully! Receipt No: ${transaction.receiptNumber}`
      );

      // Update the allocation in all lists
      setFeeAllocations(
        feeAllocations.map((a) =>
          a.id === updatedAllocation.id ? { ...a, ...updatedAllocation } : a
        )
      );

      // Update selected allocation
      setSelectedAllocation({ ...selectedAllocation, ...updatedAllocation });

      // Reset payment form
      setPaymentData({
        ...paymentData,
        amount: updatedAllocation.balance.toString(),
        remarks: '',
      });

      // If fully paid, move to paid allocations list
      if (updatedAllocation.balance <= 0) {
        setPendingAllocations(pendingAllocations.filter((a) => a.id !== updatedAllocation.id));
        setPaidAllocations([...paidAllocations, { ...selectedAllocation, ...updatedAllocation }]);
        setSelectedAllocation(null);

        // Update summary
        setFeeSummary(prev => ({
          ...prev,
          totalPaid: prev.totalPaid + amount,
          totalBalance: prev.totalBalance - amount,
        }));
      } else {
        // Update pending allocation
        setPendingAllocations(
          pendingAllocations.map((a) =>
            a.id === updatedAllocation.id ? { ...a, ...updatedAllocation } : a
          )
        );

        // Update summary for partial payment
        setFeeSummary(prev => ({
          ...prev,
          totalPaid: prev.totalPaid + amount,
          totalBalance: prev.totalBalance - amount,
        }));
      }
    } catch (error: any) {
      console.error('Error collecting payment:', error);
      showError(error.response?.data?.message || 'Error collecting payment');
    } finally {
      setProcessing(false);
    }
  };

  // Handle flexible collection (custom fees)
  const handleFlexibleCollection = async () => {
    if (!selectedStudent) return;

    const totalAmount = customFees.reduce((sum, f) => sum + f.amount, 0);
    const paidAmount = parseFloat(paymentData.amount);

    if (isNaN(paidAmount) || paidAmount <= 0) {
      showError('Please enter a valid payment amount');
      return;
    }

    if (paidAmount > totalAmount) {
      showError(`Payment amount cannot exceed total fee amount (NPR ${totalAmount})`);
      return;
    }

    try {
      setProcessing(true);

      const payloadData = {
        studentId: selectedStudent.id,
        emisId: selectedStudent.emisId,
        feeItems: customFees.map((f) => ({
          feeCategoryId: f.categoryId,
          amount: f.amount,
        })),
        totalAmount,
        paidAmount,
        dueAmount: totalAmount - paidAmount,
        paymentMethod: paymentData.paymentMethod,
        paymentDate: paymentData.paymentDate,
        bankName: paymentData.paymentMethod !== 'cash' ? paymentData.bankName : undefined,
        bankAccountNumber: paymentData.paymentMethod !== 'cash' ? paymentData.bankAccountNumber : undefined,
        referenceNumber: paymentData.paymentMethod !== 'cash' ? paymentData.referenceNumber : undefined,
        remarks: paymentData.remarks,
      };

      const response = await axios.post(
        `${API_BASE_URL}/fee-management/transactions/collect-flexible`,
        payloadData,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      // Prepare receipt data
      const receipt = {
        receiptNumber: response.data.data.receiptNumber,
        date: paymentData.paymentDate,
        student: {
          fullName: selectedStudent.fullName,
          class: selectedStudent.class,
          section: selectedStudent.section,
          rollNumber: selectedStudent.rollNumber,
          emisId: selectedStudent.emisId || '',
        },
        feeItems: customFees.map(f => ({
          categoryName: f.categoryName,
          amount: f.amount,
        })),
        totalAmount,
        paidAmount,
        dueAmount: totalAmount - paidAmount,
        scholar: 0,
        penal: 0,
        tax: 0,
        paymentMethod: paymentData.paymentMethod,
        bankName: paymentData.paymentMethod !== 'cash' ? paymentData.bankName : undefined,
        referenceNumber: paymentData.paymentMethod !== 'cash' ? paymentData.referenceNumber : undefined,
        collectedBy: response.data.data.collectedByName || 'Admin',
        remarks: paymentData.remarks || undefined,
      };

      setReceiptData(receipt);
      setShowReceiptModal(true);

      showSuccess(
        `Custom fee collected successfully! Receipt No: ${response.data.data.receiptNumber}`
      );

      // Reset custom fees
      setCustomFees([]);
      setShowCustomFees(false);
      setIsFlexibleCollection(false);
      setPaymentData({
        amount: '',
        paymentMethod: 'cash',
        paymentDate: new Date().toISOString().split('T')[0],
        bankName: '',
        bankAccountNumber: '',
        referenceNumber: '',
        remarks: '',
      });
    } catch (error: any) {
      console.error('Error collecting custom fee:', error);
      showError(error.response?.data?.message || 'Error collecting custom fee');
    } finally {
      setProcessing(false);
    }
  };

  // Clear selection
  const handleClearSelection = () => {
    setSelectedStudent(null);
    setFeeAllocations([]);
    setPendingAllocations([]);
    setPaidAllocations([]);
    setSelectedAllocation(null);
    setSearchQuery('');
    setShowCustomFees(false);
    setCustomFees([]);
    setIsFlexibleCollection(false);
    setFeeSummary({
      totalAllocated: 0,
      totalPaid: 0,
      totalBalance: 0,
      totalDiscount: 0,
    });
  };

  const getStatusBadge = (status: string) => {
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

  // Filter allocations based on criteria
  const getFilteredAllocations = () => {
    let filtered = pendingAllocations;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(a => a.status === filterStatus);
    }

    // Filter by date range
    if (filterStartDate) {
      filtered = filtered.filter(a => new Date(a.dueDate) >= new Date(filterStartDate));
    }
    if (filterEndDate) {
      filtered = filtered.filter(a => new Date(a.dueDate) <= new Date(filterEndDate));
    }

    return filtered;
  };

  // Export to CSV
  const handleExport = () => {
    try {
      const filtered = getFilteredAllocations();

      if (filtered.length === 0) {
        showError('No data to export');
        return;
      }

      // Create CSV content
      const headers = ['Student Name', 'Class', 'Roll No', 'IEMIS ID', 'Fee Structure', 'Purpose', 'Total Amount', 'Paid Amount', 'Balance', 'Status', 'Due Date'];
      const rows = filtered.map(allocation => [
        selectedStudent?.fullName || '',
        selectedStudent ? `${selectedStudent.class}-${selectedStudent.section}` : '',
        selectedStudent?.rollNumber || '',
        selectedStudent?.emisId || '',
        allocation.feeStructure.name,
        allocation.purpose || 'tuition',
        allocation.totalAmount.toFixed(2),
        allocation.paidAmount.toFixed(2),
        allocation.balance.toFixed(2),
        allocation.status,
        new Date(allocation.dueDate).toLocaleDateString()
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `fee-collection-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showSuccess('Data exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      showError('Error exporting data');
    }
  };

  // Generate Report
  const handleGenerateReport = () => {
    try {
      const filtered = getFilteredAllocations();

      if (filtered.length === 0) {
        showError('No data for report');
        return;
      }

      // Calculate report data
      const reportData = {
        totalAllocations: filtered.length,
        totalAmount: filtered.reduce((sum, a) => sum + a.totalAmount, 0),
        totalPaid: filtered.reduce((sum, a) => sum + a.paidAmount, 0),
        totalBalance: filtered.reduce((sum, a) => sum + a.balance, 0),
        byStatus: {
          paid: filtered.filter(a => a.status === 'paid').length,
          partial: filtered.filter(a => a.status === 'partial').length,
          pending: filtered.filter(a => a.status === 'pending').length,
          overdue: filtered.filter(a => a.status === 'overdue').length,
        }
      };

      // Show report in alert
      showSuccess(
        `📊 Fee Collection Report\\n\\n` +
        `Total Allocations: ${reportData.totalAllocations}\\n` +
        `Total Amount: NPR ${reportData.totalAmount.toFixed(2)}\\n` +
        `Total Paid: NPR ${reportData.totalPaid.toFixed(2)}\\n` +
        `Total Balance: NPR ${reportData.totalBalance.toFixed(2)}\\n\\n` +
        `Status Breakdown:\\n` +
        `Paid: ${reportData.byStatus.paid}\\n` +
        `Partial: ${reportData.byStatus.partial}\\n` +
        `Pending: ${reportData.byStatus.pending}\\n` +
        `Overdue: ${reportData.byStatus.overdue}`
      );
    } catch (error) {
      console.error('Report error:', error);
      showError('Error generating report');
    }
  };

  const filteredAllocations = getFilteredAllocations();

  return (
    <div className="space-y-6">
      {/* Modern Header with Integrated Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Title Bar */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-7 h-7 text-blue-600" />
                Fee Collection
              </h2>
              <p className="text-sm text-gray-600 mt-1">Modern payment collection with advanced filters</p>
            </div>
            {selectedStudent && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleGenerateReport}
                  icon={<FileText className="w-4 h-4" />}
                >
                  Report
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleExport}
                  icon={<Download className="w-4 h-4" />}
                >
                  Export
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Integrated Filter Bar */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-3">
            {/* Search - Optional */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search by name, IEMIS ID, or roll number (optional)..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">💡 Search by student details OR use filters below</p>
            </div>

            {/* Class Filter */}
            <div>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Classes</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={`${i + 1}`}>Class {i + 1}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            {/* Date Range Toggle */}
            <div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Date Range
                {(filterStartDate || filterEndDate) && (
                  <span className="text-xs bg-blue-500 text-white px-1.5 rounded-full">●</span>
                )}
              </button>
            </div>

            {/* Search Button */}
            <div>
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="w-full relative text-sm"
                icon={loading ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4 text-sm" />}
              >
                {loading ? 'Searching...' : 'Search'}
                {!loading && (searchQuery.trim() || filterClass !== 'all' || filterStatus !== 'all') && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-sm rounded-full flex items-center justify-center font-bold">
                    {[searchQuery.trim(), filterClass !== 'all', filterStatus !== 'all'].filter(Boolean).length}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Expandable Date Range Filters */}
          {showFilters && (
            <div className="mt-3 p-4 bg-white border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setFilterStartDate('');
                    setFilterEndDate('');
                  }}
                >
                  Clear Dates
                </Button>
              </div>
            </div>
          )}

          {/* Active Filters Indicator */}
          {(searchQuery.trim() || filterClass !== 'all' || filterStatus !== 'all' || filterStartDate || filterEndDate) && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-blue-900">Active Filters:</span>
                  {searchQuery.trim() && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      Student: "{searchQuery}"
                    </span>
                  )}
                  {filterClass !== 'all' && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      Class {filterClass}
                    </span>
                  )}
                  {filterStatus !== 'all' && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      Status: {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                    </span>
                  )}
                  {(filterStartDate || filterEndDate) && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      Date: {filterStartDate || '...'} to {filterEndDate || '...'}
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterClass('all');
                    setFilterStatus('all');
                    setFilterStartDate('');
                    setFilterEndDate('');
                    setSearchResults([]);
                  }}
                  icon={<X className="w-3 h-3" />}
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats Bar (when student is selected) */}
        {selectedStudent && feeAllocations.length > 0 && (
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total Allocated</p>
                  <p className="text-lg font-bold text-gray-900">NPR {feeSummary.totalAllocated.toFixed(0)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total Paid</p>
                  <p className="text-lg font-bold text-green-700">NPR {feeSummary.totalPaid.toFixed(0)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Balance Due</p>
                  <p className="text-lg font-bold text-red-700">NPR {feeSummary.totalBalance.toFixed(0)}</p>
                </div>
              </div>
              {feeSummary.totalDiscount > 0 && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Total Discount</p>
                    <p className="text-lg font-bold text-purple-700">NPR {feeSummary.totalDiscount.toFixed(0)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modern Search Results Dropdown */}
      {searchResults.length > 0 && !selectedStudent && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-blue-900">
                {searchResults.length} student{searchResults.length > 1 ? 's' : ''} found
              </p>
              <div className="flex items-center gap-2">
                {searchQuery.trim() && (
                  <span className="text-xs px-2 py-1 bg-white text-blue-700 rounded border border-blue-200">
                    Searched: "{searchQuery}"
                  </span>
                )}
                {filterClass !== 'all' && (
                  <span className="text-xs px-2 py-1 bg-white text-blue-700 rounded border border-blue-200">
                    Class {filterClass}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {loadingStatus && searchResults.length > 0 && (
              <div className="px-6 py-3 bg-yellow-50 border-b border-yellow-100 flex items-center gap-2">
                <Loader className="w-4 h-4 text-yellow-600 animate-spin" />
                <span className="text-xs text-yellow-800 font-medium">Loading payment status...</span>
              </div>
            )}
            {searchResults.map((student) => {
              // Payment status badge configuration
              const getStatusBadge = () => {
                if (!student.paymentStatus) {
                  return {
                    label: 'Loading...',
                    className: 'bg-gray-100 text-gray-600 border-gray-300',
                  };
                }

                switch (student.paymentStatus.status) {
                  case 'paid':
                    return {
                      label: 'All Paid',
                      className: 'bg-green-100 text-green-700 border-green-300',
                      icon: <CheckCircle2 className="w-3 h-3" />,
                    };
                  case 'partial':
                    return {
                      label: 'Partial',
                      className: 'bg-yellow-100 text-yellow-700 border-yellow-300',
                      icon: <Clock className="w-3 h-3" />,
                    };
                  case 'pending':
                    return {
                      label: 'Pending',
                      className: 'bg-red-100 text-red-700 border-red-300',
                      icon: <AlertCircle className="w-3 h-3" />,
                    };
                  case 'none':
                  default:
                    return {
                      label: 'No Fees',
                      className: 'bg-gray-100 text-gray-600 border-gray-300',
                    };
                }
              };

              const statusBadge = getStatusBadge();

              return (
                <button
                  key={student.id}
                  onClick={() => handleSelectStudent(student)}
                  className="w-full px-6 py-4 hover:bg-blue-50 text-left transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                          {student.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {student.fullName}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap mt-1">
                            {student.emisId && (
                              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">
                                IEMIS: {student.emisId}
                              </span>
                            )}
                            <span className="text-xs text-gray-600">
                              Roll: {student.rollNumber}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                              Class {student.class}-{student.section}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Status Section */}
                      {student.paymentStatus && student.paymentStatus.status !== 'none' && (
                        <div className="ml-13 mt-2 flex items-center gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">Total:</span>
                            <span className="font-semibold text-gray-900">
                              NPR {student.paymentStatus.totalAllocated.toFixed(0)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">Paid:</span>
                            <span className="font-semibold text-green-700">
                              NPR {student.paymentStatus.totalPaid.toFixed(0)}
                            </span>
                          </div>
                          {student.paymentStatus.totalBalance > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">Balance:</span>
                              <span className="font-semibold text-red-700">
                                NPR {student.paymentStatus.totalBalance.toFixed(0)}
                              </span>
                            </div>
                          )}
                          {student.paymentStatus.pendingCount > 0 && (
                            <span className="text-gray-600">
                              • {student.paymentStatus.pendingCount} pending fee{student.paymentStatus.pendingCount > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="text-right ml-4">
                      {/* Payment Status Badge */}
                      <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-semibold mb-2 ${statusBadge.className}`}>
                        {statusBadge.icon}
                        {statusBadge.label}
                      </div>
                      <p className="text-sm text-gray-600">{student.phone}</p>
                      {student.email && (
                        <p className="text-xs text-gray-500 mt-0.5">{student.email}</p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Welcome Message - No Student Selected */}
      {!selectedStudent && searchResults.length === 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm p-12 border border-blue-100 text-center">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg">
              <Search className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Collect Fees</h3>
            <p className="text-gray-600 mb-6 max-w-2xl">
              Flexible search options: Enter student details (IEMIS ID, name, or roll number) <strong>OR</strong> select class/status filters above.
              You can also combine both for refined results. Date filters are always optional.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mb-6">
              <div className="bg-white p-4 rounded-lg border border-blue-200 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">By Student Details</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Search directly by name, IEMIS ID, or roll number - no filters needed
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-blue-200 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <Filter className="w-4 h-4 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">By Class/Status</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Select class or status filters without entering student details
                </p>
              </div>
            </div>
            <div className="flex gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="font-bold text-blue-600">1</span>
                </div>
                <span>Search student</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="font-bold text-blue-600">2</span>
                </div>
                <span>Select fees</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="font-bold text-blue-600">3</span>
                </div>
                <span>Collect payment</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Student Details - Modern Card */}
      {selectedStudent && (
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-sm p-6 border-2 border-blue-100">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                {selectedStudent.fullName.charAt(0).toUpperCase()}
              </div>
              Student Information
            </h3>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleClearSelection}
              icon={<X className="w-4 h-4" />}
            >
              Clear Selection
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Full Name</p>
              <p className="font-bold text-gray-900">{selectedStudent.fullName}</p>
            </div>
            {selectedStudent.emisId && (
              <div className="bg-white p-3 rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600 mb-1">IEMIS ID</p>
                <p className="font-bold text-blue-600">{selectedStudent.emisId}</p>
              </div>
            )}
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Roll Number</p>
              <p className="font-bold text-gray-900">{selectedStudent.rollNumber}</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Class & Section</p>
              <p className="font-bold text-gray-900">
                {selectedStudent.class}-{selectedStudent.section}
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Phone</p>
              <p className="font-bold text-gray-900">{selectedStudent.phone || 'N/A'}</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Email</p>
              <p className="font-bold text-gray-900 text-sm">{selectedStudent.email || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Fee Allocations - Use filtered data */}
      {selectedStudent && filteredAllocations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-blue-600" />
              Pending Fees ({filteredAllocations.length})
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                💡 Click on a fee to collect payment
              </span>
            </div>
          </div>
          <div className="space-y-3">
            {filteredAllocations.map((allocation) => {
              // Purpose badge color
              const purposeColors: Record<string, string> = {
                admission: 'bg-purple-100 text-purple-700 border-purple-300',
                tuition: 'bg-blue-100 text-blue-700 border-blue-300',
                examination: 'bg-orange-100 text-orange-700 border-orange-300',
                event: 'bg-pink-100 text-pink-700 border-pink-300',
                transport: 'bg-yellow-100 text-yellow-700 border-yellow-300',
                hostel: 'bg-indigo-100 text-indigo-700 border-indigo-300',
                library: 'bg-cyan-100 text-cyan-700 border-cyan-300',
                lab: 'bg-teal-100 text-teal-700 border-teal-300',
                sports: 'bg-green-100 text-green-700 border-green-300',
                other: 'bg-gray-100 text-gray-700 border-gray-300',
              };
              const purposeColor = purposeColors[allocation.purpose || 'tuition'] || purposeColors.other;

              return (
                <button
                  key={allocation.id}
                  onClick={() => handleSelectAllocation(allocation)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${selectedAllocation?.id === allocation.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                    }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {/* Purpose Badge */}
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${purposeColor}`}>
                          {(allocation.purpose || 'tuition').charAt(0).toUpperCase() + (allocation.purpose || 'tuition').slice(1)}
                        </span>
                        {/* Status Badge */}
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(allocation.status)}`}>
                          {allocation.status.toUpperCase()}
                        </span>
                        {allocation.allocationBatch && (
                          <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                            {allocation.allocationBatch}
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-gray-900 text-base">
                        {allocation.feeStructure.name}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {allocation.feeStructure.academicYear} • Due:{' '}
                        {new Date(allocation.dueDate).toLocaleDateString()}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {allocation.feeStructure.items.map((item, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-100 px-2 py-1 rounded"
                          >
                            {item.category.name}: NPR {item.amount}
                          </span>
                        ))}
                      </div>
                      {allocation.discount > 0 && (
                        <div className="mt-2 text-xs text-green-700 bg-green-50 px-2 py-1 rounded inline-block">
                          💰 Discount: NPR {allocation.discount}
                          {allocation.discountReason && ` (${allocation.discountReason})`}
                        </div>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm text-gray-600">Balance</p>
                      <p className="text-2xl font-bold text-red-600">
                        NPR {(Number(allocation.balance) || 0).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Paid: NPR {(Number(allocation.paidAmount) || 0).toFixed(2)} of NPR{' '}
                        {(Number(allocation.totalAmount) || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State for Filtered Results */}
      {selectedStudent && pendingAllocations.length > 0 && filteredAllocations.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No fees match your filters</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filter criteria to see more results
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                setFilterStatus('all');
                setFilterStartDate('');
                setFilterEndDate('');
              }}
            >
              Clear All Filters
            </Button>
          </div>
        </div>
      )}

      {/* Empty State - No Pending Fees */}
      {selectedStudent && pendingAllocations.length === 0 && paidAllocations.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No fees allocated</h3>
            <p className="text-gray-600 mb-4">
              This student doesn't have any pending fee allocations yet
            </p>
          </div>
        </div>
      )}

      {/* Custom Fees (Miscellaneous) */}
      {selectedStudent && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Custom Fees (For Miscellaneous Items)
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Add custom fees when collecting payments not in the regular fee structure
              </p>
            </div>
            <Button
              size="sm"
              variant={showCustomFees ? "secondary" : "primary"}
              onClick={handleToggleCustomFees}
            >
              {showCustomFees ? 'Cancel Custom Fees' : 'Add Custom Fee'}
            </Button>
          </div>

          {showCustomFees && (
            <div className="space-y-4 mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2 p-3 bg-amber-100 border border-amber-300 rounded">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold">⚠️ Warning: Custom Fee Collection</p>
                  <p className="mt-1">
                    This will NOT update the student's allocated fee balance. Use this only for:
                  </p>
                  <ul className="list-disc list-inside mt-1 ml-2">
                    <li>One-time miscellaneous fees</li>
                    <li>Fees not in your fee structure</li>
                    <li>Special/emergency collections</li>
                  </ul>
                  <p className="mt-1 font-semibold">
                    For regular allocated fees, select from "Pending Fees" above instead!
                  </p>
                </div>
              </div>

              {/* Custom Fee Items */}
              <div className="space-y-3">
                {customFees.map((fee, index) => (
                  <div key={index} className="flex gap-3 items-start p-3 bg-white border border-gray-300 rounded">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <Select
                        label={`Fee Category ${index + 1} *`}
                        value={fee.categoryId.toString()}
                        onChange={(e) => handleUpdateCustomFee(index, 'categoryId', e.target.value)}
                        options={[
                          { value: '0', label: 'Select Category' },
                          ...categories.map((c) => ({
                            value: c.id.toString(),
                            label: c.name,
                          })),
                        ]}
                        required
                      />
                      <FormInput
                        label="Amount (NPR) *"
                        type="number"
                        step="0.01"
                        value={fee.amount.toString()}
                        onChange={(e) => handleUpdateCustomFee(index, 'amount', e.target.value)}
                        placeholder="Enter amount"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomFee(index)}
                      className="mt-7 p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <Button
                size="sm"
                variant="secondary"
                onClick={handleAddCustomFee}
                icon={<Plus className="w-4 h-4" />}
              >
                Add Another Category
              </Button>

              <div className="pt-3 border-t border-amber-300">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-gray-700">Total Custom Fees:</span>
                  <span className="text-lg font-bold text-amber-900">
                    NPR {customFees.reduce((sum, f) => sum + f.amount, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Paid Fees History */}
      {selectedStudent && paidAllocations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-green-600" />
            Fully Paid Fees ({paidAllocations.length})
          </h3>
          <div className="space-y-3">
            {paidAllocations.map((allocation) => (
              <div
                key={allocation.id}
                className="p-4 border-2 border-green-200 bg-green-50 rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">
                        {allocation.feeStructure.name}
                      </p>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                        ✓ FULLY PAID
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {allocation.feeStructure.academicYear}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {allocation.feeStructure.items.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-white px-2 py-1 rounded border border-green-200"
                        >
                          ✓ {item.category.name}: NPR {item.amount}
                        </span>
                      ))}
                    </div>

                    {/* Payment History for this allocation */}
                    {allocation.transactions && allocation.transactions.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-green-200">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Payment History:</p>
                        <div className="space-y-1">
                          {allocation.transactions.map((txn, idx) => (
                            <div key={idx} className="text-xs text-gray-600 flex justify-between">
                              <span>
                                {new Date(txn.paymentDate).toLocaleDateString()} -
                                {txn.paymentMethod.toUpperCase()} -
                                Receipt: {txn.receiptNumber}
                              </span>
                              <span className="font-semibold text-green-700">
                                NPR {parseFloat(txn.amount.toString()).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm text-green-600 font-medium">Total Paid</p>
                    <p className="text-2xl font-bold text-green-700">
                      NPR {(Number(allocation.paidAmount) || 0).toFixed(2)}
                    </p>
                    {allocation.discount > 0 && (
                      <p className="text-xs text-purple-600 mt-1">
                        Discount: NPR {(Number(allocation.discount) || 0).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Form */}
      {(selectedAllocation || showCustomFees) && (
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

          <form onSubmit={handleCollectPayment} className="space-y-4">
            {/* Payment Info Alert */}
            {isFlexibleCollection && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  <strong>Total Custom Fees:</strong> NPR {customFees.reduce((sum, f) => sum + f.amount, 0).toFixed(2)}
                  <br />
                  You can collect full or partial payment for these custom fees.
                </p>
              </div>
            )}
            {selectedAllocation && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  <strong>Fee:</strong> {selectedAllocation.feeStructure.name}
                  <br />
                  <strong>Balance Due:</strong> NPR {(Number(selectedAllocation.balance) || 0).toFixed(2)}
                  <br />
                  Enter full or partial payment amount below.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormInput
                  label="Payment Amount *"
                  type="number"
                  step="0.01"
                  value={paymentData.amount}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, amount: e.target.value })
                  }
                  placeholder="Enter amount"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {isFlexibleCollection
                    ? `Maximum: NPR ${customFees.reduce((sum, f) => sum + f.amount, 0).toFixed(2)}`
                    : selectedAllocation
                      ? `Maximum: NPR ${(Number(selectedAllocation.balance) || 0).toFixed(2)}`
                      : ''}
                </p>
              </div>

              <Select
                label="Payment Method *"
                value={paymentData.paymentMethod}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, paymentMethod: e.target.value })
                }
                options={[
                  { value: 'cash', label: 'Cash' },
                  { value: 'bank_transfer', label: 'Bank Transfer' },
                  { value: 'cheque', label: 'Cheque' },
                  { value: 'online', label: 'Online Payment' },
                  { value: 'card', label: 'Card' },
                ]}
                required
              />

              <FormInput
                label="Payment Date *"
                type="date"
                value={paymentData.paymentDate}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, paymentDate: e.target.value })
                }
                required
              />

              {paymentData.paymentMethod !== 'cash' && (
                <>
                  <FormInput
                    label="Bank Name"
                    value={paymentData.bankName}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, bankName: e.target.value })
                    }
                    placeholder="Enter bank name"
                  />

                  <FormInput
                    label="Account/Cheque Number"
                    value={paymentData.bankAccountNumber}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        bankAccountNumber: e.target.value,
                      })
                    }
                    placeholder="Enter account or cheque number"
                  />

                  <FormInput
                    label="Reference Number"
                    value={paymentData.referenceNumber}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        referenceNumber: e.target.value,
                      })
                    }
                    placeholder="Enter transaction reference"
                  />
                </>
              )}

              <div className="md:col-span-2">
                <FormInput
                  label="Remarks"
                  value={paymentData.remarks}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, remarks: e.target.value })
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
                  setSelectedAllocation(null);
                  setShowCustomFees(false);
                  setCustomFees([]);
                  setIsFlexibleCollection(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={processing} icon={<Receipt className="w-5 h-5" />}>
                {processing ? 'Processing...' : 'Collect Payment'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Empty State */}
      {selectedStudent && pendingAllocations.length === 0 && paidAllocations.length === 0 && !loading && (
        <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
          <AlertCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Fee Allocations</h3>
          <p className="text-gray-600">No fees have been allocated to this student yet</p>
        </div>
      )}

      {selectedStudent && pendingAllocations.length === 0 && paidAllocations.length > 0 && !loading && (
        <div className="bg-green-50 border border-green-200 rounded-xl shadow-sm p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Receipt className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-green-900 mb-2">All Fees Cleared! 🎉</h3>
          <p className="text-green-700">This student has no pending fee payments. See payment history above.</p>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && receiptData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 no-print">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center no-print">
              <h3 className="text-lg font-semibold">Fee Receipt</h3>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    // Set dynamic filename
                    const originalTitle = document.title;
                    const studentIEMIS = receiptData?.student?.emisId || 'STUDENT';
                    const receiptNo = receiptData?.receiptNumber || 'RECEIPT';
                    document.title = `Receipt_${studentIEMIS}_${receiptNo}`;

                    // Print
                    window.print();

                    // Restore original title after print dialog
                    setTimeout(() => {
                      document.title = originalTitle;
                    }, 1000);
                  }}
                  icon={<Printer className="w-5 h-5" />}
                  variant="primary"
                >
                  Print Receipt
                </Button>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div ref={receiptRef} className="p-6">
              <FeeReceipt schoolProfile={schoolProfile} receiptData={receiptData} />
            </div>
          </div>
        </div>
      )}

      {/* Global Print Styles */}
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
