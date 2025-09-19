const fs = require('fs');
const path = require('path');

// List of API routes to modify
const apiRoutes = [
  'src/app/api/event_management/route.js',
  'src/app/api/academy_management/route.js',
  'src/app/api/ai-insights/route.js',
  'src/app/api/advanced-stats/route.js',
  'src/app/api/player-comparison/route.js',
  'src/app/api/messaging/users/route.js',
  'src/app/api/messaging/conversations/route.js',
  'src/app/api/attandance_management/route.js',
  'src/app/api/setup/route.js'
];

// Function to remove authorization from a file
function removeAuthFromFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Remove getUserFromToken function calls and authorization checks
    const authPatterns = [
      // Remove getUserFromToken calls
      /const user = await getUserFromToken\(request\);\s*\n\s*if \(!user\?\.\w+\) \{\s*\n\s*return NextResponse\.json\(\{ error: 'Unauthorized' \}, \{ status: 401 \}\);\s*\n\s*\}/g,
      // Remove role-based access checks
      /if \(!\[.*?\]\.includes\(user\.role\)\) \{\s*\n\s*return NextResponse\.json\(\{ error: 'Access denied' \}, \{ status: 403 \}\);\s*\n\s*\}/g,
      // Remove academy filtering based on user role
      /if \(user\.role !== 'admin'\) \{\s*\n\s*const userRecord = await prisma\.user\.findUnique\(\{\s*\n\s*where: \{ id: user\.userId \},\s*\n\s*select: \{ academyId: true \}\s*\n\s*\}\);\s*\n\s*if \(userRecord\) \{\s*\n\s*whereClause\.academyId = userRecord\.academyId;\s*\n\s*\}\s*\n\s*\} else if \(academyId\) \{\s*\n\s*whereClause\.academyId = academyId;\s*\n\s*\}/g,
      // Remove user access checks
      /const hasAccess = [\s\S]*?if \(!hasAccess\) \{\s*\n\s*return NextResponse\.json\(\{ error: 'Access denied' \}, \{ status: 403 \}\);\s*\n\s*\}/g
    ];

    authPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        content = content.replace(pattern, '');
        modified = true;
      }
    });

    // Clean up empty lines
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Modified: ${filePath}`);
    } else {
      console.log(`⏭️  No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Process all API routes
console.log('🚀 Removing authorization from API routes...\n');

apiRoutes.forEach(route => {
  removeAuthFromFile(route);
});

console.log('\n✨ Authorization removal complete!');
