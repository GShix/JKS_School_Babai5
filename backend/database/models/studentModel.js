const studentModel = (sequelize, DataTypes) => {
  const Student = sequelize.define('student', {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Password for student portal login',
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: [['Male', 'Female', 'Other']],
      },
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    guardianName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    guardianPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    guardianEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
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
    rollNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    admissionDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    previousSchool: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bloodGroup: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active',
      validate: {
        isIn: [['active', 'inactive', 'graduated', 'transferred']],
      },
    },
    profileImage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Academic Information
    previousGrade: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    previousPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    // Additional Notes
    medicalInfo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  return Student;
};

module.exports = studentModel;
