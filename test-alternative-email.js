// Test with alternative email configuration
const nodemailer = require('nodemailer');

const EMAIL_USER = "theitxprts@gmail.com";
const EMAIL_PASS = "bxcz oyhi fcyx qcab";

async function testAlternativeEmail() {
  console.log('🧪 Testing Alternative Email Configuration...\n');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Test with different "From" formats
  const testEmails = [
    {
      name: 'Simple Format',
      from: EMAIL_USER,
      to: 'theitxprts786@gmail.com',
      subject: 'Quick Touch Academy - Test 1 (Simple Format)',
      text: 'This is a simple format test email.'
    },
    {
      name: 'Name Format',
      from: `"Quick Touch Academy" <${EMAIL_USER}>`,
      to: 'theitxprts786@gmail.com',
      subject: 'Quick Touch Academy - Test 2 (Name Format)',
      text: 'This is a name format test email.'
    },
    {
      name: 'No-Reply Format',
      from: `"Quick Touch Academy" <noreply@quicktouchacademy.com>`,
      to: 'theitxprts786@gmail.com',
      subject: 'Quick Touch Academy - Test 3 (No-Reply Format)',
      text: 'This is a no-reply format test email.'
    }
  ];

  for (const emailConfig of testEmails) {
    console.log(`\n📧 Testing ${emailConfig.name}...`);
    console.log(`   From: ${emailConfig.from}`);
    console.log(`   To: ${emailConfig.to}`);
    console.log(`   Subject: ${emailConfig.subject}`);

    try {
      const info = await transporter.sendMail(emailConfig);
      console.log(`   ✅ Sent successfully! Message ID: ${info.messageId}`);
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
    }
  }

  console.log('\n📬 Check theitxprts786@gmail.com for all three test emails:');
  console.log('1. Simple Format');
  console.log('2. Name Format'); 
  console.log('3. No-Reply Format');
  console.log('\nIf none arrive, the issue is likely Gmail filtering.');
}

testAlternativeEmail().catch(console.error);

