/**
 * Fee Category Routes
 */

const express = require('express');
const router = express.Router();
const {
  createFeeCategory,
  getAllFeeCategories,
  getFeeCategoryById,
  updateFeeCategory,
  deleteFeeCategory,
  hardDeleteFeeCategory,
} = require('../controllers/feeCategoryController');
const { protectAdmin, requireAdmin } = require('../middlewares/authMiddleware');

// All routes require admin authentication
router.use(protectAdmin);
router.use(requireAdmin);

// Create new fee category
router.post('/', createFeeCategory);

// Get all fee categories
router.get('/', getAllFeeCategories);

// Get fee category by ID
router.get('/:id', getFeeCategoryById);

// Update fee category
router.put('/:id', updateFeeCategory);

// Soft delete (deactivate) fee category
router.delete('/:id', deleteFeeCategory);

// Hard delete fee category
router.delete('/:id/permanent', hardDeleteFeeCategory);

module.exports = router;
