// Simple test to check environment variables
console.log('🔍 Environment Variables Status:\n');

console.log('📧 Email Configuration:');
console.log(`   EMAIL_USER: ${process.env.EMAIL_USER || 'NOT SET'}`);
console.log(`   EMAIL_PASS: ${process.env.EMAIL_PASS ? 'SET (hidden)' : 'NOT SET'}`);

console.log('\n🗄️ Database Configuration:');
console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? 'SET (hidden)' : 'NOT SET'}`);

console.log('\n🔐 JWT Configuration:');
console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? 'SET (hidden)' : 'NOT SET'}`);

console.log('\n🌐 Next.js Configuration:');
console.log(`   NEXT_PUBLIC_BASE_URL: ${process.env.NEXT_PUBLIC_BASE_URL || 'NOT SET'}`);

console.log('\n📝 To Fix Email Verification:');
console.log('1. Create a .env file in your project root');
console.log('2. Copy the content from env-template.txt');
console.log('3. Restart your development server (npm run dev)');
console.log('4. The email verification will work!');

