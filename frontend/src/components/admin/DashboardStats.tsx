import React, { useEffect, useState } from 'react';
import { Users, GraduationCap, ClipboardCheck, DollarSign, BookOpen, FileText, Calendar, Bell } from 'lucide-react';
import StatCard from '../shared/StatCard';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';

interface DashboardStatsProps {
  onStatClick?: (stat: string) => void;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ onStatClick }) => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalAttendanceToday: 0,
    pendingFees: 0,
    totalAssignments: 0,
    totalGrades: 0,
    upcomingEvents: 0,
    pendingLeaves: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      // Fetch students count
      const studentsRes = await axios.get(`${API_BASE_URL}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch teachers count  
      const teachersRes = await axios.get(`${API_BASE_URL}/teachers`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats({
        totalStudents: studentsRes.data.data?.length || 0,
        totalTeachers: teachersRes.data.data?.length || 0,
        totalAttendanceToday: 0, // TODO: Implement attendance count
        pendingFees: 0, // TODO: Implement fees calculation
        totalAssignments: 0, // TODO: Implement assignments count
        totalGrades: 0, // TODO: Implement grades count
        upcomingEvents: 0, // TODO: Implement events count
        pendingLeaves: 0 // TODO: Implement leaves count
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={GraduationCap}
          color="bg-blue-500"
          // trend={{ value: '+12% this month', isPositive: true }}
          onClick={() => onStatClick?.('students')}
        />

        <StatCard
          title="Total Teachers"
          value={stats.totalTeachers}
          icon={Users}
          color="bg-purple-500"
          // trend={{ value: '+3 new teachers', isPositive: true }}
          onClick={() => onStatClick?.('teachers')}
        />

        <StatCard
          title="Today's Attendance"
          value={stats.totalAttendanceToday}
          icon={ClipboardCheck}
          color="bg-green-500"
          // trend={{ value: '85% average', isPositive: true }}
          onClick={() => onStatClick?.('attendance')}
        />

        <StatCard
          title="Pending Fees"
          value={`रु${stats.pendingFees}`}
          icon={DollarSign}
          color="bg-red-500"
          // trend={{ value: '-5% from last month', isPositive: true }}
          onClick={() => onStatClick?.('fees')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Assignments"
          value={stats.totalAssignments}
          icon={BookOpen}
          color="bg-indigo-500"
          onClick={() => onStatClick?.('assignments')}
        />

        <StatCard
          title="Total Grades"
          value={stats.totalGrades}
          icon={FileText}
          color="bg-yellow-500"
          onClick={() => onStatClick?.('grades')}
        />

        <StatCard
          title="Upcoming Events"
          value={stats.upcomingEvents}
          icon={Calendar}
          color="bg-pink-500"
          onClick={() => onStatClick?.('events')}
        />

        <StatCard
          title="Pending Leaves"
          value={stats.pendingLeaves}
          icon={Bell}
          color="bg-orange-500"
          onClick={() => onStatClick?.('leaves')}
        />
      </div>
    </div>
  );
};

export default DashboardStats;
