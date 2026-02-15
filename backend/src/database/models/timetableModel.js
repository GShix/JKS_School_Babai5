const timetableModel = (sequelize, DataTypes) => {
  const Timetable = sequelize.define('timetable', {
    class: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    section: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    day: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']],
      },
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    teacher: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'staffs',
        key: 'id'
      }
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    room: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    academicYear: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'e.g., 2023-2024',
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active',
      validate: {
        isIn: [['active', 'cancelled', 'rescheduled']],
      },
    },
  });

  return Timetable;
};

module.exports = timetableModel;
