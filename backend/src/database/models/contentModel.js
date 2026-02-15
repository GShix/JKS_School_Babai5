const contentModel = (sequelize, DataTypes) => {
  const Content = sequelize.define('content', {
    section: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Section identifier: school_profile, hero, downloads, gallery, career, etc.'
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Content key within the section'
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Content value (can be text, JSON, or URL)'
    },
    valueType: {
      type: DataTypes.STRING,
      defaultValue: 'text',
      comment: 'Type of value: text, json, url, number, boolean'
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Additional metadata as JSON'
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Optional category for filtering'
    },
    language: {
      type: DataTypes.STRING,
      defaultValue: 'en',
      comment: 'Language code: en, ne (Nepali)'
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active',
      validate: {
        isIn: [['active', 'inactive', 'draft']]
      }
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Display order'
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['section', 'key', 'language']
      },
      {
        fields: ['section']
      },
      {
        fields: ['category']
      }
    ]
  });

  return Content;
};

module.exports = contentModel;
