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

db.blogs = require('./models/blogModel')(sequelize, DataTypes);
db.programs = require('./models/programModel')(sequelize, DataTypes);
db.activities = require('./models/activityModel')(sequelize, DataTypes);

sequelize.sync({ alter: true}).then(()=>{
  console.log('Database & tables created!');
})
module.exports = db; 
// exports programs and activities models
exports.programs = db.programs;
exports.activities = db.activities;