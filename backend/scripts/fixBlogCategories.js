require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.db_string, {
  dialect: 'postgres',
  dialectModule: require('pg'),
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

async function fixInvalidCategories() {
  try {
    await sequelize.authenticate();
    console.log('✓ Connected to database\n');

    // Map old categories to new ones
    const categoryMapping = {
      'Technology': 'academic',
      'Science': 'academic',
      'Mathematics': 'academic',
      'Sports & Games': 'sports',
      'Cultural': 'events',
      'News': 'announcements',
      'Updates': 'announcements',
      'Exam': 'result',
      'default': 'general'
    };

    console.log('📝 Updating invalid blog categories...\n');

    for (const [oldCat, newCat] of Object.entries(categoryMapping)) {
      try {
        const [result] = await sequelize.query(`
          UPDATE blogs 
          SET "blogCategory" = '${newCat}' 
          WHERE "blogCategory" = '${oldCat}'
        `);
        if (result && result.rowCount > 0) {
          console.log(`✓ Updated '${oldCat}' → '${newCat}' (${result.rowCount} rows)`);
        }
      } catch (err) {
        // Category might not exist, ignore
      }
    }

    // Now try to convert to ENUM again
    console.log('\n📝 Converting blogCategory to ENUM...\n');
    
    try {
      await sequelize.query(`
        ALTER TABLE blogs 
        ALTER COLUMN "blogCategory" TYPE enum_blogs_blogCategory 
        USING (CASE 
          WHEN "blogCategory" = 'Technology' THEN 'academic'::enum_blogs_blogCategory
          WHEN "blogCategory" = 'Science' THEN 'academic'::enum_blogs_blogCategory
          WHEN "blogCategory" = 'Mathematics' THEN 'academic'::enum_blogs_blogCategory
          WHEN "blogCategory" = 'Sports & Games' THEN 'sports'::enum_blogs_blogCategory
          WHEN "blogCategory" = 'Cultural' THEN 'events'::enum_blogs_blogCategory
          WHEN "blogCategory" = 'News' THEN 'announcements'::enum_blogs_blogCategory
          WHEN "blogCategory" = 'Updates' THEN 'announcements'::enum_blogs_blogCategory
          WHEN "blogCategory" = 'Exam' THEN 'result'::enum_blogs_blogCategory
          ELSE 'general'::enum_blogs_blogCategory
        END)
      `);
      console.log('✓ Successfully converted blogCategory to ENUM');
    } catch (error) {
      console.log('⚠ Error:', error.message);
    }

    // Set default
    try {
      await sequelize.query(`
        ALTER TABLE blogs 
        ALTER COLUMN "blogCategory" SET DEFAULT 'general'::enum_blogs_blogCategory
      `);
      console.log('✓ Set default value for blogCategory');
    } catch (error) {
      console.log('⚠ Note:', error.message);
    }

    // Verify
    const [results] = await sequelize.query(`
      SELECT "blogTitle", "blogCategory", "blogStatus", audience
      FROM blogs 
      ORDER BY "createdAt" DESC
      LIMIT 5
    `);
    
    console.log('\n📊 Updated blog data:');
    console.table(results);
    
    console.log('\n✅ Category fix completed!\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

fixInvalidCategories();
