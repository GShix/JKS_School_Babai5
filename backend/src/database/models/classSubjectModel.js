const classSubjectModel = (sequelize, DataTypes) => {
    const ClassSubject = sequelize.define(
        'ClassSubject',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },

            classId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'classes',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },

            subjectId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'subjects',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },

            isCompulsory: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },

            status: {
                type: DataTypes.ENUM('active', 'inactive'),
                allowNull: false,
                defaultValue: 'active',
            },
        },
        {
            tableName: 'class_subjects',
            timestamps: true,

            indexes: [
                {
                    unique: true,
                    fields: ['classId', 'subjectId'],
                },
            ],
        }
    );

    return ClassSubject;
};

module.exports = classSubjectModel;