/**
 * Fee Management Routes
 * 
 * Main route file that consolidates all fee management routes
 */

const express = require('express');
const router = express.Router();

// Import sub-routes
const feeCategoryRoutes = require('./feeCategoryRoute');
const feeStructureRoutes = require('./feeStructureRoute');
const feeAllocationRoutes = require('./feeAllocationRoute');
const feeTransactionRoutes = require('./feeTransactionRoute');

// Mount sub-routes
router.use('/categories', feeCategoryRoutes);
router.use('/structures', feeStructureRoutes);
router.use('/allocations', feeAllocationRoutes);
router.use('/transactions', feeTransactionRoutes);

module.exports = router;
