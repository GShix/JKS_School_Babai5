const programModel =(sequelize, DataTypes)=>{
    const Program = sequelize.define("program",{
        programName:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        programDescription:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        programStatus:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'active',
        },
        programImage:{
            type: DataTypes.STRING,
            allowNull: true,
        },

    })
    return Program;
}
module.exports=programModel;