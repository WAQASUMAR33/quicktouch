// Test Gmail SMTP configuration
const nodemailer = require('nodemailer');

// Use provided credentials for testing
const EMAIL_USER = "theitxprts@gmail.com";
const EMAIL_PASS = "bxcz oyhi fcyx qcab";

async function testEmailConfig() {
  console.log('📧 Testing Gmail SMTP Configuration...\n');

  // Check credentials
  console.log('1️⃣ Checking Email Credentials:');
  console.log(`   EMAIL_USER: ${EMAIL_USER ? '✅ Set' : '❌ Not set'}`);
  console.log(`   EMAIL_PASS: ${EMAIL_PASS ? '✅ Set' : '❌ Not set'}`);
  
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.log('\n❌ Missing email credentials.');
    return;
  }

  // Create transporter
  console.log('\n2️⃣ Creating Email Transporter...');
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

  // Test connection
  console.log('3️⃣ Testing SMTP Connection...');
  try {
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
  } catch (error) {
    console.log('❌ SMTP connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   - Make sure 2-Factor Authentication is enabled on your Gmail account');
    console.log('   - Use an App Password, not your regular Gmail password');
    console.log('   - Check that EMAIL_USER is your full Gmail address');
    console.log('   - Verify EMAIL_PASS is the 16-character app password');
    return;
  }

  // Send test email
  console.log('\n4️⃣ Sending Test Email...');
  try {
    const testEmail = {
      from: EMAIL_USER,
      to: EMAIL_USER, // Send to yourself for testing
      subject: 'Quick Touch Academy - Email Configuration Test',
      html: `
        <div style="background-color: #1C2526; padding: 20px; color: #FFFFFF; font-family: Arial, sans-serif;">
          <h2 style="color: #FFB300;">🎉 Email Configuration Successful!</h2>
          <p>This is a test email from Quick Touch Academy.</p>
          <p>Your Gmail SMTP configuration is working correctly.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p>Best regards,<br>Quick Touch Academy Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Check your inbox: ${EMAIL_USER}`);
  } catch (error) {
    console.log('❌ Failed to send test email:', error.message);
    return;
  }

  console.log('\n🎉 Email configuration test completed successfully!');
  console.log('✅ Your signup email verification should now work properly.');
}

testEmailConfig().catch(console.error);
