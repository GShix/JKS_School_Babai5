

const bcrypt = require('bcryptjs');
const { admins, sequelize } = require('../src/database/connection');

const createAdmin = async () => {
  try {
    // Wait for database connection
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Sync the database (create tables if they don't exist)
    await sequelize.sync({ alter: false });
    console.log('Database synced.');

    // Admin users to create
    const adminUsers = [
      // Two SuperAdmins
      {
        fullName: 'IT Operator',
        email: 'itoperator@jkss.com',
        password: 'it123456',
        role: 'superAdmin',
        status: 'active',
        phone: '9876543210'
      },
      {
        fullName: 'Developer',
        email: 'developer@jkss.com',
        password: 'dev123456',
        role: 'superAdmin',
        status: 'active',
        phone: '9876543211'
      },
      // Regular Admins
      {
        fullName: 'School Admin',
        email: 'admin@jkss.com',
        password: 'admin123',
        role: 'admin',
        status: 'active',
        phone: '9876543212'
      },
      {
        fullName: 'Academic Coordinator',
        email: 'academic@jkss.com',
        password: 'academic123',
        role: 'admin',
        status: 'active',
        phone: '9876543213'
      }
    ];

    let createdCount = 0;
    let existingCount = 0;
    const createdAdmins = [];

    console.log('\n🔄 Processing admin users...\n');

    for (const adminData of adminUsers) {
      // Check if admin already exists
      const existingAdmin = await admins.findOne({ where: { email: adminData.email } });
      
      if (existingAdmin) {
        console.log(`⚠️  Admin already exists: ${adminData.email} (${existingAdmin.fullName})`);
        existingCount++;
        continue;
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(adminData.password, 10);

      // Create admin user
      const newAdmin = await admins.create({
        fullName: adminData.fullName,
        email: adminData.email,
        password: hashedPassword,
        role: adminData.role,
        status: adminData.status,
        phone: adminData.phone
      });

      createdAdmins.push({
        name: newAdmin.fullName,
        email: adminData.email,
        password: adminData.password,
        role: newAdmin.role
      });

      console.log(`✅ Created: ${newAdmin.fullName} (${newAdmin.role})`);
      createdCount++;
    }

    console.log('\n=================================');
    console.log('📊 ADMIN CREATION SUMMARY');
    console.log('=================================');
    console.log(`✅ Created: ${createdCount} admin(s)`);
    console.log(`⚠️  Already Existed: ${existingCount} admin(s)`);
    console.log(`📋 Total Processed: ${adminUsers.length} admin(s)`);
    console.log('=================================\n');

    if (createdAdmins.length > 0) {
      console.log('🔑 NEW ADMIN LOGIN CREDENTIALS:');
      console.log('=================================');
      createdAdmins.forEach((admin, index) => {
        console.log(`\n${index + 1}. ${admin.name} (${admin.role.toUpperCase()})`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Password: ${admin.password}`);
      });
      console.log('\n=================================');
      console.log('⚠️  Please change passwords after first login!\n');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin users:', error);
    process.exit(1);
  }
};

// Run the function
createAdmin();
