/**
 * Insert Demo Students Script
 * 
 * This script creates sample student records to test the student management system.
 * Includes both Nepali and foreign students with realistic data.
 * 
 * Usage:
 *   node scripts/insertDemoStudents.js
 */

require('dotenv').config();
const { students } = require('../src/database/connection');

const demoStudents = [
  // Nepali Students
  {
    emisId: '2081-NP-001',
    firstName: 'Ram',
    middleName: 'Bahadur',
    lastName: 'Thapa',
    fullName: 'Ram Bahadur Thapa',
    emisId: 'IEMIS-2024-001',
    email: 'ram.thapa@student.jkssp5.edu.np',
    phone: '9841234567',
    contactNumber: '9841234567',
    dateOfBirth: '2013-04-15',
    gender: 'Male',
    isForeignStudent: false,

    // Permanent Address - Dang (Babai Rural Municipality)
    permanentProvince: 'Lumbini Province',
    permanentDistrict: 'Dang',
    permanentMunicipality: 'Babai Rural Municipality',
    permanentWard: '5',

    // Temporary Address - Same as permanent
    temporaryProvince: 'Lumbini Province',
    temporaryDistrict: 'Dang',
    temporaryMunicipality: 'Babai Rural Municipality',
    temporaryWard: '5',
    sameAsPermAddress: true,

    fatherName: 'Man Bahadur Thapa',
    motherName: 'Sita Thapa',
    guardianName: 'Man Bahadur Thapa',
    guardianPhone: '9841234567',
    guardianContactNo: '9841234567',
    guardianEmail: 'man.thapa@gmail.com',

    class: '8',
    section: 'A',
    rollNumber: 'R-2024-001',
    admitYear: '2081',
    admissionDate: '2024-04-01',

    caste: 'Thapa',
    motherTongue: 'Nepali',
    disabilityType: 'None',
    bloodGroup: 'O+',

    schoolingSource: 'Government',
    scholarship: 'None',
    status: 'active'
  },

  {
    emisId: '2081-NP-002',
    firstName: 'Sita',
    middleName: 'Kumari',
    lastName: 'Sharma',
    fullName: 'Sita Kumari Sharma',
    emisId: 'IEMIS-2024-002',
    email: 'sita.sharma@student.jkssp5.edu.np',
    phone: '9851234568',
    contactNumber: '9851234568',
    dateOfBirth: '2012-08-22',
    gender: 'Female',
    isForeignStudent: false,

    // Permanent Address - Kathmandu
    permanentProvince: 'Bagmati Province',
    permanentDistrict: 'Kathmandu',
    permanentMunicipality: 'Kathmandu Metropolitan',
    permanentWard: '15',

    // Temporary Address - Dang (different from permanent)
    temporaryProvince: 'Lumbini Province',
    temporaryDistrict: 'Dang',
    temporaryMunicipality: 'Ghorahi Sub-metropolitan',
    temporaryWard: '10',
    sameAsPermAddress: false,

    fatherName: 'Krishna Sharma',
    motherName: 'Radha Sharma',
    guardianName: 'Krishna Sharma',
    guardianPhone: '9851234568',
    guardianContactNo: '9851234568',
    guardianEmail: 'krishna.sharma@yahoo.com',

    class: '9',
    section: 'A',
    rollNumber: 'R-2024-002',
    admitYear: '2080',
    admissionDate: '2023-04-01',

    caste: 'Brahmin',
    motherTongue: 'Nepali',
    disabilityType: 'None',
    bloodGroup: 'A+',

    schoolingSource: 'Private',
    scholarship: 'Partial',
    subject: 'Science',
    status: 'active'
  },

  {
    emisId: '2081-NP-003',
    firstName: 'Anil',
    middleName: null,
    lastName: 'Chaudhary',
    fullName: 'Anil Chaudhary',
    emisId: 'IEMIS-2024-003',
    email: 'anil.chaudhary@student.jkssp5.edu.np',
    phone: '9861234569',
    contactNumber: '9861234569',
    dateOfBirth: '2014-01-10',
    gender: 'Male',
    isForeignStudent: false,

    // Permanent Address - Banke
    permanentProvince: 'Lumbini Province',
    permanentDistrict: 'Banke',
    permanentMunicipality: 'Nepalgunj Sub-Metropolitan',
    permanentWard: '12',

    // Temporary Address - Same as permanent
    temporaryProvince: 'Lumbini Province',
    temporaryDistrict: 'Banke',
    temporaryMunicipality: 'Nepalgunj Sub-Metropolitan',
    temporaryWard: '12',
    sameAsPermAddress: true,

    fatherName: 'Rajesh Chaudhary',
    motherName: 'Maya Chaudhary',
    guardianName: 'Rajesh Chaudhary',
    guardianPhone: '9861234569',
    guardianContactNo: '9861234569',

    class: '7',
    section: 'B',
    rollNumber: 'R-2024-003',
    admitYear: '2081',
    admissionDate: '2024-04-01',

    caste: 'Tharu',
    motherTongue: 'Tharu',
    disabilityType: 'None',
    bloodGroup: 'B+',

    schoolingSource: 'Community',
    scholarship: 'Full',
    status: 'active'
  },

  // Foreign Student
  {
    emisId: null,
    firstName: 'Yuki',
    middleName: null,
    lastName: 'Tanaka',
    fullName: 'Yuki Tanaka',
    emisId: 'IEMIS-2024-F001',
    email: 'yuki.tanaka@student.jkssp5.edu.np',
    phone: null,
    contactNumber: '9871234570',
    dateOfBirth: '2013-06-18',
    gender: 'Female',
    isForeignStudent: true,

    // No Permanent Address (Foreign Student)
    permanentProvince: null,
    permanentDistrict: null,
    permanentMunicipality: null,
    permanentWard: null,

    // Current Address in Nepal
    temporaryProvince: 'Lumbini Province',
    temporaryDistrict: 'Dang',
    temporaryMunicipality: 'Tulsipur Sub-metropolitan',
    temporaryWard: '8',
    sameAsPermAddress: false,

    fatherName: 'Hiroshi Tanaka',
    motherName: 'Akiko Tanaka',
    guardianName: 'Hiroshi Tanaka',
    guardianPhone: '9871234570',
    guardianContactNo: '9871234570',
    guardianEmail: 'hiroshi.tanaka@gmail.com',

    class: '8',
    section: 'B',
    rollNumber: 'R-2024-F001',
    admitYear: '2082',
    admissionDate: '2025-04-01',

    caste: null,
    motherTongue: 'Japanese',
    disabilityType: 'None',
    bloodGroup: 'AB+',

    schoolingSource: 'Private',
    scholarship: 'None',
    status: 'active',
    notes: 'Japanese exchange student, enrolled for 1 year'
  },

  {
    emisId: '2081-NP-004',
    firstName: 'Lakshmi',
    middleName: null,
    lastName: 'Gurung',
    fullName: 'Lakshmi Gurung',
    emisId: 'IEMIS-2024-004',
    email: 'lakshmi.gurung@student.jkssp5.edu.np',
    phone: '9881234571',
    contactNumber: '9881234571',
    dateOfBirth: '2011-11-25',
    gender: 'Female',
    isForeignStudent: false,

    // Permanent Address - Kaski (Pokhara)
    permanentProvince: 'Gandaki Province',
    permanentDistrict: 'Kaski',
    permanentMunicipality: 'Pokhara Metropolitan',
    permanentWard: '22',

    // Temporary Address - Dang
    temporaryProvince: 'Lumbini Province',
    temporaryDistrict: 'Dang',
    temporaryMunicipality: 'Babai Rural Municipality',
    temporaryWard: '7',
    sameAsPermAddress: false,

    fatherName: 'Bir Bahadur Gurung',
    motherName: 'Mina Gurung',
    guardianName: 'Bir Bahadur Gurung',
    guardianPhone: '9881234571',
    guardianContactNo: '9881234571',
    guardianEmail: 'bir.gurung@hotmail.com',

    class: '10',
    section: 'A',
    rollNumber: 'R-2024-004',
    admitYear: '2078',
    admissionDate: '2021-04-01',

    caste: 'Gurung',
    motherTongue: 'Gurung',
    disabilityType: 'None',
    bloodGroup: 'O-',

    schoolingSource: 'Government',
    scholarship: 'Partial',
    subject: 'Management',
    status: 'active',
    previousSchool: 'Pokhara Secondary School'
  },

  {
    emisId: '2081-NP-005',
    firstName: 'Bijay',
    middleName: 'Kumar',
    lastName: 'Yadav',
    fullName: 'Bijay Kumar Yadav',
    emisId: 'IEMIS-2024-005',
    email: 'bijay.yadav@student.jkssp5.edu.np',
    phone: '9891234572',
    contactNumber: '9891234572',
    dateOfBirth: '2015-03-08',
    gender: 'Male',
    isForeignStudent: false,

    // Permanent Address - Dang (Rajpur)
    permanentProvince: 'Lumbini Province',
    permanentDistrict: 'Dang',
    permanentMunicipality: 'Rajpur Rural Municipality',
    permanentWard: '3',

    // Temporary Address - Same as permanent
    temporaryProvince: 'Lumbini Province',
    temporaryDistrict: 'Dang',
    temporaryMunicipality: 'Rajpur Rural Municipality',
    temporaryWard: '3',
    sameAsPermAddress: true,

    fatherName: 'Ramesh Yadav',
    motherName: 'Sunita Yadav',
    guardianName: 'Ramesh Yadav',
    guardianPhone: '9891234572',
    guardianContactNo: '9891234572',

    class: '6',
    section: 'A',
    rollNumber: 'R-2024-005',
    admitYear: '2082',
    admissionDate: '2025-04-01',

    caste: 'Yadav',
    motherTongue: 'Maithili',
    disabilityType: 'None',
    bloodGroup: 'B-',

    schoolingSource: 'Government',
    scholarship: 'Full',
    status: 'active'
  },

  // Student with disability
  {
    emisId: '2081-NP-006',
    firstName: 'Pratik',
    middleName: null,
    lastName: 'Tamang',
    fullName: 'Pratik Tamang',
    emisId: 'IEMIS-2024-006',
    email: 'pratik.tamang@student.jkssp5.edu.np',
    phone: '9801234573',
    contactNumber: '9801234573',
    dateOfBirth: '2013-09-12',
    gender: 'Male',
    isForeignStudent: false,

    // Permanent Address - Bagmati (Lalitpur)
    permanentProvince: 'Bagmati Province',
    permanentDistrict: 'Lalitpur',
    permanentMunicipality: 'Lalitpur Metropolitan',
    permanentWard: '18',

    // Temporary Address - Dang
    temporaryProvince: 'Lumbini Province',
    temporaryDistrict: 'Dang',
    temporaryMunicipality: 'Lamahi Municipality',
    temporaryWard: '5',
    sameAsPermAddress: false,

    fatherName: 'Dawa Tamang',
    motherName: 'Yangchen Tamang',
    guardianName: 'Dawa Tamang',
    guardianPhone: '9801234573',
    guardianContactNo: '9801234573',
    guardianEmail: 'dawa.tamang@gmail.com',

    class: '8',
    section: 'C',
    rollNumber: 'R-2024-006',
    admitYear: '2081',
    admissionDate: '2024-04-01',

    caste: 'Tamang',
    motherTongue: 'Tamang',
    disabilityType: 'Physical',
    bloodGroup: 'A-',

    schoolingSource: 'Government',
    scholarship: 'Full',
    status: 'active',
    medicalInfo: 'Requires wheelchair accessibility',
    notes: 'Special arrangements needed for physical education'
  }
];

async function insertDemoStudents() {
  try {
    console.log('🚀 Starting demo student insertion...\n');

    let successCount = 0;
    let errorCount = 0;

    for (const studentData of demoStudents) {
      try {
        const student = await students.create(studentData);
        successCount++;
        console.log(`✅ Created: ${student.fullName} (${student.class}, ${student.isForeignStudent ? 'Foreign' : 'Nepali'})`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Error creating ${studentData.fullName}:`, error.message);
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   Total students: ${demoStudents.length}`);
    console.log(`   ✅ Successfully created: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);

    if (successCount > 0) {
      console.log('\n🎉 Demo students inserted successfully!');
      console.log('\n📝 Student Distribution:');
      console.log(`   - Nepali students: ${demoStudents.filter(s => !s.isForeignStudent).length}`);
      console.log(`   - Foreign students: ${demoStudents.filter(s => s.isForeignStudent).length}`);
      console.log(`   - With disabilities: ${demoStudents.filter(s => s.disabilityType !== 'None').length}`);
      console.log(`   - With scholarships: ${demoStudents.filter(s => s.scholarship !== 'None').length}`);

      console.log('\n🏫 Students by Class:');
      const classCounts = {};
      demoStudents.forEach(s => {
        classCounts[s.class] = (classCounts[s.class] || 0) + 1;
      });
      Object.entries(classCounts).forEach(([cls, count]) => {
        console.log(`   - Class ${cls}: ${count} student${count > 1 ? 's' : ''}`);
      });

      console.log('\n📍 Students by Location (Temporary Address):');
      const locationCounts = {};
      demoStudents.forEach(s => {
        const loc = s.temporaryMunicipality;
        locationCounts[loc] = (locationCounts[loc] || 0) + 1;
      });
      Object.entries(locationCounts).forEach(([loc, count]) => {
        console.log(`   - ${loc}: ${count} student${count > 1 ? 's' : ''}`);
      });
    }

    console.log('\n✨ Script completed!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
console.log('═══════════════════════════════════════════════════════');
console.log('  Demo Student Insertion Script');
console.log('  JKS School Babai - Student Management System');
console.log('═══════════════════════════════════════════════════════\n');

insertDemoStudents();
