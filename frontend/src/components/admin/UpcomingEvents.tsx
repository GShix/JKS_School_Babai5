import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    CalendarDays,
    Clock3,
    MapPin,
    ChevronRight,
} from 'lucide-react';

import { API_BASE_URL } from '../../api/';

interface EventItem {
    id: number;
    title: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    date?: string;
    startTime?: string;
    location?: string;
    type?: string;
}

interface UpcomingEventsProps {
    refreshKey?: number;
    limit?: number;
    onEventClick?: (event: EventItem) => void;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({
    refreshKey = 0,
    limit = 5,
    onEventClick,
}) => {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, [refreshKey]);

    const fetchEvents = async () => {
        try {
            setLoading(true);

            const token =
                localStorage.getItem('token') ||
                sessionStorage.getItem('token');

            const response = await axios.get(
                `${API_BASE_URL}/events`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data: EventItem[] =
                response.data.data || [];

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const upcoming = data
                .filter((event) => {
                    const eventDate = new Date(
                        event.startDate || event.date || ''
                    );

                    return (
                        !Number.isNaN(eventDate.getTime()) &&
                        eventDate >= today
                    );
                })
                .sort(
                    (a, b) =>
                        new Date(
                            a.startDate || a.date || ''
                        ).getTime() -
                        new Date(
                            b.startDate || b.date || ''
                        ).getTime()
                )
                .slice(0, limit);

            setEvents(upcoming);
        } catch (error) {
            console.error(
                'Failed to fetch upcoming events:',
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date?: string) => {
        if (!date) return 'TBD';

        const parsed = new Date(date);

        if (Number.isNaN(parsed.getTime())) {
            return 'TBD';
        }

        return parsed.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    const formatWeekday = (date?: string) => {
        if (!date) return '';

        const parsed = new Date(date);

        if (Number.isNaN(parsed.getTime())) {
            return '';
        }

        return parsed.toLocaleDateString('en-US', {
            weekday: 'short',
        });
    };

    const getEventDate = (event: EventItem) =>
        event.startDate || event.date;

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
                            className="flex gap-3"
                        >
                            <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-200" />

                            <div className="flex-1">
                                <div className="mb-2 h-4 w-40 animate-pulse rounded bg-gray-200" />
                                <div className="h-3 w-28 animate-pulse rounded bg-gray-100" />
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
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                        <CalendarDays size={20} />
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-gray-900">
                            Upcoming Events
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            School events and activities
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={fetchEvents}
                    className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-600"
                    title="Refresh"
                >
                    <CalendarDays size={17} />
                </button>
            </div>

            {/* Empty state */}
            {events.length === 0 ? (
                <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
                        <CalendarDays size={22} />
                    </div>

                    <p className="text-sm font-medium text-gray-600">
                        No upcoming events
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                        Upcoming school activities will appear here.
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {events.map((event) => {
                        const eventDate = getEventDate(event);

                        return (
                            <button
                                key={event.id}
                                type="button"
                                onClick={() =>
                                    onEventClick?.(event)
                                }
                                className="group flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-gray-50"
                            >
                                {/* Date */}
                                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-pink-50">
                                    <span className="text-[10px] font-semibold uppercase text-pink-500">
                                        {formatWeekday(eventDate)}
                                    </span>

                                    <span className="text-sm font-bold text-pink-700">
                                        {formatDate(eventDate)}
                                    </span>
                                </div>

                                {/* Details */}
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-gray-800">
                                        {event.title}
                                    </p>

                                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                                        {event.startTime && (
                                            <span className="flex items-center gap-1">
                                                <Clock3 size={12} />
                                                {event.startTime}
                                            </span>
                                        )}

                                        {event.location && (
                                            <span className="flex items-center gap-1">
                                                <MapPin size={12} />
                                                {event.location}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Type */}
                                {event.type && (
                                    <span className="hidden rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-medium capitalize text-gray-500 sm:block">
                                        {event.type}
                                    </span>
                                )}

                                <ChevronRight
                                    size={16}
                                    className="shrink-0 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-gray-500"
                                />
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Footer */}
            {events.length > 0 && (
                <div className="mt-5 border-t border-gray-100 pt-4">
                    <button
                        type="button"
                        className="text-xs font-semibold text-pink-600 transition hover:text-pink-700"
                    >
                        View all events →
                    </button>
                </div>
            )}
        </div>
    );
};

export default UpcomingEvents;