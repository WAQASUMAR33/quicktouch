import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
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

    // Send verification email
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/users/verify?token=${verificationToken}`;
    
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

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email - Quick Touch Academy',
      html: emailHtml,
    });

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
        academy: {
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