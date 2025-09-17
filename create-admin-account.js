const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminAccount() {
  try {
    console.log('🔧 Creating super admin account...');

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        OR: [
          { email: 'admin@quicktouch.com' },
          { role: 'super_admin' }
        ]
      }
    });

    if (existingAdmin) {
      console.log('⚠️  Admin account already exists:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log(`   ID: ${existingAdmin.id}`);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Check if admin academy exists, if not create it
    let adminAcademy = await prisma.academy.findUnique({
      where: { id: 'admin-academy' }
    });

    if (!adminAcademy) {
      console.log('🔧 Creating admin academy...');
      adminAcademy = await prisma.academy.create({
        data: {
          id: 'admin-academy',
          name: 'System Administration',
          location: 'System',
          description: 'Special academy for system administrators',
          contactEmail: 'admin@quicktouch.com',
          contactPhone: '+1234567890',
          adminIds: '[]'
        }
      });
      console.log('✅ Admin academy created');
    }

    // Generate a unique ID for the admin
    const adminId = `admin-${Date.now()}`;
    
    // Create super admin account
    const admin = await prisma.user.create({
      data: {
        id: adminId,
        email: 'admin@quicktouch.com',
        password: hashedPassword,
        fullName: 'Super Admin',
        role: 'super_admin',
        phone: '+1234567890',
        academyId: 'admin-academy',
        isEmailVerified: true
      }
    });

    console.log('✅ Super admin account created successfully!');
    console.log('📋 Login Details:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: admin123`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   ID: ${admin.id}`);
    console.log(`   Full Name: ${admin.fullName}`);
    console.log(`   Phone: ${admin.phone}`);
    console.log(`   Verified: ${admin.isVerified}`);
    console.log(`   Active: ${admin.isActive}`);

    console.log('\n🔐 Security Note:');
    console.log('   - Please change the password after first login');
    console.log('   - This account has full system access');
    console.log('   - Can manage all academies, users, and players');

  } catch (error) {
    console.error('❌ Error creating admin account:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminAccount();
