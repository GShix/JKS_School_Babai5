require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize with PostgreSQL connection
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

async function migrateBlogsTable() {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully.');

    const queryInterface = sequelize.getQueryInterface();

    console.log('\n📝 Starting blog table migration...\n');

    // Step 1: Add authorId column
    try {
      await queryInterface.addColumn('blogs', 'authorId', {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ID of the logged-in admin who created the blog'
      });
      console.log('✓ Added authorId column');
    } catch (error) {
      if (error.message.includes('Duplicate column name')) {
        console.log('⚠ authorId column already exists, skipping');
      } else {
        throw error;
      }
    }

    // Step 2: Modify blogStatus to ENUM
    try {
      await queryInterface.changeColumn('blogs', 'blogStatus', {
        type: DataTypes.ENUM('draft', 'published', 'archived'),
        allowNull: false,
        defaultValue: 'draft'
      });
      console.log('✓ Updated blogStatus to ENUM type');
    } catch (error) {
      console.log('⚠ Error updating blogStatus:', error.message);
      console.log('  You may need to manually update existing records first');
    }

    // Step 3: Modify blogCategory to ENUM
    try {
      await queryInterface.changeColumn('blogs', 'blogCategory', {
        type: DataTypes.ENUM('admission', 'result', 'academic', 'events', 'sports', 'achievements', 'announcements', 'general'),
        allowNull: false,
        defaultValue: 'general'
      });
      console.log('✓ Updated blogCategory to ENUM type');
    } catch (error) {
      console.log('⚠ Error updating blogCategory:', error.message);
      console.log('  You may need to manually update existing records first');
    }

    // Step 4: Add audience column
    try {
      await queryInterface.addColumn('blogs', 'audience', {
        type: DataTypes.ENUM('public', 'students_parents', 'teachers', 'internal'),
        allowNull: false,
        defaultValue: 'public',
        comment: 'Who can view this blog post'
      });
      console.log('✓ Added audience column');
    } catch (error) {
      if (error.message.includes('Duplicate column name')) {
        console.log('⚠ audience column already exists, skipping');
      } else {
        throw error;
      }
    }

    // Step 5: Add publishedDate column
    try {
      await queryInterface.addColumn('blogs', 'publishedDate', {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date when blog was published'
      });
      console.log('✓ Added publishedDate column');
    } catch (error) {
      if (error.message.includes('Duplicate column name')) {
        console.log('⚠ publishedDate column already exists, skipping');
      } else {
        throw error;
      }
    }

    // Step 6: Add views column
    try {
      await queryInterface.addColumn('blogs', 'views', {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Number of views'
      });
      console.log('✓ Added views column');
    } catch (error) {
      if (error.message.includes('Duplicate column name')) {
        console.log('⚠ views column already exists, skipping');
      } else {
        throw error;
      }
    }

    // Step 7: Add tags column
    try {
      await queryInterface.addColumn('blogs', 'tags', {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Comma-separated tags'
      });
      console.log('✓ Added tags column');
    } catch (error) {
      if (error.message.includes('Duplicate column name')) {
        console.log('⚠ tags column already exists, skipping');
      } else {
        throw error;
      }
    }

    // Step 8: Update existing published blogs with current date
    try {
      await sequelize.query(`
        UPDATE blogs 
        SET publishedDate = createdAt 
        WHERE blogStatus = 'published' AND publishedDate IS NULL
      `);
      console.log('✓ Updated existing published blogs with publishedDate');
    } catch (error) {
      console.log('⚠ Error updating published dates:', error.message);
    }

    console.log('\n✅ Blog table migration completed successfully!\n');
    console.log('📊 Summary:');
    console.log('   - Added: authorId, audience, publishedDate, views, tags');
    console.log('   - Updated: blogStatus and blogCategory to ENUM types');
    console.log('   - Set publishedDate for existing published blogs\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

// Run migration
migrateBlogsTable()
  .then(() => {
    console.log('Migration script completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration script failed:', error);
    process.exit(1);
  });
