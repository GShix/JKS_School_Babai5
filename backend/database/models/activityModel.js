const activityModel = (sequelize, DataTypes) => {
    const Activity = sequelize.define("activity", {
        activityName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        activityDescription: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        activityStatus: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'active',
        },
        activityImage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });
    return Activity;
}
module.exports = activityModel;