const attendanceModel = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('attendance', {
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'absent',
      validate: {
        isIn: [['present', 'absent', 'late', 'excused']],
      },
    },
    class: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    section: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    markedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Admin/Staff ID who marked attendance'
    }
  });

  return Attendance;
};

module.exports = attendanceModel;
