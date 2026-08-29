import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
    Wallet,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Clock3,
    CircleDollarSign,
} from 'lucide-react';

import { API_BASE_URL } from '../../api/';

interface FeeAllocation {
    id: number;
    studentId: number;
    totalAmount: number | string;
    paidAmount: number | string;
    balance: number | string;
    discount?: number | string;
    status: string;
}

interface FeeSummary {
    totalAllocated: number;
    totalPaid: number;
    totalOutstanding: number;
    totalDiscount: number;

    paidCount: number;
    partialCount: number;
    pendingCount: number;
    overdueCount: number;
    waivedCount: number;

    collectionRate: number;
}

interface FeeOverviewProps {
    refreshKey?: number;
    onClick?: () => void;
}

const FeeOverview: React.FC<FeeOverviewProps> = ({
    refreshKey = 0,
    onClick,
}) => {
    const [summary, setSummary] = useState<FeeSummary>({
        totalAllocated: 0,
        totalPaid: 0,
        totalOutstanding: 0,
        totalDiscount: 0,

        paidCount: 0,
        partialCount: 0,
        pendingCount: 0,
        overdueCount: 0,
        waivedCount: 0,

        collectionRate: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeeOverview();
    }, [refreshKey]);

    const fetchFeeOverview = async () => {
        try {
            setLoading(true);

            const token =
                localStorage.getItem('token') ||
                sessionStorage.getItem('token');

            const response = await axios.get(
                `${API_BASE_URL}/fee-management/allocations`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const allocations: FeeAllocation[] =
                response.data.data || [];

            /*
             * --------------------------------------------------
             * Financial totals
             * --------------------------------------------------
             */
            const totalAllocated = allocations.reduce(
                (sum, fee) =>
                    sum + Number(fee.totalAmount || 0),
                0
            );

            const totalPaid = allocations.reduce(
                (sum, fee) =>
                    sum + Number(fee.paidAmount || 0),
                0
            );

            const totalOutstanding = allocations.reduce(
                (sum, fee) =>
                    sum + Number(fee.balance || 0),
                0
            );

            const totalDiscount = allocations.reduce(
                (sum, fee) =>
                    sum + Number(fee.discount || 0),
                0
            );

            /*
             * --------------------------------------------------
             * Status counts
             * --------------------------------------------------
             */
            const paidCount = allocations.filter(
                (fee) => fee.status === 'paid'
            ).length;

            const partialCount = allocations.filter(
                (fee) => fee.status === 'partial'
            ).length;

            const pendingCount = allocations.filter(
                (fee) => fee.status === 'pending'
            ).length;

            const overdueCount = allocations.filter(
                (fee) => fee.status === 'overdue'
            ).length;

            const waivedCount = allocations.filter(
                (fee) => fee.status === 'waived'
            ).length;

            /*
             * --------------------------------------------------
             * Collection rate
             *
             * Avoid division by zero.
             * --------------------------------------------------
             */
            const collectionRate =
                totalAllocated > 0
                    ? Number(
                        (
                            (totalPaid / totalAllocated) *
                            100
                        ).toFixed(1)
                    )
                    : 0;

            setSummary({
                totalAllocated,
                totalPaid,
                totalOutstanding,
                totalDiscount,

                paidCount,
                partialCount,
                pendingCount,
                overdueCount,
                waivedCount,

                collectionRate,
            });
        } catch (error) {
            console.error(
                'Failed to fetch fee overview:',
                error
            );
        } finally {
            setLoading(false);
        }
    };

    /*
     * ----------------------------------------------------
     * Format Nepali currency
     * ----------------------------------------------------
     */
    const formatCurrency = (amount: number) => {
        return `रु ${amount.toLocaleString('en-IN', {
            maximumFractionDigits: 0,
        })}`;
    };

    /*
     * ----------------------------------------------------
     * Status distribution
     * ----------------------------------------------------
     */
    const statusTotal = useMemo(() => {
        return (
            summary.paidCount +
            summary.partialCount +
            summary.pendingCount +
            summary.overdueCount +
            summary.waivedCount
        );
    }, [summary]);

    const getPercentage = (value: number) => {
        if (statusTotal === 0) {
            return 0;
        }

        return Number(
            ((value / statusTotal) * 100).toFixed(1)
        );
    };

    /*
     * ----------------------------------------------------
     * Loading state
     * ----------------------------------------------------
     */
    if (loading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <div className="mb-2 h-5 w-32 animate-pulse rounded bg-gray-200" />
                        <div className="h-3 w-52 animate-pulse rounded bg-gray-200" />
                    </div>

                    <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200" />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="h-24 animate-pulse rounded-xl bg-gray-100"
                        />
                    ))}
                </div>

                <div className="mt-6 h-48 animate-pulse rounded-xl bg-gray-100" />
            </div>
        );
    }

    return (
        <div
            className={`rounded-2xl border border-gray-200 bg-white p-2 shadow-sm sm:p-3 ${onClick
                ? 'cursor-pointer transition hover:border-gray-300 hover:shadow-md'
                : ''
                }`}
            onClick={onClick}
        >
            {/* =================================================
          Header
      ================================================= */}
            <div className="mb-4 flex items-start justify-between">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <Wallet size={20} />
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-gray-900">
                            Fee Overview
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Overall fee collection status
                        </p>
                    </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-2 text-gray-500">
                    <TrendingUp size={18} />
                </div>
            </div>

            {/* =================================================
          Financial summary
      ================================================= */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                {/* Total allocated */}
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-2">
                    <div className="mb-3 flex items-center gap-2">
                        <CircleDollarSign
                            size={17}
                            className="text-gray-500"
                        />

                        <span className="text-xs font-medium text-gray-500">
                            Total Allocated
                        </span>
                    </div>

                    <p className="text-md font-bold text-gray-900">
                        {formatCurrency(summary.totalAllocated)}
                    </p>
                </div>

                {/* Total paid */}
                <div className="rounded-xl border border-green-100 bg-green-50/60 p-2">
                    <div className="mb-3 flex items-center gap-2">
                        <CheckCircle2
                            size={17}
                            className="text-green-600"
                        />

                        <span className="text-xs font-medium text-gray-500">
                            Total Paid
                        </span>
                    </div>

                    <p className="text-md font-bold text-gray-900">
                        {formatCurrency(summary.totalPaid)}
                    </p>
                </div>

                {/* Outstanding */}
                <div className="rounded-xl border border-red-100 bg-red-50/60 p-2">
                    <div className="mb-3 flex items-center gap-2">
                        <AlertCircle
                            size={17}
                            className="text-red-600"
                        />

                        <span className="text-xs font-medium text-gray-500">
                            Outstanding
                        </span>
                    </div>

                    <p className="text-md font-bold text-gray-900">
                        {formatCurrency(summary.totalOutstanding)}
                    </p>
                </div>
            </div>

            {/* =================================================
          Collection progress
      ================================================= */}
            <div className="mt-4 rounded-xl border border-gray-100 p-4">

                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-gray-900">
                            Collection Rate
                        </p>

                        <p className="mt-0.5 text-xs text-gray-500">
                            Paid against total allocated fees
                        </p>
                    </div>

                    <p className="text-lg font-bold text-indigo-600">
                        {summary.collectionRate}%
                    </p>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                        className="h-full rounded-full bg-indigo-500 transition-all duration-700"
                        style={{
                            width: `${Math.min(
                                summary.collectionRate,
                                100
                            )}%`,
                        }}
                    />
                </div>
            </div>

            {/* =================================================
          Fee status
      ================================================= */}
            <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-gray-900">
                            Allocation Status
                        </p>

                        <p className="mt-0.5 text-xs text-gray-500">
                            Current fee allocation distribution
                        </p>
                    </div>

                    <span className="text-xs font-medium text-gray-400">
                        {statusTotal} allocations
                    </span>
                </div>

                <div className="space-y-3">

                    {/* Paid */}
                    <StatusRow
                        label="Paid"
                        count={summary.paidCount}
                        percentage={getPercentage(
                            summary.paidCount
                        )}
                        icon={CheckCircle2}
                        iconClass="text-green-600"
                        barClass="bg-green-500"
                    />

                    {/* Partial */}
                    <StatusRow
                        label="Partial"
                        count={summary.partialCount}
                        percentage={getPercentage(
                            summary.partialCount
                        )}
                        icon={TrendingUp}
                        iconClass="text-blue-600"
                        barClass="bg-blue-500"
                    />

                    {/* Pending */}
                    <StatusRow
                        label="Pending"
                        count={summary.pendingCount}
                        percentage={getPercentage(
                            summary.pendingCount
                        )}
                        icon={Clock3}
                        iconClass="text-yellow-600"
                        barClass="bg-yellow-500"
                    />

                    {/* Overdue */}
                    <StatusRow
                        label="Overdue"
                        count={summary.overdueCount}
                        percentage={getPercentage(
                            summary.overdueCount
                        )}
                        icon={AlertCircle}
                        iconClass="text-red-600"
                        barClass="bg-red-500"
                    />

                    {/* Waived */}
                    {summary.waivedCount > 0 && (
                        <StatusRow
                            label="Waived"
                            count={summary.waivedCount}
                            percentage={getPercentage(
                                summary.waivedCount
                            )}
                            icon={CircleDollarSign}
                            iconClass="text-gray-500"
                            barClass="bg-gray-400"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

/*
 * ======================================================
 * Status Row
 * ======================================================
 */

interface StatusRowProps {
    label: string;
    count: number;
    percentage: number;
    icon: React.ElementType;
    iconClass: string;
    barClass: string;
}

const StatusRow: React.FC<StatusRowProps> = ({
    label,
    count,
    percentage,
    icon: Icon,
    iconClass,
    barClass,
}) => {
    return (
        <div>
            <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon
                        size={15}
                        className={iconClass}
                    />

                    <span className="text-xs font-medium text-gray-600">
                        {label}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-700">
                        {count}
                    </span>

                    <span className="w-10 text-right text-xs text-gray-400">
                        {percentage}%
                    </span>
                </div>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${barClass}`}
                    style={{
                        width: `${percentage}%`,
                    }}
                />
            </div>
        </div>
    );
};

export default FeeOverview;