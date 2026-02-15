const { sequelize } = require('../src/database/connection');

async function checkAnnouncements() {
  try {
    const rows = await sequelize.query(
      'SELECT id, title, content, priority, "targetAudience", "isPinned", "startDate", "endDate" FROM announcements ORDER BY id DESC LIMIT 5',
      { type: sequelize.QueryTypes.SELECT }
    );
    
    console.log('Recent announcements:');
    console.table(rows);
    
    // Check for null or empty titles
    const emptyTitles = rows.filter(row => !row.title || row.title.trim() === '');
    if (emptyTitles.length > 0) {
      console.log('\n⚠️  Found announcements with empty titles:');
      console.table(emptyTitles);
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkAnnouncements();
