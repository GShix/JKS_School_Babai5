const downloadModel = (sequelize, DataTypes) => {
  const Download = sequelize.define('download', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Title of the downloadable resource',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Description of the content',
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['notes', 'question-papers', 'solutions', 'forms', 'syllabus', 'others']],
      },
      comment: 'Type of resource: notes, question-papers, solutions, forms, syllabus, others',
    },
    class: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Applicable class (1-12, or "all")',
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Subject name (e.g., Mathematics, Science)',
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'URL or path to the file',
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Original file name',
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'File type: pdf, image (jpeg, jpg, png, etc.)',
    },
    fileSize: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'File size (e.g., 2.5 MB)',
    },
    downloads: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of times downloaded',
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active',
      validate: {
        isIn: [['active', 'inactive']],
      },
      comment: 'Status of the download',
    },
    uploadedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Admin ID who uploaded',
    },
    academicYear: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Academic year for the resource (e.g., 2024-2025)',
    },
  });

  return Download;
};

module.exports = downloadModel;
