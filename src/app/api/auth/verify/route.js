import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '../../../lib/prisma';

export async function GET(request) {
  try {
    // Extract token from Authorization header
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: No token provided' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');

    // Fetch full user data from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        Academy: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return full user data
    return NextResponse.json({
      message: 'Token valid',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone,
        academyId: user.academyId,
        isEmailVerified: user.isEmailVerified,
        Academy: user.Academy
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Verify API Error:', error.message);
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Prevent 405 errors for non-GET methods
export async function POST(request) {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET.' },
    { status: 405 }
  );
}