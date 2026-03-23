const classModel = (sequelize, DataTypes) => {
    const Class = sequelize.define('class', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        medium: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        section: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        department: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'active',
            validate: {
                isIn: [['active', 'inactive']],
            },
        },
        totalStudents: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        }
    });

    return Class;
};

module.exports = classModel;