/**
 * Fee Structure Item Model
 * 
 * Junction table linking Fee Structures to Fee Categories with specific amounts.
 * This allows a fee structure to have multiple categories with different amounts.
 */

const feeStructureItemModel = (sequelize, DataTypes) => {
  const FeeStructureItem = sequelize.define('feeStructureItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    feeStructureId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'fee_structures',
        key: 'id',
      },
      onDelete: 'CASCADE',
      comment: 'Reference to the fee structure',
    },
    feeCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'fee_categories',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      comment: 'Reference to the fee category',
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Amount for this specific category',
      validate: {
        min: 0,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Optional description or notes for this item',
    },
  }, {
    tableName: 'fee_structure_items',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['feeStructureId', 'feeCategoryId'],
      },
    ],
  });

  return FeeStructureItem;
};

module.exports = feeStructureItemModel;
