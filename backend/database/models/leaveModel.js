const leaveModel = (sequelize, DataTypes) => {
  const Leave = sequelize.define('leave', {
    applicantType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['student', 'staff']],
      },
    },
    applicantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Student ID or Staff ID',
    },
    leaveType: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Sick, Casual, Emergency, etc.',
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    totalDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'approved', 'rejected']],
      },
    },
    appliedDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    reviewedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Admin ID who reviewed'
    },
    reviewedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reviewRemarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  return Leave;
};

module.exports = leaveModel;
