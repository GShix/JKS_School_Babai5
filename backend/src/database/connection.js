const {Sequelize, DataTypes} = require('sequelize');

// Ensure db_string exists
if (!process.env.db_string) {
  console.error('❌ ERROR: db_string environment variable is not set!');
  throw new Error('Database connection string is required. Please set db_string in environment variables.');
}

const sequelize = new Sequelize(process.env.db_string, {
  logging: false, // Disable SQL query logging to reduce console noise
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// Only authenticate, don't wait for it
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connection established successfully.');
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:', err.message);
  });   

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.blogs = require('./models/blogModel')(sequelize, DataTypes);
db.programs = require('./models/programModel')(sequelize, DataTypes);
db.activities = require('./models/activityModel')(sequelize, DataTypes);
db.admins = require('./models/adminModel')(sequelize, DataTypes);
db.students = require('./models/studentModel')(sequelize, DataTypes);
db.staff = require('./models/staffModel')(sequelize, DataTypes);
db.teacher = require('./models/teacherModel')(sequelize, DataTypes);
db.attendance = require('./models/attendanceModel')(sequelize, DataTypes);
db.grades = require('./models/gradeModel')(sequelize, DataTypes);
db.fees = require('./models/feeModel')(sequelize, DataTypes);
db.timetables = require('./models/timetableModel')(sequelize, DataTypes);
db.assignments = require('./models/assignmentModel')(sequelize, DataTypes);
db.submissions = require('./models/submissionModel')(sequelize, DataTypes);
db.leaves = require('./models/leaveModel')(sequelize, DataTypes);
db.announcements = require('./models/announcementModel')(sequelize, DataTypes);
db.contents = require('./models/contentModel')(sequelize, DataTypes);
db.gallery = require('./models/galleryModel')(sequelize, DataTypes);
db.downloads = require('./models/downloadModel')(sequelize, DataTypes);db.heroSlides = require('./models/heroSlideModel')(sequelize, DataTypes);
db.schoolProfile = require('./models/schoolProfileModel')(sequelize, DataTypes);
db.schoolMessages = require('./models/schoolMessageModel')(sequelize, DataTypes);
db.contacts = require('./models/contactModel')(sequelize, DataTypes);
db.careerPositions = require('./models/careerPositionModel')(sequelize, DataTypes);
db.jobApplications = require('./models/jobApplicationModel')(sequelize, DataTypes);

// DO NOT run sync() in production/serverless - it's slow and can crash functions
// Tables should already exist in production database
// Only run sync in local development if needed
if (process.env.NODE_ENV === 'development') {
  sequelize.sync({ alter: false }).then(() => {
    console.log('✅ Database & tables synced (development mode)');
  }).catch(err => {
    console.error('❌ Database sync error:', err.message);
  });
}

module.exports = db; 
// exports models
exports.programs = db.programs;
exports.activities = db.activities;
exports.admins = db.admins;
exports.students = db.students;
exports.staff = db.staff;
exports.teacher = db.teacher;
exports.attendance = db.attendance;
exports.grades = db.grades;
exports.fees = db.fees;
exports.timetables = db.timetables;
exports.assignments = db.assignments;
exports.submissions = db.submissions;
exports.leaves = db.leaves;
exports.announcements = db.announcements;
exports.contents = db.contents;
exports.blogs = db.blogs;
exports.gallery = db.gallery;
exports.downloads = db.downloads;
exports.heroSlides = db.heroSlides;
exports.schoolProfile = db.schoolProfile;
exports.schoolMessages = db.schoolMessages;
exports.contacts = db.contacts;
exports.careerPositions = db.careerPositions;
exports.jobApplications = db.jobApplications;