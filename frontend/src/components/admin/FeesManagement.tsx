import React, { useEffect, useState } from 'react';
import { DollarSign, Plus, Edit, Trash2, CheckCircle, Download } from 'lucide-react';
import DataTable from '../shared/DataTable';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import FormInput from '../shared/FormInput';
import Select from '../shared/Select';
import Badge from '../shared/Badge';
import axios from 'axios';
import { showSuccess, showError, showDeleteConfirm } from '../../utils/sweetAlert';

interface FeeRecord {
  id: number;
  studentId: number;
  student?: {
    fullName: string;
    rollNumber: string;
    class: string;
    section: string;
  };
  feeType: string;
  amount: number;
  dueDate: string;
  paidAmount: number;
  paidDate?: string;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  academicYear: string;
  term: string;
  remarks?: string;
}

const FeesManagement: React.FC = () => {
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<FeeRecord | null>(null);
  const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  const [formData, setFormData] = useState({
    studentId: '',
    feeType: '',
    amount: '',
    dueDate: '',
    academicYear: '2025-2026',
    term: '',
    remarks: ''
  });

  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/fees', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setFees(response.data.data || []);
    } catch (error) {
      console.error('Error fetching fees:', error);
      setFees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const feeData = {
      studentId: parseInt(formData.studentId),
      feeType: formData.feeType,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate,
      academicYear: formData.academicYear,
      term: formData.term,
      remarks: formData.remarks,
      paidAmount: 0,
      status: 'pending'
    };

    try {
      setLoading(true);
      if (editingFee) {
        await axios.put(
          `http://localhost:3000/api/fees/${editingFee.id}/update`,
          feeData,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        showSuccess('Fee record has been updated successfully!');
      } else {
        await axios.post(
          'http://localhost:3000/api/fees/create',
          feeData,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        showSuccess('New fee record has been added successfully!');
      }
      
      setModalOpen(false);
      resetForm();
      fetchFees();
    } catch (error) {
      console.error('Error saving fee:', error);
      showError('Failed to save fee record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedFee || !paymentAmount) return;

    const amount = parseFloat(paymentAmount);

    try {
      setLoading(true);
      await axios.post(
        `http://localhost:3000/api/fees/${selectedFee.id}/payment`,
        {
          paidAmount: amount,
          paidDate: new Date().toISOString().split('T')[0]
        },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      
      showSuccess('Payment has been recorded successfully!');
      setPaymentModalOpen(false);
      setPaymentAmount('');
      setSelectedFee(null);
      fetchFees();
    } catch (error) {
      console.error('Error recording payment:', error);
      showError('Failed to record payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (fee: FeeRecord) => {
    setEditingFee(fee);
    setFormData({
      studentId: fee.studentId.toString(),
      feeType: fee.feeType,
      amount: fee.amount.toString(),
      dueDate: fee.dueDate,
      academicYear: fee.academicYear,
      term: fee.term,
      remarks: fee.remarks || ''
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const result = await showDeleteConfirm('this fee record');
    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/api/fees/${id}/delete`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      showSuccess('Fee record has been deleted successfully!');
      fetchFees();
    } catch (error) {
      console.error('Error deleting fee:', error);
      showError('Failed to delete fee record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      feeType: '',
      amount: '',
      dueDate: '',
      academicYear: '2025-2026',
      term: '',
      remarks: ''
    });
    setEditingFee(null);
  };

  const exportFees = () => {
    const csvContent = generateFeesReport();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fees_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const generateFeesReport = () => {
    const headers = ['Student Name', 'Roll No', 'Class', 'Fee Type', 'Amount', 'Paid', 'Balance', 'Status', 'Due Date', 'Academic Year'];
    const rows = fees.map(fee => [
      fee.student?.fullName || '',
      fee.student?.rollNumber || '',
      fee.student?.class || '',
      fee.feeType,
      fee.amount,
      fee.paidAmount,
      fee.amount - fee.paidAmount,
      fee.status.toUpperCase(),
      fee.dueDate,
      fee.academicYear
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const columns = [
    { key: 'student', label: 'Student', render: (fee: FeeRecord) => (
      <div>
        <p className="font-medium">{fee.student?.fullName || 'N/A'}</p>
        <p className="text-sm text-gray-600">Roll: {fee.student?.rollNumber}</p>
      </div>
    )},
    { key: 'class', label: 'Class', render: (fee: FeeRecord) => `${fee.student?.class} ${fee.student?.section || ''}` },
    { key: 'feeType', label: 'Fee Type' },
    { key: 'amount', label: 'Amount', render: (fee: FeeRecord) => `NPR ${fee.amount.toLocaleString()}` },
    { key: 'paid', label: 'Paid', render: (fee: FeeRecord) => `NPR ${fee.paidAmount.toLocaleString()}` },
    { key: 'balance', label: 'Balance', render: (fee: FeeRecord) => `NPR ${(fee.amount - fee.paidAmount).toLocaleString()}` },
    { 
      key: 'status', 
      label: 'Status', 
      render: (fee: FeeRecord) => {
        const variants: { [key: string]: any } = {
          paid: 'success',
          partial: 'warning',
          pending: 'info',
          overdue: 'danger'
        };
        return <Badge variant={variants[fee.status]}>{fee.status.toUpperCase()}</Badge>;
      }
    },
    { key: 'dueDate', label: 'Due Date' }
  ];

  const feeTypeOptions = [
    { value: 'Tuition Fee', label: 'Tuition Fee' },
    { value: 'Admission Fee', label: 'Admission Fee' },
    { value: 'Exam Fee', label: 'Exam Fee' },
    { value: 'Library Fee', label: 'Library Fee' },
    { value: 'Laboratory Fee', label: 'Laboratory Fee' },
    { value: 'Sports Fee', label: 'Sports Fee' },
    { value: 'Transport Fee', label: 'Transport Fee' },
    { value: 'Hostel Fee', label: 'Hostel Fee' },
    { value: 'Computer Fee', label: 'Computer Fee' },
    { value: 'Development Fee', label: 'Development Fee' },
    { value: 'Miscellaneous', label: 'Miscellaneous' }
  ];

  const termOptions = [
    { value: 'First Term', label: 'First Term' },
    { value: 'Second Term', label: 'Second Term' },
    { value: 'Third Term', label: 'Third Term' },
    { value: 'Annual', label: 'Annual' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-7 h-7 text-green-600" />
              Fees Management
            </h2>
            <p className="text-sm text-gray-600 mt-1">Manage student fees and payments</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => { resetForm(); setModalOpen(true); }} icon={<Plus />}>
              Add Fee Record
            </Button>
            {fees.length > 0 && (
              <Button onClick={exportFees} variant="success" icon={<Download />}>
                Export Report
              </Button>
            )}
          </div>
        </div>

        <DataTable
          data={fees}
          columns={columns}
          searchable={true}
          searchPlaceholder="Search by student name or fee type..."
          loading={loading && fees.length === 0}
          actions={(fee) => (
            <div className="flex gap-2">
              {fee.status !== 'paid' && (
                <button
                  onClick={() => { setSelectedFee(fee); setPaymentModalOpen(true); }}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                  title="Record Payment"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => handleEdit(fee)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(fee.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); resetForm(); }}
        title={editingFee ? 'Edit Fee Record' : 'Add New Fee Record'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Student ID"
              type="number"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              required
            />
            <Select
              label="Fee Type"
              value={formData.feeType}
              onChange={(e) => setFormData({ ...formData, feeType: e.target.value })}
              options={feeTypeOptions}
              required
            />
            <FormInput
              label="Amount (NPR)"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
            <FormInput
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />
            <FormInput
              label="Academic Year"
              type="text"
              value={formData.academicYear}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
              required
            />
            <Select
              label="Term"
              value={formData.term}
              onChange={(e) => setFormData({ ...formData, term: e.target.value })}
              options={termOptions}
              required
            />
            <div className="md:col-span-2">
              <FormInput
                label="Remarks"
                type="text"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" onClick={() => { setModalOpen(false); resetForm(); }} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {editingFee ? 'Update Fee' : 'Add Fee'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Payment Modal */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => { setPaymentModalOpen(false); setPaymentAmount(''); setSelectedFee(null); }}
        title="Record Payment"
        size="md"
      >
        {selectedFee && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Student: <span className="font-medium text-gray-900">{selectedFee.student?.fullName}</span></p>
              <p className="text-sm text-gray-600 mt-1">Fee Type: <span className="font-medium text-gray-900">{selectedFee.feeType}</span></p>
              <p className="text-sm text-gray-600 mt-1">Total Amount: <span className="font-medium text-gray-900">NPR {selectedFee.amount.toLocaleString()}</span></p>
              <p className="text-sm text-gray-600 mt-1">Already Paid: <span className="font-medium text-gray-900">NPR {selectedFee.paidAmount.toLocaleString()}</span></p>
              <p className="text-sm text-gray-600 mt-1">Balance: <span className="font-medium text-red-600">NPR {(selectedFee.amount - selectedFee.paidAmount).toLocaleString()}</span></p>
            </div>

            <FormInput
              label="Payment Amount (NPR)"
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              required
            />

            <div className="flex justify-end gap-2">
              <Button onClick={() => { setPaymentModalOpen(false); setPaymentAmount(''); setSelectedFee(null); }} variant="secondary">
                Cancel
              </Button>
              <Button onClick={handlePayment} loading={loading}>
                Record Payment
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FeesManagement;
