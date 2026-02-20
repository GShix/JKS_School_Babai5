/**
 * Fee Structure Model
 * 
 * Defines the fee structure for a specific class/grade for an academic year.
 * Links multiple fee categories with their amounts for a particular class.
 */

const feeStructureModel = (sequelize, DataTypes) => {
  const FeeStructure = sequelize.define('feeStructure', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'e.g., "Class 8 - Academic Year 2024-2025"',
    },
    academicYear: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'e.g., "2024-2025" or "2081-2082" (Nepali calendar)',
    },
    class: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Class/Grade (e.g., "8", "9", "10")',
    },
    section: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Section (e.g., "A", "B", "C") - null means applies to all sections',
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: 'Total fee amount (sum of all category amounts)',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Additional description or notes',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether this fee structure is currently active',
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Default due date for this fee structure',
    },
  }, {
    tableName: 'fee_structures',
    timestamps: true,
    indexes: [
      {
        fields: ['academicYear', 'class'],
      },
      {
        fields: ['isActive'],
      },
    ],
  });

  return FeeStructure;
};

module.exports = feeStructureModel;
