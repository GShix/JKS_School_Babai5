import React from 'react';
import {
    UserPlus,
    Receipt,
    ClipboardCheck,
    CalendarPlus,
    BookOpen,
    GraduationCap,
} from 'lucide-react';

interface QuickActionsProps {
    onAction?: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
    onAction,
}) => {
    const actions = [
        {
            id: 'add-student',
            title: 'Add Student',
            description: 'Register a new student',
            icon: UserPlus,
            iconClass: 'bg-blue-50 text-blue-600',
        },
        {
            id: 'collect-fee',
            title: 'Collect Fee',
            description: 'Record a fee payment',
            icon: Receipt,
            iconClass: 'bg-green-50 text-green-600',
        },
        {
            id: 'attendance',
            title: 'Take Attendance',
            description: "Mark today's attendance",
            icon: ClipboardCheck,
            iconClass: 'bg-purple-50 text-purple-600',
        },
        {
            id: 'add-event',
            title: 'Add Event',
            description: 'Create a school event',
            icon: CalendarPlus,
            iconClass: 'bg-pink-50 text-pink-600',
        },
        {
            id: 'assignment',
            title: 'Create Assignment',
            description: 'Add a new assignment',
            icon: BookOpen,
            iconClass: 'bg-indigo-50 text-indigo-600',
        },
        {
            id: 'grade',
            title: 'Enter Grades',
            description: 'Update student grades',
            icon: GraduationCap,
            iconClass: 'bg-yellow-50 text-yellow-600',
        },
    ];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm sm:p-3">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-base font-semibold text-gray-900">
                    Quick Actions
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Frequently used administrative actions
                </p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {actions.map((action) => {
                    const Icon = action.icon;

                    return (
                        <button
                            key={action.id}
                            type="button"
                            onClick={() => onAction?.(action.id)}
                            className="group rounded-xl border border-gray-100 p-4 text-left transition hover:border-gray-200 hover:bg-gray-50"
                        >
                            <div
                                className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${action.iconClass} transition-transform group-hover:scale-105`}
                            >
                                <Icon size={19} />
                            </div>

                            <p className="text-sm font-semibold text-gray-800">
                                {action.title}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-gray-400">
                                {action.description}
                            </p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default QuickActions;