import React from 'react';
import { CalendarDays, ChevronDown, RefreshCw } from 'lucide-react';

interface DashboardHeaderProps {
    academicYears?: string[];
    selectedYear?: string;
    onYearChange?: (year: string) => void;
    onRefresh?: () => void;
    refreshing?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    academicYears = [],
    selectedYear,
    onYearChange,
    onRefresh,
    refreshing = false,
}) => {
    const currentDate = new Date();

    const formattedDate = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className="mb-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Left side */}
                <div>
                    <p className="text-xs font-medium text-gray-500">
                        {formattedDate}
                    </p>

                    <h1 className="text-lg font-semibold text-gray-900">
                        Dashboard
                    </h1>

                    <p className="text-sm text-gray-500">
                        Welcome back, Administrator. Here's what's happening at your
                        school today.
                    </p>
                </div>

                {/* Right side */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* Academic year selector */}
                    <div className="relative">
                        <CalendarDays
                            size={16}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                        />

                        <select
                            value={selectedYear || ''}
                            onChange={(e) => onYearChange?.(e.target.value)}
                            disabled={academicYears.length === 0}
                            className=" h-8 appearance-none rounded-lg border border-gray-200 bg-white pl-9 pr-9 text-sm font-medium text-gray-700 shadow-sm outline-none transition hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50">
                            {academicYears.length === 0 ? (
                                <option value="">
                                    Academic Year
                                </option>
                            ) : (
                                academicYears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))
                            )}
                        </select>

                        <ChevronDown
                            size={14}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                    </div>

                    {/* Refresh button */}
                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={refreshing}
                        title="Refresh dashboard"
                        className=" inline-flex h-8 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60">
                        <RefreshCw
                            size={14}
                            className={refreshing ? 'animate-spin' : ''}
                        />

                        <span className="hidden sm:inline">
                            {refreshing ? 'Refreshing...' : 'Refresh'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;