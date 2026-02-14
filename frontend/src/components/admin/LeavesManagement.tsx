import React, { useEffect, useState } from 'react';
import { CalendarX, CheckCircle, XCircle } from 'lucide-react';
import DataTable from '../shared/DataTable';
import Badge from '../shared/Badge';
import axios from 'axios';
import { showSuccess, showError, showWarning } from '../../utils/sweetAlert';

interface LeaveRequest {
  id: number;
  studentId: number;
  student?: {
    fullName: string;
    rollNumber: string;
    class: string;
    section: string;
  };
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: number;
  approvedDate?: string;
  remarks?: string;
  createdAt: string;
}

const LeavesManagement: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('pending');

  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  useEffect(() => {
    fetchLeaves();
  }, [filterStatus]);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const params = filterStatus ? { status: filterStatus } : {};
      const response = await axios.get('http://localhost:3000/api/leaves', {
        headers: { Authorization: `Bearer ${getToken()}` },
        params
      });
      setLeaves(response.data.data || []);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    const remarks = window.prompt('Enter approval remarks (optional):');
    
    try {
      setLoading(true);
      await axios.put(
        `http://localhost:3000/api/leaves/${id}/approve`,
        { remarks },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      showSuccess('Leave request has been approved!');
      fetchLeaves();
    } catch (error) {
      console.error('Error approving leave:', error);
      showError('Failed to approve leave request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id: number) => {
    const remarks = window.prompt('Enter rejection reason:');
    if (!remarks) {
      showWarning('Rejection reason required', 'Please provide a reason for rejection.');
      return;
    }
    
    try {
      setLoading(true);
      await axios.put(
        `http://localhost:3000/api/leaves/${id}/reject`,
        { remarks },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      showSuccess('Leave request has been rejected!');
      fetchLeaves();
    } catch (error) {
      console.error('Error rejecting leave:', error);
      showError('Failed to reject leave request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include both start and end date
  };

  const columns = [
    { 
      key: 'student', 
      label: 'Student', 
      render: (leave: LeaveRequest) => (
        <div>
          <p className="font-medium">{leave.student?.fullName || 'N/A'}</p>
          <p className="text-sm text-gray-600">Roll: {leave.student?.rollNumber}</p>
        </div>
      )
    },
    { key: 'class', label: 'Class', render: (leave: LeaveRequest) => `${leave.student?.class} ${leave.student?.section || ''}` },
    { key: 'leaveType', label: 'Leave Type' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { 
      key: 'duration', 
      label: 'Duration', 
      render: (leave: LeaveRequest) => `${calculateDays(leave.startDate, leave.endDate)} days`
    },
    { key: 'reason', label: 'Reason', render: (leave: LeaveRequest) => (
      <span className="max-w-xs truncate block" title={leave.reason}>{leave.reason}</span>
    )},
    { 
      key: 'status', 
      label: 'Status', 
      render: (leave: LeaveRequest) => {
        const variants: { [key: string]: any } = {
          pending: 'warning',
          approved: 'success',
          rejected: 'danger'
        };
        return <Badge variant={variants[leave.status]}>{leave.status.toUpperCase()}</Badge>;
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <CalendarX className="w-7 h-7 text-orange-600" />
              Leave Requests Management
            </h2>
            <p className="text-sm text-gray-600 mt-1">Review and manage student leave applications</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          {['pending', 'approved', 'rejected', 'all'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status === 'all' ? '' : status)}
              className={`px-4 py-2 font-medium transition ${
                filterStatus === (status === 'all' ? '' : status)
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status === 'pending' && leaves.filter(l => l.status === 'pending').length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-orange-500 text-white rounded-full">
                  {leaves.filter(l => l.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </div>

        <DataTable
          data={leaves}
          columns={columns}
          searchable={true}
          searchPlaceholder="Search by student name or reason..."
          actions={(leave) => (
            <div className="flex gap-2">
              {leave.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleApprove(leave.id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition flex items-center gap-1"
                    title="Approve"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs">Approve</span>
                  </button>
                  <button
                    onClick={() => handleReject(leave.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-1"
                    title="Reject"
                  >
                    <XCircle className="w-4 h-4" />
                    <span className="text-xs">Reject</span>
                  </button>
                </>
              )}
              {leave.status !== 'pending' && leave.remarks && (
                <span className="text-xs text-gray-600" title={leave.remarks}>
                  {leave.remarks.substring(0, 20)}...
                </span>
              )}
            </div>
          )}
        />

        {leaves.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <CalendarX className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p>No {filterStatus} leave requests found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeavesManagement;
