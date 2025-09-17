import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import bcrypt from "bcryptjs";
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

// PUT: Update a user by ID
export async function PUT(request, { params }) {
  try {
    const user = await getUserFromToken(request);
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins and coaches can update users
    if (!['admin', 'coach', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { id } = params;
    const { email, password, fullName, role, isEmailVerified } = await request.json();

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ 
      where: { id },
      select: { id: true, academyId: true, role: true }
    });
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check access permissions
    if (user.role !== 'admin' && user.role !== 'super_admin') {
      // Coaches can only update users in their academy
      const currentUser = await prisma.user.findUnique({
        where: { id: user.userId },
        select: { academyId: true }
      });
      if (currentUser?.academyId !== existingUser.academyId) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    // Prepare update data
    const updateData = {};
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    if (fullName !== undefined) updateData.fullName = fullName;
    if (role !== undefined) updateData.role = role;
    if (isEmailVerified !== undefined) updateData.isEmailVerified = isEmailVerified;

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        phone: true,
        academyId: true,
        isEmailVerified: true,
        createdAt: true,
        Academy: {
          select: { id: true, name: true }
        }
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to update user", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE: Delete a user by ID
export async function DELETE(request, { params }) {
  try {
    const user = await getUserFromToken(request);
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins and super_admins can delete users
    if (!['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { id } = params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ 
      where: { id },
      select: { id: true, academyId: true, role: true }
    });
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check access permissions
    if (user.role !== 'super_admin') {
      // Admins can only delete users in their academy
      const currentUser = await prisma.user.findUnique({
        where: { id: user.userId },
        select: { academyId: true }
      });
      if (currentUser?.academyId !== existingUser.academyId) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    // Delete user
    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete user", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}



// GET: Fetch a single user by ID
export async function GET(request, { params }) {
  try {
    const user = await getUserFromToken(request);
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins, coaches, and super_admins can view user details
    if (!['admin', 'coach', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Valid User ID is required' }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
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
      }
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check access permissions
    if (user.role !== 'admin' && user.role !== 'super_admin') {
      // Coaches can only view users in their academy
      const currentUser = await prisma.user.findUnique({
        where: { id: user.userId },
        select: { academyId: true }
      });
      if (currentUser?.academyId !== targetUser.academyId) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    return NextResponse.json(targetUser, { status: 200 });
  } catch (error) {
    console.error('GET User error:', error);
    return NextResponse.json({ error: 'Failed to fetch User', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
