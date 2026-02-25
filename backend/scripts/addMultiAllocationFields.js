/**
 * Migration Script: Add Multi-Allocation Support Fields
 * 
 * This script adds fields to support multiple independent fee allocations
 * per student throughout the academic year (exams, events, etc.)
 * 
 * Run: node backend/scripts/addMultiAllocationFields.js
 */

const { Sequelize, DataTypes } = require('sequelize');
const db = require('../src/database/connection');
const sequelize = db.sequelize;

async function addMultiAllocationFields() {
  try {
    console.log('🔄 Starting migration: Add multi-allocation fields...\n');

    // Start transaction
    const transaction = await sequelize.transaction();

    try {
      // 1. Add allocationBatch column
      console.log('📝 Adding allocationBatch column...');
      await sequelize.query(`
        ALTER TABLE fee_allocations 
        ADD COLUMN IF NOT EXISTS allocation_batch VARCHAR(100) NULL
        COMMENT 'Batch identifier for grouping allocations (e.g., 2081-MIDTERM-EXAM)'
      `, { transaction });
      console.log('   ✅ allocationBatch column added\n');

      // 2. Add purpose column
      console.log('📝 Adding purpose column...');
      await sequelize.query(`
        ALTER TABLE fee_allocations 
        ADD COLUMN IF NOT EXISTS purpose ENUM(
          'admission', 
          'tuition', 
          'examination', 
          'event', 
          'transport', 
          'hostel', 
          'library', 
          'lab', 
          'sports', 
          'other'
        ) NOT NULL DEFAULT 'tuition'
        COMMENT 'Purpose of this fee allocation'
      `, { transaction });
      console.log('   ✅ purpose column added\n');

      // 3. Add allocatedBy column
      console.log('📝 Adding allocatedBy column...');
      await sequelize.query(`
        ALTER TABLE fee_allocations 
        ADD COLUMN IF NOT EXISTS allocated_by INT NULL
        COMMENT 'Admin user who created this allocation'
      `, { transaction });
      console.log('   ✅ allocatedBy column added\n');

      // 4. Add indexes for better query performance
      console.log('📝 Adding indexes...');
      
      await sequelize.query(`
        CREATE INDEX IF NOT EXISTS idx_allocation_batch 
        ON fee_allocations(allocation_batch)
      `, { transaction });
      console.log('   ✅ Index on allocation_batch created');

      await sequelize.query(`
        CREATE INDEX IF NOT EXISTS idx_purpose 
        ON fee_allocations(purpose)
      `, { transaction });
      console.log('   ✅ Index on purpose created');

      await sequelize.query(`
        CREATE INDEX IF NOT EXISTS idx_student_batch 
        ON fee_allocations(student_id, allocation_batch)
      `, { transaction });
      console.log('   ✅ Composite index on student_id + allocation_batch created\n');

      // 5. Update existing data to set default values
      console.log('📝 Updating existing allocations with default values...');
      await sequelize.query(`
        UPDATE fee_allocations 
        SET 
          purpose = 'tuition',
          allocation_batch = CONCAT('LEGACY-', DATE_FORMAT(allocation_date, '%Y-%m'))
        WHERE purpose IS NULL OR allocation_batch IS NULL
      `, { transaction });
      console.log('   ✅ Existing records updated\n');

      // Commit transaction
      await transaction.commit();

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ Migration completed successfully!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      // Show summary
      console.log('📊 Summary:');
      console.log('   • allocationBatch column added');
      console.log('   • purpose column added');
      console.log('   • allocatedBy column added');
      console.log('   • 3 indexes created for performance');
      console.log('   • Existing records updated with defaults\n');

      console.log('🎯 Next Steps:');
      console.log('   1. Restart your backend server');
      console.log('   2. Use allocation batch for different fee types:');
      console.log('      - "2081-ADMISSION" for admission fee');
      console.log('      - "2081-MIDTERM-EXAM" for mid-term exam');
      console.log('      - "2081-ANNUAL-EXAM" for annual exam');
      console.log('      - "2081-SPORTS-DAY" for sports event\n');

      process.exit(0);

    } catch (error) {
      // Rollback on error
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('\n🔍 Error details:', error);
    process.exit(1);
  }
}

// Run migration
addMultiAllocationFields();
