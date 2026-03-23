const studentModel = (sequelize, DataTypes) => {
  const Student = sequelize.define('student', {
    // Basic Information
    emisId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    middleName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      // unique: true, // Temporarily disabled for schema sync
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
    contactNumber: {
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
    isForeignStudent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    // Permanent Address (Not required for foreign students)
    permanentProvince: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    permanentDistrict: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    permanentMunicipality: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    permanentWard: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Temporary/Current Address (Required for all students)
    temporaryProvince: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    temporaryDistrict: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    temporaryMunicipality: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    temporaryWard: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sameAsPermAddress: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    // Legacy address field (kept for backward compatibility)
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // Family Information
    fatherName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    motherName: {
      type: DataTypes.STRING,
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
    guardianContactNo: {
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

    // Academic Information
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
      // unique: true, // Temporarily disabled for schema sync
    },
    admitYear: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    admissionDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    previousSchool: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    previousGrade: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    previousPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Personal Details
    caste: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    motherTongue: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    disabilityType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bloodGroup: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // School Information
    schoolingSource: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    scholarship: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Status and Media
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
    photo: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Student photo URL from file upload',
    },

    // Additional Information
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
