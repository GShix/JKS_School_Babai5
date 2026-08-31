'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    BookOpen,
    Check,
    Loader2,
    Search,
    X,
} from 'lucide-react';

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function AssignSubjects({
    classData,
    onClose,
    onSuccess,
}) {
    const [subjects, setSubjects] = useState([]);
    const [assignedSubjects, setAssignedSubjects] = useState([]);

    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [search, setSearch] = useState('');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSubjects();
    }, [classData?.id]);

    const fetchSubjects = async () => {
        try {
            setLoading(true);

            const [subjectsResponse, assignedResponse] =
                await Promise.all([
                    fetch(
                        `${API_URL}/subjects?academicYearId=${classData.academicYearId}`
                    ),
                    fetch(
                        `${API_URL}/class-subjects/class/${classData.id}`
                    ),
                ]);

            if (!subjectsResponse.ok) {
                throw new Error('Failed to fetch subjects');
            }

            if (!assignedResponse.ok) {
                throw new Error('Failed to fetch assigned subjects');
            }

            const subjectsData = await subjectsResponse.json();
            const assignedData = await assignedResponse.json();

            const allSubjects = subjectsData.data || [];
            const assigned = assignedData.data || [];

            setSubjects(allSubjects);
            setAssignedSubjects(assigned);

            setSelectedSubjects(
                assigned.map((item) => item.subjectId)
            );
        } catch (error) {
            console.error('Fetch subjects error:', error);
        } finally {
            setLoading(false);
        }
    };

    const assignedIds = useMemo(
        () => new Set(assignedSubjects.map((item) => item.subjectId)),
        [assignedSubjects]
    );

    const filteredSubjects = useMemo(() => {
        const keyword = search.toLowerCase().trim();

        if (!keyword) {
            return subjects;
        }

        return subjects.filter((subject) => {
            return (
                subject.subjectName
                    ?.toLowerCase()
                    .includes(keyword) ||
                subject.subjectCode
                    ?.toLowerCase()
                    .includes(keyword)
            );
        });
    }, [subjects, search]);

    const toggleSubject = (subjectId) => {
        setSelectedSubjects((current) => {
            if (current.includes(subjectId)) {
                return current.filter((id) => id !== subjectId);
            }

            return [...current, subjectId];
        });
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            const originalIds = new Set(
                assignedSubjects.map((item) => item.subjectId)
            );

            const currentIds = new Set(selectedSubjects);

            // Subjects to add
            const subjectsToAdd = selectedSubjects.filter(
                (id) => !originalIds.has(id)
            );

            // Subjects to remove
            const subjectsToRemove = assignedSubjects.filter(
                (item) => !currentIds.has(item.subjectId)
            );

            // Add new assignments
            await Promise.all(
                subjectsToAdd.map(async (subjectId) => {
                    const response = await fetch(
                        `${API_URL}/class-subjects`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                classId: classData.id,
                                subjectId,
                                isCompulsory: true,
                            }),
                        }
                    );

                    if (!response.ok) {
                        const error = await response.json();

                        throw new Error(
                            error.message ||
                            'Failed to assign subject'
                        );
                    }
                })
            );

            // Remove unselected assignments
            await Promise.all(
                subjectsToRemove.map(async (assignment) => {
                    const response = await fetch(
                        `${API_URL}/class-subjects/class/${classData.id}/subject/${assignment.subjectId}`,
                        {
                            method: 'DELETE',
                        }
                    );

                    if (!response.ok) {
                        const error = await response.json();

                        throw new Error(
                            error.message ||
                            'Failed to remove subject'
                        );
                    }
                })
            );

            onSuccess?.();
            onClose?.();
        } catch (error) {
            console.error('Save subjects error:', error);

            alert(
                error.message ||
                'Failed to update class subjects'
            );
        } finally {
            setSaving(false);
        }
    };

    if (!classData) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-800">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                <BookOpen size={20} />
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Assign Subjects
                                </h2>

                                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                                    {classData.name}
                                    {classData.section
                                        ? ` • Section ${classData.section}`
                                        : ''}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Search */}
                    <div className="relative mb-4">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search subjects..."
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-800"
                        />
                    </div>

                    {/* Subject list */}
                    <div className="max-h-[400px] space-y-2 overflow-y-auto pr-1">
                        {loading ? (
                            <div className="flex items-center justify-center py-16">
                                <Loader2
                                    size={24}
                                    className="animate-spin text-blue-600"
                                />
                            </div>
                        ) : filteredSubjects.length === 0 ? (
                            <div className="py-16 text-center">
                                <BookOpen
                                    size={32}
                                    className="mx-auto mb-3 text-gray-300"
                                />

                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    No subjects found
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    Try a different search term.
                                </p>
                            </div>
                        ) : (
                            filteredSubjects.map((subject) => {
                                const selected =
                                    selectedSubjects.includes(
                                        subject.id
                                    );

                                const alreadyAssigned =
                                    assignedIds.has(subject.id);

                                return (
                                    <button
                                        key={subject.id}
                                        type="button"
                                        onClick={() =>
                                            toggleSubject(subject.id)
                                        }
                                        className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${selected
                                                ? 'border-blue-500 bg-blue-50/70 dark:border-blue-500 dark:bg-blue-500/10'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        {/* Checkbox */}
                                        <div
                                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${selected
                                                    ? 'border-blue-600 bg-blue-600 text-white'
                                                    : 'border-gray-300 dark:border-gray-600'
                                                }`}
                                        >
                                            {selected && (
                                                <Check size={14} />
                                            )}
                                        </div>

                                        {/* Icon */}
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                            <BookOpen size={17} />
                                        </div>

                                        {/* Details */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                                    {
                                                        subject.subjectName
                                                    }
                                                </p>

                                                {alreadyAssigned && (
                                                    <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-500/10 dark:text-green-400">
                                                        Assigned
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                                <span>
                                                    {
                                                        subject.subjectCode
                                                    }
                                                </span>

                                                <span>•</span>

                                                <span>
                                                    {
                                                        subject.subjectType
                                                    }
                                                </span>

                                                {subject.isOptional && (
                                                    <>
                                                        <span>•</span>

                                                        <span className="text-amber-600">
                                                            Optional
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-950/50">
                    <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedSubjects.length}{' '}
                            subject
                            {selectedSubjects.length !== 1
                                ? 's'
                                : ''}{' '}
                            selected
                        </p>

                        <p className="text-xs text-gray-500">
                            Select all subjects this class will study.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving && (
                                <Loader2
                                    size={16}
                                    className="animate-spin"
                                />
                            )}

                            {saving
                                ? 'Saving...'
                                : 'Save Subjects'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}