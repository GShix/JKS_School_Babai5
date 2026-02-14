module.exports = (sequelize, DataTypes) => {
  const SchoolMessage = sequelize.define('school_message', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    personName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'person_name'
    },
    personPosition: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'person_position'
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    photo: {
      type: DataTypes.STRING(255)
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'display_order'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    }
  }, {
    tableName: 'school_messages',
    timestamps: true,
    underscored: true
  });

  return SchoolMessage;
};
