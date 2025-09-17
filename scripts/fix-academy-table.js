// Script to fix Academy table structure
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixAcademyTable() {
  try {
    console.log('🔧 Fixing Academy table structure...');

    // Add missing columns to Academy table
    const alterQueries = [
      'ALTER TABLE Academy ADD COLUMN IF NOT EXISTS description TEXT',
      'ALTER TABLE Academy ADD COLUMN IF NOT EXISTS contactEmail VARCHAR(191)',
      'ALTER TABLE Academy ADD COLUMN IF NOT EXISTS contactPhone VARCHAR(191)',
      'ALTER TABLE Academy ADD COLUMN IF NOT EXISTS adminIds LONGTEXT NOT NULL DEFAULT ""',
      'ALTER TABLE Academy ADD COLUMN IF NOT EXISTS updatedAt DATETIME(3)'
    ];

    for (const query of alterQueries) {
      try {
        await prisma.$executeRawUnsafe(query);
        console.log(`✅ Executed: ${query}`);
      } catch (error) {
        console.log(`⚠️ Column might already exist: ${error.message}`);
      }
    }

    // Now insert academy data
    const academies = [
      {
        id: 'academy-main-campus',
        name: 'Quick Touch Academy - Main Campus',
        location: 'Lahore, Pakistan',
        description: 'Main campus of Quick Touch Academy with state-of-the-art facilities and professional coaching staff.',
        contactEmail: 'info@quicktouchacademy.com',
        contactPhone: '+92-300-1234567',
        adminIds: '',
      },
      {
        id: 'academy-karachi-branch',
        name: 'Quick Touch Academy - Karachi Branch',
        location: 'Karachi, Pakistan',
        description: 'Karachi branch offering comprehensive football training programs for all age groups.',
        contactEmail: 'karachi@quicktouchacademy.com',
        contactPhone: '+92-21-1234567',
        adminIds: '',
      },
      {
        id: 'academy-islamabad-branch',
        name: 'Quick Touch Academy - Islamabad Branch',
        location: 'Islamabad, Pakistan',
        description: 'Islamabad branch with modern training facilities and experienced coaches.',
        contactEmail: 'islamabad@quicktouchacademy.com',
        contactPhone: '+92-51-1234567',
        adminIds: '',
      }
    ];

    // Insert academies
    for (const academy of academies) {
      try {
        await prisma.$executeRaw`
          INSERT INTO Academy (id, name, location, description, contactEmail, contactPhone, adminIds, createdAt)
          VALUES (${academy.id}, ${academy.name}, ${academy.location}, ${academy.description}, ${academy.contactEmail}, ${academy.contactPhone}, ${academy.adminIds}, NOW())
          ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          location = VALUES(location),
          description = VALUES(description),
          contactEmail = VALUES(contactEmail),
          contactPhone = VALUES(contactPhone),
          updatedAt = NOW();
        `;
        console.log(`✅ Academy created/updated: ${academy.name}`);
      } catch (error) {
        console.log(`❌ Error creating academy ${academy.name}:`, error.message);
      }
    }

    console.log('🎉 Academy table fixed and seeded!');
  } catch (error) {
    console.error('❌ Error fixing Academy table:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAcademyTable();


