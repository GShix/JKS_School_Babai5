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

db.programs = require('./models/programModel')(sequelize, DataTypes);
db.activities = require('./models/activityModel')(sequelize, DataTypes);

sequelize.sync({ alter: false}).then(()=>{
  console.log('Database & tables created!');
})
module.exports = db;