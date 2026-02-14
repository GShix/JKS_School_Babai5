require('dotenv').config();
const { sequelize, schoolProfile, schoolMessages } = require('./database/connection');

async function setupSchoolProfile() {
  try {
    console.log('🚀 Setting up School Profile tables...\n');

    // Create tables using Sequelize sync
    await sequelize.sync({ alter: false });
    console.log('✅ Tables created/verified successfully');

    // Check if school profile exists
    const existingProfile = await schoolProfile.findOne();
    
    if (!existingProfile) {
      // Create default school profile
      await schoolProfile.create({
        schoolName: 'ज.क. मा.वि.',
        schoolNameNepali: 'जनकल्याण माध्यमिक विद्यालय',
        phone: '9876543210',
        email: 'info@jkschool.edu.np',
        address: 'Babai, Dang',
        addressNepali: 'बबई, दाङ',
        province: 'Province 5',
        district: 'Dang',
        municipality: 'Babai',
        ward: '1',
        introduction: 'Welcome to Janakalyan Secondary School',
        establishedYear: 2020,
        principalName: 'Principal Name',
        website: 'https://jkschool.edu.np',
        facebookUrl: 'https://facebook.com/jkschool'
      });
      console.log('✅ Default school profile created');
    } else {
      console.log('ℹ️  School profile already exists');
    }

    // Check if messages exist
    const existingMessages = await schoolMessages.findAll();
    
    if (existingMessages.length === 0) {
      // Create default messages
      await schoolMessages.bulkCreate([
        {
          personName: 'Principal Name',
          personPosition: 'Principal',
          message: 'Welcome to our school! We are committed to providing quality education to all students.',
          displayOrder: 1,
          isActive: true
        },
        {
          personName: 'Vice Principal Name',
          personPosition: 'Vice Principal',
          message: 'Education is the most powerful weapon which you can use to change the world.',
          displayOrder: 2,
          isActive: true
        }
      ]);
      console.log('✅ Default messages created');
    } else {
      console.log('ℹ️  Messages already exist');
    }

    console.log('\n✅ School Profile setup completed successfully!');
    console.log('\n📋 Tables managed:');
    console.log('   - school_profile');
    console.log('   - school_messages');
    console.log('\n🎉 You can now manage school profile from Admin Dashboard → Messages!');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error setting up school profile:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the setup
setupSchoolProfile();

