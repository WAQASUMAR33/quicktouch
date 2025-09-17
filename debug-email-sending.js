// Debug email sending with detailed logging
const nodemailer = require('nodemailer');

const EMAIL_USER = "theitxprts@gmail.com";
const EMAIL_PASS = "bxcz oyhi fcyx qcab";

async function debugEmailSending() {
  console.log('🔍 Debugging Email Sending Process...\n');

  // Create transporter with detailed logging
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
    },
    debug: true, // Enable debug logging
    logger: true // Enable logger
  });

  console.log('1️⃣ Testing SMTP Connection with Debug...');
  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');
  } catch (error) {
    console.log('❌ SMTP verification failed:', error.message);
    console.log('Full error:', error);
    return;
  }

  console.log('\n2️⃣ Sending Test Email with Debug Info...');
  
  const testEmail = {
    from: `"Quick Touch Academy" <${EMAIL_USER}>`,
    to: 'theitxprts786@gmail.com',
    subject: 'Quick Touch Academy - Email Delivery Test',
    text: 'This is a test email to verify email delivery.',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FFB300;">Quick Touch Academy - Email Delivery Test</h2>
        <p>This is a test email to verify that emails are being delivered properly.</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p><strong>From:</strong> ${EMAIL_USER}</p>
        <p><strong>To:</strong> theitxprts786@gmail.com</p>
        <p>If you receive this email, the email delivery system is working correctly.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          This is an automated test email from Quick Touch Academy.
        </p>
      </div>
    `
  };

  try {
    console.log('📤 Sending email...');
    console.log('   From:', testEmail.from);
    console.log('   To:', testEmail.to);
    console.log('   Subject:', testEmail.subject);
    
    const info = await transporter.sendMail(testEmail);
    
    console.log('\n✅ Email sent successfully!');
    console.log('📧 Email Details:');
    console.log('   Message ID:', info.messageId);
    console.log('   Response:', info.response);
    console.log('   Accepted:', info.accepted);
    console.log('   Rejected:', info.rejected);
    
    if (info.rejected && info.rejected.length > 0) {
      console.log('❌ Email was rejected:', info.rejected);
    }
    
    console.log('\n📬 Next Steps:');
    console.log('1. Check theitxprts786@gmail.com inbox');
    console.log('2. Check Spam/Junk folder');
    console.log('3. Wait 1-2 minutes for delivery');
    console.log('4. If still not received, check Gmail filters');
    
  } catch (error) {
    console.log('❌ Failed to send email:', error.message);
    console.log('Full error:', error);
  }
}

debugEmailSending().catch(console.error);

