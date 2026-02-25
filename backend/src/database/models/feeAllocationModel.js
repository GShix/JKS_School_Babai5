/**
 * Fee Allocation Model
 * 
 * Links a Student to a Fee Structure and tracks their balance.
 * This is the main table for tracking outstanding fees per student.
 */

const feeAllocationModel = (sequelize, DataTypes) => {
  const FeeAllocation = sequelize.define('feeAllocation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id',
      },
      onDelete: 'CASCADE',
      comment: 'Reference to the student',
    },
    feeStructureId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'fee_structures',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      comment: 'Reference to the fee structure',
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Total fee amount allocated to this student',
      validate: {
        min: 0,
      },
    },
    paidAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: 'Total amount paid by the student',
      validate: {
        min: 0,
      },
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Outstanding balance (totalAmount - paidAmount)',
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'partial', 'paid', 'overdue', 'waived']],
      },
      comment: 'Payment status: pending (no payment), partial (some paid), paid (full), overdue, waived',
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Due date for this fee allocation',
    },
    allocationDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Date when fee was allocated to student',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Additional notes or remarks',
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: 'Discount amount applied',
      validate: {
        min: 0,
      },
    },
    discountReason: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Reason for discount (scholarship, sibling discount, etc.)',
    },
    allocationBatch: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Batch identifier for grouping allocations (e.g., 2081-MIDTERM-EXAM, 2081-ANNUAL-FEE)',
    },
    purpose: {
      type: DataTypes.ENUM('admission', 'tuition', 'examination', 'event', 'transport', 'hostel', 'library', 'lab', 'sports', 'other'),
      allowNull: false,
      defaultValue: 'tuition',
      comment: 'Purpose of this fee allocation',
    },
    allocatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Admin user who created this allocation',
    },
  }, {
    tableName: 'fee_allocations',
    timestamps: true,
    indexes: [
      {
        fields: ['studentId'],
      },
      {
        fields: ['feeStructureId'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['dueDate'],
      },
    ],
    hooks: {
      // Automatically calculate balance before saving
      beforeValidate: (allocation) => {
        if (allocation.totalAmount !== undefined && allocation.paidAmount !== undefined) {
          allocation.balance = parseFloat(allocation.totalAmount) - parseFloat(allocation.paidAmount) - parseFloat(allocation.discount || 0);
        }
      },
      // Update status based on balance
      beforeSave: (allocation) => {
        if (allocation.balance <= 0) {
          allocation.status = 'paid';
        } else if (allocation.paidAmount > 0) {
          allocation.status = 'partial';
        } else {
          allocation.status = 'pending';
        }
        
        // Check if overdue
        if (allocation.dueDate && new Date(allocation.dueDate) < new Date() && allocation.balance > 0) {
          allocation.status = 'overdue';
        }
      },
    },
  });

  return FeeAllocation;
};

module.exports = feeAllocationModel;
