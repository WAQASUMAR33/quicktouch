# Gmail SMTP Setup Guide for Quick Touch Academy

## 📧 Setting up Gmail SMTP for Email Verification

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification**
3. Enable 2-Factor Authentication if not already enabled

### Step 2: Generate App Password
1. In Google Account settings, go to **Security** → **2-Step Verification**
2. Scroll down to **App passwords**
3. Click **App passwords**
4. Select **Mail** as the app
5. Select **Other (custom name)** and enter "Quick Touch Academy"
6. Click **Generate**
7. **Copy the 16-character password** (you'll need this for EMAIL_PASS)

### Step 3: Set Environment Variables
Create a `.env.local` file in your project root with:

```bash
# Gmail SMTP Configuration
EMAIL_USER="your-gmail@gmail.com"
EMAIL_PASS="your-16-character-app-password"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-for-development"

# Database (if not already set)
DATABASE_URL="your-database-url"

# Next.js Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

### Step 4: Test Email Configuration
Run the test script to verify email setup:
```bash
node test-email-config.js
```

## 🔧 Alternative: Use Development Email Service

If you prefer not to use Gmail, you can use a development email service like:

### Option 1: Mailtrap (Recommended for Development)
1. Sign up at https://mailtrap.io/
2. Get your SMTP credentials
3. Update the transporter configuration:

```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'your-mailtrap-username',
    pass: 'your-mailtrap-password'
  }
});
```

### Option 2: Ethereal Email (Free Testing)
1. Install ethereal-email: `npm install ethereal-email`
2. Use the ethereal email service for testing

## 🚨 Important Notes

- **Never commit your `.env.local` file** to version control
- **Use App Passwords**, not your regular Gmail password
- **Test in development** before deploying to production
- **Consider using a dedicated email service** for production

## ✅ Verification

After setup, test the signup process:
1. Go to http://localhost:3000/register
2. Fill out the registration form
3. Check your email for the verification message
4. Click the verification link to complete registration


