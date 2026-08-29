import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    BarChart3,
    TrendingUp,
    ArrowUpRight,
} from 'lucide-react';

import { API_BASE_URL } from '../../api/';

interface Transaction {
    id: number;
    amount: number | string;
    paymentDate: string;
    status: string;
}

interface MonthlyData {
    month: string;
    amount: number;
}

interface FeeCollectionTrendProps {
    refreshKey?: number;
}

const FeeCollectionTrend: React.FC<FeeCollectionTrendProps> = ({
    refreshKey = 0,
}) => {
    const [data, setData] = useState<MonthlyData[]>([]);
    const [totalCollected, setTotalCollected] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCollectionData();
    }, [refreshKey]);

    const fetchCollectionData = async () => {
        try {
            setLoading(true);

            const token =
                localStorage.getItem('token') ||
                sessionStorage.getItem('token');

            const response = await axios.get(
                `${API_BASE_URL}/fee-management/transactions`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const transactions: Transaction[] =
                response.data.data || [];

            const confirmedTransactions = transactions.filter(
                (transaction) =>
                    transaction.status === 'confirmed'
            );

            const monthlyMap: Record<string, number> = {};

            confirmedTransactions.forEach((transaction) => {
                const date = new Date(transaction.paymentDate);

                const key = `${date.getFullYear()}-${String(
                    date.getMonth() + 1
                ).padStart(2, '0')}`;

                monthlyMap[key] =
                    (monthlyMap[key] || 0) +
                    Number(transaction.amount || 0);
            });

            const months: MonthlyData[] = [];

            const now = new Date();

            for (let i = 5; i >= 0; i--) {
                const date = new Date(
                    now.getFullYear(),
                    now.getMonth() - i,
                    1
                );

                const key = `${date.getFullYear()}-${String(
                    date.getMonth() + 1
                ).padStart(2, '0')}`;

                months.push({
                    month: date.toLocaleDateString('en-US', {
                        month: 'short',
                    }),
                    amount: monthlyMap[key] || 0,
                });
            }

            const total = confirmedTransactions.reduce(
                (sum, transaction) =>
                    sum + Number(transaction.amount || 0),
                0
            );

            setData(months);
            setTotalCollected(total);
        } catch (error) {
            console.error(
                'Failed to fetch fee collection trend:',
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        if (amount >= 10000000) {
            return `रु ${(amount / 10000000).toFixed(1)}Cr`;
        }

        if (amount >= 100000) {
            return `रु ${(amount / 100000).toFixed(1)}L`;
        }

        if (amount >= 1000) {
            return `रु ${(amount / 1000).toFixed(1)}K`;
        }

        return `रु ${amount.toLocaleString('en-IN')}`;
    };

    const maxAmount = Math.max(
        ...data.map((item) => item.amount),
        1
    );

    if (loading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <div className="mb-2 h-5 w-40 animate-pulse rounded bg-gray-200" />
                        <div className="h-3 w-56 animate-pulse rounded bg-gray-200" />
                    </div>

                    <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200" />
                </div>

                <div className="h-40 animate-pulse rounded-xl bg-gray-100" />
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm sm:p-3">

            {/* Header */}
            <div className="mb-6 flex items-start justify-between">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <BarChart3 size={20} />
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-gray-900">
                            Fee Collection Trend
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Monthly payment collection
                        </p>
                    </div>
                </div>

                <div className="hidden items-center gap-2 rounded-lg bg-green-50 px-3 py-2 sm:flex">
                    <TrendingUp
                        size={15}
                        className="text-green-600"
                    />

                    <span className="text-xs font-semibold text-green-700">
                        Collection
                    </span>
                </div>
            </div>

            {/* Total */}
            <div className="mb-6">
                <p className="text-xs font-medium text-gray-500">
                    Total Collected
                </p>

                <div className="mt-1 flex items-center gap-2">
                    <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(totalCollected)}
                    </p>

                    <ArrowUpRight
                        size={18}
                        className="text-green-500"
                    />
                </div>
            </div>

            {/* Chart */}
            <div className="relative h-40">

                {/* Horizontal grid */}
                <div className="absolute inset-0 flex flex-col justify-between">
                    {[0, 1, 2, 3, 4].map((line) => (
                        <div
                            key={line}
                            className="border-t border-dashed border-gray-100"
                        />
                    ))}
                </div>

                {/* Bars */}
                <div className="absolute inset-0 flex items-end justify-around gap-3 px-2 pb-7 pt-4">
                    {data.map((item) => {
                        const height =
                            (item.amount / maxAmount) * 100;

                        return (
                            <div
                                key={item.month}
                                className="group relative flex h-full flex-1 flex-col justify-end"
                            >
                                {/* Tooltip */}
                                <div className="pointer-events-none absolute bottom-[calc(var(--bar-height)+0.5rem)] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                                    {formatCurrency(item.amount)}
                                </div>

                                {/* Bar */}
                                <div
                                    className="mx-auto w-full max-w-[52px] rounded-t-lg bg-blue-500 transition-all duration-500 group-hover:bg-blue-600"
                                    style={{
                                        height: `${Math.max(height, 2)}%`,
                                        ['--bar-height' as string]: `${height}%`,
                                    }}
                                />

                                {/* Month */}
                                <div className="absolute -bottom-7 left-0 right-0 text-center text-xs font-medium text-gray-400">
                                    {item.month}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-10 flex items-center justify-between border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400">
                    Last 6 months
                </p>

                <p className="text-xs font-medium text-gray-500">
                    Confirmed transactions only
                </p>
            </div>
        </div>
    );
};

export default FeeCollectionTrend;