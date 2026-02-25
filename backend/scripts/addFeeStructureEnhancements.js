/**
 * Add enhancements to fee_structures table
 * - purpose field
 * - isTemplate field
 * - clonedFrom field
 */

// Load environment variables FIRST before any other requires
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const { sequelize } = require('../src/database/connection');

async function addFeeStructureEnhancements() {
  console.log('🔧 Starting fee structure enhancement migration...\n');

  try {
    // Test database connection first
    await sequelize.authenticate();
    console.log('✅ Database connection successful\n');
  } catch (error) {
    console.error('❌ DATABASE CONNECTION FAILED!\n');
    console.error('Error:', error.message);
    console.error('\n📝 Fix this by:');
    console.error('1. Create a .env file in backend/ folder');
    console.error('2. Add your db_string connection (see .env.example)');
    console.error('3. OR run the SQL script manually: backend/scripts/fee_structure_migration.sql\n');
    console.error('See MIGRATION_SETUP_GUIDE.md for detailed instructions.');
    process.exit(1);
  }

  try {

    // Add purpose column
    try {
      await sequelize.query(`
        ALTER TABLE fee_structures 
        ADD COLUMN purpose VARCHAR(50) NOT NULL DEFAULT 'tuition' 
        CHECK (purpose IN ('admission', 'tuition', 'examination', 'event', 'transport', 'hostel', 'library', 'lab', 'sports', 'other'))
      `);
      console.log('✅ Added purpose column');
    } catch (error) {
      if (error.message.includes('already exists') || error.message.includes('Duplicate column')) {
        console.log('⚠️  purpose column already exists');
      } else {
        throw error;
      }
    }

    // Add isTemplate column
    try {
      await sequelize.query(`
        ALTER TABLE fee_structures 
        ADD COLUMN isTemplate BOOLEAN NOT NULL DEFAULT false
      `);
      console.log('✅ Added isTemplate column');
    } catch (error) {
      if (error.message.includes('already exists') || error.message.includes('Duplicate column')) {
        console.log('⚠️  isTemplate column already exists');
      } else {
        throw error;
      }
    }

    // Add clonedFrom column
    try {
      await sequelize.query(`
        ALTER TABLE fee_structures 
        ADD COLUMN "clonedFrom" INTEGER NULL
      `);
      console.log('✅ Added clonedFrom column');
    } catch (error) {
      if (error.message.includes('already exists') || error.message.includes('Duplicate column')) {
        console.log('⚠️  clonedFrom column already exists');
      } else {
        throw error;
      }
    }

    // Add index for purpose
    try {
      await sequelize.query(`
        CREATE INDEX idx_fee_structures_purpose ON fee_structures(purpose)
      `);
      console.log('✅ Added index for purpose');
    } catch (error) {
      if (error.message.includes('Duplicate key') || error.message.includes('already exists')) {
        console.log('⚠️  Index for purpose already exists');
      } else {
        throw error;
      }
    }

    console.log('✅ Fee structure enhancements completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding fee structure enhancements:', error);
    process.exit(1);
  }
}

addFeeStructureEnhancements();
