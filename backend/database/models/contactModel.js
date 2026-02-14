module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('contact', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isStudent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_student'
    },
    className: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'class_name'
    },
    status: {
      type: DataTypes.ENUM('pending', 'contacted', 'resolved'),
      defaultValue: 'pending'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Admin notes about this contact'
    }
  }, {
    tableName: 'contacts',
    timestamps: true,
    underscored: true
  });

  return Contact;
};
