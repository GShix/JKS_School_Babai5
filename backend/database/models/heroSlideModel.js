const heroSlideModel = (sequelize, DataTypes) => {
  const HeroSlide = sequelize.define('heroSlide', {
    title: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Optional title for the slide',
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'URL of the hero image',
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Order in which slides appear (lower numbers first)',
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active',
      validate: {
        isIn: [['active', 'inactive']],
      },
      comment: 'Status of the slide',
    },
    uploadedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Admin ID who uploaded',
    },
  });

  return HeroSlide;
};

module.exports = heroSlideModel;
