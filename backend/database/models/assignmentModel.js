const assignmentModel = (sequelize, DataTypes) => {
  const Assignment = sequelize.define('assignment', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    class: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    section: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'staffs',
        key: 'id'
      }
    },
    assignedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    totalMarks: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 100,
    },
    attachments: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'JSON array of file URLs',
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active',
      validate: {
        isIn: [['active', 'closed', 'cancelled']],
      },
    },
  });

  return Assignment;
};

module.exports = assignmentModel;
