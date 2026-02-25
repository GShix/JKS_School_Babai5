
require('dotenv').config();
const {
  feeAllocations,
  feeStructures,
  students,
} = require('../src/database/connection');

const allocateFeesToClass = async (feeStructureId, className, section = null) => {
  try {
    console.log('\n🔄 Starting fee allocation...\n');

    // Check if fee structure exists
    const feeStructure = await feeStructures.findByPk(feeStructureId);
    if (!feeStructure) {
      console.error(`❌ Fee structure with ID ${feeStructureId} not found!`);
      process.exit(1);
    }

    console.log(`📋 Fee Structure: ${feeStructure.name}`);
    console.log(`💰 Total Amount: NPR ${feeStructure.totalAmount}`);
    console.log(`📅 Academic Year: ${feeStructure.academicYear}`);
    console.log(`🎯 Allocating to: Class ${className}${section ? `-${section}` : ' (all sections)'}\n`);

    // Find students
    const where = { class: className };
    if (section) where.section = section;

    const studentsInClass = await students.findAll({
      where,
      attributes: ['id', 'fullName', 'rollNumber', 'class', 'section'],
    });

    if (studentsInClass.length === 0) {
      console.error(`❌ No students found in Class ${className}${section ? `-${section}` : ''}!`);
      process.exit(1);
    }

    console.log(`👥 Found ${studentsInClass.length} students\n`);

    const totalAmount = parseFloat(feeStructure.totalAmount);
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const student of studentsInClass) {
      try {
        // Check if already allocated
        const existingAllocation = await feeAllocations.findOne({
          where: {
            studentId: student.id,
            feeStructureId,
          },
        });

        if (existingAllocation) {
          console.log(`⏭️  ${student.rollNumber} - ${student.fullName} (already allocated)`);
          skipCount++;
          continue;
        }

        // Create allocation
        await feeAllocations.create({
          studentId: student.id,
          feeStructureId,
          totalAmount,
          paidAmount: 0,
          balance: totalAmount,
          status: 'pending',
          discount: 0,
          dueDate: feeStructure.dueDate,
          allocationDate: new Date(),
        });

        console.log(`✅ ${student.rollNumber} - ${student.fullName} (NPR ${totalAmount})`);
        successCount++;
      } catch (error) {
        console.error(`❌ ${student.rollNumber} - ${student.fullName} (${error.message})`);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`\n🎉 Allocation Complete!\n`);
    console.log(`✅ Successfully allocated: ${successCount}`);
    console.log(`⏭️  Already allocated: ${skipCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`\n📊 Total processed: ${studentsInClass.length}`);
    console.log(`\n💵 Total amount allocated: NPR ${(successCount * totalAmount).toLocaleString()}`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error allocating fees:', error.message);
    process.exit(1);
  }
};

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('\n❌ Missing arguments!\n');
  console.log('Usage: node scripts/allocateFees.js <feeStructureId> <class> [section]\n');
  console.log('Examples:');
  console.log('  node scripts/allocateFees.js 1 8 C    # Allocate to Class 8-C');
  console.log('  node scripts/allocateFees.js 1 8      # Allocate to entire Class 8');
  console.log('  node scripts/allocateFees.js 2 9 A    # Allocate to Class 9-A');
  console.log('');
  process.exit(1);
}

const feeStructureId = parseInt(args[0]);
const className = args[1];
const section = args[2] || null;

if (isNaN(feeStructureId)) {
  console.error('\n❌ Fee Structure ID must be a number!\n');
  process.exit(1);
}

// Run allocation
allocateFeesToClass(feeStructureId, className, section);
