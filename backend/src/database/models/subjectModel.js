const subjectModel = (sequelize, DataTypes) => {
    const Subject = sequelize.define(
        'Subject',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },

            academicYearId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'academic_years',
                    key: 'id',
                },
            },

            subjectName: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            subjectCode: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },

            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            subjectType: {
                type: DataTypes.ENUM('THEORY', 'PRACTICAL', 'BOTH'),
                defaultValue: 'THEORY',
                allowNull: false,
            },

            isOptional: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },

            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            tableName: 'subjects',
            timestamps: true,
        }
    );

    return Subject;
};

module.exports = subjectModel;