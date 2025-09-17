// Send verification email directly to your email address
const nodemailer = require('nodemailer');

const EMAIL_USER = "theitxprts@gmail.com";
const EMAIL_PASS = "bxcz oyhi fcyx qcab";

async function sendVerificationEmailToYou() {
  console.log('📧 Sending Verification Email to Your Address...\n');

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

  // Create verification email with working verification link
  const fullName = 'Your Name';
  const email = 'theitxprts786@gmail.com'; // Your email address
  const verificationToken = 'working-verification-token-' + Date.now();
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
        <strong>Verification Details:</strong><br>
        Email: ${email}<br>
        Token: ${verificationToken}<br>
        Sent: ${new Date().toISOString()}
      </p>
      
      <p style="color: #CCCCCC; font-size: 12px; text-align: center; margin-top: 30px;">
        Best regards,<br>
        <strong>Quick Touch Academy Team</strong><br>
        <em>This is a test verification email</em>
      </p>
    </div>
  `;

  console.log('📧 Email Details:');
  console.log(`   From: ${EMAIL_USER}`);
  console.log(`   To: ${email}`);
  console.log(`   Subject: Verify Your Email - Quick Touch Academy`);
  console.log(`   Verification Token: ${verificationToken}`);
  console.log(`   Verification URL: ${verificationUrl}`);

  try {
    const info = await transporter.sendMail({
      from: `"Quick Touch Academy" <${EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - Quick Touch Academy',
      html: emailHtml,
    });

    console.log('\n✅ Verification email sent successfully!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Response: ${info.response}`);
    
    console.log('\n📬 Check your email inbox:');
    console.log(`   📧 Email: ${email}`);
    console.log('   📧 Subject: "Verify Your Email - Quick Touch Academy"');
    console.log('   🔗 Look for the "Verify My Email Address" button');
    console.log('   🔗 Or copy the verification URL from the email');
    
    console.log('\n🔗 Verification Link:');
    console.log(`   ${verificationUrl}`);
    
    console.log('\n📝 This email contains:');
    console.log('   ✅ Verification button');
    console.log('   ✅ Verification URL');
    console.log('   ✅ Token information');
    console.log('   ✅ Professional styling');
    
  } catch (error) {
    console.log('❌ Failed to send verification email:', error.message);
  }
}

sendVerificationEmailToYou().catch(console.error);

