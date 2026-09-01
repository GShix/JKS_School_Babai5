const {
    classSubjects,
    classes,
    subjects,
    academicYears,
} = require('../database/connection');

const { Op } = require('sequelize');

/**
 * Get all class-subject assignments
 */
exports.getAllClassSubjects = async (req, res) => {
    try {
        const { classId, subjectId, academicYearId, status } = req.query;

        const where = {};

        if (classId) {
            where.classId = classId;
        }

        if (subjectId) {
            where.subjectId = subjectId;
        }

        if (status) {
            where.status = status;
        }

        const classWhere = {};

        if (academicYearId) {
            classWhere.academicYearId = academicYearId;
        }

        const assignments = await classSubjects.findAll({
            where,
            include: [
                {
                    model: classes,
                    as: 'class',
                    attributes: [
                        'id',
                        'academicYearId',
                        'name',
                        'medium',
                        'section',
                        'department',
                        'status',
                    ],
                    ...(Object.keys(classWhere).length > 0
                        ? { where: classWhere }
                        : {}),
                },
                {
                    model: subjects,
                    as: 'subject',
                    attributes: [
                        'id',
                        'academicYearId',
                        'subjectName',
                        'subjectCode',
                        'description',
                        'subjectType',
                        'isOptional',
                        'isActive',
                    ],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        return res.status(200).json({
            message: 'Class subjects fetched successfully',
            data: assignments,
        });
    } catch (error) {
        console.error('Error fetching class subjects:', error);

        return res.status(500).json({
            message: 'Error fetching class subjects',
            error: error.message,
        });
    }
};

/**
 * Get assignments for one class
 */
exports.getSubjectsByClass = async (req, res) => {
    try {
        const { classId } = req.params;

        const classItem = await classes.findByPk(classId);

        if (!classItem) {
            return res.status(404).json({
                message: 'Class not found',
            });
        }

        const assignments = await classSubjects.findAll({
            where: {
                classId,
                status: 'active',
            },
            include: [
                {
                    model: subjects,
                    as: 'subject',
                    where: {
                        isActive: true,
                    },
                },
            ],
            order: [
                [
                    { model: subjects, as: 'subject' },
                    'subjectName',
                    'ASC',
                ],
            ],
        });

        return res.status(200).json({
            message: 'Class subjects fetched successfully',
            data: assignments,
        });
    } catch (error) {
        console.error('Error fetching subjects by class:', error);

        return res.status(500).json({
            message: 'Error fetching subjects by class',
            error: error.message,
        });
    }
};

/**
 * Assign one subject to a class
 */
exports.assignSubject = async (req, res) => {
    try {
        const {
            classId,
            subjectId,
            isCompulsory = true,
        } = req.body;

        if (!classId || !subjectId) {
            return res.status(400).json({
                message: 'Class ID and Subject ID are required',
            });
        }

        const [classItem, subject] = await Promise.all([
            classes.findByPk(classId),
            subjects.findByPk(subjectId),
        ]);

        if (!classItem) {
            return res.status(404).json({
                message: 'Class not found',
            });
        }

        if (!subject) {
            return res.status(404).json({
                message: 'Subject not found',
            });
        }

        /**
         * Subject and class must belong to same academic year
         */
        if (
            Number(classItem.academicYearId) !==
            Number(subject.academicYearId)
        ) {
            return res.status(400).json({
                message:
                    'Class and subject must belong to the same academic year',
                code: 'ACADEMIC_YEAR_MISMATCH',
            });
        }

        if (!subject.isActive) {
            return res.status(400).json({
                message: 'Cannot assign an inactive subject',
            });
        }

        const existingAssignment = await classSubjects.findOne({
            where: {
                classId,
                subjectId,
            },
        });

        if (existingAssignment) {
            if (existingAssignment.status === 'inactive') {
                existingAssignment.status = 'active';
                existingAssignment.isCompulsory =
                    Boolean(isCompulsory);

                await existingAssignment.save();

                return res.status(200).json({
                    message: 'Subject assigned successfully',
                    data: existingAssignment,
                });
            }

            return res.status(409).json({
                message: 'Subject is already assigned to this class',
                code: 'SUBJECT_ALREADY_ASSIGNED',
            });
        }

        const assignment = await classSubjects.create({
            classId,
            subjectId,
            isCompulsory: Boolean(isCompulsory),
            status: 'active',
        });

        return res.status(201).json({
            message: 'Subject assigned successfully',
            data: assignment,
        });
    } catch (error) {
        console.error('Error assigning subject:', error);

        return res.status(500).json({
            message: 'Error assigning subject',
            error: error.message,
        });
    }
};

/**
 * Assign multiple subjects to a class
 */
exports.assignMultipleSubjects = async (req, res) => {
    try {
        const {
            classId,
            subjects: subjectList,
        } = req.body;

        if (!classId) {
            return res.status(400).json({
                message: 'Class ID is required',
            });
        }

        if (
            !Array.isArray(subjectList) ||
            subjectList.length === 0
        ) {
            return res.status(400).json({
                message: 'At least one subject is required',
            });
        }

        const classItem = await classes.findByPk(classId);

        if (!classItem) {
            return res.status(404).json({
                message: 'Class not found',
            });
        }

        const subjectIds = subjectList.map(item =>
            typeof item === 'string'
                ? item
                : item.subjectId
        );

        const uniqueSubjectIds = [
            ...new Set(subjectIds),
        ];

        const dbSubjects = await subjects.findAll({
            where: {
                id: {
                    [Op.in]: uniqueSubjectIds,
                },
                isActive: true,
            },
        });

        if (dbSubjects.length !== uniqueSubjectIds.length) {
            return res.status(400).json({
                message:
                    'One or more selected subjects were not found or are inactive',
            });
        }

        const invalidAcademicYear = dbSubjects.find(
            subject =>
                Number(subject.academicYearId) !==
                Number(classItem.academicYearId)
        );

        if (invalidAcademicYear) {
            return res.status(400).json({
                message:
                    'All selected subjects must belong to the same academic year as the class',
                code: 'ACADEMIC_YEAR_MISMATCH',
            });
        }

        const existingAssignments =
            await classSubjects.findAll({
                where: {
                    classId,
                    subjectId: {
                        [Op.in]: uniqueSubjectIds,
                    },
                },
            });

        const existingMap = new Map(
            existingAssignments.map(item => [
                item.subjectId,
                item,
            ])
        );

        const assignments = [];

        for (const item of subjectList) {
            const subjectId =
                typeof item === 'string'
                    ? item
                    : item.subjectId;

            const isCompulsory =
                typeof item === 'string'
                    ? true
                    : item.isCompulsory !== undefined
                        ? Boolean(item.isCompulsory)
                        : true;

            const existing = existingMap.get(subjectId);

            if (existing) {
                existing.status = 'active';
                existing.isCompulsory = isCompulsory;

                await existing.save();

                assignments.push(existing);
            } else {
                const assignment =
                    await classSubjects.create({
                        classId,
                        subjectId,
                        isCompulsory,
                        status: 'active',
                    });

                assignments.push(assignment);
            }
        }

        return res.status(201).json({
            message: `${assignments.length} subject(s) assigned successfully`,
            data: assignments,
        });
    } catch (error) {
        console.error(
            'Error assigning multiple subjects:',
            error
        );

        return res.status(500).json({
            message: 'Error assigning multiple subjects',
            error: error.message,
        });
    }
};

/**
 * Update assignment
 */
exports.updateClassSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const { isCompulsory, status } = req.body;

        const assignment = await classSubjects.findByPk(id);

        if (!assignment) {
            return res.status(404).json({
                message: 'Subject assignment not found',
            });
        }

        if (isCompulsory !== undefined) {
            assignment.isCompulsory = Boolean(isCompulsory);
        }

        if (status !== undefined) {
            if (!['active', 'inactive'].includes(status)) {
                return res.status(400).json({
                    message: 'Invalid status',
                });
            }

            assignment.status = status;
        }

        await assignment.save();

        return res.status(200).json({
            message: 'Subject assignment updated successfully',
            data: assignment,
        });
    } catch (error) {
        console.error(
            'Error updating class subject:',
            error
        );

        return res.status(500).json({
            message: 'Error updating class subject',
            error: error.message,
        });
    }
};

/**
 * Remove subject from class
 */
exports.removeSubjectFromClass = async (req, res) => {
    try {
        const { classId, subjectId } = req.params;

        const assignment = await classSubjects.findOne({
            where: {
                classId,
                subjectId,
            },
        });

        if (!assignment) {
            return res.status(404).json({
                message: 'Subject assignment not found',
            });
        }

        await assignment.destroy();

        return res.status(200).json({
            message: 'Subject removed from class successfully',
        });
    } catch (error) {
        console.error(
            'Error removing subject from class:',
            error
        );

        return res.status(500).json({
            message: 'Error removing subject from class',
            error: error.message,
        });
    }
};