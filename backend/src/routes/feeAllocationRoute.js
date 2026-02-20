/**
 * Fee Allocation Routes
 */

const express = require('express');
const router = express.Router();
const {
  allocateFeeToStudent,
  allocateFeeToMultipleStudents,
  allocateFeeToClass,
  getAllFeeAllocations,
  getFeeAllocationById,
  getStudentFeeAllocations,
  updateFeeAllocation,
  deleteFeeAllocation,
} = require('../controllers/feeAllocationController');
const { protectAdmin, requireAdmin } = require('../middlewares/authMiddleware');

// All routes require admin authentication
router.use(protectAdmin);
router.use(requireAdmin);

// Allocate fee to single student
router.post('/student', allocateFeeToStudent);

// Allocate fee to multiple students (bulk)
router.post('/bulk', allocateFeeToMultipleStudents);

// Allocate fee to entire class
router.post('/class', allocateFeeToClass);

// Get all fee allocations
router.get('/', getAllFeeAllocations);

// Get fee allocation by ID
router.get('/:id', getFeeAllocationById);

// Get all allocations for a specific student
router.get('/student/:studentId', getStudentFeeAllocations);

// Update fee allocation
router.put('/:id', updateFeeAllocation);

// Delete fee allocation
router.delete('/:id', deleteFeeAllocation);

module.exports = router;
