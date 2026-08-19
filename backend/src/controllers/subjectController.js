const { subjects, academicYears } = require('../database/connection');
const { Op } = require('sequelize');

// CREATE SUBJECT
exports.createSubject = async (req, res) => {
    try {
        const {
            subjectName,
            subjectCode,
            description,
            subjectType,
            isOptional,
            isActive,
            academicYearId,
        } = req.body;

        if (!subjectName || !subjectCode) {
            return res.status(400).json({
                message: 'Subject name and subject code are required',
            });
        }

        let targetYearId = academicYearId;

        // Fallback: If academicYearId not passed, resolve active current year automatically
        if (!targetYearId) {
            const currentYear = await academicYears.findOne({ where: { isCurrent: true } });
            if (!currentYear) {
                return res.status(400).json({
                    message: 'No active current academic year configured. Please set one first.',
                });
            }
            targetYearId = currentYear.id;
        }

        const existingSubject = await subjects.findOne({
            where: {
                subjectCode: subjectCode.trim().toUpperCase(),
            },
        });

        if (existingSubject) {
            return res.status(409).json({
                message: 'Subject code already exists',
            });
        }

        const subject = await subjects.create({
            academicYearId: targetYearId,
            subjectName: subjectName.trim(),
            subjectCode: subjectCode.trim().toUpperCase(),
            description: description?.trim() || null,
            subjectType: subjectType || 'THEORY',
            isOptional: isOptional ?? false,
            isActive: isActive ?? true,
        });

        return res.status(201).json({
            message: 'Subject created successfully',
            data: subject,
        });
    } catch (error) {
        console.error('Error creating subject:', error);
        return res.status(500).json({
            message: 'Error creating subject',
            error: error.message,
        });
    }
};

// FETCH SUBJECTS
exports.fetchSubjects = async (req, res) => {
    try {
        const {
            search,
            subjectType,
            isOptional,
            isActive,
            academicYearId,
        } = req.query;

        const whereClause = {};

        if (search) {
            whereClause[Op.or] = [
                { subjectName: { [Op.iLike]: `%${search}%` } },
                { subjectCode: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } },
            ];
        }

        if (subjectType) whereClause.subjectType = subjectType;
        if (academicYearId) whereClause.academicYearId = academicYearId;
        if (isOptional !== undefined) whereClause.isOptional = isOptional === 'true';
        if (isActive !== undefined) whereClause.isActive = isActive === 'true';

        const allSubjects = await subjects.findAll({
            where: whereClause,
            include: [
                {
                    model: academicYears,
                    as: 'academicYear',
                    attributes: ['id', 'year', 'title', 'isCurrent'],
                },
            ],
            order: [['subjectName', 'ASC']],
        });

        return res.json({
            message: 'Subjects fetched successfully',
            data: allSubjects,
        });
    } catch (error) {
        console.error('Error fetching subjects:', error);
        return res.status(500).json({
            message: 'Error fetching subjects',
            error: error.message,
        });
    }
};

// FETCH SINGLE SUBJECT
exports.fetchSubjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const subject = await subjects.findByPk(id, {
            include: [{ model: academicYears, as: 'academicYear' }],
        });

        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        return res.json({
            message: 'Subject fetched successfully',
            data: subject,
        });
    } catch (error) {
        console.error('Error fetching subject:', error);
        return res.status(500).json({ message: 'Error fetching subject', error: error.message });
    }
};

// UPDATE SUBJECT
exports.updateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            subjectName,
            subjectCode,
            description,
            subjectType,
            isOptional,
            isActive,
            academicYearId,
        } = req.body;

        const subject = await subjects.findByPk(id);
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        if (subjectCode) {
            const existingSubject = await subjects.findOne({
                where: {
                    subjectCode: subjectCode.trim().toUpperCase(),
                    id: { [Op.ne]: id },
                },
            });

            if (existingSubject) {
                return res.status(409).json({ message: 'Subject code already exists' });
            }
        }

        await subject.update({
            ...(academicYearId && { academicYearId }),
            ...(subjectName !== undefined && { subjectName: subjectName.trim() }),
            ...(subjectCode !== undefined && { subjectCode: subjectCode.trim().toUpperCase() }),
            ...(description !== undefined && { description: description?.trim() || null }),
            ...(subjectType !== undefined && { subjectType }),
            ...(isOptional !== undefined && { isOptional }),
            ...(isActive !== undefined && { isActive }),
        });

        return res.json({
            message: 'Subject updated successfully',
            data: subject,
        });
    } catch (error) {
        console.error('Error updating subject:', error);
        return res.status(500).json({ message: 'Error updating subject', error: error.message });
    }
};

// DELETE SUBJECT
exports.deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const subject = await subjects.findByPk(id);
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        await subject.destroy();
        return res.json({ message: 'Subject deleted successfully' });
    } catch (error) {
        console.error('Error deleting subject:', error);
        return res.status(500).json({ message: 'Error deleting subject' });
    }
};

// TOGGLE STATUS
exports.toggleSubjectStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const subject = await subjects.findByPk(id);

        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        await subject.update({ isActive: !subject.isActive });

        return res.json({
            message: `Subject ${subject.isActive ? 'activated' : 'deactivated'} successfully`,
            data: subject,
        });
    } catch (error) {
        console.error('Error toggling subject status:', error);
        return res.status(500).json({ message: 'Error updating subject status', error: error.message });
    }
};