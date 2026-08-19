import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, Download } from 'lucide-react';
import Badge from '../../components/shared/Badge';
import Button from '../../components/shared/Button';
import DataTable from '../../components/shared/DataTable';
import Select from '../../components/shared/Select';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';
import { showSuccess, showError } from '../../utils/sweetAlert';

interface Student {
  id: number;
  fullName: string;
  rollNumber: string;
  currentClass: string;
  section: string;
}

interface AttendanceRecord {
  id: number;
  studentId: number;
  student?: Student;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
}

const Attendance: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [markingMode, setMarkingMode] = useState(false);
  const [bulkAttendance, setBulkAttendance] = useState<{ [key: number]: string }>({});

  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedDate && selectedClass) {
      fetchAttendance();
    }
  }, [selectedDate, selectedClass, selectedSection]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/students`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setStudents(response.data.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      setDataLoading(true);
      const params: any = { date: selectedDate };
      if (selectedClass) params.class = selectedClass;
      if (selectedSection) params.section = selectedSection;

      const response = await axios.get(`${API_BASE_URL}/attendance`, {
        headers: { Authorization: `Bearer ${getToken()}` },
        params
      });
      setAttendanceRecords(response.data.data || []);

      // Initialize bulk attendance with existing records
      const bulk: { [key: number]: string } = {};
      response.data.data.forEach((record: AttendanceRecord) => {
        bulk[record.studentId] = record.status;
      });
      setBulkAttendance(bulk);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setAttendanceRecords([]);
    } finally {
      setDataLoading(false);
    }
  };

  const handleBulkAttendanceChange = (studentId: number, status: string) => {
    setBulkAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAllPresent = () => {
    const filtered = getFilteredStudents();
    const bulk: { [key: number]: string } = {};
    filtered.forEach(student => {
      bulk[student.id] = 'present';
    });
    setBulkAttendance(bulk);
  };

  const handleSubmitBulkAttendance = async () => {
    try {
      setLoading(true);
      const attendanceData = Object.entries(bulkAttendance).map(([studentId, status]) => ({
        studentId: parseInt(studentId),
        date: selectedDate,
        status,
        remarks: ''
      }));

      await axios.post(`${API_BASE_URL}/attendance/bulk`,
        { attendance: attendanceData },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      showSuccess('Attendance has been marked successfully!');
      setMarkingMode(false);
      fetchAttendance();
    } catch (error) {
      console.error('Error marking attendance:', error);
      showError('Failed to mark attendance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const exportAttendance = () => {
    // IEMIS-compliant attendance export
    const csvContent = generateIEMISAttendanceReport();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${selectedDate}_${selectedClass}.csv`;
    a.click();
  };

  const generateIEMISAttendanceReport = () => {
    const headers = ['Student Name', 'Roll No', 'Class', 'Section', 'Date', 'Status', 'IEMIS Code'];
    const rows = attendanceRecords.map(record => [
      record.student?.fullName || '',
      record.student?.rollNumber || '',
      record.student?.currentClass || '',
      record.student?.section || '',
      selectedDate,
      record.status.toUpperCase(),
      record.student?.rollNumber || '' // IEMIS student code
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const getFilteredStudents = () => {
    return students.filter(student => {
      if (selectedClass && student.currentClass !== selectedClass) return false;
      if (selectedSection && student.section !== selectedSection) return false;
      return true;
    });
  };

  const columns = [
    { key: 'rollNumber', label: 'Roll No', render: (_value: any, record: AttendanceRecord) => record.student?.rollNumber || '-' },
    { key: 'name', label: 'Student Name', render: (_value: any, record: AttendanceRecord) => record.student?.fullName || '-' },
    { key: 'class', label: 'Class', render: (_value: any, record: AttendanceRecord) => record.student?.currentClass || '-' },
    { key: 'section', label: 'Section', render: (_value: any, record: AttendanceRecord) => record.student?.section || 'A' },
    {
      key: 'status',
      label: 'Status',
      render: (_value: any, record: AttendanceRecord) => {
        const variants: { [key: string]: any } = {
          present: 'success',
          absent: 'danger',
          late: 'warning',
          excused: 'info'
        };
        return <Badge variant={variants[record.status]}>{record.status.toUpperCase()}</Badge>;
      }
    },
    { key: 'date', label: 'Date' }
  ];

  const classOptions = [
    { value: '1', label: 'Class 1' },
    { value: '2', label: 'Class 2' },
    { value: '3', label: 'Class 3' },
    { value: '4', label: 'Class 4' },
    { value: '5', label: 'Class 5' },
    { value: '6', label: 'Class 6' },
    { value: '7', label: 'Class 7' },
    { value: '8', label: 'Class 8' },
    { value: '9', label: 'Class 9' },
    { value: '10', label: 'Class 10' },
    { value: '11', label: 'Class 11' },
    { value: '12', label: 'Class 12' }
  ];

  const sectionOptions = [
    { value: 'A', label: 'Section A' },
    { value: 'B', label: 'Section B' },
    { value: 'C', label: 'Section C' }
  ];

  return (
    <div className="space-y-6 relative">
      {/* Data Loading Overlay */}
      {dataLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 z-10 flex items-center justify-center rounded-xl">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600">Loading data...</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">\n        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">\n          <div>\n            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">\n              <Calendar className="w-7 h-7 text-blue-600" />\n              Attendance Management\n            </h2>\n            <p className="text-sm text-gray-600 mt-1">Mark and track student attendance (IEMIS Compliant)</p>\n          </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setMarkingMode(!markingMode)}
            variant={markingMode ? 'secondary' : 'primary'}
            icon={<Clock />}
          >
            {markingMode ? 'View Records' : 'Mark Attendance'}
          </Button>
          {!markingMode && attendanceRecords.length > 0 && (
            <Button onClick={exportAttendance} variant="success" icon={<Download />}>
              Export IEMIS Report
            </Button>
          )}
        </div>
      </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <Select
            label="Class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            options={classOptions}
            required
          />
          <Select
            label="Section"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            options={sectionOptions}
          />
          <div className="flex items-end">
            <Button onClick={fetchAttendance} className="w-full">
              Load Attendance
            </Button>
          </div>
        </div>

        {/* Marking Mode */}
        {markingMode && selectedClass && (
          <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Mark Attendance - Class {selectedClass} {selectedSection}
              </h3>
              <Button onClick={handleMarkAllPresent} variant="success" size="sm">
                Mark All Present
              </Button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {getFilteredStudents().map(student => (
                <div key={student.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{student.fullName}</p>
                    <p className="text-sm text-gray-600">Roll No: {student.rollNumber}</p>
                  </div>
                  <div className="flex gap-2">
                    {['present', 'absent', 'late', 'excused'].map(status => (
                      <button
                        key={status}
                        onClick={() => handleBulkAttendanceChange(student.id, status)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition ${bulkAttendance[student.id] === status
                            ? status === 'present' ? 'bg-green-500 text-white' :
                              status === 'absent' ? 'bg-red-500 text-white' :
                                status === 'late' ? 'bg-yellow-500 text-white' :
                                  'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                      >
                        {status === 'present' && <CheckCircle className="w-4 h-4 inline mr-1" />}
                        {status === 'absent' && <XCircle className="w-4 h-4 inline mr-1" />}
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={() => setMarkingMode(false)} variant="secondary">
                Cancel
              </Button>
              <Button onClick={handleSubmitBulkAttendance} variant="primary" loading={loading}>
                Submit Attendance
              </Button>
            </div>
          </div>
        )}

        {/* Records View */}
        {!markingMode && (
          <div>
            {attendanceRecords.length > 0 ? (
              <DataTable
                data={attendanceRecords}
                columns={columns}
                searchable={true}
                searchPlaceholder="Search by student name or roll number..."
                loading={loading && attendanceRecords.length === 0}
              />
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>No attendance records found for selected date and class</p>
                <p className="text-sm mt-2">Click "Mark Attendance" to record today's attendance</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
