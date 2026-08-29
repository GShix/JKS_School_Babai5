const { fees } = require('../database/connection');
const { Op } = require('sequelize');

// Create Fee Record
exports.createFee = async (req, res) => {
  try {
    const {
      studentId,
      feeType,
      amount,
      dueDate,
      academicYear,
      remarks
    } = req.body;

    if (!studentId || !feeType || !amount || !dueDate || !academicYear) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const newFee = await fees.create({
      studentId,
      feeType,
      amount,
      dueDate,
      academicYear,
      remarks,
      status: 'pending'
    });

    return res.status(201).json({ message: 'Fee record created successfully', data: newFee });
  } catch (error) {
    return res.status(500).json({ message: 'Could not create fee record', error: error.message });
  }
};

// Record Payment
exports.recordPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paidAmount, paymentDate, paymentMethod, receiptNumber } = req.body;

    if (!paidAmount) {
      return res.status(400).json({ message: 'Paid amount is required' });
    }

    const feeRecord = await fees.findByPk(id);
    if (!feeRecord) {
      return res.status(404).json({ message: 'Fee record not found' });
    }

    const totalPaid = (feeRecord.paidAmount || 0) + paidAmount;
    let status = 'pending';

    if (totalPaid >= feeRecord.amount) {
      status = 'paid';
    } else if (totalPaid > 0) {
      status = 'partial';
    }

    await feeRecord.update({
      paidAmount: totalPaid,
      paymentDate: paymentDate || new Date(),
      paymentMethod,
      receiptNumber,
      status,
      collectedBy: req.user.id
    });

    return res.json({ message: 'Payment recorded successfully', data: feeRecord });
  } catch (error) {
    return res.status(500).json({ message: 'Could not record payment', error: error.message });
  }
};

// Get Student Fees
exports.getStudentFees = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { status, academicYear } = req.query;

    let whereClause = { studentId };
    if (status) whereClause.status = status;
    if (academicYear) whereClause.academicYear = academicYear;

    const studentFees = await fees.findAll({
      where: whereClause,
      order: [['dueDate', 'ASC']]
    });

    const summary = {
      total: studentFees.reduce((sum, f) => sum + f.amount, 0),
      paid: studentFees.reduce((sum, f) => sum + f.paidAmount, 0),
      pending: studentFees.reduce((sum, f) => sum + (f.amount - f.paidAmount), 0),
    };

    return res.json({
      message: 'Student fees fetched successfully',
      data: studentFees,
      summary
    });
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch student fees', error: error.message });
  }
};

// Get All Fees (with filters)
exports.getAllFees = async (req, res) => {
  try {
    const { status, feeType, academicYear } = req.query;

    let whereClause = {};
    if (status) whereClause.status = status;
    if (feeType) whereClause.feeType = feeType;
    if (academicYear) whereClause.academicYear = academicYear;

    const allFees = await fees.findAll({
      where: whereClause,
      order: [['dueDate', 'ASC']]
    });

    return res.json({ message: 'Fees fetched successfully', data: allFees });
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch fees', error: error.message });
  }
};

// Update Fee Record
exports.updateFee = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, dueDate, feeType, remarks, status } = req.body;

    const feeRecord = await fees.findByPk(id);
    if (!feeRecord) {
      return res.status(404).json({ message: 'Fee record not found' });
    }

    await feeRecord.update({
      amount: amount !== undefined ? amount : feeRecord.amount,
      dueDate: dueDate !== undefined ? dueDate : feeRecord.dueDate,
      feeType: feeType !== undefined ? feeType : feeRecord.feeType,
      remarks: remarks !== undefined ? remarks : feeRecord.remarks,
      status: status !== undefined ? status : feeRecord.status,
    });

    return res.json({ message: 'Fee record updated successfully', data: feeRecord });
  } catch (error) {
    return res.status(500).json({ message: 'Could not update fee record', error: error.message });
  }
};

// Delete Fee Record
exports.deleteFee = async (req, res) => {
  try {
    const { id } = req.params;

    const feeRecord = await fees.findByPk(id);
    if (!feeRecord) {
      return res.status(404).json({ message: 'Fee record not found' });
    }

    await fees.destroy({ where: { id } });
    return res.json({ message: 'Fee record deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Could not delete fee record', error: error.message });
  }
};
