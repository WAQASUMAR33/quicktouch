// Script to directly delete academies from database
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function directDatabaseDelete() {
  try {
    console.log('🗑️ Directly deleting academies from database...');
    
    // Academy to keep
    const academyToKeep = 'academy-3986f0d5-7753-42c8-8d25-8be5a3955d58';
    
    // Get all academies using raw SQL
    const academies = await prisma.$queryRaw`
      SELECT id, name, status 
      FROM Academy
    `;

    console.log(`📋 Found ${academies.length} academies total`);
    
    const academiesToDelete = academies.filter(academy => academy.id !== academyToKeep);
    console.log(`🗑️ Deleting ${academiesToDelete.length} academies`);

    for (const academy of academiesToDelete) {
      console.log(`\n🗑️ Deleting: ${academy.name} (${academy.id})`);
      
      try {
        // Delete related data first
        console.log(`   🔧 Deleting related data...`);
        
        // Delete PlayerStats
        await prisma.playerStats.deleteMany({
          where: {
            Player: {
              academyId: academy.id
            }
          }
        });
        console.log(`   ✅ Deleted PlayerStats`);
        
        // Delete Feedback
        await prisma.feedback.deleteMany({
          where: {
            Player: {
              academyId: academy.id
            }
          }
        });
        console.log(`   ✅ Deleted Feedback`);
        
        // Delete Attendance
        await prisma.attendance.deleteMany({
          where: {
            Player: {
              academyId: academy.id
            }
          }
        });
        console.log(`   ✅ Deleted Attendance`);
        
        // Delete ScoutFavorite
        await prisma.scoutFavorite.deleteMany({
          where: {
            Player: {
              academyId: academy.id
            }
          }
        });
        console.log(`   ✅ Deleted ScoutFavorite`);
        
        // Delete Players
        await prisma.player.deleteMany({
          where: { academyId: academy.id }
        });
        console.log(`   ✅ Deleted Players`);
        
        // Delete Events
        await prisma.event.deleteMany({
          where: { academyId: academy.id }
        });
        console.log(`   ✅ Deleted Events`);
        
        // Delete Matches
        await prisma.match.deleteMany({
          where: { academyId: academy.id }
        });
        console.log(`   ✅ Deleted Matches`);
        
        // Delete TrainingPlans
        await prisma.trainingPlan.deleteMany({
          where: { academyId: academy.id }
        });
        console.log(`   ✅ Deleted TrainingPlans`);
        
        // Delete Users
        await prisma.user.deleteMany({
          where: { academyId: academy.id }
        });
        console.log(`   ✅ Deleted Users`);
        
        // Finally delete the academy
        await prisma.academy.delete({
          where: { id: academy.id }
        });
        
        console.log(`   ✅ Successfully deleted academy: ${academy.name}`);
        
      } catch (error) {
        console.log(`   ❌ Failed to delete ${academy.name}: ${error.message}`);
      }
    }

    // Verify remaining academies
    console.log('\n🔍 Verifying remaining academies...');
    const remainingAcademies = await prisma.$queryRaw`
      SELECT id, name, status, contactEmail 
      FROM Academy
    `;

    console.log(`\n📊 FINAL RESULT:`);
    console.log(`🏫 Total academies remaining: ${remainingAcademies.length}`);
    
    if (remainingAcademies.length > 0) {
      console.log('\n📋 Remaining Academies:');
      console.log('='.repeat(60));
      remainingAcademies.forEach(academy => {
        console.log(`   🏫 ${academy.name}`);
        console.log(`      ID: ${academy.id}`);
        console.log(`      Status: ${academy.status || 'N/A'}`);
        console.log(`      Contact: ${academy.contactEmail || 'N/A'}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

directDatabaseDelete();
