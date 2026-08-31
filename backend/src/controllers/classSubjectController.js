const { ClassSubject, Class, Subject } = require('../models');

/**
 * Assign a subject to a class
 */
const assignSubjectToClass = async (req, res) => {
    try {
        const { classId, subjectId, isCompulsory = true } = req.body;

        if (!classId || !subjectId) {
            return res.status(400).json({
                success: false,
                message: 'classId and subjectId are required',
            });
        }

        // Check class
        const classData = await Class.findByPk(classId);

        if (!classData) {
            return res.status(404).json({
                success: false,
                message: 'Class not found',
            });
        }

        // Check subject
        const subject = await Subject.findByPk(subjectId);

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found',
            });
        }

        // Make sure class and subject belong to same academic year
        if (classData.academicYearId !== subject.academicYearId) {
            return res.status(400).json({
                success: false,
                message:
                    'Class and subject must belong to the same academic year',
            });
        }

        // Check existing assignment
        const existingAssignment = await ClassSubject.findOne({
            where: {
                classId,
                subjectId,
            },
        });

        if (existingAssignment) {
            return res.status(409).json({
                success: false,
                message: 'Subject is already assigned to this class',
                data: existingAssignment,
            });
        }

        const assignment = await ClassSubject.create({
            classId,
            subjectId,
            isCompulsory,
            status: 'active',
        });

        const result = await ClassSubject.findByPk(assignment.id, {
            include: [
                {
                    model: Class,
                    as: 'class',
                },
                {
                    model: Subject,
                    as: 'subject',
                },
            ],
        });

        return res.status(201).json({
            success: true,
            message: 'Subject assigned to class successfully',
            data: result,
        });
    } catch (error) {
        console.error('Assign subject error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to assign subject to class',
            error: error.message,
        });
    }
};

/**
 * Get all subjects assigned to a class
 */
const getSubjectsByClass = async (req, res) => {
    try {
        const { classId } = req.params;

        const classData = await Class.findByPk(classId);

        if (!classData) {
            return res.status(404).json({
                success: false,
                message: 'Class not found',
            });
        }

        const assignments = await ClassSubject.findAll({
            where: {
                classId,
                status: 'active',
            },
            include: [
                {
                    model: Subject,
                    as: 'subject',
                },
            ],
            order: [
                [
                    { model: Subject, as: 'subject' },
                    'subjectName',
                    'ASC',
                ],
            ],
        });

        return res.status(200).json({
            success: true,
            data: assignments,
        });
    } catch (error) {
        console.error('Get class subjects error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch class subjects',
            error: error.message,
        });
    }
};

/**
 * Get all classes assigned to a subject
 */
const getClassesBySubject = async (req, res) => {
    try {
        const { subjectId } = req.params;

        const subject = await Subject.findByPk(subjectId);

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found',
            });
        }

        const assignments = await ClassSubject.findAll({
            where: {
                subjectId,
                status: 'active',
            },
            include: [
                {
                    model: Class,
                    as: 'class',
                },
            ],
        });

        return res.status(200).json({
            success: true,
            data: assignments,
        });
    } catch (error) {
        console.error('Get subject classes error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch subject classes',
            error: error.message,
        });
    }
};

/**
 * Remove subject from class
 */
const removeSubjectFromClass = async (req, res) => {
    try {
        const { classId, subjectId } = req.params;

        const assignment = await ClassSubject.findOne({
            where: {
                classId,
                subjectId,
            },
        });

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Subject assignment not found',
            });
        }

        await assignment.destroy();

        return res.status(200).json({
            success: true,
            message: 'Subject removed from class successfully',
        });
    } catch (error) {
        console.error('Remove class subject error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to remove subject from class',
            error: error.message,
        });
    }
};

/**
 * Update assignment
 */
const updateClassSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const { isCompulsory, status } = req.body;

        const assignment = await ClassSubject.findByPk(id);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Subject assignment not found',
            });
        }

        if (isCompulsory !== undefined) {
            assignment.isCompulsory = isCompulsory;
        }

        if (status !== undefined) {
            assignment.status = status;
        }

        await assignment.save();

        return res.status(200).json({
            success: true,
            message: 'Subject assignment updated successfully',
            data: assignment,
        });
    } catch (error) {
        console.error('Update class subject error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to update subject assignment',
            error: error.message,
        });
    }
};

module.exports = {
    assignSubjectToClass,
    getSubjectsByClass,
    getClassesBySubject,
    removeSubjectFromClass,
    updateClassSubject,
};