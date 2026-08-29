import React from 'react';
import {
    Activity,
    UserPlus,
    Receipt,
    ClipboardCheck,
    CalendarDays,
    GraduationCap,
    Clock3,
} from 'lucide-react';

interface ActivityItem {
    id: number;
    type:
    | 'student'
    | 'fee'
    | 'attendance'
    | 'event'
    | 'grade';
    title: string;
    description: string;
    time: string;
}

interface DashboardActivityProps {
    activities?: ActivityItem[];
}

const DashboardActivity: React.FC<DashboardActivityProps> = ({
    activities = [],
}) => {
    const getIcon = (type: ActivityItem['type']) => {
        switch (type) {
            case 'student':
                return UserPlus;

            case 'fee':
                return Receipt;

            case 'attendance':
                return ClipboardCheck;

            case 'event':
                return CalendarDays;

            case 'grade':
                return GraduationCap;

            default:
                return Activity;
        }
    };

    const getIconStyle = (type: ActivityItem['type']) => {
        switch (type) {
            case 'student':
                return 'bg-blue-50 text-blue-600';

            case 'fee':
                return 'bg-green-50 text-green-600';

            case 'attendance':
                return 'bg-purple-50 text-purple-600';

            case 'event':
                return 'bg-pink-50 text-pink-600';

            case 'grade':
                return 'bg-yellow-50 text-yellow-600';

            default:
                return 'bg-gray-50 text-gray-500';
        }
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm sm:p-3">
            {/* Header */}
            <div className="mb-6 flex items-start justify-between">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-600">
                        <Activity size={20} />
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-gray-900">
                            Recent Activity
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Latest activity across the school
                        </p>
                    </div>
                </div>

                <Clock3
                    size={17}
                    className="text-gray-300"
                />
            </div>

            {/* Empty state */}
            {activities.length === 0 ? (
                <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
                        <Activity size={22} />
                    </div>

                    <p className="text-sm font-medium text-gray-600">
                        No recent activity
                    </p>

                    <p className="mt-1 max-w-xs text-xs text-gray-400">
                        Recent student, fee, attendance and school
                        activities will appear here.
                    </p>
                </div>
            ) : (
                <div className="relative">
                    {/* Timeline */}
                    <div className="absolute bottom-4 left-5 top-4 w-px bg-gray-100" />

                    <div className="space-y-5">
                        {activities.map((item) => {
                            const Icon = getIcon(item.type);

                            return (
                                <div
                                    key={item.id}
                                    className="relative flex gap-3"
                                >
                                    {/* Icon */}
                                    <div
                                        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${getIconStyle(
                                            item.type
                                        )}`}
                                    >
                                        <Icon size={17} />
                                    </div>

                                    {/* Content */}
                                    <div className="min-w-0 flex-1 pt-0.5">
                                        <p className="text-sm font-semibold text-gray-800">
                                            {item.title}
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-gray-400">
                                            {item.description}
                                        </p>

                                        <p className="mt-1.5 text-[10px] font-medium text-gray-300">
                                            {item.time}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Footer */}
            {activities.length > 0 && (
                <div className="mt-5 border-t border-gray-100 pt-4">
                    <button
                        type="button"
                        className="text-xs font-semibold text-gray-600 transition hover:text-gray-900"
                    >
                        View all activity →
                    </button>
                </div>
            )}
        </div>
    );
};

export default DashboardActivity;