import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken';

// Create email transporter with proper configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Helper function to get user from JWT token
async function getUserFromToken(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');
    return decoded;
  } catch (error) {
    return null;
  }
}

// POST: Create a new user
export async function POST(request) {
  try {
    const { fullName, email, password, role, phone, academyId } = await request.json();

    // Validate input
    if (!fullName || !email || !password || !role || !academyId) {
      return NextResponse.json(
        { error: 'Missing required fields: fullName, email, password, role, academyId' },
        { status: 400 }
      );
    }

    // Check if academy exists, if not create a default one
    let academy = await prisma.academy.findUnique({
      where: { id: academyId }
    });

    if (!academy) {
      // If academy doesn't exist, create a default one
      academy = await prisma.academy.create({
        data: {
          id: academyId,
          name: 'Football Academy',
          location: 'Default Location',
          description: 'Default academy for new users',
          contactEmail: 'info@footballacademy.com',
          contactPhone: '+1-555-1234567',
          adminIds: '',
          createdAt: new Date(),
        }
      });
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['player', 'coach', 'admin', 'scout', 'parent'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be one of: player, coach, admin, scout, parent' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate verification token
    const verificationToken = uuidv4();

    // Create user
    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        fullName,
        email,
        password: hashedPassword,
        role,
        phone,
        academyId,
        isEmailVerified: false,
        verificationToken
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        phone: true,
        academyId: true,
        isEmailVerified: true,
        createdAt: true
      }
    });

    // Send verification email (skip if email not configured)
    try {
      const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/users/verify?token=${verificationToken}`;
      
      const emailHtml = `
        <div style="background-color: #1C2526; padding: 20px; color: #FFFFFF; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #FFB300; margin: 0;">Football Academy</h1>
            <p style="color: #FFFFFF; margin: 5px 0;">Football Training Excellence</p>
          </div>
          
          <h2 style="color: #FFB300;">Welcome to Football Academy!</h2>
          <p>Hi ${fullName},</p>
          <p>Thank you for registering with our Football Academy. Please verify your email address by clicking the button below:</p>
          
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
            Role: ${role}<br>
            Academy: Football Academy
          </p>
          
          <p style="color: #CCCCCC; font-size: 12px; text-align: center; margin-top: 30px;">
            Best regards,<br>
            <strong>Football Academy Team</strong>
          </p>
        </div>
      `;

      await transporter.sendMail({
        from: `"Football Academy" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email - Football Academy',
        html: emailHtml,
      });
    } catch (emailError) {
      console.log('Email service error:', emailError.message);
      console.log('Please check your Gmail SMTP configuration in .env');
      // Continue with user creation even if email fails
    }

    return NextResponse.json(
      {
        message: 'User created successfully. Please check your email to verify your account.',
        user
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to create user', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET: Fetch all users
export async function GET(request) {
  try {
    const user = await getUserFromToken(request);
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins and coaches can view all users
    if (!['admin', 'coach'].includes(user.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const academyId = searchParams.get('academyId');
    const role = searchParams.get('role');

    let whereClause = {};

    // Filter by academy if not admin
    if (user.role !== 'admin') {
      const userRecord = await prisma.user.findUnique({
        where: { id: user.userId },
        select: { academyId: true }
      });
      if (userRecord) {
        whereClause.academyId = userRecord.academyId;
      }
    } else if (academyId) {
      whereClause.academyId = academyId;
    }

    // Filter by role
    if (role) {
      whereClause.role = role;
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        phone: true,
        academyId: true,
        isEmailVerified: true,
        createdAt: true,
        Academy: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}