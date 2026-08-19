import React, { useState, useEffect, useRef } from 'react';
import { Printer, Search, Filter, Receipt, X } from 'lucide-react';
import Button from '../../components/shared/Button';
import DataTable from '../../components/shared/DataTable';
import Badge from '../../components/shared/Badge';
import FormInput from '../../components/shared/FormInput';
import Select from '../../components/shared/Select';
import FeeReceipt from '../../components/admin/FeeReceipt';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';
import { showError } from '../../utils/sweetAlert';
import { schoolProfileService } from '../../api';
import type { SchoolProfile } from '../../api/types';

interface FeeTransaction {
  id: number;
  receiptNumber: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  status: string;
  bankName?: string;
  referenceNumber?: string;
  remarks?: string;
  feeAllocationId?: number | null;
  feeAllocation?: {
    student: {
      fullName: string;
      rollNumber: string;
      currentClass: string;
      section: string;
      emisId?: string;
    };
    feeStructure: {
      name: string;
      academicYear: string;
    };
  } | null;
  student?: {
    fullName: string;
    rollNumber: string;
    currentClass: string;
    section: string;
    emisId?: string;
  };
  collector?: {
    fullName: string;
  };
  collectedByName?: string;
}

const FeeTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<FeeTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    totalTransactions: 0,
    totalAmount: 0,
    byPaymentMethod: {} as Record<string, { count: number; amount: number }>,
  });
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Filters
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    paymentMethod: '',
    status: '',
  });

  const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

  useEffect(() => {
    fetchTransactions();
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

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.paymentMethod) params.append('paymentMethod', filters.paymentMethod);
      if (filters.status) params.append('status', filters.status);

      const response = await axios.get(
        `${API_BASE_URL}/fee-management/transactions?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      const data = response.data.data;
      setTransactions(data.transactions || []);
      if (data.summary) {
        setSummary(data.summary);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      showError('Error fetching fee transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    fetchTransactions();
  };

  const handleClearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      paymentMethod: '',
      status: '',
    });
    setTimeout(() => fetchTransactions(), 100);
  };

  const handlePrintReceipt = async (transaction: FeeTransaction) => {
    try {
      // Get student info from transaction
      const student = transaction.feeAllocation?.student || transaction.student;
      if (!student) {
        showError('Student information not available');
        return;
      }

      // Prepare receipt data with proper null handling
      const receipt = {
        receiptNumber: transaction.receiptNumber,
        date: transaction.paymentDate,
        student: {
          fullName: student.fullName,
          currentClass: student.currentClass,
          section: student.section,
          rollNumber: student.rollNumber,
          emisId: student.emisId || '',
        },
        feeItems: transaction.feeAllocation?.feeStructure ? [
          {
            categoryName: transaction.feeAllocation.feeStructure.name,
            amount: parseFloat(transaction.amount.toString()),
          }
        ] : [
          {
            categoryName: 'Fee Payment',
            amount: parseFloat(transaction.amount.toString()),
          }
        ],
        totalAmount: parseFloat(transaction.amount.toString()),
        paidAmount: parseFloat(transaction.amount.toString()),
        dueAmount: 0,
        scholar: 0,
        penal: 0,
        tax: 0,
        paymentMethod: transaction.paymentMethod || 'cash',
        bankName: transaction.bankName || undefined,
        referenceNumber: transaction.referenceNumber || undefined,
        collectedBy: transaction.collectedByName || transaction.collector?.fullName || 'Admin',
        remarks: transaction.remarks || undefined,
      };

      console.log('Receipt Data:', receipt);
      console.log('School Profile:', schoolProfile);

      setReceiptData(receipt);
      setShowReceiptModal(true);
    } catch (error) {
      console.error('Error preparing receipt:', error);
      showError('Error preparing receipt');
    }
  };

  const columns = [
    {
      key: 'receiptNumber',
      label: 'Receipt No.',
      render: (value: string) => (
        <span className="font-mono font-semibold text-blue-600">{value}</span>
      ),
    },
    {
      key: 'paymentDate',
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'student',
      label: 'Student',
      render: (_value: any, row: FeeTransaction) => {
        const student = row.feeAllocation?.student || row.student;
        return student ? (
          <div>
            <p className="font-semibold">{student.fullName}</p>
            <p className="text-xs text-gray-500">
              {student.rollNumber} | Class {student.currentClass}-{student.section}
            </p>
          </div>
        ) : (
          <span className="text-gray-400">N/A</span>
        );
      },
    },
    {
      key: 'feeAllocation',
      label: 'Fee Type',
      render: (_value: any, row: FeeTransaction) => {
        // Check if this is a flexible collection (no feeAllocationId)
        if (!row.feeAllocationId) {
          return (
            <Badge variant="info">Flexible Collection</Badge>
          );
        }
        // Regular fee collection with fee structure
        if (row.feeAllocation?.feeStructure) {
          return (
            <div>
              <p className="text-sm">{row.feeAllocation.feeStructure.name}</p>
              <p className="text-xs text-gray-500">{row.feeAllocation.feeStructure.academicYear}</p>
            </div>
          );
        }
        // Regular collection but fee structure not loaded
        return (
          <Badge variant="success">Regular Collection</Badge>
        );
      },
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value: number) => (
        <span className="font-semibold text-green-600">NPR {(Number(value) || 0).toFixed(2)}</span>
      ),
    },
    {
      key: 'paymentMethod',
      label: 'Payment Method',
      render: (value: string) => (
        <Badge variant="info">{value.replace('_', ' ').toUpperCase()}</Badge>
      ),
    },
    {
      key: 'collectedByName',
      label: 'Collected By',
      render: (value: string, row: FeeTransaction) =>
        value || row.collector?.fullName || 'N/A',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge
          variant={
            value === 'confirmed' ? 'success' : value === 'cancelled' ? 'danger' : 'warning'
          }
        >
          {value.toUpperCase()}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Fee Transactions</h2>
        <p className="text-gray-600">View and manage all fee payment transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-2 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-xl font-bold text-gray-900">{summary.totalTransactions}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Receipt className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-2 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Collection</p>
              <p className="text-xl font-bold text-green-600">
                NPR {(Number(summary.totalAmount) || 0).toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <span className="text-2xl font-bold text-green-600">रु</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-2 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Payment Methods</p>
              <div className="mt-2 space-y-1">
                {Object.entries(summary.byPaymentMethod).map(([method, data]) => (
                  <p key={method} className="text-xs text-gray-600">
                    {method}: {data.count} (NPR {(Number(data.amount) || 0).toFixed(2)})
                  </p>
                ))}
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Filter className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-2 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormInput
            className="text-sm"
            label="Start Date"
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />

          <FormInput
            className="text-sm"
            label="End Date"
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />

          <Select
            className="text-sm"
            label="Payment Method"
            value={filters.paymentMethod}
            onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
            options={[
              { value: '', label: 'All Methods' },
              { value: 'cash', label: 'Cash' },
              { value: 'bank_transfer', label: 'Bank Transfer' },
              { value: 'cheque', label: 'Cheque' },
              { value: 'online', label: 'Online' },
              { value: 'card', label: 'Card' },
            ]}
          />

          <Select
            className="text-sm"
            label="Status"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            options={[
              { value: '', label: 'All Status' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'pending', label: 'Pending' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
          />
        </div>

        <div className="flex gap-3 mt-3">
          <Button className=' text-sm' onClick={handleApplyFilters} disabled={loading}>
            <Search className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
          <Button className=' text-sm' variant="secondary" onClick={handleClearFilters}>
            Clear
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <DataTable
          data={transactions}
          columns={columns}
          loading={loading}
          searchPlaceholder="Search by receipt number, student name..."
          actions={(transaction: FeeTransaction) => (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handlePrintReceipt(transaction)}
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </Button>
          )}
        />
      </div>

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

export default FeeTransactions;