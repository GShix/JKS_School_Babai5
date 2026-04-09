const { Sequelize, DataTypes } = require('sequelize');

if (!process.env.db_string) {
  console.error('db_string is not set!');
  throw new Error('Database connection string is required.');
}

const sequelize = new Sequelize(process.env.db_string, {
  dialect: 'postgres',
  dialectModule: require('pg'),
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
    console.log('Database connection established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err.message);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.blogs = require('./models/blogModel')(sequelize, DataTypes);
db.programs = require('./models/programModel')(sequelize, DataTypes);
db.activities = require('./models/activityModel')(sequelize, DataTypes);
db.admins = require('./models/adminModel')(sequelize, DataTypes);
db.students = require('./models/studentModel')(sequelize, DataTypes);
db.classes = require('./models/classModel')(sequelize, DataTypes);
db.teacher = require('./models/teacherModel')(sequelize, DataTypes);
db.staff = require('./models/staffModel')(sequelize, DataTypes);
db.attendance = require('./models/attendanceModel')(sequelize, DataTypes);
db.grades = require('./models/gradeModel')(sequelize, DataTypes);
db.fees = require('./models/feeModel')(sequelize, DataTypes);
// New Fee Management System Models
db.feeCategories = require('./models/feeCategoryModel')(sequelize, DataTypes);
db.feeStructures = require('./models/feeStructureModel')(sequelize, DataTypes);
db.feeStructureItems = require('./models/feeStructureItemModel')(sequelize, DataTypes);
db.feeAllocations = require('./models/feeAllocationModel')(sequelize, DataTypes);
db.feeTransactions = require('./models/feeTransactionModel')(sequelize, DataTypes);
db.timetables = require('./models/timetableModel')(sequelize, DataTypes);
db.assignments = require('./models/assignmentModel')(sequelize, DataTypes);
db.submissions = require('./models/submissionModel')(sequelize, DataTypes);
db.leaves = require('./models/leaveModel')(sequelize, DataTypes);
db.announcements = require('./models/announcementModel')(sequelize, DataTypes);
db.contents = require('./models/contentModel')(sequelize, DataTypes);
db.gallery = require('./models/galleryModel')(sequelize, DataTypes);
db.downloads = require('./models/downloadModel')(sequelize, DataTypes);
db.heroSlides = require('./models/heroSlideModel')(sequelize, DataTypes);
db.schoolProfile = require('./models/schoolProfileModel')(sequelize, DataTypes);
db.schoolMessages = require('./models/schoolMessageModel')(sequelize, DataTypes);
db.contacts = require('./models/contactModel')(sequelize, DataTypes);
db.careerPositions = require('./models/careerPositionModel')(sequelize, DataTypes);
db.jobApplications = require('./models/jobApplicationModel')(sequelize, DataTypes);

// FeeStructure has many FeeStructureItems
db.feeStructures.hasMany(db.feeStructureItems, {
  foreignKey: 'feeStructureId',
  as: 'items',
  onDelete: 'CASCADE',
});
db.feeStructureItems.belongsTo(db.feeStructures, {
  foreignKey: 'feeStructureId',
  as: 'feeStructure',
});

// FeeCategory has many FeeStructureItems
db.feeCategories.hasMany(db.feeStructureItems, {
  foreignKey: 'feeCategoryId',
  as: 'structureItems',
});
db.feeStructureItems.belongsTo(db.feeCategories, {
  foreignKey: 'feeCategoryId',
  as: 'category',
});

// Student has many FeeAllocations
db.students.hasMany(db.feeAllocations, {
  foreignKey: 'studentId',
  as: 'feeAllocations',
  onDelete: 'CASCADE',
});
db.feeAllocations.belongsTo(db.students, {
  foreignKey: 'studentId',
  as: 'student',
});

// FeeStructure has many FeeAllocations
db.feeStructures.hasMany(db.feeAllocations, {
  foreignKey: 'feeStructureId',
  as: 'allocations',
});
db.feeAllocations.belongsTo(db.feeStructures, {
  foreignKey: 'feeStructureId',
  as: 'feeStructure',
});

// FeeAllocation has many FeeTransactions
db.feeAllocations.hasMany(db.feeTransactions, {
  foreignKey: 'feeAllocationId',
  as: 'transactions',
});
db.feeTransactions.belongsTo(db.feeAllocations, {
  foreignKey: 'feeAllocationId',
  as: 'feeAllocation',
});

// Student has many FeeTransactions
db.students.hasMany(db.feeTransactions, {
  foreignKey: 'studentId',
  as: 'feeTransactions',
});
db.feeTransactions.belongsTo(db.students, {
  foreignKey: 'studentId',
  as: 'student',
});

// Admin collected FeeTransactions
db.admins.hasMany(db.feeTransactions, {
  foreignKey: 'collectedBy',
  as: 'collectedTransactions',
});
db.feeTransactions.belongsTo(db.admins, {
  foreignKey: 'collectedBy',
  as: 'collector',
});

if (process.env.NODE_ENV === 'development') {
  sequelize.sync({ alter: false }).then(async () => {
    console.log('✅ Database connected');

    try {
      await db.feeCategories.sync();
      await db.feeStructures.sync();
      await db.feeStructureItems.sync();
      await db.feeAllocations.sync();
      await db.feeTransactions.sync();
      await db.admins.sync({ alter: true }); // Alter admin table to add new roles
      console.log('✅ Fee management tables created successfully');
    } catch (err) {
      console.error('❌ Fee management tables sync error:', err.message);
    }

    try {
      await db.teacher.sync({ alter: true });
      console.log('✅ Teacher table schema updated');
    } catch (err) {
      console.error('❌ Teacher table sync error:', err.message);
    }
  }).catch(err => {
    console.error('❌ Database sync error:', err.message);
  });
}

if (process.env.NODE_ENV === 'production' && process.env.SYNC_DB === 'true') {
  sequelize.sync({ alter: true }).then(() => {
    console.log('✅ Production database schema updated');
  }).catch(err => {
    console.error('❌ Production sync error:', err.message);
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
exports.classes = db.classes;
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
// Fee Management System exports
exports.feeCategories = db.feeCategories;
exports.feeStructures = db.feeStructures;
exports.feeStructureItems = db.feeStructureItems;
exports.feeAllocations = db.feeAllocations;
exports.feeTransactions = db.feeTransactions;