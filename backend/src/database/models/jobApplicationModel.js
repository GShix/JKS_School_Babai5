module.exports = (sequelize, DataTypes) => {
  const JobApplication = sequelize.define('job_application', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    positionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'position_id',
      comment: 'Reference to career_position id'
    },
    positionTitle: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'position_title',
      comment: 'Snapshot of position title at time of application'
    },
    applicantName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'applicant_name'
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    coverLetter: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'cover_letter',
      comment: 'Optional cover letter from applicant'
    },
    resumeFileName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'resume_file_name',
      comment: 'Original filename of resume'
    },
    resumeFileUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: 'resume_file_url',
      comment: 'URL/path to resume file'
    },
    status: {
      type: DataTypes.ENUM('pending', 'reviewing', 'shortlisted', 'rejected', 'accepted'),
      allowNull: false,
      defaultValue: 'pending',
      comment: 'Application status'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Admin notes about this application'
    },
    reviewedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'reviewed_by',
      comment: 'Admin ID who reviewed'
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'reviewed_at'
    }
  }, {
    tableName: 'job_applications',
    timestamps: true,
    underscored: true
  });

  return JobApplication;
};
