const express = require('express');
const router = express.Router();

const { allocateFeeToStudent, allocateFeeToMultipleStudents, allocateFeeToClass, getAllFeeAllocations, getFeeAllocationById, getStudentFeeAllocations, updateFeeAllocation, deleteFeeAllocation,
} = require('../controllers/feeAllocationController');

const { protectAdmin, requireAdmin,
} = require('../middlewares/authMiddleware');

router.use(protectAdmin);
router.use(requireAdmin);

// Allocate fee to one student
router.post('/student', allocateFeeToStudent);

// Allocate fee to multiple selected students
router.post('/bulk', allocateFeeToMultipleStudents);

// Allocate fee to an entire class
router.post('/class', allocateFeeToClass);

// Get all fee allocations
router.get('/', getAllFeeAllocations);

// Get allocations for a specific student
// IMPORTANT: This must come BEFORE /:id
router.get('/student/:studentId', getStudentFeeAllocations);

// Get one fee allocation
router.get('/:id', getFeeAllocationById);

// Update fee allocation
router.put('/:id', updateFeeAllocation);

// Delete fee allocation
router.delete('/:id', deleteFeeAllocation);

module.exports = router;