// Detailed email test with the same configuration as the signup API
const nodemailer = require('nodemailer');

const EMAIL_USER = "theitxprts@gmail.com";
const EMAIL_PASS = "bxcz oyhi fcyx qcab";

async function testDetailedEmail() {
  console.log('📧 Detailed Email Test (Same as Signup API)...\n');

  // Use the exact same configuration as the signup API
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

  console.log('1️⃣ Testing SMTP Connection...');
  try {
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
  } catch (error) {
    console.log('❌ SMTP connection failed:', error.message);
    return;
  }

  console.log('\n2️⃣ Sending Verification Email (Same as Signup)...');
  
  // Create the exact same email as the signup API
  const verificationToken = 'test-token-' + Date.now();
  const verificationUrl = `http://localhost:3000/api/users/verify?token=${verificationToken}`;
  
  const emailHtml = `
    <div style="background-color: #1C2526; padding: 20px; color: #FFFFFF; font-family: Montserrat, sans-serif;">
      <h2 style="color: #FFB300;">Welcome to Quick Touch Academy!</h2>
      <p>Hi Test User,</p>
      <p>Thank you for registering with Quick Touch Academy. Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}" style="background-color: #FFB300; color: #1C2526; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">Verify Email</a>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="color: #FFB300;">${verificationUrl}</p>
      <p>Best regards,<br>Quick Touch Academy Team</p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: EMAIL_USER,
      to: EMAIL_USER, // Send to yourself
      subject: 'Verify Your Email - Quick Touch Academy',
      html: emailHtml,
    });

    console.log('✅ Verification email sent successfully!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   To: ${EMAIL_USER}`);
    console.log(`   Subject: Verify Your Email - Quick Touch Academy`);
    console.log(`   Verification URL: ${verificationUrl}`);
    
    console.log('\n📧 Email Details:');
    console.log('   - Check your Gmail inbox');
    console.log('   - Check your Spam/Junk folder');
    console.log('   - Look for subject: "Verify Your Email - Quick Touch Academy"');
    console.log('   - The email should contain a verification link');
    
  } catch (error) {
    console.log('❌ Failed to send verification email:', error.message);
    console.log('   Full error:', error);
  }
}

testDetailedEmail().catch(console.error);


