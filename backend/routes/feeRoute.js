const router = require('express').Router();
const {
  createFee,
  recordPayment,
  getStudentFees,
  getAllFees,
  updateFee,
  deleteFee,
} = require('../controllers/feeController');
const { protectAdmin, requireAdmin } = require('../middlewares/authMiddleware');

// Admin routes
router.post('/fees/create', protectAdmin, requireAdmin, createFee);
router.post('/fees/:id/payment', protectAdmin, requireAdmin, recordPayment);
router.get('/fees', protectAdmin, getAllFees);
router.put('/fees/:id', protectAdmin, requireAdmin, updateFee);
router.delete('/fees/:id', protectAdmin, requireAdmin, deleteFee);

// Student can view their fees
router.get('/fees/student/:studentId', getStudentFees);

module.exports = router;
