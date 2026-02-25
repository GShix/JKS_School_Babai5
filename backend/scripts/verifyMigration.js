require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { sequelize } = require('../src/database/connection');

(async () => {
  await sequelize.authenticate();
  
  // Check for new columns
  const [results] = await sequelize.query(`
    SELECT column_name, data_type, column_default, is_nullable
    FROM information_schema.columns 
    WHERE table_name = 'fee_structures' 
    AND column_name IN ('purpose', 'isTemplate', 'clonedFrom')
    ORDER BY column_name
  `);
  console.log('\n✅ New columns in fee_structures table:');
  console.table(results);
  
  // Check all columns
  const [allCols] = await sequelize.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'fee_structures' 
    ORDER BY ordinal_position
  `);
  console.log('\nAll columns:', allCols.map(c => c.column_name).join(', '));
  
  process.exit(0);
})();
