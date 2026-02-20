import React, { useState } from 'react';
import { Search, DollarSign, User, CreditCard, Receipt, AlertCircle } from 'lucide-react';
import Button from '../../components/shared/Button';
import FormInput from '../../components/shared/FormInput';
import Select from '../../components/shared/Select';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';
import { showSuccess, showError } from '../../utils/sweetAlert';

interface Student {
  id: number;
  fullName: string;
  rollNumber: string;
  class: string;
  section: string;
  phone: string;
  email: string;
}

interface FeeAllocation {
  id: number;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  status: string;
  dueDate: string;
  discount: number;
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
}

const FeeCollection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [feeAllocations, setFeeAllocations] = useState<FeeAllocation[]>([]);
  const [selectedAllocation, setSelectedAllocation] = useState<FeeAllocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

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

  // Search for students
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      showError('Please enter a search query');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/students`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const students = response.data.data || [];
      const filtered = students.filter((student: Student) =>
        student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setSearchResults(filtered);

      if (filtered.length === 0) {
        showError('No students found matching your search');
      }
    } catch (error) {
      console.error('Error searching students:', error);
      showError('Error searching for students');
    } finally {
      setLoading(false);
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
      setFeeAllocations(allocations.filter((a: FeeAllocation) => a.balance > 0));

      if (allocations.filter((a: FeeAllocation) => a.balance > 0).length === 0) {
        showSuccess('This student has no pending fees!');
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
    setSelectedAllocation(allocation);
    setPaymentData({
      ...paymentData,
      amount: allocation.balance.toString(),
    });
  };

  // Collect payment
  const handleCollectPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAllocation) {
      showError('Please select a fee allocation');
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

      showSuccess(
        `Payment collected successfully! Receipt No: ${transaction.receiptNumber}`
      );

      // Update the allocation in the list
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

      // If fully paid, remove from list
      if (updatedAllocation.balance <= 0) {
        setFeeAllocations(feeAllocations.filter((a) => a.id !== updatedAllocation.id));
        setSelectedAllocation(null);
      }
    } catch (error: any) {
      console.error('Error collecting payment:', error);
      showError(error.response?.data?.message || 'Error collecting payment');
    } finally {
      setProcessing(false);
    }
  };

  // Clear selection
  const handleClearSelection = () => {
    setSelectedStudent(null);
    setFeeAllocations([]);
    setSelectedAllocation(null);
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fee Collection</h2>
          <p className="text-gray-600">Search for students and collect fee payments</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Search className="w-5 h-5" />
          Search Student
        </h3>

        <div className="flex gap-3">
          <div className="flex-1">
            <FormInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or roll number..."
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
          {selectedStudent && (
            <Button variant="secondary" onClick={handleClearSelection}>
              Clear
            </Button>
          )}
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
            <div className="max-h-60 overflow-y-auto">
              {searchResults.map((student) => (
                <button
                  key={student.id}
                  onClick={() => handleSelectStudent(student)}
                  className="w-full px-4 py-3 hover:bg-blue-50 border-b border-gray-100 text-left transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">{student.fullName}</p>
                      <p className="text-sm text-gray-600">
                        Roll No: {student.rollNumber} | Class: {student.class}-{student.section}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">{student.phone}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected Student Details */}
      {selectedStudent && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Student Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-semibold">{selectedStudent.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Roll Number</p>
              <p className="font-semibold">{selectedStudent.rollNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Class</p>
              <p className="font-semibold">
                {selectedStudent.class}-{selectedStudent.section}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-semibold">{selectedStudent.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold">{selectedStudent.email || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Fee Allocations */}
      {selectedStudent && feeAllocations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Pending Fees
          </h3>
          <div className="space-y-3">
            {feeAllocations.map((allocation) => (
              <button
                key={allocation.id}
                onClick={() => handleSelectAllocation(allocation)}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                  selectedAllocation?.id === allocation.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
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
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm text-gray-600">Balance</p>
                    <p className="text-2xl font-bold text-red-600">
                      NPR {allocation.balance.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Paid: NPR {allocation.paidAmount.toFixed(2)} of NPR{' '}
                      {allocation.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Payment Form */}
      {selectedAllocation && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Collect Payment
          </h3>

          <form onSubmit={handleCollectPayment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                onClick={() => setSelectedAllocation(null)}
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
      {selectedStudent && feeAllocations.length === 0 && !loading && (
        <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
          <AlertCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">All Fees Paid!</h3>
          <p className="text-gray-600">This student has no pending fee payments</p>
        </div>
      )}
    </div>
  );
};

export default FeeCollection;
