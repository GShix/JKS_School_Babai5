import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Bell,
    CalendarDays,
    ChevronRight,
    Clock3,
    User,
} from 'lucide-react';

import { API_BASE_URL } from '../../api/';

interface Leave {
    id: number;
    studentId?: number;
    teacherId?: number;
    reason?: string;
    leaveType?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    student?: {
        firstName?: string;
        lastName?: string;
        name?: string;
    };
    teacher?: {
        firstName?: string;
        lastName?: string;
        name?: string;
    };
}

interface PendingLeavesProps {
    refreshKey?: number;
    limit?: number;
    onLeaveClick?: (leave: Leave) => void;
}

const PendingLeaves: React.FC<PendingLeavesProps> = ({
    refreshKey = 0,
    limit = 5,
    onLeaveClick,
}) => {
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingLeaves();
    }, [refreshKey]);

    const fetchPendingLeaves = async () => {
        try {
            setLoading(true);

            const token =
                localStorage.getItem('token') ||
                sessionStorage.getItem('token');

            const response = await axios.get(
                `${API_BASE_URL}/leaves`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data: Leave[] =
                response.data.data || [];

            const pending = data
                .filter(
                    (leave) =>
                        leave.status?.toLowerCase() === 'pending'
                )
                .sort(
                    (a, b) =>
                        new Date(
                            a.startDate || ''
                        ).getTime() -
                        new Date(
                            b.startDate || ''
                        ).getTime()
                )
                .slice(0, limit);

            setLeaves(pending);
        } catch (error) {
            console.error(
                'Failed to fetch pending leaves:',
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date?: string) => {
        if (!date) return 'N/A';

        const parsed = new Date(date);

        if (Number.isNaN(parsed.getTime())) {
            return 'N/A';
        }

        return parsed.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    const getApplicantName = (leave: Leave) => {
        const person = leave.student || leave.teacher;

        if (!person) {
            if (leave.studentId) {
                return `Student #${leave.studentId}`;
            }

            if (leave.teacherId) {
                return `Teacher #${leave.teacherId}`;
            }

            return 'Unknown applicant';
        }

        if (person.name) {
            return person.name;
        }

        return `${person.firstName || ''} ${person.lastName || ''
            }`.trim() || 'Unknown applicant';
    };

    if (loading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm sm:p-3">
                <div className="mb-6 flex items-center gap-3">
                    <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200" />

                    <div>
                        <div className="mb-2 h-5 w-36 animate-pulse rounded bg-gray-200" />
                        <div className="h-3 w-52 animate-pulse rounded bg-gray-200" />
                    </div>
                </div>

                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div
                            key={item}
                            className="flex items-center gap-3"
                        >
                            <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200" />

                            <div className="flex-1">
                                <div className="mb-2 h-3 w-32 animate-pulse rounded bg-gray-200" />
                                <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm sm:p-3">

            {/* Header */}
            <div className="mb-6 flex items-start justify-between">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                        <Bell size={20} />
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-gray-900">
                            Pending Leaves
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Leave requests waiting for approval
                        </p>
                    </div>
                </div>

                <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">
                    {leaves.length}
                </span>
            </div>

            {/* Empty */}
            {leaves.length === 0 ? (
                <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-500">
                        <Bell size={21} />
                    </div>

                    <p className="text-sm font-medium text-gray-600">
                        No pending leave requests
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                        Everything is up to date.
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {leaves.map((leave) => (
                        <button
                            key={leave.id}
                            type="button"
                            onClick={() => onLeaveClick?.(leave)}
                            className="group flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-gray-50"
                        >
                            {/* Avatar */}
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                                <User size={17} />
                            </div>

                            {/* Details */}
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-gray-800">
                                    {getApplicantName(leave)}
                                </p>

                                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                                    {leave.leaveType && (
                                        <span className="capitalize">
                                            {leave.leaveType}
                                        </span>
                                    )}

                                    <span className="flex items-center gap-1">
                                        <CalendarDays size={12} />

                                        {formatDate(leave.startDate)}
                                        {leave.endDate &&
                                            ` - ${formatDate(leave.endDate)}`}
                                    </span>
                                </div>
                            </div>

                            {/* Pending */}
                            <div className="hidden items-center gap-1.5 sm:flex">
                                <Clock3
                                    size={13}
                                    className="text-orange-500"
                                />

                                <span className="text-[10px] font-medium text-orange-600">
                                    Pending
                                </span>
                            </div>

                            <ChevronRight
                                size={16}
                                className="shrink-0 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-gray-500"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Footer */}
            {leaves.length > 0 && (
                <div className="mt-5 border-t border-gray-100 pt-4">
                    <button
                        type="button"
                        className="text-xs font-semibold text-orange-600 transition hover:text-orange-700"
                    >
                        Review all requests →
                    </button>
                </div>
            )}
        </div>
    );
};

export default PendingLeaves;