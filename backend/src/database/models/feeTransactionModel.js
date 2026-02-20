/**
 * Fee Transaction Model
 * 
 * Records every payment made by students.
 * Supports partial payments and maintains a complete payment history.
 */

const feeTransactionModel = (sequelize, DataTypes) => {
  const FeeTransaction = sequelize.define('feeTransaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    receiptNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false, // Removed unique for easier migration
      comment: 'Unique receipt number for this transaction (e.g., FEE-2024-0001)',
    },
    feeAllocationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'fee_allocations',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      comment: 'Reference to the fee allocation',
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      comment: 'Reference to the student (denormalized for easier querying)',
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Payment amount',
      validate: {
        min: 0.01,
      },
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'cash',
      validate: {
        isIn: [['cash', 'bank_transfer', 'cheque', 'online', 'card']],
      },
      comment: 'Payment method used',
    },
    paymentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Date when payment was made',
    },
    transactionDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Timestamp when transaction was recorded',
    },
    bankName: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Bank name (for bank transfer/cheque payments)',
    },
    bankAccountNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Bank account number or cheque number',
    },
    referenceNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Bank reference number or transaction ID',
    },
    collectedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'admins',
        key: 'id',
      },
      comment: 'Admin/Accountant who collected the payment',
    },
    collectedByName: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Name of person who collected payment (denormalized)',
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Additional remarks or notes',
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'confirmed',
      validate: {
        isIn: [['pending', 'confirmed', 'cancelled']],
      },
      comment: 'Transaction status',
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Timestamp when transaction was cancelled',
    },
    cancelledBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'admins',
        key: 'id',
      },
      comment: 'Admin who cancelled the transaction',
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Reason for cancellation',
    },
  }, {
    tableName: 'fee_transactions',
    timestamps: true,
    indexes: [
      {
        fields: ['receiptNumber'],
      },
      {
        fields: ['feeAllocationId'],
      },
      {
        fields: ['studentId'],
      },
      {
        fields: ['paymentDate'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['collectedBy'],
      },
    ],
  });

  return FeeTransaction;
};

module.exports = feeTransactionModel;
