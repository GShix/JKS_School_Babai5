const feeModel = (sequelize, DataTypes) => {
  const Fee = sequelize.define('fee', {
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id'
      }
    },
    feeType: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Tuition, Transport, Library, Exam, etc.',
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    paidAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    paymentDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Cash, Bank Transfer, Online, Cheque, etc.',
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'paid', 'partial', 'overdue']],
      },
    },
    academicYear: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'e.g., 2023-2024',
    },
    receiptNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    collectedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Admin ID who collected fee'
    }
  });

  return Fee;
};

module.exports = feeModel;
