import React, {
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    BookOpen,
    Check,
    Save,
    Users,
    X,
    RefreshCw,
} from 'lucide-react';

import axios from 'axios';

import Button from '../../components/shared/Button';
import FormInput from '../../components/shared/FormInput';
import Select from '../../components/shared/Select';

import { API_BASE_URL } from '../../api/config';

import {
    showError,
    showSuccess,
} from '../../utils/sweetAlert';

interface AcademicYear {
    id: number;
    year: string;
    title?: string;
    isCurrent?: boolean;
}

interface ClassItem {
    id: number;
    academicYearId: number;
    name: string;
    medium?: string;
    section?: string;
    department?: string;
    status?: string;
    totalStudents?: number;
    academicYear?: AcademicYear;
}

interface Subject {
    id: string;
    academicYearId: number;
    subjectName: string;
    subjectCode: string;
    description?: string;
    subjectType:
    | 'THEORY'
    | 'PRACTICAL'
    | 'BOTH';
    isOptional: boolean;
    isActive: boolean;
}

interface ClassSubjectAssignment {
    id: string;
    classId: number;
    subjectId: string;
    isCompulsory: boolean;
    status: 'active' | 'inactive';
    subject?: Subject;
}

interface SubjectSelection {
    subjectId: string;
    isCompulsory: boolean;
}

const AssignSubjects: React.FC = () => {
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>(
        []
    );

    const [assignments, setAssignments] = useState<
        ClassSubjectAssignment[]
    >([]);

    const [selectedClassId, setSelectedClassId] =
        useState('');

    const [selectedSubjects, setSelectedSubjects] =
        useState<Record<string, SubjectSelection>>({});

    const [search, setSearch] = useState('');

    const [loadingClasses, setLoadingClasses] =
        useState(false);

    const [loadingSubjects, setLoadingSubjects] =
        useState(false);

    const [saving, setSaving] = useState(false);

    const token =
        typeof window !== 'undefined'
            ? localStorage.getItem('token') ||
            sessionStorage.getItem('token')
            : null;

    const authHeaders = token
        ? {
            Authorization: `Bearer ${token}`,
        }
        : {};

    /**
     * Get classId from URL
     */
    const getClassIdFromUrl = () => {
        const params = new URLSearchParams(
            window.location.search
        );

        return params.get('classId');
    };

    /**
     * Fetch classes
     */
    const fetchClasses = async () => {
        try {
            setLoadingClasses(true);

            const res = await axios.get(
                `${API_BASE_URL}/classes`,
                {
                    headers: authHeaders,
                }
            );

            const data: ClassItem[] =
                res.data.data || [];

            setClasses(data);

            const urlClassId =
                getClassIdFromUrl();

            if (
                urlClassId &&
                data.some(
                    item =>
                        String(item.id) ===
                        String(urlClassId)
                )
            ) {
                setSelectedClassId(urlClassId);
            } else if (data.length > 0) {
                setSelectedClassId(
                    String(data[0].id)
                );
            }
        } catch (error: any) {
            console.error(
                'Error fetching classes:',
                error
            );

            showError(
                error.response?.data?.message ||
                'Failed to load classes'
            );
        } finally {
            setLoadingClasses(false);
        }
    };

    /**
     * Fetch subjects and assignments
     */
    const fetchSubjectsForClass = async (
        classId: string
    ) => {
        if (!classId) {
            setSubjects([]);
            setAssignments([]);
            setSelectedSubjects({});
            return;
        }

        const selectedClass = classes.find(
            item =>
                String(item.id) ===
                String(classId)
        );

        if (!selectedClass) return;

        try {
            setLoadingSubjects(true);

            const [
                subjectsResponse,
                assignmentsResponse,
            ] = await Promise.all([
                axios.get(
                    `${API_BASE_URL}/subjects?academicYearId=${selectedClass.academicYearId}`,
                    {
                        headers: authHeaders,
                    }
                ),

                axios.get(
                    `${API_BASE_URL}/class-subjects/class/${classId}`,
                    {
                        headers: authHeaders,
                    }
                ),
            ]);

            const allSubjects: Subject[] =
                subjectsResponse.data.data || [];

            const currentAssignments:
                ClassSubjectAssignment[] =
                assignmentsResponse.data.data || [];

            setSubjects(
                allSubjects.filter(
                    subject =>
                        subject.isActive
                )
            );

            setAssignments(
                currentAssignments
            );

            const selection: Record<
                string,
                SubjectSelection
            > = {};

            currentAssignments.forEach(
                assignment => {
                    selection[
                        assignment.subjectId
                    ] = {
                        subjectId:
                            assignment.subjectId,
                        isCompulsory:
                            assignment.isCompulsory,
                    };
                }
            );

            setSelectedSubjects(selection);
        } catch (error: any) {
            console.error(
                'Error fetching subjects:',
                error
            );

            setSubjects([]);
            setAssignments([]);
            setSelectedSubjects({});

            showError(
                error.response?.data?.message ||
                'Failed to load subjects'
            );
        } finally {
            setLoadingSubjects(false);
        }
    };

    useEffect(() => {
        fetchClasses();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selectedClassId) {
            fetchSubjectsForClass(
                selectedClassId
            );
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedClassId, classes]);

    /**
     * Currently selected class
     */
    const selectedClass = useMemo(() => {
        return classes.find(
            item =>
                String(item.id) ===
                String(selectedClassId)
        );
    }, [classes, selectedClassId]);

    /**
     * Filter subjects
     */
    const filteredSubjects = useMemo(() => {
        const keyword =
            search.trim().toLowerCase();

        if (!keyword) {
            return subjects;
        }

        return subjects.filter(subject => {
            return (
                subject.subjectName
                    .toLowerCase()
                    .includes(keyword) ||
                subject.subjectCode
                    .toLowerCase()
                    .includes(keyword) ||
                subject.subjectType
                    .toLowerCase()
                    .includes(keyword)
            );
        });
    }, [subjects, search]);

    /**
     * Selected count
     */
    const selectedSubjectIds = Object.keys(
        selectedSubjects
    );

    const selectedCount =
        selectedSubjectIds.length;

    const compulsoryCount =
        selectedSubjectIds.filter(
            id =>
                selectedSubjects[id]
                    ?.isCompulsory
        ).length;

    const optionalCount =
        selectedCount - compulsoryCount;

    /**
     * Assignment map
     */
    const assignmentMap = useMemo(() => {
        return new Map(
            assignments.map(assignment => [
                assignment.subjectId,
                assignment,
            ])
        );
    }, [assignments]);

    /**
     * Select/deselect subject
     */
    const toggleSubject = (
        subject: Subject
    ) => {
        setSelectedSubjects(current => {
            const next = { ...current };

            if (next[subject.id]) {
                delete next[subject.id];
            } else {
                next[subject.id] = {
                    subjectId: subject.id,
                    isCompulsory:
                        !subject.isOptional,
                };
            }

            return next;
        });
    };

    /**
     * Toggle compulsory
     */
    const toggleCompulsory = (
        subjectId: string
    ) => {
        setSelectedSubjects(current => {
            const currentSubject =
                current[subjectId];

            if (!currentSubject) {
                return current;
            }

            return {
                ...current,
                [subjectId]: {
                    ...currentSubject,
                    isCompulsory:
                        !currentSubject.isCompulsory,
                },
            };
        });
    };

    /**
     * Select all filtered subjects
     */
    const selectAll = () => {
        setSelectedSubjects(current => {
            const next = { ...current };

            filteredSubjects.forEach(
                subject => {
                    if (!next[subject.id]) {
                        next[subject.id] = {
                            subjectId:
                                subject.id,
                            isCompulsory:
                                !subject.isOptional,
                        };
                    }
                }
            );

            return next;
        });
    };

    /**
     * Clear selection
     */
    const clearSelection = () => {
        setSelectedSubjects({});
    };

    /**
     * Handle class selection
     */
    const handleClassChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const classId = e.target.value;

        setSelectedClassId(classId);
        setSearch('');

        const url = new URL(
            window.location.href
        );

        if (classId) {
            url.searchParams.set(
                'classId',
                classId
            );
        } else {
            url.searchParams.delete(
                'classId'
            );
        }

        window.history.replaceState(
            {},
            '',
            url.toString()
        );
    };

    /**
     * Save changes
     */
    const handleSave = async () => {
        if (!selectedClass) {
            showError('Please select a class');
            return;
        }

        if (selectedCount === 0) {
            showError(
                'Please select at least one subject'
            );
            return;
        }

        try {
            setSaving(true);

            const payload = {
                classId: selectedClass.id,
                subjects:
                    selectedSubjectIds.map(
                        subjectId => ({
                            subjectId,
                            isCompulsory:
                                selectedSubjects[
                                    subjectId
                                ]
                                    .isCompulsory,
                        })
                    ),
            };

            await axios.post(
                `${API_BASE_URL}/class-subjects/bulk`,
                payload,
                {
                    headers: authHeaders,
                }
            );

            /**
             * Find assignments that were removed
             */
            const selectedIds = new Set(
                selectedSubjectIds
            );

            const removedAssignments =
                assignments.filter(
                    assignment =>
                        !selectedIds.has(
                            assignment.subjectId
                        )
                );

            /**
             * Delete removed assignments
             */
            await Promise.all(
                removedAssignments.map(
                    assignment =>
                        axios.delete(
                            `${API_BASE_URL}/class-subjects/class/${selectedClass.id}/subject/${assignment.subjectId}`,
                            {
                                headers:
                                    authHeaders,
                            }
                        )
                )
            );

            showSuccess(
                'Subjects assigned successfully'
            );

            await fetchSubjectsForClass(
                String(selectedClass.id)
            );
        } catch (error: any) {
            console.error(
                'Error saving subjects:',
                error
            );

            showError(
                error.response?.data?.message ||
                'Failed to save subjects'
            );
        } finally {
            setSaving(false);
        }
    };

    /**
     * Reset current class from API
     */
    const handleRefresh = () => {
        if (selectedClassId) {
            fetchSubjectsForClass(
                selectedClassId
            );
        }
    };

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Assign Subjects
                    </h1>

                    <p className="mt-1 text-sm text-gray-600">
                        Assign and manage subjects for
                        each class.
                    </p>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    icon={
                        <RefreshCw className="h-4 w-4" />
                    }
                    onClick={handleRefresh}
                    disabled={
                        loadingSubjects ||
                        !selectedClassId
                    }
                >
                    Refresh
                </Button>
            </div>

            {/* Class selection */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <Users className="h-5 w-5" />
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-gray-900">
                            Select Class
                        </h2>

                        <p className="mt-0.5 text-xs text-gray-500">
                            Choose the class whose
                            subjects you want to manage.
                        </p>
                    </div>
                </div>

                <Select
                    label="Class"
                    name="classId"
                    value={selectedClassId}
                    onChange={handleClassChange}
                    disabled={
                        loadingClasses ||
                        classes.length === 0
                    }
                    options={[
                        {
                            value: '',
                            label: loadingClasses
                                ? 'Loading classes...'
                                : 'Select a class',
                        },
                        ...classes
                            .filter(
                                item =>
                                    item.status !==
                                    'inactive'
                            )
                            .map(item => ({
                                value: String(
                                    item.id
                                ),
                                label: `${item.name}${item.section
                                    ? ` - Section ${item.section}`
                                    : ''
                                    }${item.medium
                                        ? ` • ${item.medium}`
                                        : ''
                                    }`,
                            })),
                    ]}
                />
            </div>

            {/* Selected class summary */}
            {selectedClass && (
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                                <BookOpen className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                                    Selected Class
                                </p>

                                <h2 className="text-base font-bold text-gray-900">
                                    {selectedClass.name}

                                    {selectedClass.section &&
                                        ` - Section ${selectedClass.section}`}
                                </h2>

                                <p className="text-xs text-gray-600">
                                    {selectedClass
                                        .academicYear
                                        ?.year ||
                                        `Academic Year ID: ${selectedClass.academicYearId}`}

                                    {selectedClass.medium &&
                                        ` • ${selectedClass.medium}`}

                                    {selectedClass
                                        .department &&
                                        ` • ${selectedClass.department}`}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <div className="rounded-lg bg-white px-3 py-2 text-center shadow-sm">
                                <p className="text-lg font-bold text-gray-900">
                                    {selectedCount}
                                </p>

                                <p className="text-[10px] font-medium uppercase text-gray-500">
                                    Selected
                                </p>
                            </div>

                            <div className="rounded-lg bg-white px-3 py-2 text-center shadow-sm">
                                <p className="text-lg font-bold text-blue-600">
                                    {compulsoryCount}
                                </p>

                                <p className="text-[10px] font-medium uppercase text-gray-500">
                                    Required
                                </p>
                            </div>

                            <div className="rounded-lg bg-white px-3 py-2 text-center shadow-sm">
                                <p className="text-lg font-bold text-gray-600">
                                    {optionalCount}
                                </p>

                                <p className="text-[10px] font-medium uppercase text-gray-500">
                                    Optional
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Subject management */}
            {selectedClass && (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    {/* Toolbar */}
                    <div className="border-b border-gray-200 p-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div className="flex-1 lg:max-w-md">
                                <FormInput
                                    label="Search Subjects"
                                    name="subjectSearch"
                                    value={search}
                                    onChange={e =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search by name, code or type..."
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={selectAll}
                                    disabled={
                                        loadingSubjects ||
                                        filteredSubjects.length ===
                                        0
                                    }
                                >
                                    Select All
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={
                                        clearSelection
                                    }
                                    disabled={
                                        selectedCount ===
                                        0
                                    }
                                >
                                    Clear
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Subject list */}
                    <div className="p-4">
                        {loadingSubjects ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />

                                <p className="mt-3 text-sm text-gray-500">
                                    Loading subjects...
                                </p>
                            </div>
                        ) : filteredSubjects.length ===
                            0 ? (
                            <div className="rounded-xl border border-dashed border-gray-300 py-14 text-center">
                                <BookOpen className="mx-auto h-10 w-10 text-gray-300" />

                                <h3 className="mt-3 text-sm font-semibold text-gray-800">
                                    No subjects found
                                </h3>

                                <p className="mt-1 text-xs text-gray-500">
                                    {search
                                        ? 'Try a different search term.'
                                        : 'No active subjects are available for this academic year.'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredSubjects.map(
                                    subject => {
                                        const selected =
                                            Boolean(
                                                selectedSubjects[
                                                subject.id
                                                ]
                                            );

                                        const compulsory =
                                            selectedSubjects[
                                                subject.id
                                            ]
                                                ?.isCompulsory;

                                        const existing =
                                            assignmentMap.get(
                                                subject.id
                                            );

                                        return (
                                            <div
                                                key={
                                                    subject.id
                                                }
                                                className={`group rounded-xl border p-3 transition ${selected
                                                    ? 'border-blue-200 bg-blue-50/50'
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {/* Checkbox */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            toggleSubject(
                                                                subject
                                                            )
                                                        }
                                                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${selected
                                                            ? 'border-blue-600 bg-blue-600 text-white'
                                                            : 'border-gray-300 bg-white hover:border-blue-400'
                                                            }`}
                                                        aria-label={`Select ${subject.subjectName}`}
                                                    >
                                                        {selected && (
                                                            <Check className="h-3.5 w-3.5" />
                                                        )}
                                                    </button>

                                                    {/* Icon */}
                                                    <div
                                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${selected
                                                            ? 'bg-blue-100 text-blue-600'
                                                            : 'bg-gray-100 text-gray-500'
                                                            }`}
                                                    >
                                                        <BookOpen className="h-4 w-4" />
                                                    </div>

                                                    {/* Details */}
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <h3 className="truncate text-sm font-semibold text-gray-900">
                                                                {
                                                                    subject.subjectName
                                                                }
                                                            </h3>

                                                            {existing && (
                                                                <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                                                                    Assigned
                                                                </span>
                                                            )}

                                                            {subject.isOptional && (
                                                                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                                                                    Optional
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                                            <span className="font-medium">
                                                                {
                                                                    subject.subjectCode
                                                                }
                                                            </span>

                                                            <span>
                                                                •
                                                            </span>

                                                            <span>
                                                                {
                                                                    subject.subjectType
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Compulsory */}
                                                    {selected && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                toggleCompulsory(
                                                                    subject.id
                                                                )
                                                            }
                                                            className={`hidden rounded-lg border px-3 py-1.5 text-xs font-semibold transition sm:block ${compulsory
                                                                ? 'border-blue-200 bg-blue-100 text-blue-700'
                                                                : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            {compulsory
                                                                ? 'Compulsory'
                                                                : 'Optional'}
                                                        </button>
                                                    )}

                                                    {/* Remove */}
                                                    {selected && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                toggleSubject(
                                                                    subject
                                                                )
                                                            }
                                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500"
                                                            aria-label={`Remove ${subject.subjectName}`}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Mobile compulsory */}
                                                {selected && (
                                                    <div className="mt-3 sm:hidden">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                toggleCompulsory(
                                                                    subject.id
                                                                )
                                                            }
                                                            className={`w-full rounded-lg border px-3 py-2 text-xs font-semibold ${compulsory
                                                                ? 'border-blue-200 bg-blue-100 text-blue-700'
                                                                : 'border-gray-200 bg-white text-gray-500'
                                                                }`}
                                                        >
                                                            {compulsory
                                                                ? 'Compulsory Subject'
                                                                : 'Optional Subject'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-900">
                                    {selectedCount}{' '}
                                    subject
                                    {selectedCount !==
                                        1
                                        ? 's'
                                        : ''}{' '}
                                    selected
                                </p>

                                <p className="text-xs text-gray-500">
                                    {compulsoryCount}{' '}
                                    compulsory •{' '}
                                    {optionalCount}{' '}
                                    optional
                                </p>
                            </div>

                            <Button
                                variant="primary"
                                size="md"
                                icon={
                                    <Save className="h-4 w-4" />
                                }
                                onClick={handleSave}
                                loading={saving}
                                disabled={
                                    !selectedClass ||
                                    selectedCount === 0
                                }
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignSubjects;