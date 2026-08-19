import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Trash2, Receipt, User, X, Printer } from 'lucide-react';
import Button from '../../components/shared/Button';
import FormInput from '../../components/shared/FormInput';
import Select from '../../components/shared/Select';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';
import { showSuccess, showError } from '../../utils/sweetAlert';
import FeeReceipt from '../../components/admin/FeeReceipt';
import { schoolProfileService } from '../../api';
import type { SchoolProfile } from '../../api/types';

interface Student {
  id: number;
  emisId: string;
  fullName: string;
  rollNumber: string;
  currentClass: string;
  section: string;
  phone: string;
  email: string;
}

interface FeeCategory {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

interface SelectedFeeItem {
  categoryId: number;
  categoryName: string;
  amount: number;
}

interface AllocatedFeeItem {
  id: number;
  feeCategoryId: number;
  amount: number;
  category: {
    id: number;
    name: string;
  };
}

interface FeeAllocation {
  id: number;
  studentId: number;
  feeStructureId: number;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  status: string;
  feeStructure: {
    id: number;
    name: string;
    items: AllocatedFeeItem[];
  };
}

interface PaymentData {
  paymentMethod: string;
  paymentDate: string;
  bankName: string;
  bankAccountNumber: string;
  referenceNumber: string;
  remarks: string;
}

const FeeCollectionNew: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [categories, setCategories] = useState<FeeCategory[]>([]);
  const [selectedFees, setSelectedFees] = useState<SelectedFeeItem[]>([]);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentData, setPaymentData] = useState<PaymentData>({
    paymentMethod: 'cash',
    paymentDate: new Date().toISOString().split('T')[0],
    bankName: '',
    bankAccountNumber: '',
    referenceNumber: '',
    remarks: '',
  });
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);
  const [allocatedFees, setAllocatedFees] = useState<FeeAllocation[]>([]);
  const [availableFeeItems, setAvailableFeeItems] = useState<AllocatedFeeItem[]>([]);
  const receiptRef = useRef<HTMLDivElement>(null);

  const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

  useEffect(() => {
    fetchCategories();
    fetchSchoolProfile();
  }, []);

  // Fetch school profile
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

  // Fetch fee categories
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

  // Fetch allocated fees for a student
  const fetchAllocatedFees = async (studentId: number) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/fee-management/allocations/student/${studentId}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      const allocations = response.data.data?.allocations || [];
      setAllocatedFees(allocations);

      // Extract all fee items from allocations that have pending balance
      const pendingAllocations = allocations.filter((a: FeeAllocation) => a.balance > 0);
      const feeItems: AllocatedFeeItem[] = [];

      pendingAllocations.forEach((allocation: FeeAllocation) => {
        if (allocation.feeStructure?.items) {
          allocation.feeStructure.items.forEach((item: AllocatedFeeItem) => {
            // Check if this item is not already added (avoid duplicates)
            const exists = feeItems.find(f => f.feeCategoryId === item.feeCategoryId);
            if (!exists) {
              feeItems.push(item);
            }
          });
        }
      });

      setAvailableFeeItems(feeItems);

      // Auto-populate fee items if allocations exist
      if (feeItems.length > 0) {
        const autoFees = feeItems.map(item => ({
          categoryId: item.feeCategoryId,
          categoryName: item.category.name,
          amount: parseFloat(item.amount.toString()),
        }));
        setSelectedFees(autoFees);
      }
    } catch (error) {
      console.error('Error fetching allocated fees:', error);
      // No error message - allocations are optional
      setAllocatedFees([]);
      setAvailableFeeItems([]);
    }
  };

  // Search student by IIEMIS Code or name
  const handleSearchStudent = async () => {
    if (!searchQuery.trim()) {
      showError('Please enter IIEMIS Code or student name');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/students`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const students = response.data.data || [];
      const query = searchQuery.toLowerCase();

      const found = students.find(
        (s: Student) =>
          s.emisId?.toLowerCase() === query ||
          s.fullName?.toLowerCase().includes(query) ||
          s.rollNumber?.toLowerCase() === query
      );

      if (found) {
        setSelectedStudent(found);
        // Fetch allocated fees for this student
        await fetchAllocatedFees(found.id);
        // Payment amount is reset but fees are auto-populated
        setPaymentAmount('');
      } else {
        showError('Student not found');
      }
    } catch (error) {
      console.error('Error searching student:', error);
      showError('Error searching for student');
    } finally {
      setLoading(false);
    }
  };

  // Add fee category
  const handleAddFeeCategory = () => {
    setSelectedFees([
      ...selectedFees,
      { categoryId: 0, categoryName: '', amount: 0 },
    ]);
  };

  // Update fee item
  const handleUpdateFeeItem = (index: number, field: string, value: any) => {
    const updated = [...selectedFees];
    if (field === 'categoryId') {
      const categoryId = parseInt(value);
      const category = categories.find((c) => c.id === categoryId);
      updated[index].categoryId = categoryId;
      updated[index].categoryName = category?.name || '';

      // Auto-fill amount from allocated fee if exists
      const allocatedItem = availableFeeItems.find(
        (item) => item.feeCategoryId === categoryId
      );
      if (allocatedItem) {
        updated[index].amount = parseFloat(allocatedItem.amount.toString());
      } else {
        updated[index].amount = 0;
      }
    } else if (field === 'amount') {
      updated[index].amount = parseFloat(value) || 0;
    }
    setSelectedFees(updated);
  };

  // Remove fee item
  const handleRemoveFeeItem = (index: number) => {
    setSelectedFees(selectedFees.filter((_, i) => i !== index));
  };

  // Calculate totals
  const totalFeeAmount = selectedFees.reduce((sum, item) => sum + item.amount, 0);
  const paidAmount = parseFloat(paymentAmount) || 0;
  const dueAmount = totalFeeAmount - paidAmount;

  // Collect payment
  const handleCollectPayment = async () => {
    if (!selectedStudent) {
      showError('Please select a student');
      return;
    }

    if (selectedFees.length === 0) {
      showError('Please add at least one fee category');
      return;
    }

    if (selectedFees.some((f) => f.categoryId === 0 || f.amount <= 0)) {
      showError('Please select valid categories and amounts');
      return;
    }

    if (paidAmount <= 0) {
      showError('Please enter payment amount');
      return;
    }

    if (paidAmount > totalFeeAmount) {
      showError('Payment amount cannot exceed total fee amount');
      return;
    }

    try {
      setProcessing(true);

      const payloadData = {
        studentId: selectedStudent.id,
        emisId: selectedStudent.emisId,
        feeItems: selectedFees.map((f) => ({
          feeCategoryId: f.categoryId,
          amount: f.amount,
        })),
        totalAmount: totalFeeAmount,
        paidAmount: paidAmount,
        dueAmount: dueAmount,
        paymentMethod: paymentData.paymentMethod,
        paymentDate: paymentData.paymentDate,
        bankName: paymentData.paymentMethod !== 'cash' ? paymentData.bankName : undefined,
        bankAccountNumber: paymentData.paymentMethod !== 'cash' ? paymentData.bankAccountNumber : undefined,
        referenceNumber: paymentData.paymentMethod !== 'cash' ? paymentData.referenceNumber : undefined,
        remarks: paymentData.remarks,
      };

      // Note: You'll need to create this endpoint in backend
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
          currentClass: selectedStudent.currentClass,
          section: selectedStudent.section,
          rollNumber: selectedStudent.rollNumber,
          emisId: selectedStudent.emisId,
        },
        feeItems: selectedFees.map(f => ({
          categoryName: f.categoryName,
          amount: f.amount,
        })),
        totalAmount: totalFeeAmount,
        paidAmount: paidAmount,
        dueAmount: dueAmount,
        paymentMethod: paymentData.paymentMethod,
        bankName: paymentData.bankName,
        referenceNumber: paymentData.referenceNumber,
        collectedBy: response.data.data.collectedByName || 'Admin',
        remarks: paymentData.remarks,
      };

      setReceiptData(receipt);
      setShowReceiptModal(true);

      showSuccess(
        `Payment collected successfully! Receipt No: ${response.data.data.receiptNumber}`
      );

      // Reset form (keep modal open to print)
      setSelectedStudent(null);
      setSelectedFees([]);
      setPaymentAmount('');
      setSearchQuery('');
      setPaymentData({
        paymentMethod: 'cash',
        paymentDate: new Date().toISOString().split('T')[0],
        bankName: '',
        bankAccountNumber: '',
        referenceNumber: '',
        remarks: '',
      });
    } catch (error: any) {
      console.error('Error collecting payment:', error);
      showError(error.response?.data?.message || 'Error collecting payment');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex gap-6 h-screen overflow-hidden">
      {/* Left Side - Fee Collection Form */}
      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fee Collection</h1>
          <p className="text-gray-600 mt-1">Collect fees with flexible categories</p>
        </div>

        {/* Student Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Student</h3>
          <div className="flex gap-3">
            <FormInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter IIEMIS Code, name, or roll number"
              onKeyDown={(e) => e.key === 'Enter' && handleSearchStudent()}
              disabled={loading}
            />
            <Button
              onClick={handleSearchStudent}
              icon={<Search className="w-5 h-5" />}
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {selectedStudent && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900">Student Found</h4>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">IIEMIS Code:</span>
                  <span className="ml-2 font-semibold">{selectedStudent.emisId}</span>
                </div>
                <div>
                  <span className="text-gray-600">Name:</span>
                  <span className="ml-2 font-semibold">{selectedStudent.fullName}</span>
                </div>
                <div>
                  <span className="text-gray-600">Roll No:</span>
                  <span className="ml-2 font-semibold">{selectedStudent.rollNumber}</span>
                </div>
                <div>
                  <span className="text-gray-600">Class:</span>
                  <span className="ml-2 font-semibold">
                    {selectedStudent.currentClass}-{selectedStudent.section}
                  </span>
                </div>
              </div>

              {/* Fee Allocation Summary */}
              {allocatedFees.length > 0 && (
                <div className="mt-3 pt-3 border-t border-blue-300">
                  <p className="text-xs font-semibold text-blue-800 mb-2">Fee Allocation Summary:</p>
                  {allocatedFees.map((allocation, idx) => (
                    <div key={idx} className="text-xs text-blue-700 mb-1">
                      • {allocation.feeStructure?.name}: NPR {parseFloat(allocation.balance.toString()).toLocaleString()} pending
                      {allocation.status === 'paid' && <span className="text-green-600 ml-2">(✓ Paid)</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Fee Categories Selection */}
        {selectedStudent && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Fee Categories</h3>
                {allocatedFees.length > 0 && (
                  <p className="text-sm text-green-600 mt-1">
                    ✓ {allocatedFees.length} fee structure(s) allocated to this student
                  </p>
                )}
              </div>
              <Button
                size="sm"
                onClick={handleAddFeeCategory}
                icon={<Plus className="w-4 h-4" />}
              >
                Add Category
              </Button>
            </div>

            {availableFeeItems.length > 0 && selectedFees.length === 0 && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> Fee categories have been auto-loaded from allocated fee structure.
                  Remove any categories you don't want to collect now.
                </p>
              </div>
            )}

            <div className="space-y-3">
              {selectedFees.map((item, index) => {
                const isAllocated = availableFeeItems.some(
                  (f) => f.feeCategoryId === item.categoryId
                );
                return (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <div className="relative">
                        <Select
                          value={item.categoryId.toString()}
                          onChange={(e) =>
                            handleUpdateFeeItem(index, 'categoryId', e.target.value)
                          }
                          options={[
                            { value: '0', label: 'Select Category' },
                            ...categories.map((c) => ({
                              value: c.id.toString(),
                              label: c.name,
                            })),
                          ]}
                        />
                        {isAllocated && item.categoryId > 0 && (
                          <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                            Allocated
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-48">
                      <FormInput
                        type="number"
                        value={item.amount || ''}
                        onChange={(e) =>
                          handleUpdateFeeItem(index, 'amount', e.target.value)
                        }
                        placeholder="Amount"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRemoveFeeItem(index)}
                      icon={<Trash2 className="w-4 h-4" />}
                    />
                  </div>
                );
              })}

              {selectedFees.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  Click "Add Category" to add fee items
                </p>
              )}
            </div>

            {selectedFees.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Fee Amount:</span>
                  <span className="text-blue-600">NPR {totalFeeAmount.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Payment Details */}
        {selectedStudent && selectedFees.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>

            <div className="space-y-4">
              <div>
                <FormInput
                  label="Payment Amount *"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter amount being paid"
                  min="0"
                  max={totalFeeAmount}
                  step="0.01"
                />
                {paidAmount > 0 && (
                  <p className="text-sm mt-1">
                    {dueAmount > 0 ? (
                      <span className="text-orange-600">
                        Due Amount: NPR {dueAmount.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-green-600">Full payment</span>
                    )}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                />

                <FormInput
                  label="Payment Date *"
                  type="date"
                  value={paymentData.paymentDate}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, paymentDate: e.target.value })
                  }
                />
              </div>

              {paymentData.paymentMethod !== 'cash' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>
                  <FormInput
                    label="Reference Number"
                    value={paymentData.referenceNumber}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, referenceNumber: e.target.value })
                    }
                    placeholder="Enter transaction reference"
                  />
                </>
              )}

              <FormInput
                label="Remarks"
                value={paymentData.remarks}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, remarks: e.target.value })
                }
                placeholder="Optional notes"
              />

              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSelectedStudent(null);
                    setSelectedFees([]);
                    setPaymentAmount('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCollectPayment}
                  disabled={processing || paidAmount <= 0}
                  icon={<Receipt className="w-5 h-5" />}
                >
                  {processing ? 'Processing...' : 'Collect Payment'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Side - Live Receipt Preview */}
      {selectedStudent && selectedFees.length > 0 && paidAmount > 0 && (
        <div className="w-96 bg-white shadow-xl border-l border-gray-200 overflow-y-auto p-6">
          <div className="flex items-center gap-2 mb-4">
            <Receipt className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Receipt Preview</h3>
          </div>

          <div className="space-y-4 text-sm">
            {/* Student Info */}
            <div className="border-b pb-3">
              <p className="font-semibold text-gray-900">{selectedStudent.fullName}</p>
              <p className="text-gray-600">IEMIS: {selectedStudent.emisId}</p>
              <p className="text-gray-600">
                Class: {selectedStudent.currentClass}-{selectedStudent.section}
              </p>
            </div>

            {/* Fee Breakdown */}
            <div>
              <p className="font-semibold text-gray-900 mb-2">Fee Details:</p>
              <div className="space-y-2">
                {selectedFees.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="text-gray-700">{item.categoryName}</span>
                    <span className="font-semibold">NPR {item.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>NPR {totalFeeAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-blue-50 p-3 rounded border border-blue-200">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Amount Paid</span>
                  <span className="font-semibold text-green-600">
                    NPR {paidAmount.toLocaleString()}
                  </span>
                </div>
                {dueAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Due Amount</span>
                    <span className="font-semibold text-red-600">
                      NPR {dueAmount.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="text-xs text-gray-600">
              <p>Payment: {paymentData.paymentMethod.replace('_', ' ').toUpperCase()}</p>
              <p>Date: {new Date(paymentData.paymentDate).toLocaleDateString()}</p>
              {paymentData.remarks && <p>Remarks: {paymentData.remarks}</p>}
            </div>
          </div>
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
          /* Hide everything except receipt */
          body > *:not(#root),
          #root > *:not(.fixed) {
            display: none !important;
          }
          
          /* Hide modal overlay but keep content */
          .fixed {
            position: static !important;
            background: white !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* Remove all modal wrapper styling */
          .fixed > div {
            box-shadow: none !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            max-height: none !important;
            overflow: visible !important;
            border-radius: 0 !important;
          }
          
          /* Remove padding from receipt wrapper */
          .fixed > div > div:not(.sticky):not(.no-print) {
            padding: 0 !important;
          }
          
          /* Hide modal header and controls */
          .no-print,
          .sticky {
            display: none !important;
          }
          
          /* Show receipt properly - single page */
          #receipt-content {
            display: block !important;
            width: 210mm !important;
            max-width: 210mm !important;
            margin: 0 auto !important;
            padding: 0 !important;
            page-break-after: avoid !important;
          }
          
          /* Ensure single page */
          body, html {
            height: auto !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FeeCollectionNew;
