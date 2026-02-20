/**
 * Fee Management Setup Script
 * 
 * This script creates initial fee categories to get started
 * 
 * Usage:
 *   node scripts/setupFeeManagement.js
 */

require('dotenv').config();
const { feeCategories } = require('../src/database/connection');

const initialCategories = [
  {
    name: 'Tuition Fee',
    description: 'Monthly or annual tuition fee for academic instruction',
    isActive: true,
    displayOrder: 1,
  },
  {
    name: 'Admission Fee',
    description: 'One-time admission fee for new students',
    isActive: true,
    displayOrder: 2,
  },
  {
    name: 'Library Fee',
    description: 'Fee for library access and book borrowing',
    isActive: true,
    displayOrder: 3,
  },
  {
    name: 'Lab Fee',
    description: 'Fee for laboratory equipment and materials',
    isActive: true,
    displayOrder: 4,
  },
  {
    name: 'Sports Fee',
    description: 'Fee for sports activities and equipment',
    isActive: true,
    displayOrder: 5,
  },
  {
    name: 'Exam Fee',
    description: 'Fee for conducting examinations',
    isActive: true,
    displayOrder: 6,
  },
  {
    name: 'Transport Fee',
    description: 'Fee for school bus transportation',
    isActive: true,
    displayOrder: 7,
  },
  {
    name: 'Uniform Fee',
    description: 'Fee for school uniform',
    isActive: true,
    displayOrder: 8,
  },
  {
    name: 'Computer Fee',
    description: 'Fee for computer lab and IT resources',
    isActive: true,
    displayOrder: 9,
  },
  {
    name: 'ID Card Fee',
    description: 'Fee for student ID card',
    isActive: true,
    displayOrder: 10,
  },
  {
    name: 'Stationery Fee',
    description: 'Fee for books and stationery',
    isActive: true,
    displayOrder: 11,
  },
  {
    name: 'Activity Fee',
    description: 'Fee for extracurricular activities',
    isActive: true,
    displayOrder: 12,
  },
];

async function setupFeeManagement() {
  try {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  Fee Management Setup Script');
    console.log('  Creating Initial Fee Categories');
    console.log('═══════════════════════════════════════════════════════\n');

    let created = 0;
    let skipped = 0;

    for (const categoryData of initialCategories) {
      try {
        // Check if category already exists
        const existing = await feeCategories.findOne({
          where: { name: categoryData.name },
        });

        if (existing) {
          console.log(`⏭️  Skipped: ${categoryData.name} (already exists)`);
          skipped++;
        } else {
          await feeCategories.create(categoryData);
          console.log(`✅ Created: ${categoryData.name}`);
          created++;
        }
      } catch (error) {
        console.error(`❌ Error creating ${categoryData.name}:`, error.message);
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   Total categories processed: ${initialCategories.length}`);
    console.log(`   ✅ Created: ${created}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);

    console.log('\n🎉 Fee management setup completed!');
    console.log('\n📝 Next Steps:');
    console.log('   1. Go to Fee Setup page in admin panel');
    console.log('   2. Create fee structures for different classes');
    console.log('   3. Allocate fee structures to students');
    console.log('   4. Start collecting payments via Fee Collection page\n');

    process.exit(0);
  } catch (error) {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  }
}

// Run the setup
setupFeeManagement();
