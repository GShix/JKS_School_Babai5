const studentModel = (sequelize, DataTypes) => {
  const Student = sequelize.define('student', {
    // Basic Information
    iemisCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currentSchool: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    middleName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
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
    contactNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    dobNepali: {
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
      allowNull: true,
      defaultValue: false,
    },

    // Permanent Address (Not required for foreign students)
    permanentAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
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
    permanentTole: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Temporary/Current Address (Required for all students)
    temporaryAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
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
    temporaryTole: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sameAsPermAddress: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
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
    currentClass: {
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
    admissionDateNepali: {
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
    currentScholarship: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Status and Media
    status: {
      type: DataTypes.STRING,
      allowNull: true,
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
    isTransferred: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    transferedToSchool: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transferDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
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
