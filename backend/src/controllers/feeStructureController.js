/**
 * Fee Structure Controller
 * 
 * Manages fee structures for different classes/grades
 */

const { feeStructures, feeStructureItems, feeCategories } = require('../database/connection');
const { Op } = require('sequelize');

// Create a new fee structure with items
exports.createFeeStructure = async (req, res) => {
  try {
    const {
      name,
      academicYear,
      class: className,
      section,
      description,
      dueDate,
      items, // Array of { feeCategoryId, amount, description }
    } = req.body;

    // Validation
    if (!name || !academicYear || !className) {
      return res.status(400).json({
        message: 'Name, academic year, and class are required',
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: 'At least one fee item is required',
      });
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => {
      const amount = parseFloat(item.amount) || 0;
      if (amount < 0) {
        throw new Error('Item amounts must be non-negative');
      }
      return sum + amount;
    }, 0);

    // Create fee structure
    const feeStructure = await feeStructures.create({
      name: name.trim(),
      academicYear: academicYear.trim(),
      class: className.trim(),
      section: section?.trim(),
      totalAmount,
      description: description?.trim(),
      dueDate,
      isActive: true,
    });

    // Create fee structure items
    const structureItems = await Promise.all(
      items.map(item =>
        feeStructureItems.create({
          feeStructureId: feeStructure.id,
          feeCategoryId: item.feeCategoryId,
          amount: parseFloat(item.amount),
          description: item.description?.trim(),
        })
      )
    );

    // Fetch the complete structure with items and categories
    const completeStructure = await feeStructures.findByPk(feeStructure.id, {
      include: [
        {
          model: feeStructureItems,
          as: 'items',
          include: [
            {
              model: feeCategories,
              as: 'category',
            },
          ],
        },
      ],
    });

    res.status(201).json({
      message: 'Fee structure created successfully',
      data: completeStructure,
    });
  } catch (error) {
    console.error('Error creating fee structure:', error);
    res.status(500).json({
      message: 'Error creating fee structure',
      error: error.message,
    });
  }
};

// Get all fee structures
exports.getAllFeeStructures = async (req, res) => {
  try {
    const { academicYear, class: className, isActive } = req.query;

    const where = {};
    if (academicYear) where.academicYear = academicYear;
    if (className) where.class = className;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const structures = await feeStructures.findAll({
      where,
      include: [
        {
          model: feeStructureItems,
          as: 'items',
          include: [
            {
              model: feeCategories,
              as: 'category',
            },
          ],
        },
      ],
      order: [['academicYear', 'DESC'], ['class', 'ASC']],
    });

    res.json({
      message: 'Fee structures fetched successfully',
      data: structures,
    });
  } catch (error) {
    console.error('Error fetching fee structures:', error);
    res.status(500).json({
      message: 'Error fetching fee structures',
      error: error.message,
    });
  }
};

// Get a single fee structure by ID
exports.getFeeStructureById = async (req, res) => {
  try {
    const { id } = req.params;

    const structure = await feeStructures.findByPk(id, {
      include: [
        {
          model: feeStructureItems,
          as: 'items',
          include: [
            {
              model: feeCategories,
              as: 'category',
            },
          ],
        },
      ],
    });

    if (!structure) {
      return res.status(404).json({
        message: 'Fee structure not found',
      });
    }

    res.json({
      message: 'Fee structure fetched successfully',
      data: structure,
    });
  } catch (error) {
    console.error('Error fetching fee structure:', error);
    res.status(500).json({
      message: 'Error fetching fee structure',
      error: error.message,
    });
  }
};

// Update a fee structure
exports.updateFeeStructure = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      academicYear,
      class: className,
      section,
      description,
      dueDate,
      isActive,
      items,
    } = req.body;

    const structure = await feeStructures.findByPk(id);

    if (!structure) {
      return res.status(404).json({
        message: 'Fee structure not found',
      });
    }

    // Update basic fields
    if (name !== undefined) structure.name = name.trim();
    if (academicYear !== undefined) structure.academicYear = academicYear.trim();
    if (className !== undefined) structure.class = className.trim();
    if (section !== undefined) structure.section = section?.trim();
    if (description !== undefined) structure.description = description?.trim();
    if (dueDate !== undefined) structure.dueDate = dueDate;
    if (isActive !== undefined) structure.isActive = isActive;

    // If items are provided, update them
    if (items && Array.isArray(items)) {
      // Delete existing items
      await feeStructureItems.destroy({
        where: { feeStructureId: id },
      });

      // Create new items
      await Promise.all(
        items.map(item =>
          feeStructureItems.create({
            feeStructureId: id,
            feeCategoryId: item.feeCategoryId,
            amount: parseFloat(item.amount),
            description: item.description?.trim(),
          })
        )
      );

      // Recalculate total amount
      const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
      structure.totalAmount = totalAmount;
    }

    await structure.save();

    // Fetch updated structure with items
    const updatedStructure = await feeStructures.findByPk(id, {
      include: [
        {
          model: feeStructureItems,
          as: 'items',
          include: [
            {
              model: feeCategories,
              as: 'category',
            },
          ],
        },
      ],
    });

    res.json({
      message: 'Fee structure updated successfully',
      data: updatedStructure,
    });
  } catch (error) {
    console.error('Error updating fee structure:', error);
    res.status(500).json({
      message: 'Error updating fee structure',
      error: error.message,
    });
  }
};

// Delete a fee structure
exports.deleteFeeStructure = async (req, res) => {
  try {
    const { id } = req.params;

    const structure = await feeStructures.findByPk(id);

    if (!structure) {
      return res.status(404).json({
        message: 'Fee structure not found',
      });
    }

    // Soft delete
    structure.isActive = false;
    await structure.save();

    res.json({
      message: 'Fee structure deactivated successfully',
      data: structure,
    });
  } catch (error) {
    console.error('Error deleting fee structure:', error);
    res.status(500).json({
      message: 'Error deleting fee structure',
      error: error.message,
    });
  }
};
