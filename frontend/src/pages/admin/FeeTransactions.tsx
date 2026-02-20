import React, { useState, useEffect } from 'react';
import { Download, Search, Calendar, DollarSign, Filter, Receipt } from 'lucide-react';
import Button from '../../components/shared/Button';
import DataTable from '../../components/shared/DataTable';
import Badge from '../../components/shared/Badge';
import FormInput from '../../components/shared/FormInput';
import Select from '../../components/shared/Select';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';
import { showError, showSuccess } from '../../utils/sweetAlert';

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
  feeAllocation: {
    student: {
      fullName: string;
      rollNumber: string;
      class: string;
      section: string;
    };
    feeStructure: {
      name: string;
      academicYear: string;
    };
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
  }, []);

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

  const handleDownloadReceipt = async (transaction: FeeTransaction) => {
    try {
      // This would generate a PDF receipt
      // For now, show success message
      showSuccess(`Receipt ${transaction.receiptNumber} will be downloaded`);
      
      // TODO: Implement actual PDF generation
      // You can use libraries like jsPDF or pdfmake
      // Or create a backend endpoint that generates PDFs
    } catch (error) {
      showError('Error downloading receipt');
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
      key: 'feeAllocation',
      label: 'Student',
      render: (value: any) => (
        <div>
          <p className="font-semibold">{value.student.fullName}</p>
          <p className="text-xs text-gray-500">
            {value.student.rollNumber} | Class {value.student.class}-{value.student.section}
          </p>
        </div>
      ),
    },
    {
      key: 'feeAllocation',
      label: 'Fee Structure',
      render: (value: any) => (
        <div>
          <p className="text-sm">{value.feeStructure.name}</p>
          <p className="text-xs text-gray-500">{value.feeStructure.academicYear}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value: number) => (
        <span className="font-semibold text-green-600">NPR {value.toFixed(2)}</span>
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Fee Transactions</h2>
        <p className="text-gray-600">View and manage all fee payment transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{summary.totalTransactions}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Receipt className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Collection</p>
              <p className="text-2xl font-bold text-green-600">
                NPR {summary.totalAmount.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Payment Methods</p>
              <div className="mt-2 space-y-1">
                {Object.entries(summary.byPaymentMethod).map(([method, data]) => (
                  <p key={method} className="text-xs text-gray-600">
                    {method}: {data.count} (NPR {data.amount.toFixed(2)})
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
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormInput
            label="Start Date"
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />

          <FormInput
            label="End Date"
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />

          <Select
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

        <div className="flex gap-3 mt-4">
          <Button onClick={handleApplyFilters} disabled={loading}>
            <Search className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
          <Button variant="secondary" onClick={handleClearFilters}>
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
              size="small"
              variant="secondary"
              onClick={() => handleDownloadReceipt(transaction)}
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
        />
      </div>
    </div>
  );
};

export default FeeTransactions;
