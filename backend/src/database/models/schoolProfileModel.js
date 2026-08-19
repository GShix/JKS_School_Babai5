module.exports = (sequelize, DataTypes) => {
  const SchoolProfile = sequelize.define('school_profile', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    schoolName: {
      type: DataTypes.STRING(255),
      field: 'school_name'
    },
    schoolNameNepali: {
      type: DataTypes.STRING(255),
      field: 'school_name_nepali'
    },
    phone: {
      type: DataTypes.STRING(20)
    },
    email: {
      type: DataTypes.STRING(100)
    },
    address: {
      type: DataTypes.STRING(255)
    },
    addressNepali: {
      type: DataTypes.STRING(255),
      field: 'address_nepali'
    },
    province: {
      type: DataTypes.STRING(100)
    },
    district: {
      type: DataTypes.STRING(100)
    },
    municipality: {
      type: DataTypes.STRING(100)
    },
    ward: {
      type: DataTypes.STRING(10)
    },
    introduction: {
      type: DataTypes.TEXT
    },
    established: {
      type: DataTypes.STRING(10),
      field: 'established'
    },
    principalName: {
      type: DataTypes.STRING(255),
      field: 'principal_name'
    },
    website: {
      type: DataTypes.STRING(255)
    },
    facebookUrl: {
      type: DataTypes.STRING(255),
      field: 'facebook_url'
    },
    logoUrl: {
      type: DataTypes.STRING(500),
      field: 'logo_url'
    },
    panNumber: {
      type: DataTypes.STRING(50),
      field: 'pan_number'
    },
    registrationNumber: {
      type: DataTypes.STRING(100),
      field: 'registration_number'
    },
    affiliation: {
      type: DataTypes.STRING(255)
    },
    schoolCode: {
      type: DataTypes.STRING(20),
      field: 'school_code'
    },
    taxPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      field: 'tax_percentage',
      defaultValue: 0.00
    }
  }, {
    tableName: 'school_profile',
    timestamps: true,
    underscored: true
  });

  return SchoolProfile;
};
