const teacherModel = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('teacher', {
    // Basic Information
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
    nin: {
      type: DataTypes.STRING,
      allowNull: true,
      // unique: true, // Temporarily disabled for schema sync
      comment: 'National Identification Number',
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
    citizenship: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Permanent Address
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

    // Temporary Address
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

    // Family Information
    fatherName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    motherName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    spouseName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    willPerson: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Guardian or will executor',
    },

    // Additional Information
    caste: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    motherTongue: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    disability: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true, // Temporarily disabled for schema sync
      validate: {
        isEmail: true,
      },
    },
    pan: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Permanent Account Number',
    },
    bankName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bankAccount: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Professional Information
    employeeId: {
      type: DataTypes.STRING,
      allowNull: true,
      // unique: true, // Temporarily disabled for schema sync
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Teaching',
    },
    subjects: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Comma-separated list of subjects',
    },
    teachingLicense: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    joiningDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    qualification: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    experience: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Years of experience',
    },
    bloodGroup: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Government Schemes
    karmachariSanachayakosh: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Employee Provident Fund',
    },
    sabadhikBimaKosh: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Social Security Fund',
    },
    ssf: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Social Security Fund Number',
    },
    nagarikLaganiKosh: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Citizen Investment Trust',
    },

    // Status and Image
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active',
      validate: {
        isIn: [['active', 'inactive', 'on-leave', 'terminated']],
      },
    },
    profileImage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // Additional Notes
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  return Teacher;
};

module.exports = teacherModel;
