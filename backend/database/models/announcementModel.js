const announcementModel = (sequelize, DataTypes) => {
  const Announcement = sequelize.define('announcement', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    targetAudience: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'all',
      comment: 'all, students, staff, parents, or specific class',
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'medium',
      validate: {
        isIn: [['low', 'medium', 'high', 'urgent']],
      },
    },
    isPinned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Pin announcement to top',
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Date when announcement becomes active',
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Date when announcement expires',
    },
    attachments: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('attachments');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('attachments', JSON.stringify(value));
      },
      comment: 'JSON array of file objects {filename, originalName, fileType, url, size}',
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active',
      validate: {
        isIn: [['active', 'expired', 'draft']],
      },
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Admin ID who created'
    },
  });

  return Announcement;
};

module.exports = announcementModel;
