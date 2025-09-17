// Script to seed academies in the database
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedAcademies() {
  try {
    console.log('🌱 Seeding academies...');

    // First, let's check if Academy table exists and create it if needed
    try {
      // Try to create the Academy table manually
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS Academy (
          id VARCHAR(191) NOT NULL,
          name VARCHAR(191) NOT NULL,
          location VARCHAR(191) NOT NULL,
          description TEXT,
          contactEmail VARCHAR(191),
          contactPhone VARCHAR(191),
          adminIds LONGTEXT NOT NULL,
          createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
          updatedAt DATETIME(3),
          PRIMARY KEY (id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
      `;
      console.log('✅ Academy table created/verified');
    } catch (error) {
      console.log('⚠️ Academy table might already exist:', error.message);
    }

    // Create academy records
    const academies = [
      {
        id: 'academy-main-campus',
        name: 'Quick Touch Academy - Main Campus',
        location: 'Lahore, Pakistan',
        description: 'Main campus of Quick Touch Academy with state-of-the-art facilities and professional coaching staff.',
        contactEmail: 'info@quicktouchacademy.com',
        contactPhone: '+92-300-1234567',
        adminIds: '',
        createdAt: new Date(),
      },
      {
        id: 'academy-karachi-branch',
        name: 'Quick Touch Academy - Karachi Branch',
        location: 'Karachi, Pakistan',
        description: 'Karachi branch offering comprehensive football training programs for all age groups.',
        contactEmail: 'karachi@quicktouchacademy.com',
        contactPhone: '+92-21-1234567',
        adminIds: '',
        createdAt: new Date(),
      },
      {
        id: 'academy-islamabad-branch',
        name: 'Quick Touch Academy - Islamabad Branch',
        location: 'Islamabad, Pakistan',
        description: 'Islamabad branch with modern training facilities and experienced coaches.',
        contactEmail: 'islamabad@quicktouchacademy.com',
        contactPhone: '+92-51-1234567',
        adminIds: '',
        createdAt: new Date(),
      }
    ];

    // Insert academies
    for (const academy of academies) {
      try {
        await prisma.$executeRaw`
          INSERT INTO Academy (id, name, location, description, contactEmail, contactPhone, adminIds, createdAt)
          VALUES (${academy.id}, ${academy.name}, ${academy.location}, ${academy.description}, ${academy.contactEmail}, ${academy.contactPhone}, ${academy.adminIds}, ${academy.createdAt})
          ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          location = VALUES(location),
          description = VALUES(description),
          contactEmail = VALUES(contactEmail),
          contactPhone = VALUES(contactPhone),
          updatedAt = CURRENT_TIMESTAMP(3);
        `;
        console.log(`✅ Academy created/updated: ${academy.name}`);
      } catch (error) {
        console.log(`❌ Error creating academy ${academy.name}:`, error.message);
      }
    }

    console.log('🎉 Academy seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding academies:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAcademies();


