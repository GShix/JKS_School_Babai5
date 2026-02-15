const submissionModel = (sequelize, DataTypes) => {
  const Submission = sequelize.define('submission', {
    assignmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'assignments',
        key: 'id'
      }
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id'
      }
    },
    submissionDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    attachments: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'JSON array of file URLs',
    },
    marksObtained: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'submitted',
      validate: {
        isIn: [['submitted', 'graded', 'late', 'resubmit']],
      },
    },
    gradedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Staff ID who graded'
    },
    gradedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  });

  return Submission;
};

module.exports = submissionModel;
