const gradeModel = (sequelize, DataTypes) => {
  const Grade = sequelize.define('grade', {
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id'
      }
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    examType: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'e.g., First Terminal, Second Terminal, Final, Unit Test, etc.',
    },
    marksObtained: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    totalMarks: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    percentage: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'A+, A, B+, B, C+, C, D, E, F',
    },
    class: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    section: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    academicYear: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'e.g., 2023-2024',
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    enteredBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Admin/Staff ID who entered grades'
    }
  });

  return Grade;
};

module.exports = gradeModel;
