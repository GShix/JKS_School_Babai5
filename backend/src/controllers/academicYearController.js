const { academicYears } = require('../database/connection');
const { Op } = require('sequelize');

// Helper to handle single active current year
const resetOtherCurrentYears = async (currentId = null) => {
    await academicYears.update(
        { isCurrent: false },
        {
            where: {
                ...(currentId && { id: { [Op.ne]: currentId } }),
            },
        }
    );
};

// CREATE ACADEMIC YEAR
exports.createAcademicYear = async (req, res) => {
    try {
        const { year, title, startDate, endDate, isCurrent, isActive } = req.body;

        if (!year) {
            return res.status(400).json({ message: 'Academic year is required' });
        }

        const existingYear = await academicYears.findOne({
            where: { year: year.trim() },
        });

        if (existingYear) {
            return res.status(409).json({ message: 'Academic year already exists' });
        }

        if (isCurrent) {
            await resetOtherCurrentYears();
        }

        const academicYear = await academicYears.create({
            year: year.trim(),
            title: title?.trim() || null,
            startDate: startDate || null,
            endDate: endDate || null,
            isCurrent: isCurrent ?? false,
            isActive: isActive ?? true,
        });

        return res.status(201).json({
            message: 'Academic year created successfully',
            data: academicYear,
        });
    } catch (error) {
        console.error('Error creating academic year:', error);
        return res.status(500).json({
            message: 'Error creating academic year',
            error: error.message,
        });
    }
};

// FETCH ACADEMIC YEARS
exports.fetchAcademicYears = async (req, res) => {
    try {
        const { search, isActive, isCurrent } = req.query;
        const whereClause = {};

        if (search) {
            whereClause[Op.or] = [
                { year: { [Op.iLike]: `%${search}%` } },
                { title: { [Op.iLike]: `%${search}%` } },
            ];
        }

        if (isActive !== undefined) {
            whereClause.isActive = isActive === 'true';
        }

        if (isCurrent !== undefined) {
            whereClause.isCurrent = isCurrent === 'true';
        }

        const list = await academicYears.findAll({
            where: whereClause,
            order: [['year', 'DESC']],
        });

        return res.json({
            message: 'Academic years fetched successfully',
            data: list,
        });
    } catch (error) {
        console.error('Error fetching academic years:', error);
        return res.status(500).json({
            message: 'Error fetching academic years',
            error: error.message,
        });
    }
};

// FETCH SINGLE ACADEMIC YEAR
exports.fetchAcademicYearById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await academicYears.findByPk(id);

        if (!item) {
            return res.status(404).json({ message: 'Academic year not found' });
        }

        return res.json({
            message: 'Academic year fetched successfully',
            data: item,
        });
    } catch (error) {
        console.error('Error fetching academic year:', error);
        return res.status(500).json({ message: 'Error fetching academic year' });
    }
};

// UPDATE ACADEMIC YEAR
exports.updateAcademicYear = async (req, res) => {
    try {
        const { id } = req.params;
        const { year, title, startDate, endDate, isCurrent, isActive } = req.body;

        const item = await academicYears.findByPk(id);
        if (!item) {
            return res.status(404).json({ message: 'Academic year not found' });
        }

        if (year) {
            const existing = await academicYears.findOne({
                where: {
                    year: year.trim(),
                    id: { [Op.ne]: id },
                },
            });

            if (existing) {
                return res.status(409).json({ message: 'Academic year already exists' });
            }
        }

        if (isCurrent === true) {
            await resetOtherCurrentYears(id);
        }

        await item.update({
            ...(year !== undefined && { year: year.trim() }),
            ...(title !== undefined && { title: title?.trim() || null }),
            ...(startDate !== undefined && { startDate: startDate || null }),
            ...(endDate !== undefined && { endDate: endDate || null }),
            ...(isCurrent !== undefined && { isCurrent }),
            ...(isActive !== undefined && { isActive }),
        });

        return res.json({
            message: 'Academic year updated successfully',
            data: item,
        });
    } catch (error) {
        console.error('Error updating academic year:', error);
        return res.status(500).json({ message: 'Error updating academic year' });
    }
};

// SET CURRENT ACADEMIC YEAR
exports.setCurrentAcademicYear = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await academicYears.findByPk(id);

        if (!item) {
            return res.status(404).json({ message: 'Academic year not found' });
        }

        await resetOtherCurrentYears(id);
        await item.update({ isCurrent: true, isActive: true });

        return res.json({
            message: `Academic year ${item.year} set as current`,
            data: item,
        });
    } catch (error) {
        console.error('Error setting current academic year:', error);
        return res.status(500).json({ message: 'Error setting current academic year' });
    }
};

// DELETE ACADEMIC YEAR
exports.deleteAcademicYear = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await academicYears.findByPk(id);

        if (!item) {
            return res.status(404).json({ message: 'Academic year not found' });
        }

        await item.destroy();
        return res.json({ message: 'Academic year deleted successfully' });
    } catch (error) {
        console.error('Error deleting academic year:', error);
        return res.status(500).json({ message: 'Error deleting academic year' });
    }
};