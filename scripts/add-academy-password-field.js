// Script to add password field to Academy table
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addAcademyPasswordField() {
  try {
    console.log('🔧 Adding password field to Academy table...');

    // Add password column to Academy table
    await prisma.$executeRaw`
      ALTER TABLE Academy 
      ADD COLUMN IF NOT EXISTS adminPassword VARCHAR(255)
    `;

    console.log('✅ Successfully added password field to Academy table');
    console.log('📋 New field added:');
    console.log('   - adminPassword (VARCHAR(255))');

  } catch (error) {
    console.error('❌ Error adding password field:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addAcademyPasswordField();
