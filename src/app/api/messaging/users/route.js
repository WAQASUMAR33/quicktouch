import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import jwt from 'jsonwebtoken';

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

// GET /api/messaging/users - Get users that can be messaged based on role
export async function GET(request) {
  try {

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    // Define messaging permissions based on roles
    const messagingPermissions = {
      player: ['coach', 'parent', 'admin'],
      parent: ['coach', 'admin', 'player'],
      coach: ['player', 'parent', 'admin', 'scout'],
      scout: ['admin', 'coach'],
      admin: ['player', 'parent', 'coach', 'scout']
    };

    const allowedRoles = messagingPermissions[user.role] || [];

    let whereClause = {
      id: { not: user.userId }, // Exclude current user
      role: { in: allowedRoles }
    };

    // Filter by specific role if provided
    if (role && allowedRoles.includes(role)) {
      whereClause.role = role;
    }

    // Add search filter if provided
    if (search) {
      whereClause.fullName = {
        contains: search,
        mode: 'insensitive'
      };
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        fullName: true,
        role: true,
        profilePhoto: true,
        email: true
      },
      orderBy: { fullName: 'asc' }
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users for messaging:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}