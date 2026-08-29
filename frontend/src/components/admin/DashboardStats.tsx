import React, { useEffect, useState } from 'react';
import {
  Users,
  GraduationCap,
  ClipboardCheck,
  Wallet,
  AlertCircle,
  Bell,
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../api';
import StatCard from '../shared/StatCard';

interface DashboardStatsProps {
  onStatClick?: (stat: string) => void;
  refreshKey?: number;
}

interface Stats {
  totalStudents: number;
  totalTeachers: number;
  totalAttendanceToday: number;
  attendanceRate: number;
  feesCollected: number;
  pendingFees: number;
  pendingLeaves: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  onStatClick,
  refreshKey = 0,
}) => {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalAttendanceToday: 0,
    attendanceRate: 0,
    feesCollected: 0,
    pendingFees: 0,
    pendingLeaves: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem('token') ||
        sessionStorage.getItem('token');

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      /*
       * ----------------------------------------------------
       * Students
       * ----------------------------------------------------
       */
      const studentsRes = await axios.get(
        `${API_BASE_URL}/students`,
        { headers }
      );

      /*
       * ----------------------------------------------------
       * Teachers
       * ----------------------------------------------------
       */
      const teachersRes = await axios.get(
        `${API_BASE_URL}/teachers`,
        { headers }
      );

      /*
       * ----------------------------------------------------
       * Pending Fees
       *
       * feeAllocations.balance is the source of truth.
       * ----------------------------------------------------
       */
      const pendingFeesRes = await axios.get(
        `${API_BASE_URL}/fee-management/allocations/pending`,
        { headers }
      );

      /*
       * ----------------------------------------------------
       * Update dashboard stats
       * ----------------------------------------------------
       */
      setStats({
        totalStudents:
          studentsRes.data.data?.length || 0,

        totalTeachers:
          teachersRes.data.data?.length || 0,

        // TODO: connect attendance API
        totalAttendanceToday: 0,

        // TODO: calculate from attendance API
        attendanceRate: 0,

        // TODO: connect fee collection API
        feesCollected: 0,

        // feeAllocations.balance
        pendingFees:
          Number(
            pendingFeesRes.data.summary?.totalPending
          ) || 0,

        // TODO: connect leaves API
        pendingLeaves: 0,
      });
    } catch (error) {
      console.error(
        'Failed to fetch dashboard stats:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * ----------------------------------------------------
   * Loading state
   * ----------------------------------------------------
   */
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="w-full">
                <div className="mb-3 h-4 w-28 animate-pulse rounded bg-gray-200" />

                <div className="mb-3 h-8 w-20 animate-pulse rounded bg-gray-200" />

                <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
              </div>

              <div className="h-11 w-11 animate-pulse rounded-xl bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

      {/* -----------------------------------------------
          Total Students
      ------------------------------------------------ */}
      <StatCard
        title="Total Students"
        value={stats.totalStudents}
        icon={GraduationCap}
        color="bg-blue-500"
        onClick={() => onStatClick?.('students')}
      />

      {/* -----------------------------------------------
          Teachers & Staff
      ------------------------------------------------ */}
      <StatCard
        title="Teachers & Staff"
        value={stats.totalTeachers}
        icon={Users}
        color="bg-purple-500"
        onClick={() => onStatClick?.('teachers')}
      />

      {/* -----------------------------------------------
          Today's Attendance
      ------------------------------------------------ */}
      <StatCard
        title="Today's Attendance"
        value={
          stats.attendanceRate > 0
            ? `${stats.attendanceRate}%`
            : stats.totalAttendanceToday
        }
        icon={ClipboardCheck}
        color="bg-green-500"
        onClick={() => onStatClick?.('attendance')}
      />

      {/* -----------------------------------------------
          Fees Collected
      ------------------------------------------------ */}
      <StatCard
        title="Fees Collected"
        value={`रु ${stats.feesCollected.toLocaleString('en-IN')}`}
        icon={Wallet}
        color="bg-indigo-500"
        onClick={() => onStatClick?.('fees')}
      />

      {/* -----------------------------------------------
          Outstanding Fees
      ------------------------------------------------ */}
      <StatCard
        title="Outstanding Fees"
        value={`रु ${stats.pendingFees.toLocaleString('en-IN')}`}
        icon={AlertCircle}
        color="bg-red-500"
        onClick={() => onStatClick?.('fees')}
      />

      {/* -----------------------------------------------
          Pending Leaves
      ------------------------------------------------ */}
      <StatCard
        title="Pending Leaves"
        value={stats.pendingLeaves}
        icon={Bell}
        color="bg-orange-500"
        onClick={() => onStatClick?.('leaves')}
      />
    </div>
  );
};

export default DashboardStats;