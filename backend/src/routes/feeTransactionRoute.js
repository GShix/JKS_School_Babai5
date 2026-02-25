/**
 * Fee Transaction Routes
 */

const express = require('express');
const router = express.Router();
const {
  collectFeePayment,
  getAllFeeTransactions,
  getFeeTransactionById,
  getFeeTransactionByReceiptNumber,
  cancelFeeTransaction,
  getDailyCollectionReport,
  collectFlexibleFeePayment,
} = require('../controllers/feeTransactionController');
const { protectAdmin, requireAdmin } = require('../middlewares/authMiddleware');

// All routes require admin authentication
router.use(protectAdmin);
router.use(requireAdmin);

// Collect fee payment (create new transaction)
router.post('/collect', collectFeePayment);

// Collect flexible fee payment (custom categories)
router.post('/collect-flexible', collectFlexibleFeePayment);

// Get all fee transactions
router.get('/', getAllFeeTransactions);

// Get daily collection report
router.get('/report/daily', getDailyCollectionReport);

// Get transaction by receipt number
router.get('/receipt/:receiptNumber', getFeeTransactionByReceiptNumber);

// Get transaction by ID
router.get('/:id', getFeeTransactionById);

// Cancel a transaction
router.post('/:id/cancel', cancelFeeTransaction);

module.exports = router;
