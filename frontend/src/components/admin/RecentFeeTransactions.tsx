import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import {
    Receipt,
    CreditCard,
    Banknote,
    Landmark,
    WalletCards,
    RefreshCw,
    ArrowRight,
} from 'lucide-react';

import { API_BASE_URL } from '../../api/';
import { Link } from 'react-router-dom';

interface FeeTransaction {
    id: number;
    receiptNumber: string;
    studentId: number;
    amount: number | string;
    paymentMethod: string;
    paymentDate: string;
    transactionDate: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    collectedByName?: string;
    referenceNumber?: string;
}

interface RecentFeeTransactionsProps {
    refreshKey?: number;
    limit?: number;
}

const RecentFeeTransactions: React.FC<
    RecentFeeTransactionsProps
> = ({
    refreshKey = 0,
    limit = 6,
}) => {
        const [transactions, setTransactions] = useState<FeeTransaction[]>([]);
        const [loading, setLoading] = useState(true);
        const [refreshing, setRefreshing] = useState(false);

        const fetchTransactions = useCallback(async () => {
            try {
                setRefreshing(true);

                const token =
                    localStorage.getItem('token') ||
                    sessionStorage.getItem('token');

                const params = new URLSearchParams();

                params.append('status', 'confirmed');

                const response = await axios.get(
                    `${API_BASE_URL}/fee-management/transactions?${params.toString()}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = response.data.data;

                const confirmedTransactions: FeeTransaction[] =
                    data?.transactions || [];

                const recent = [...confirmedTransactions]
                    .filter(
                        (transaction) =>
                            transaction.status === 'confirmed'
                    )
                    .sort(
                        (a, b) =>
                            new Date(b.transactionDate).getTime() -
                            new Date(a.transactionDate).getTime()
                    )
                    .slice(0, limit);

                setTransactions(recent);
            } catch (error) {
                console.error(
                    'Failed to fetch recent fee transactions:',
                    error
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        }, [limit]);

        useEffect(() => {
            fetchTransactions();
        }, [fetchTransactions, refreshKey]);

        const formatCurrency = (amount: number | string) =>
            `रु ${Number(amount || 0).toLocaleString('en-IN', {
                maximumFractionDigits: 0,
            })}`;

        const formatDate = (date: string) =>
            new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });

        const getPaymentIcon = (method: string) => {
            switch (method) {
                case 'bank_transfer':
                    return Landmark;

                case 'card':
                    return CreditCard;

                case 'online':
                    return WalletCards;

                case 'cheque':
                    return Receipt;

                default:
                    return Banknote;
            }
        };

        const getPaymentLabel = (method: string) => {
            switch (method) {
                case 'bank_transfer':
                    return 'Bank Transfer';

                case 'card':
                    return 'Card';

                case 'online':
                    return 'Online';

                case 'cheque':
                    return 'Cheque';

                default:
                    return 'Cash';
            }
        };

        /*
         * Loading state
         */
        if (loading) {
            return (
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-100" />

                            <div>
                                <div className="mb-2 h-4 w-40 animate-pulse rounded bg-gray-200" />
                                <div className="h-3 w-48 animate-pulse rounded bg-gray-100" />
                            </div>
                        </div>

                        <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-100" />
                    </div>

                    <div className="space-y-1">
                        {Array.from({ length: Math.min(limit, 4) }).map(
                            (_, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 rounded-xl p-3"
                                >
                                    <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-100" />

                                    <div className="flex-1">
                                        <div className="mb-2 h-3 w-32 animate-pulse rounded bg-gray-200" />
                                        <div className="h-3 w-44 animate-pulse rounded bg-gray-100" />
                                    </div>

                                    <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                                </div>
                            )
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                {/* Header */}
                <div className="mb-5 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <Receipt size={19} />
                        </div>

                        <div>
                            <h2 className="text-[15px] font-semibold tracking-tight text-gray-900">
                                Recent Transactions
                            </h2>

                            <p className="mt-0.5 text-xs text-gray-500">
                                Latest confirmed payments
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={fetchTransactions}
                        disabled={refreshing}
                        title="Refresh transactions"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50"
                    >
                        <RefreshCw
                            size={17}
                            className={
                                refreshing ? 'animate-spin' : ''
                            }
                        />
                    </button>
                </div>

                {/* Empty */}
                {transactions.length === 0 ? (
                    <div className="flex min-h-[230px] flex-col items-center justify-center">
                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
                            <Receipt size={20} />
                        </div>

                        <p className="text-sm font-medium text-gray-700">
                            No confirmed payments
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                            Confirmed fee transactions will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {transactions.map((transaction) => {
                            const PaymentIcon = getPaymentIcon(
                                transaction.paymentMethod
                            );

                            return (
                                <div
                                    key={transaction.id}
                                    className="group flex items-center gap-3 rounded-xl px-2 py-3 transition hover:bg-gray-50"
                                >
                                    {/* Payment icon */}
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition group-hover:bg-indigo-50 group-hover:text-indigo-600">
                                        <PaymentIcon size={17} />
                                    </div>

                                    {/* Details */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="truncate text-sm font-semibold text-gray-800">
                                                {transaction.receiptNumber}
                                            </p>

                                            <span className="hidden rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 sm:inline-flex">
                                                Confirmed
                                            </span>
                                        </div>

                                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                                            <span>
                                                Student #{transaction.studentId}
                                            </span>

                                            <span className="text-gray-300">
                                                •
                                            </span>

                                            <span>
                                                {getPaymentLabel(
                                                    transaction.paymentMethod
                                                )}
                                            </span>

                                            <span className="hidden text-gray-300 sm:inline">
                                                •
                                            </span>

                                            <span className="hidden sm:inline">
                                                {formatDate(
                                                    transaction.paymentDate
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Amount */}
                                    <div className="shrink-0 text-right">
                                        <p className="text-sm font-semibold tracking-tight text-gray-900">
                                            {formatCurrency(
                                                transaction.amount
                                            )}
                                        </p>

                                        {transaction.collectedByName && (
                                            <p className="mt-0.5 hidden max-w-[100px] truncate text-[10px] text-gray-400 sm:block">
                                                {transaction.collectedByName}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Footer */}
                {transactions.length > 0 && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                        <Link
                            to="/admin/fee-transactions"
                            type="button"
                            className="group flex items-center gap-1.5 text-xs font-semibold text-indigo-600 transition hover:text-indigo-700"
                        >
                            View all transactions

                            <ArrowRight
                                size={13}
                                className="transition-transform group-hover:translate-x-0.5"
                            />
                        </Link>
                    </div>
                )}
            </div>
        );
    };

export default RecentFeeTransactions;