// Test the exact email template used in signup
const nodemailer = require('nodemailer');

const EMAIL_USER = "theitxprts@gmail.com";
const EMAIL_PASS = "bxcz oyhi fcyx qcab";

async function testSignupEmailTemplate() {
  console.log('🧪 Testing Signup Email Template with Verification Link...\n');

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

  // Create the exact same email template as the signup API
  const fullName = 'Test User 786';
  const email = 'theitxprts786@gmail.com';
  const verificationToken = 'test-verification-token-' + Date.now();
  const verificationUrl = `http://localhost:3000/api/users/verify?token=${verificationToken}`;
  
  const emailHtml = `
    <div style="background-color: #1C2526; padding: 20px; color: #FFFFFF; font-family: Montserrat, sans-serif;">
      <h2 style="color: #FFB300;">Welcome to Quick Touch Academy!</h2>
      <p>Hi ${fullName},</p>
      <p>Thank you for registering with Quick Touch Academy. Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}" style="background-color: #FFB300; color: #1C2526; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">Verify Email</a>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="color: #FFB300;">${verificationUrl}</p>
      <p>Best regards,<br>Quick Touch Academy Team</p>
    </div>
  `;

  console.log('📧 Email Details:');
  console.log(`   From: ${EMAIL_USER}`);
  console.log(`   To: ${email}`);
  console.log(`   Subject: Verify Your Email - Quick Touch Academy`);
  console.log(`   Verification URL: ${verificationUrl}`);
  console.log(`   Token: ${verificationToken}`);

  try {
    const info = await transporter.sendMail({
      from: EMAIL_USER,
      to: email,
      subject: 'Verify Your Email - Quick Touch Academy',
      html: emailHtml,
    });

    console.log('\n✅ Verification email sent successfully!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Response: ${info.response}`);
    
    console.log('\n📬 Check theitxprts786@gmail.com for:');
    console.log('   - Subject: "Verify Your Email - Quick Touch Academy"');
    console.log('   - Verification button/link in the email');
    console.log('   - Verification URL in the email body');
    
    console.log('\n🔗 Verification Link:');
    console.log(`   ${verificationUrl}`);
    
  } catch (error) {
    console.log('❌ Failed to send verification email:', error.message);
  }
}

testSignupEmailTemplate().catch(console.error);

