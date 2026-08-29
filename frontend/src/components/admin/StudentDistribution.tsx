import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
    GraduationCap,
    Users,
} from 'lucide-react';

import { API_BASE_URL } from '../../api/';

interface Student {
    id: number;
    currentClass?: string;
    section?: string;
    gender?: string;
}

interface StudentDistributionProps {
    refreshKey?: number;
}

interface ClassDistribution {
    className: string;
    count: number;
    percentage: number;
}

const StudentDistribution: React.FC<StudentDistributionProps> = ({
    refreshKey = 0,
}) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudents();
    }, [refreshKey]);

    const fetchStudents = async () => {
        try {
            setLoading(true);

            const token =
                localStorage.getItem('token') ||
                sessionStorage.getItem('token');

            const response = await axios.get(
                `${API_BASE_URL}/students`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setStudents(response.data.data || []);
        } catch (error) {
            console.error(
                'Failed to fetch student distribution:',
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const distribution = useMemo<ClassDistribution[]>(() => {
        const classMap: Record<string, number> = {};

        students.forEach((student) => {
            const className =
                student.currentClass || 'Unassigned';

            classMap[className] =
                (classMap[className] || 0) + 1;
        });

        const total = students.length;

        return Object.entries(classMap)
            .map(([className, count]) => ({
                className,
                count,
                percentage:
                    total > 0
                        ? Number(
                            ((count / total) * 100).toFixed(1)
                        )
                        : 0,
            }))
            .sort((a, b) => b.count - a.count);
    }, [students]);

    const maxCount = Math.max(
        ...distribution.map((item) => item.count),
        1
    );

    if (loading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-6 flex items-center gap-3">
                    <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200" />

                    <div>
                        <div className="mb-2 h-5 w-40 animate-pulse rounded bg-gray-200" />
                        <div className="h-3 w-56 animate-pulse rounded bg-gray-200" />
                    </div>
                </div>

                <div className="flex h-40 items-end gap-3 px-3">
                    {[40, 70, 55, 85, 60, 75].map(
                        (height, index) => (
                            <div
                                key={index}
                                className="flex-1 animate-pulse rounded-t-lg bg-gray-200"
                                style={{
                                    height: `${height}%`,
                                }}
                            />
                        )
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

            {/* Header */}
            <div className="mb-6 flex items-start justify-between">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <GraduationCap size={20} />
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-gray-900">
                            Student Distribution
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Students by class
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-2">
                    <Users
                        size={15}
                        className="text-gray-500"
                    />

                    <span className="text-xs font-semibold text-gray-600">
                        {students.length}
                    </span>
                </div>
            </div>

            {/* Empty state */}
            {distribution.length === 0 ? (
                <div className="flex min-h-[260px] items-center justify-center">
                    <p className="text-sm text-gray-400">
                        No student data available.
                    </p>
                </div>
            ) : (
                <>
                    {/* Chart */}
                    <div className="mt-2">

                        {/* Graph Area */}
                        <div className="relative h-40">

                            {/* Y-axis + Grid */}
                            <div className="absolute inset-0 flex flex-col justify-between">
                                {[100, 75, 50, 25, 0].map((value) => (
                                    <div
                                        key={value}
                                        className="flex items-center gap-3"
                                    >
                                        <span className="w-7 text-right text-[10px] text-gray-400">
                                            {Math.round(
                                                (maxCount * value) / 100
                                            )}
                                        </span>

                                        <div className="flex-1 border-t border-dashed border-gray-100" />
                                    </div>
                                ))}
                            </div>

                            {/* Bars */}
                            <div className="absolute bottom-0 left-10 right-0 top-0 flex items-end justify-around gap-3 sm:gap-5">
                                {distribution.map((item) => {
                                    const height =
                                        (item.count / maxCount) * 100;

                                    return (
                                        <div
                                            key={item.className}
                                            className="group flex h-full flex-1 flex-col items-center justify-end"
                                        >
                                            {/* Value */}
                                            <div className="mb-2 text-xs font-semibold text-gray-600 opacity-0 transition-opacity group-hover:opacity-100">
                                                {item.count}
                                            </div>

                                            {/* Bar */}
                                            <div
                                                className="w-full max-w-12 rounded-t-lg bg-blue-500 transition-all duration-500 hover:bg-blue-600"
                                                style={{
                                                    height: `${Math.max(
                                                        height,
                                                        3
                                                    )}%`,
                                                }}
                                                title={`${item.className}: ${item.count} students`}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* X-Axis */}
                        <div className="ml-10 flex gap-3 border-t border-gray-100 pt-3 sm:gap-5">
                            {distribution.map((item) => (
                                <div
                                    key={item.className}
                                    className="min-w-0 flex-1 text-center"
                                >
                                    <span
                                        className="block truncate text-[11px] font-medium text-gray-500"
                                        title={item.className}
                                    >
                                        {item.className}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Footer */}
                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                        <span className="text-xs text-gray-400">
                            Total students
                        </span>

                        <span className="text-sm font-semibold text-gray-700">
                            {students.length}
                        </span>
                    </div>
                </>
            )}
        </div>
    );
};

export default StudentDistribution;