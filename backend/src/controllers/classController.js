const { classes, academicYears } = require('../database/connection');

// Create a new class
exports.createClass = async (req, res) => {
    try {
        const { name, medium, section, department, status, totalStudents, academicYearId } = req.body;

        if (!name) {
            return res.status(400).json({
                message: 'Class name is required',
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

        const newClass = await classes.create({
            academicYearId: targetYearId,
            name,
            medium,
            section,
            department,
            status: status || 'active',
            totalStudents: typeof totalStudents === 'number' ? totalStudents : undefined,
        });

        res.status(201).json({
            message: 'Class created successfully',
            data: newClass,
        });
    } catch (error) {
        console.error('Error creating class:', error);
        res.status(500).json({
            message: 'Error creating class',
            error: error.message,
        });
    }
};

// Fetch all classes (with optional filters)
exports.fetchClasses = async (req, res) => {
    try {
        const { status, department, academicYearId } = req.query;
        const whereClause = {};

        if (status) {
            whereClause.status = status;
        }

        if (department) {
            whereClause.department = department;
        }

        if (academicYearId) {
            whereClause.academicYearId = academicYearId;
        }

        const allClasses = await classes.findAll({
            where: whereClause,
            include: [
                {
                    model: academicYears,
                    as: 'academicYear',
                    attributes: ['id', 'year', 'title', 'isCurrent'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        res.json({
            message: 'Classes fetched successfully',
            data: allClasses,
        });
    } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).json({
            message: 'Error fetching classes',
            error: error.message,
        });
    }
};

// Fetch a single class by ID
exports.fetchSingleClass = async (req, res) => {
    const { id } = req.params;

    try {
        const classItem = await classes.findByPk(id, {
            include: [
                {
                    model: academicYears,
                    as: 'academicYear',
                    attributes: ['id', 'year', 'title', 'isCurrent'],
                },
            ],
        });

        if (!classItem) {
            return res.status(404).json({
                message: 'Class not found',
            });
        }

        res.json({
            message: 'Class details',
            data: classItem,
        });
    } catch (error) {
        console.error('Error fetching class:', error);
        res.status(500).json({
            message: 'Error fetching class',
            error: error.message,
        });
    }
};

// Update a class
exports.updateClass = async (req, res) => {
    const { id } = req.params;

    try {
        const classItem = await classes.findByPk(id);

        if (!classItem) {
            return res.status(404).json({
                message: 'Class not found',
            });
        }

        const { name, medium, section, department, status, totalStudents, academicYearId } = req.body;

        await classItem.update({
            academicYearId: academicYearId !== undefined ? academicYearId : classItem.academicYearId,
            name: name !== undefined ? name : classItem.name,
            medium: medium !== undefined ? medium : classItem.medium,
            section: section !== undefined ? section : classItem.section,
            department: department !== undefined ? department : classItem.department,
            status: status !== undefined ? status : classItem.status,
            totalStudents: totalStudents !== undefined ? totalStudents : classItem.totalStudents,
        });

        res.json({
            message: 'Class updated successfully',
            data: classItem,
        });
    } catch (error) {
        console.error('Error updating class:', error);
        res.status(500).json({
            message: 'Error updating class',
            error: error.message,
        });
    }
};

// Delete a class
exports.deleteClass = async (req, res) => {
    const { id } = req.params;

    try {
        const classItem = await classes.findByPk(id);

        if (!classItem) {
            return res.status(404).json({
                message: 'Class not found',
            });
        }

        await classItem.destroy();

        res.json({
            message: 'Class deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting class:', error);
        res.status(500).json({
            message: 'Error deleting class',
            error: error.message,
        });
    }
};