const {sequelize, DataTypes} = require('sequelize');

const sequelize = new sequelize('postgresql://postgres.jcjowrzhcfkrmjerwsry:DP_SASS.2025@aws-0-us-east-2.pooler.supabase.com:6543/postgres');

sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });   