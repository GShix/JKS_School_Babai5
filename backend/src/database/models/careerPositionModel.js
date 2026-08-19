module.exports = (sequelize, DataTypes) => {
  const CareerPosition = sequelize.define('career_position', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Job position title'
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Department (Academics, Science, Administration, etc.)'
    },
    type: {
      type: DataTypes.ENUM('Full-time', 'Part-time', 'Contract', 'Temporary'),
      allowNull: false,
      defaultValue: 'Full-time'
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'Bhangabari, Dang'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Detailed job description'
    },
    requirements: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Job requirements and qualifications'
    },
    responsibilities: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Key responsibilities'
    },
    salaryRange: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'salary_range',
      comment: 'Expected salary range'
    },
    vacancies: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: 'Number of positions available'
    },
    applicationDeadline: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'application_deadline',
      comment: 'Last date to apply'
    },
    noticeFileName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'notice_file_name',
      comment: 'Original filename of the uploaded notice'
    },
    noticeFileUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'notice_file_url',
      comment: 'URL/path to the notice file (PDF/image)'
    },
    status: {
      type: DataTypes.ENUM('active', 'closed', 'draft'),
      allowNull: false,
      defaultValue: 'active',
      comment: 'Position status'
    },
    postedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'posted_date',
      comment: 'Date when position was posted'
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'created_by',
      comment: 'Admin ID who created this position'
    }
  }, {
    tableName: 'career_positions',
    timestamps: true,
    underscored: true
  });

  return CareerPosition;
};
