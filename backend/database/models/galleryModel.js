const galleryModel = (sequelize, DataTypes) => {
  const Gallery = sequelize.define('gallery', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'events',
      validate: {
        isIn: [['events', 'academic', 'cultural', 'sports', 'infrastructure', 'other']],
      },
      comment: 'events, academic, cultural, sports, infrastructure, other',
    },
    eventDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Date when the event/activity took place',
    },
    images: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('images');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('images', JSON.stringify(value));
      },
      comment: 'JSON array of image objects {filename, originalName, url, size}',
    },
    videos: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('videos');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('videos', JSON.stringify(value));
      },
      comment: 'JSON array of video objects {filename, originalName, url, size, duration}',
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Comma-separated tags for search',
    },
    featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Show on homepage',
    },
    views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of views',
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active',
      validate: {
        isIn: [['active', 'inactive', 'draft']],
      },
    },
    uploadedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Admin ID who uploaded',
    },
  });

  return Gallery;
};

module.exports = galleryModel;
