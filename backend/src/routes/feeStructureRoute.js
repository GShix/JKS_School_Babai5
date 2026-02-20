/**
 * Fee Structure Routes
 */

const express = require('express');
const router = express.Router();
const {
  createFeeStructure,
  getAllFeeStructures,
  getFeeStructureById,
  updateFeeStructure,
  deleteFeeStructure,
} = require('../controllers/feeStructureController');
const { protectAdmin, requireAdmin } = require('../middlewares/authMiddleware');

// All routes require admin authentication
router.use(protectAdmin);
router.use(requireAdmin);

// Create new fee structure
router.post('/', createFeeStructure);

// Get all fee structures
router.get('/', getAllFeeStructures);

// Get fee structure by ID
router.get('/:id', getFeeStructureById);

// Update fee structure
router.put('/:id', updateFeeStructure);

// Delete fee structure
router.delete('/:id', deleteFeeStructure);

module.exports = router;
