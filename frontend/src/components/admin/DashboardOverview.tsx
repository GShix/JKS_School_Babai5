import React from 'react';

import AttendanceOverview from './AttendanceOverview';
import DashboardActivity from './DashboardActivity';
import DashboardHeader from './DashboardHeader';
import DashboardStats from './DashboardStats';
import FeeCollectionTrend from './FeeCollectionTrend';
import FeeOverview from './FeeOverview';
import PendingLeaves from './PendingLeaves';
import QuickActions from './QuickActions';
import RecentFeeTransactions from './RecentFeeTransactions';
import StudentDistribution from './StudentDistribution';
import UpcomingEvents from './UpcomingEvents';

interface DashboardOverviewProps {
    onStatClick?: (stat: string) => void;
    refreshKey?: number;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
    onStatClick,
    refreshKey = 0,
}) => {
    return (
        <div className="space-y-6">

            {/* Main Statistics */}
            <DashboardHeader />
            <DashboardStats
                onStatClick={onStatClick}
            />

            {/* Attendance + Fee Overview */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <AttendanceOverview
                    refreshKey={refreshKey}
                />

                <FeeOverview
                    refreshKey={refreshKey}
                />
            </div>

            {/* Fee Collection + Student Distribution */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <FeeCollectionTrend
                    refreshKey={refreshKey}
                />

                <StudentDistribution
                    refreshKey={refreshKey}
                />
            </div>

            {/* Recent Transactions + Pending Leaves */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <RecentFeeTransactions
                    refreshKey={refreshKey}
                />

                <PendingLeaves
                    refreshKey={refreshKey}
                />
            </div>

            {/* Events */}
            <UpcomingEvents
                refreshKey={refreshKey}
            />

            {/* Quick Actions */}
            <QuickActions
                onAction={(action) => {
                    console.log('Quick action:', action);
                }}
            />

            {/* Activity */}
            <DashboardActivity />
        </div>
    );
};

export default DashboardOverview;