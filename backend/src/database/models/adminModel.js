const adminModel = (sequelize, DataTypes) => {
  const Admin = sequelize.define('admin', {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true, // Temporarily disabled for schema sync
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'admin',
      validate: {
        isIn: [['admin', 'superAdmin', 'accountant', 'operator', 'coordinator', 'teacher', 'staff']],
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profileImage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active',
      validate: {
        isIn: [['active', 'inactive', 'suspended']],
      },
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  return Admin;
};

module.exports = adminModel;
