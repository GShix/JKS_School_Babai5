/**
 * Migration Script: Make feeAllocationId nullable
 * Run this script to allow flexible fee collection without allocations
 */

require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize(process.env.db_string, {
  dialect: 'postgres',
  dialectModule: require('pg'),
  logging: console.log,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

async function runMigration() {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Read migration SQL
    const migrationPath = path.join(__dirname, '../src/database/migrations/make_fee_allocation_id_nullable.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('🔄 Running migration...');
    console.log('SQL:', migrationSQL);

    // Execute migration
    await sequelize.query(migrationSQL);

    console.log('✅ Migration completed successfully!');
    console.log('✅ feeAllocationId is now nullable - flexible fee collection enabled');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('🔒 Database connection closed');
  }
}

runMigration();
