import React from 'react';
import DashboardHeader from '../../components/admin/DashboardHeader';
import DashboardStats from '../../components/admin/DashboardStats';
import AttendanceOverview from '../../components/admin/AttendanceOverview';
import FeeOverview from '../../components/admin/FeeOverview';
import FeeCollectionTrend from '../../components/admin/FeeCollectionTrend';
import StudentDistribution from '../../components/admin/StudentDistribution';
import RecentFeeTransactions from '../../components/admin/RecentFeeTransactions';
import UpcomingEvents from '../../components/admin/UpcomingEvents';
import PendingLeaves from '../../components/admin/PendingLeaves';
import QuickActions from '../../components/admin/QuickActions';
import DashboardActivity from '../../components/admin/DashboardActivity';

const Dashboard: React.FC = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-full bg-gray-50 max-sm:p-2">
      <DashboardHeader
        academicYears={['2081/82', '2082/83', '2083/84']}
        selectedYear="2082/83"
        onYearChange={(year) => {
          console.log('Selected academic year:', year);
        }}
        onRefresh={handleRefresh}
      />
      <DashboardStats />
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <RecentFeeTransactions />
        <FeeOverview />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <StudentDistribution />
        <AttendanceOverview />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <FeeCollectionTrend />
        <PendingLeaves />
      </div>
      <div className="mt-4">
        <QuickActions />
      </div>
      <div className="mt-4">
        <UpcomingEvents />
      </div>
      <div className="mt-4">
        <DashboardActivity
        // activities={[
        //   {
        //     id: 1,
        //     type: 'student',
        //     title: 'New student registered',
        //     description: 'A new student was added to the system.',
        //     time: 'Today',
        //   },
        //   {
        //     id: 2,
        //     type: 'fee',
        //     title: 'Fee payment received',
        //     description: 'A fee transaction was successfully recorded.',
        //     time: 'Today',
        //   },
        //   {
        //     id: 3,
        //     type: 'attendance',
        //     title: 'Attendance updated',
        //     description: "Today's attendance has been recorded.",
        //     time: 'Yesterday',
        //   },
        // ]}
        />
      </div>
    </div>
  );
};

export default Dashboard;