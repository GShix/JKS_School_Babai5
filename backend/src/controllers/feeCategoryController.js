/**
 * Fee Category Controller
 * 
 * Manages CRUD operations for fee categories
 */

const { feeCategories } = require('../database/connection');

// Create a new fee category
exports.createFeeCategory = async (req, res) => {
  try {
    const { name, description, isActive, displayOrder } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        message: 'Category name is required',
      });
    }

    // Create category
    const category = await feeCategories.create({
      name: name.trim(),
      description: description?.trim(),
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder || 0,
    });

    res.status(201).json({
      message: 'Fee category created successfully',
      data: category,
    });
  } catch (error) {
    console.error('Error creating fee category:', error);
    res.status(500).json({
      message: 'Error creating fee category',
      error: error.message,
    });
  }
};

// Get all fee categories
exports.getAllFeeCategories = async (req, res) => {
  try {
    const { isActive } = req.query;
    
    const where = {};
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const categories = await feeCategories.findAll({
      where,
      order: [['displayOrder', 'ASC'], ['name', 'ASC']],
    });

    res.json({
      message: 'Fee categories fetched successfully',
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching fee categories:', error);
    res.status(500).json({
      message: 'Error fetching fee categories',
      error: error.message,
    });
  }
};

// Get a single fee category by ID
exports.getFeeCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await feeCategories.findByPk(id);

    if (!category) {
      return res.status(404).json({
        message: 'Fee category not found',
      });
    }

    res.json({
      message: 'Fee category fetched successfully',
      data: category,
    });
  } catch (error) {
    console.error('Error fetching fee category:', error);
    res.status(500).json({
      message: 'Error fetching fee category',
      error: error.message,
    });
  }
};

// Update a fee category
exports.updateFeeCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive, displayOrder } = req.body;

    const category = await feeCategories.findByPk(id);

    if (!category) {
      return res.status(404).json({
        message: 'Fee category not found',
      });
    }

    // Update fields
    if (name !== undefined) category.name = name.trim();
    if (description !== undefined) category.description = description?.trim();
    if (isActive !== undefined) category.isActive = isActive;
    if (displayOrder !== undefined) category.displayOrder = displayOrder;

    await category.save();

    res.json({
      message: 'Fee category updated successfully',
      data: category,
    });
  } catch (error) {
    console.error('Error updating fee category:', error);
    res.status(500).json({
      message: 'Error updating fee category',
      error: error.message,
    });
  }
};

// Delete a fee category
exports.deleteFeeCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await feeCategories.findByPk(id);

    if (!category) {
      return res.status(404).json({
        message: 'Fee category not found',
      });
    }

    // Soft delete: just mark as inactive
    category.isActive = false;
    await category.save();

    res.json({
      message: 'Fee category deactivated successfully',
      data: category,
    });
  } catch (error) {
    console.error('Error deleting fee category:', error);
    res.status(500).json({
      message: 'Error deleting fee category',
      error: error.message,
    });
  }
};

// Permanently delete a fee category
exports.hardDeleteFeeCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await feeCategories.findByPk(id);

    if (!category) {
      return res.status(404).json({
        message: 'Fee category not found',
      });
    }

    await category.destroy();

    res.json({
      message: 'Fee category deleted permanently',
    });
  } catch (error) {
    console.error('Error permanently deleting fee category:', error);
    res.status(500).json({
      message: 'Error permanently deleting fee category',
      error: error.message,
    });
  }
};
