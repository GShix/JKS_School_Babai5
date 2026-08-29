import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
    Activity,
    CalendarDays,
    CheckCircle2,
    Clock3,
    UserX,
} from 'lucide-react';

import { API_BASE_URL } from '../../api/';

interface AttendanceRecord {
    id: number;
    studentId: number;
    date: string;
    status: 'present' | 'absent' | 'late' | 'excused' | string;
    class?: string;
    section?: string;
}

interface SchoolClass {
    id: number;
    name: string;
    section?: string;
    status?: string;
    academicYearId?: number;
    academicYear?: {
        id: number;
        year: string;
        title?: string;
        isCurrent?: boolean;
    };
}

interface AttendanceOverviewProps {
    refreshKey?: number;
}

interface AttendanceSummary {
    present: number;
    absent: number;
    late: number;
    excused: number;
    total: number;
}

const AttendanceOverview: React.FC<AttendanceOverviewProps> = ({
    refreshKey = 0,
}) => {
    const [summary, setSummary] = useState<AttendanceSummary>({
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
        total: 0,
    });

    const [loading, setLoading] = useState(true);
    const [hasData, setHasData] = useState(false);

    useEffect(() => {
        fetchTodayAttendance();
    }, [refreshKey]);

    const fetchTodayAttendance = async () => {
        try {
            setLoading(true);
            setHasData(false);

            const token =
                localStorage.getItem('token') ||
                sessionStorage.getItem('token');

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            /*
             * --------------------------------------------------
             * Today's date
             * --------------------------------------------------
             */
            const today = new Date().toISOString().split('T')[0];

            /*
             * --------------------------------------------------
             * Get current/active classes
             * --------------------------------------------------
             */
            const classesRes = await axios.get(
                `${API_BASE_URL}/classes?status=active`,
                {
                    headers,
                }
            );

            const classes: SchoolClass[] =
                classesRes.data.data || [];

            if (classes.length === 0) {
                setSummary({
                    present: 0,
                    absent: 0,
                    late: 0,
                    excused: 0,
                    total: 0,
                });

                return;
            }

            /*
             * --------------------------------------------------
             * Fetch today's attendance for each class
             *
             * Existing backend endpoint:
             * GET /attendance/class
             *
             * Requires:
             * - date
             * - class
             * - optional section
             * --------------------------------------------------
             */
            const attendanceRequests = classes.map((classItem) => {
                const params: Record<string, string> = {
                    date: today,
                    class: classItem.name,
                };

                if (classItem.section) {
                    params.section = classItem.section;
                }

                return axios.get(
                    `${API_BASE_URL}/attendance/class`,
                    {
                        headers,
                        params,
                    }
                );
            });

            const responses = await Promise.all(
                attendanceRequests
            );

            /*
             * --------------------------------------------------
             * Combine attendance records from all classes
             * --------------------------------------------------
             */
            const allRecords: AttendanceRecord[] =
                responses.flatMap(
                    (response) => response.data.data || []
                );

            /*
             * --------------------------------------------------
             * Calculate school-wide attendance
             * --------------------------------------------------
             */
            const present = allRecords.filter(
                (record) => record.status === 'present'
            ).length;

            const absent = allRecords.filter(
                (record) => record.status === 'absent'
            ).length;

            const late = allRecords.filter(
                (record) => record.status === 'late'
            ).length;

            const excused = allRecords.filter(
                (record) => record.status === 'excused'
            ).length;

            setSummary({
                present,
                absent,
                late,
                excused,
                total: allRecords.length,
            });

            setHasData(allRecords.length > 0);
        } catch (error) {
            console.error(
                'Failed to fetch attendance overview:',
                error
            );
        } finally {
            setLoading(false);
        }
    };

    /*
     * ----------------------------------------------------
     * Attendance percentage
     * ----------------------------------------------------
     */
    const attendanceRate = useMemo(() => {
        if (summary.total === 0) {
            return 0;
        }

        return Number(
            (
                ((summary.present + summary.late) /
                    summary.total) *
                100
            ).toFixed(1)
        );
    }, [summary]);

    /*
     * ----------------------------------------------------
     * Loading
     * ----------------------------------------------------
     */
    if (loading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-2 sm:p-3 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <div className="mb-2 h-5 w-44 animate-pulse rounded bg-gray-200" />
                        <div className="h-3 w-64 animate-pulse rounded bg-gray-200" />
                    </div>

                    <div className="h-9 w-24 animate-pulse rounded-lg bg-gray-200" />
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="rounded-xl bg-gray-50 p-4"
                        >
                            <div className="mb-3 h-8 w-8 animate-pulse rounded-lg bg-gray-200" />
                            <div className="mb-2 h-5 w-16 animate-pulse rounded bg-gray-200" />
                            <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    /*
     * ----------------------------------------------------
     * Empty state
     * ----------------------------------------------------
     */
    if (!hasData) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-2 sm:p-3 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                        <CalendarDays size={21} />
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-gray-900">
                            Attendance Overview
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            No attendance records have been recorded for today yet.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm sm:p-3">

            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                        <Activity size={20} />
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-gray-900">
                            Attendance Overview
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Today's school-wide attendance
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
                    <CalendarDays size={15} />

                    <span>
                        {new Date().toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </span>
                </div>
            </div>

            {/* Main percentage */}
            <div className="mb-6 flex flex-col items-center justify-center rounded-2xl bg-gray-50 px-6 py-7">
                <p className="text-sm font-medium text-gray-500">
                    Attendance Rate
                </p>

                <p className="mt-1 text-4xl font-bold tracking-tight text-gray-900">
                    {attendanceRate}%
                </p>

                <p className="mt-1 text-xs text-gray-500">
                    {summary.present + summary.late} of {summary.total}{' '}
                    students attended
                </p>

                {/* Progress */}
                <div className="mt-5 h-2.5 w-full max-w-md overflow-hidden rounded-full bg-gray-200">
                    <div
                        className="h-full rounded-full bg-green-500 transition-all duration-500"
                        style={{
                            width: `${Math.min(attendanceRate, 100)}%`,
                        }}
                    />
                </div>
            </div>

            {/* Status cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                {/* Present */}
                <div className="rounded-xl border border-gray-100 bg-green-50/60 p-4">
                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600">
                        <CheckCircle2 size={17} />
                    </div>

                    <p className="text-xl font-bold text-gray-900">
                        {summary.present}
                    </p>

                    <p className="mt-0.5 text-xs font-medium text-gray-500">
                        Present
                    </p>
                </div>

                {/* Absent */}
                <div className="rounded-xl border border-gray-100 bg-red-50/60 p-4">
                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">
                        <UserX size={17} />
                    </div>

                    <p className="text-xl font-bold text-gray-900">
                        {summary.absent}
                    </p>

                    <p className="mt-0.5 text-xs font-medium text-gray-500">
                        Absent
                    </p>
                </div>

                {/* Late */}
                <div className="rounded-xl border border-gray-100 bg-orange-50/60 p-4">
                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                        <Clock3 size={17} />
                    </div>

                    <p className="text-xl font-bold text-gray-900">
                        {summary.late}
                    </p>

                    <p className="mt-0.5 text-xs font-medium text-gray-500">
                        Late
                    </p>
                </div>

                {/* Excused */}
                <div className="rounded-xl border border-gray-100 bg-blue-50/60 p-4">
                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                        <CalendarDays size={17} />
                    </div>

                    <p className="text-xl font-bold text-gray-900">
                        {summary.excused}
                    </p>

                    <p className="mt-0.5 text-xs font-medium text-gray-500">
                        Excused
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AttendanceOverview;