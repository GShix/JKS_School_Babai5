const {Sequelize, DataTypes} = require('sequelize');

 
const sequelize = new Sequelize(process.env.db_string);

sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });   

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;