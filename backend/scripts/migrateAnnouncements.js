/**
 * Migration script to update announcements table schema
 * Run this once to update the database structure
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.db_string, {
  logging: console.log
});

async function migrateAnnouncementsTable() {
  try {
    console.log('Starting announcements table migration (PostgreSQL)...\n');

    // Check if the table exists
    const [tables] = await sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'announcements'"
    );

    if (tables.length === 0) {
      console.log('Announcements table does not exist. Will be created on next server start.');
      process.exit(0);
    }

    // Get current columns
    const [columns] = await sequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'announcements'"
    );
    
    const columnNames = columns.map(col => col.column_name);
    console.log('Current columns:', columnNames);

    // Add isPinned if it doesn't exist
    if (!columnNames.includes('isPinned')) {
      console.log('Adding isPinned column...');
      await sequelize.query(
        "ALTER TABLE announcements ADD COLUMN \"isPinned\" BOOLEAN NOT NULL DEFAULT false"
      );
      console.log('✓ Added isPinned column');
    }

    // Rename publishDate to startDate if publishDate exists
    if (columnNames.includes('publishDate') && !columnNames.includes('startDate')) {
      console.log('Renaming publishDate to startDate...');
      await sequelize.query(
        "ALTER TABLE announcements RENAME COLUMN \"publishDate\" TO \"startDate\""
      );
      console.log('✓ Renamed publishDate to startDate');
    } else if (!columnNames.includes('startDate')) {
      console.log('Adding startDate column...');
      await sequelize.query(
        "ALTER TABLE announcements ADD COLUMN \"startDate\" DATE NOT NULL DEFAULT CURRENT_DATE"
      );
      console.log('✓ Added startDate column');
    }

    // Rename expiryDate to endDate if expiryDate exists
    if (columnNames.includes('expiryDate') && !columnNames.includes('endDate')) {
      console.log('Renaming expiryDate to endDate...');
      await sequelize.query(
        "ALTER TABLE announcements RENAME COLUMN \"expiryDate\" TO \"endDate\""
      );
      console.log('✓ Renamed expiryDate to endDate');
    } else if (!columnNames.includes('endDate')) {
      console.log('Adding endDate column...');
      await sequelize.query(
        "ALTER TABLE announcements ADD COLUMN \"endDate\" DATE NULL"
      );
      console.log('✓ Added endDate column');
    }

    // Update priority values from 'normal' to 'medium'
    console.log('Updating priority values...');
    await sequelize.query(
      "UPDATE announcements SET priority = 'medium' WHERE priority = 'normal'"
    );
    console.log('✓ Updated priority values');

    // Update priority column to allow new default
    console.log('Updating priority column default...');
    await sequelize.query(
      "ALTER TABLE announcements ALTER COLUMN priority SET DEFAULT 'medium'"
    );
    console.log('✓ Updated priority column');

    console.log('\n✅ Migration completed successfully!');
    console.log('You can now restart your server.\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run migration
migrateAnnouncementsTable();
