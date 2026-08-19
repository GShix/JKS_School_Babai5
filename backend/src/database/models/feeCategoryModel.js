const feeCategoryModel = (sequelize, DataTypes) => {
  const FeeCategory = sequelize.define('feeCategory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false, // Removed unique constraint for easier migration
      comment: 'e.g., Tuition Fee, Transport Fee, Uniform Fee',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Detailed description of the fee category',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether this category is currently active',
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: 'Order in which to display this category',
    },
  }, {
    tableName: 'fee_categories',
    timestamps: true,
    indexes: [
      {
        fields: ['name'],
      },
      {
        fields: ['isActive'],
      },
    ],
  });

  return FeeCategory;
};

module.exports = feeCategoryModel;
