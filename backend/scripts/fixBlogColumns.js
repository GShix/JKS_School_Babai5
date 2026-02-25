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

async function fixBlogColumns() {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully.\n');

    console.log('📝 Fixing blog table columns...\n');

    // Step 1: Update null blogCategory values to 'general'
    console.log('1. Fixing null blogCategory values...');
    try {
      const [results1] = await sequelize.query(`
        UPDATE blogs 
        SET "blogCategory" = 'general' 
        WHERE "blogCategory" IS NULL
      `);
      console.log(`✓ Updated ${results1.length > 0 ? results1.length : 'existing'} null blogCategory values to 'general'\n`);
    } catch (error) {
      console.log('⚠ Note:', error.message, '\n');
    }

    // Step 2: Update existing blogStatus values to valid enum values
    console.log('2. Normalizing blogStatus values...');
    try {
      await sequelize.query(`
        UPDATE blogs 
        SET "blogStatus" = 'published' 
        WHERE LOWER("blogStatus") = 'published' AND "blogStatus" != 'published'
      `);
      
      await sequelize.query(`
        UPDATE blogs 
        SET "blogStatus" = 'draft' 
        WHERE LOWER("blogStatus") = 'draft' AND "blogStatus" != 'draft'
      `);
      
      await sequelize.query(`
        UPDATE blogs 
        SET "blogStatus" = 'draft' 
        WHERE "blogStatus" NOT IN ('published', 'draft', 'archived')
      `);
      console.log('✓ Normalized blogStatus values\n');
    } catch (error) {
      console.log('⚠ Note:', error.message, '\n');
    }

    // Step 3: Fix blogStatus column if needed
    console.log('3. Converting blogStatus to ENUM...');
    try {
      // Drop existing default
      await sequelize.query(`
        ALTER TABLE blogs 
        ALTER COLUMN "blogStatus" DROP DEFAULT
      `);
      
      // Create or replace ENUM type
      await sequelize.query(`
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_blogs_blogStatus') THEN
            CREATE TYPE enum_blogs_blogStatus AS ENUM('draft', 'published', 'archived');
          END IF;
        END $$;
      `);
      
      // Convert column
      await sequelize.query(`
        ALTER TABLE blogs 
        ALTER COLUMN "blogStatus" TYPE enum_blogs_blogStatus 
        USING ("blogStatus"::text::enum_blogs_blogStatus)
      `);
      
      // Set new default
      await sequelize.query(`
        ALTER TABLE blogs 
        ALTER COLUMN "blogStatus" SET DEFAULT 'draft'::enum_blogs_blogStatus
      `);
      
      console.log('✓ Successfully converted blogStatus to ENUM\n');
    } catch (error) {
      console.log('⚠ Note:', error.message, '\n');
    }

    // Step 4: Fix blogCategory column
    console.log('4. Converting blogCategory to ENUM...');
    try {
      // Drop existing default
      await sequelize.query(`
        ALTER TABLE blogs 
        ALTER COLUMN "blogCategory" DROP DEFAULT
      `);
      
      // Create or replace ENUM type
      await sequelize.query(`
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_blogs_blogCategory') THEN
            CREATE TYPE enum_blogs_blogCategory AS ENUM('admission', 'result', 'academic', 'events', 'sports', 'achievements', 'announcements', 'general');
          END IF;
        END $$;
      `);
      
      // Convert column
      await sequelize.query(`
        ALTER TABLE blogs 
        ALTER COLUMN "blogCategory" TYPE enum_blogs_blogCategory 
        USING (COALESCE("blogCategory", 'general')::enum_blogs_blogCategory)
      `);
      
      // Set new default
      await sequelize.query(`
        ALTER TABLE blogs 
        ALTER COLUMN "blogCategory" SET DEFAULT 'general'::enum_blogs_blogCategory
      `);
      
      console.log('✓ Successfully converted blogCategory to ENUM\n');
    } catch (error) {
      console.log('⚠ Note:', error.message, '\n');
    }

    // Step 5: Update publishedDate for published blogs
    console.log('5. Setting publishedDate for published blogs...');
    try {
      const [results5] = await sequelize.query(`
        UPDATE blogs 
        SET "publishedDate" = "createdAt" 
        WHERE "blogStatus" = 'published' AND "publishedDate" IS NULL
      `);
      console.log(`✓ Updated publishedDate for existing published blogs\n`);
    } catch (error) {
      console.log('⚠ Note:', error.message, '\n');
    }

    // Step 6: Initialize views counter
    console.log('6. Initializing views counter...');
    try {
      await sequelize.query(`
        UPDATE blogs 
        SET views = 0 
        WHERE views IS NULL
      `);
      console.log('✓ Initialized views counter\n');
    } catch (error) {
      console.log('⚠ Note:', error.message, '\n');
    }

    // Step 7: Verify the changes
    console.log('7. Verifying changes...');
    const [results] = await sequelize.query(`
      SELECT 
        "blogTitle",
        "blogAuthor",
        "blogStatus",
        "blogCategory",
        audience,
        views,
        "publishedDate"
      FROM blogs 
      LIMIT 5
    `);
    console.log('\nSample data:');
    console.table(results);

    console.log('\n✅ Blog table cleanup completed successfully!\n');

  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    throw error;
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

// Run cleanup
fixBlogColumns()
  .then(() => {
    console.log('Cleanup script completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Cleanup script failed:', error);
    process.exit(1);
  });
