/**
 * Fee Transaction Controller
 * 
 * Manages fee payment transactions - the core of fee collection
 */

const {
  feeTransactions,
  feeAllocations,
  feeStructures,
  feeStructureItems,
  feeCategories,
  students,
  admins,
} = require('../database/connection');
const { sequelize } = require('../database/connection');
const { Op } = require('sequelize');

// Generate unique receipt number
const generateReceiptNumber = async () => {
  const year = new Date().getFullYear();
  const lastTransaction = await feeTransactions.findOne({
    where: {
      receiptNumber: {
        [Op.like]: `FEE-${year}-%`,
      },
    },
    order: [['createdAt', 'DESC']],
  });

  let sequenceNumber = 1;
  if (lastTransaction) {
    const lastNumber = lastTransaction.receiptNumber.split('-')[2];
    sequenceNumber = parseInt(lastNumber) + 1;
  }

  return `FEE-${year}-${String(sequenceNumber).padStart(5, '0')}`;
};

// Collect fee payment (create transaction)
exports.collectFeePayment = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      feeAllocationId,
      amount,
      paymentMethod,
      paymentDate,
      bankName,
      bankAccountNumber,
      referenceNumber,
      remarks,
    } = req.body;

    const collectedBy = req.admin.id; // From auth middleware
    const collectedByName = req.admin.fullName || req.admin.email;

    // Validation
    if (!feeAllocationId || !amount) {
      await t.rollback();
      return res.status(400).json({
        message: 'Fee allocation ID and amount are required',
      });
    }

    const paymentAmount = parseFloat(amount);
    if (paymentAmount <= 0) {
      await t.rollback();
      return res.status(400).json({
        message: 'Payment amount must be greater than zero',
      });
    }

    // Find fee allocation
    const allocation = await feeAllocations.findByPk(feeAllocationId, {
      include: [
        {
          model: students,
          as: 'student',
          attributes: ['id', 'fullName', 'rollNumber', 'currentClass', 'section', 'contactNumber'],
        },
        {
          model: feeStructures,
          as: 'feeStructure',
        },
      ],
      transaction: t,
    });

    if (!allocation) {
      await t.rollback();
      return res.status(404).json({
        message: 'Fee allocation not found',
      });
    }

    // Check if payment amount exceeds balance
    const currentBalance = parseFloat(allocation.balance);
    if (paymentAmount > currentBalance) {
      await t.rollback();
      return res.status(400).json({
        message: `Payment amount (${paymentAmount}) exceeds outstanding balance (${currentBalance})`,
      });
    }

    //Generate receipt number
    const receiptNumber = await generateReceiptNumber();

    // Create transaction
    const transaction = await feeTransactions.create(
      {
        receiptNumber,
        feeAllocationId,
        studentId: allocation.studentId,
        amount: paymentAmount,
        paymentMethod: paymentMethod || 'cash',
        paymentDate: paymentDate || new Date(),
        transactionDate: new Date(),
        bankName: bankName?.trim(),
        bankAccountNumber: bankAccountNumber?.trim(),
        referenceNumber: referenceNumber?.trim(),
        collectedBy,
        collectedByName,
        remarks: remarks?.trim(),
        status: 'confirmed',
      },
      { transaction: t }
    );

    // Update allocation balance and status
    const newPaidAmount = parseFloat(allocation.paidAmount) + paymentAmount;
    const newBalance = parseFloat(allocation.totalAmount) - newPaidAmount - parseFloat(allocation.discount || 0);

    allocation.paidAmount = newPaidAmount;
    allocation.balance = newBalance;

    // Update status based on balance
    if (newBalance <= 0) {
      allocation.status = 'paid';
    } else if (newPaidAmount > 0) {
      allocation.status = 'partial';
    }

    await allocation.save({ transaction: t });

    await t.commit();

    // Fetch complete transaction details
    const completeTransaction = await feeTransactions.findByPk(transaction.id, {
      include: [
        {
          model: feeAllocations,
          as: 'feeAllocation',
          include: [
            {
              model: students,
              as: 'student',
              attributes: ['id', 'fullName', 'rollNumber', 'currentClass', 'section', 'contactNumber', 'email'],
            },
            {
              model: feeStructures,
              as: 'feeStructure',
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
            },
          ],
        },
        {
          model: admins,
          as: 'collector',
          attributes: ['id', 'fullName', 'email'],
        },
      ],
    });

    res.status(201).json({
      message: 'Payment collected successfully',
      data: {
        transaction: completeTransaction,
        allocation: {
          id: allocation.id,
          totalAmount: allocation.totalAmount,
          paidAmount: allocation.paidAmount,
          balance: allocation.balance,
          status: allocation.status,
        },
      },
    });
  } catch (error) {
    await t.rollback();
    console.error('Error collecting fee payment:', error);
    res.status(500).json({
      message: 'Error collecting fee payment',
      error: error.message,
    });
  }
};

// Get all fee transactions
exports.getAllFeeTransactions = async (req, res) => {
  try {
    const {
      studentId,
      feeAllocationId,
      status,
      paymentMethod,
      startDate,
      endDate,
      collectedBy,
    } = req.query;

    const where = {};
    if (studentId) where.studentId = studentId;
    if (feeAllocationId) where.feeAllocationId = feeAllocationId;
    if (status) where.status = status;
    if (paymentMethod) where.paymentMethod = paymentMethod;
    if (collectedBy) where.collectedBy = collectedBy;

    if (startDate && endDate) {
      where.paymentDate = {
        [Op.between]: [startDate, endDate],
      };
    } else if (startDate) {
      where.paymentDate = {
        [Op.gte]: startDate,
      };
    } else if (endDate) {
      where.paymentDate = {
        [Op.lte]: endDate,
      };
    }

    const transactions = await feeTransactions.findAll({
      where,
      include: [
        {
          model: feeAllocations,
          as: 'feeAllocation',
          required: false, // Allow null for flexible collections
          include: [
            {
              model: students,
              as: 'student',
              attributes: ['id', 'fullName', 'rollNumber', 'currentClass', 'section'],
            },
            {
              model: feeStructures,
              as: 'feeStructure',
              attributes: ['id', 'name', 'academicYear', 'class'],
            },
          ],
        },
        {
          model: students,
          as: 'student', // Direct student relation for flexible collections
          attributes: ['id', 'fullName', 'rollNumber', 'currentClass', 'section', 'contactNumber', 'studentId'],
        },
        {
          model: admins,
          as: 'collector',
          attributes: ['id', 'fullName', 'email'],
        },
      ],
      order: [['transactionDate', 'DESC']],
    });

    // Calculate summary
    const summary = {
      totalTransactions: transactions.length,
      totalAmount: transactions
        .filter(t => t.status === 'confirmed')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0),
      byPaymentMethod: {},
      byStatus: {},
    };

    transactions.forEach(t => {
      // By payment method
      const method = t.paymentMethod;
      if (!summary.byPaymentMethod[method]) {
        summary.byPaymentMethod[method] = { count: 0, amount: 0 };
      }
      summary.byPaymentMethod[method].count++;
      if (t.status === 'confirmed') {
        summary.byPaymentMethod[method].amount += parseFloat(t.amount);
      }

      // By status
      const status = t.status;
      if (!summary.byStatus[status]) {
        summary.byStatus[status] = { count: 0, amount: 0 };
      }
      summary.byStatus[status].count++;
      if (t.status === 'confirmed') {
        summary.byStatus[status].amount += parseFloat(t.amount);
      }
    });

    res.json({
      message: 'Fee transactions fetched successfully',
      data: {
        transactions,
        summary,
      },
    });
  } catch (error) {
    console.error('Error fetching fee transactions:', error);
    res.status(500).json({
      message: 'Error fetching fee transactions',
      error: error.message,
    });
  }
};

// Get transaction by ID
exports.getFeeTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await feeTransactions.findByPk(id, {
      include: [
        {
          model: feeAllocations,
          as: 'feeAllocation',
          include: [
            {
              model: students,
              as: 'student',
            },
            {
              model: feeStructures,
              as: 'feeStructure',
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
            },
          ],
        },
        {
          model: admins,
          as: 'collector',
          attributes: ['id', 'fullName', 'email'],
        },
      ],
    });

    if (!transaction) {
      return res.status(404).json({
        message: 'Fee transaction not found',
      });
    }

    res.json({
      message: 'Fee transaction fetched successfully',
      data: transaction,
    });
  } catch (error) {
    console.error('Error fetching fee transaction:', error);
    res.status(500).json({
      message: 'Error fetching fee transaction',
      error: error.message,
    });
  }
};

// Get transaction by receipt number
exports.getFeeTransactionByReceiptNumber = async (req, res) => {
  try {
    const { receiptNumber } = req.params;

    const transaction = await feeTransactions.findOne({
      where: { receiptNumber },
      include: [
        {
          model: feeAllocations,
          as: 'feeAllocation',
          include: [
            {
              model: students,
              as: 'student',
            },
            {
              model: feeStructures,
              as: 'feeStructure',
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
            },
          ],
        },
        {
          model: admins,
          as: 'collector',
          attributes: ['id', 'fullName', 'email'],
        },
      ],
    });

    if (!transaction) {
      return res.status(404).json({
        message: 'Fee transaction not found',
      });
    }

    res.json({
      message: 'Fee transaction fetched successfully',
      data: transaction,
    });
  } catch (error) {
    console.error('Error fetching fee transaction:', error);
    res.status(500).json({
      message: 'Error fetching fee transaction',
      error: error.message,
    });
  }
};

// Cancel a transaction
exports.cancelFeeTransaction = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;
    const cancelledBy = req.admin.id;

    if (!cancellationReason) {
      await t.rollback();
      return res.status(400).json({
        message: 'Cancellation reason is required',
      });
    }

    const transaction = await feeTransactions.findByPk(id, {
      include: [
        {
          model: feeAllocations,
          as: 'feeAllocation',
        },
      ],
      transaction: t,
    });

    if (!transaction) {
      await t.rollback();
      return res.status(404).json({
        message: 'Fee transaction not found',
      });
    }

    if (transaction.status === 'cancelled') {
      await t.rollback();
      return res.status(400).json({
        message: 'Transaction is already cancelled',
      });
    }

    // Update transaction status
    transaction.status = 'cancelled';
    transaction.cancelledAt = new Date();
    transaction.cancelledBy = cancelledBy;
    transaction.cancellationReason = cancellationReason.trim();
    await transaction.save({ transaction: t });

    // Reverse the payment in allocation
    const allocation = transaction.feeAllocation;
    const transactionAmount = parseFloat(transaction.amount);

    allocation.paidAmount = parseFloat(allocation.paidAmount) - transactionAmount;
    allocation.balance = parseFloat(allocation.balance) + transactionAmount;

    // Update status
    if (allocation.paidAmount <= 0) {
      allocation.status = 'pending';
    } else if (allocation.balance > 0) {
      allocation.status = 'partial';
    } else {
      allocation.status = 'paid';
    }

    await allocation.save({ transaction: t });

    await t.commit();

    // Fetch updated transaction
    const updatedTransaction = await feeTransactions.findByPk(id, {
      include: [
        {
          model: feeAllocations,
          as: 'feeAllocation',
          include: [
            {
              model: students,
              as: 'student',
              attributes: ['id', 'fullName', 'rollNumber', 'currentClass', 'section'],
            },
          ],
        },
      ],
    });

    res.json({
      message: 'Transaction cancelled successfully',
      data: updatedTransaction,
    });
  } catch (error) {
    await t.rollback();
    console.error('Error cancelling fee transaction:', error);
    res.status(500).json({
      message: 'Error cancelling fee transaction',
      error: error.message,
    });
  }
};

// Get daily collection report
exports.getDailyCollectionReport = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    const transactions = await feeTransactions.findAll({
      where: {
        paymentDate: targetDate,
        status: 'confirmed',
      },
      include: [
        {
          model: students,
          as: 'student',
          attributes: ['id', 'fullName', 'rollNumber', 'currentClass', 'section'],
        },
        {
          model: admins,
          as: 'collector',
          attributes: ['id', 'fullName', 'email'],
        },
      ],
      order: [['transactionDate', 'ASC']],
    });

    const summary = {
      date: targetDate,
      totalTransactions: transactions.length,
      totalAmount: transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0),
      byPaymentMethod: {},
      byCollector: {},
    };

    transactions.forEach(t => {
      // By payment method
      const method = t.paymentMethod;
      if (!summary.byPaymentMethod[method]) {
        summary.byPaymentMethod[method] = { count: 0, amount: 0 };
      }
      summary.byPaymentMethod[method].count++;
      summary.byPaymentMethod[method].amount += parseFloat(t.amount);

      // By collector
      const collectorName = t.collectedByName || 'Unknown';
      if (!summary.byCollector[collectorName]) {
        summary.byCollector[collectorName] = { count: 0, amount: 0 };
      }
      summary.byCollector[collectorName].count++;
      summary.byCollector[collectorName].amount += parseFloat(t.amount);
    });

    res.json({
      message: 'Daily collection report generated successfully',
      data: {
        transactions,
        summary,
      },
    });
  } catch (error) {
    console.error('Error generating daily collection report:', error);
    res.status(500).json({
      message: 'Error generating daily collection report',
      error: error.message,
    });
  }
};

// Collect flexible fee payment (with custom categories)
exports.collectFlexibleFeePayment = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      studentId,
      feeItems, // Array of { feeCategoryId, amount }
      totalAmount,
      paidAmount,
      dueAmount,
      paymentMethod,
      paymentDate,
      bankName,
      bankAccountNumber,
      referenceNumber,
      remarks,
    } = req.body;

    const collectedBy = req.admin.id;
    const collectedByName = req.admin.fullName || req.admin.email;

    // Validation
    if (!studentId || !feeItems || feeItems.length === 0) {
      await t.rollback();
      return res.status(400).json({
        message: 'Student ID and fee items are required',
      });
    }

    if (!paidAmount || parseFloat(paidAmount) <= 0) {
      await t.rollback();
      return res.status(400).json({
        message: 'Payment amount must be greater than zero',
      });
    }

    if (parseFloat(paidAmount) > parseFloat(totalAmount)) {
      await t.rollback();
      return res.status(400).json({
        message: 'Payment amount cannot exceed total amount',
      });
    }

    // Verify student exists
    const student = await students.findByPk(studentId);
    if (!student) {
      await t.rollback();
      return res.status(404).json({
        message: 'Student not found',
      });
    }

    // Generate receipt number
    const receiptNumber = await generateReceiptNumber();

    // Create fee items description for storage
    const feeItemsDescription = await Promise.all(
      feeItems.map(async (item) => {
        const category = await feeCategories.findByPk(item.feeCategoryId);
        return {
          categoryId: item.feeCategoryId,
          categoryName: category?.name || 'Unknown',
          amount: parseFloat(item.amount),
        };
      })
    );

    // Create transaction record
    const transaction = await feeTransactions.create(
      {
        receiptNumber,
        feeAllocationId: null, // No allocation for flexible fees
        studentId,
        amount: parseFloat(paidAmount),
        paymentMethod: paymentMethod || 'cash',
        paymentDate: paymentDate || new Date(),
        transactionDate: new Date(),
        bankName: bankName?.trim(),
        bankAccountNumber: bankAccountNumber?.trim(),
        referenceNumber: referenceNumber?.trim(),
        collectedBy,
        collectedByName,
        remarks: JSON.stringify({
          userRemarks: remarks?.trim(),
          feeItems: feeItemsDescription,
          totalAmount: parseFloat(totalAmount),
          dueAmount: parseFloat(dueAmount),
        }),
        status: 'confirmed',
      },
      { transaction: t }
    );

    await t.commit();

    res.status(201).json({
      message: 'Payment collected successfully',
      data: {
        receiptNumber,
        transaction,
        student: {
          id: student.id,
          studentId: student.studentId,
          fullName: student.fullName,
          rollNumber: student.rollNumber,
          currentClass: student.currentClass,
          section: student.section,
        },
        feeItems: feeItemsDescription,
        totalAmount: parseFloat(totalAmount),
        paidAmount: parseFloat(paidAmount),
        dueAmount: parseFloat(dueAmount),
      },
    });
  } catch (error) {
    await t.rollback();
    console.error('Error collecting flexible fee payment:', error);
    res.status(500).json({
      message: 'Error collecting fee payment',
      error: error.message,
    });
  }
};
