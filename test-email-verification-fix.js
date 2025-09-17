// Test email verification after fixing environment variables
const nodemailer = require('nodemailer');

// Use the same credentials that should be in .env.local
const EMAIL_USER = "theitxprts@gmail.com";
const EMAIL_PASS = "bxcz oyhi fcyx qcab";

async function testEmailVerificationFix() {
  console.log('🔧 Testing Email Verification Fix...\n');

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

  // Test the exact same configuration as the API
  const fullName = 'Test User';
  const email = 'theitxprts786@gmail.com';
  const verificationToken = 'test-token-' + Date.now();
  const verificationUrl = `http://localhost:3000/api/users/verify?token=${verificationToken}`;
  
  const emailHtml = `
    <div style="background-color: #1C2526; padding: 20px; color: #FFFFFF; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #FFB300; margin: 0;">Quick Touch Academy</h1>
        <p style="color: #FFFFFF; margin: 5px 0;">Football Training Excellence</p>
      </div>
      
      <h2 style="color: #FFB300;">Welcome to Quick Touch Academy!</h2>
      <p>Hi ${fullName},</p>
      <p>Thank you for registering with Quick Touch Academy. Please verify your email address by clicking the button below:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="background-color: #FFB300; color: #1C2526; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">Verify My Email Address</a>
      </div>
      
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <div style="background-color: #333; padding: 15px; border-radius: 5px; word-break: break-all;">
        <p style="color: #FFB300; margin: 0; font-family: monospace;">${verificationUrl}</p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #444; margin: 30px 0;">
      
      <p style="color: #CCCCCC; font-size: 14px;">
        <strong>Account Details:</strong><br>
        Email: ${email}<br>
        Role: player<br>
        Academy: Quick Touch Academy
      </p>
      
      <p style="color: #CCCCCC; font-size: 12px; text-align: center; margin-top: 30px;">
        Best regards,<br>
        <strong>Quick Touch Academy Team</strong>
      </p>
    </div>
  `;

  console.log('📧 Testing with same config as API...');
  console.log(`   From: "Quick Touch Academy" <${EMAIL_USER}>`);
  console.log(`   To: ${email}`);
  console.log(`   Verification URL: ${verificationUrl}`);

  try {
    const info = await transporter.sendMail({
      from: `"Quick Touch Academy" <${EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - Quick Touch Academy',
      html: emailHtml,
    });

    console.log('\n✅ Email verification test successful!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Response: ${info.response}`);
    
    console.log('\n📬 Check theitxprts786@gmail.com for:');
    console.log('   ✅ Verification email with working link');
    console.log('   ✅ Professional Quick Touch Academy design');
    console.log('   ✅ "Verify My Email Address" button');
    
    console.log('\n🔗 Verification Link:');
    console.log(`   ${verificationUrl}`);
    
  } catch (error) {
    console.log('❌ Email verification test failed:', error.message);
  }
}

testEmailVerificationFix().catch(console.error);

