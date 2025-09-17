// Script to add new fields to Academy table
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addAcademyFields() {
  try {
    console.log('🔧 Adding new fields to Academy table...');

    // Add new columns to Academy table
    await prisma.$executeRaw`
      ALTER TABLE Academy 
      ADD COLUMN IF NOT EXISTS contactPerson VARCHAR(255),
      ADD COLUMN IF NOT EXISTS contactPersonPhone VARCHAR(50),
      ADD COLUMN IF NOT EXISTS status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'
    `;

    console.log('✅ Successfully added new fields to Academy table');
    console.log('📋 New fields added:');
    console.log('   - contactPerson (VARCHAR(255))');
    console.log('   - contactPersonPhone (VARCHAR(50))');
    console.log('   - status (ENUM: pending, approved, rejected)');

  } catch (error) {
    console.error('❌ Error adding fields:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addAcademyFields();
