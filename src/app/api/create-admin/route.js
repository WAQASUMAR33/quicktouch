import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export async function POST() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "admin" }
    });

    if (existingAdmin) {
      return NextResponse.json({
        message: "Admin user already exists",
        user: {
          id: existingAdmin.id,
          email: existingAdmin.email,
          fullName: existingAdmin.fullName,
          role: existingAdmin.role
        }
      });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12);
    
    // Get the first academy
    let academy = await prisma.academy.findFirst();
    if (!academy) {
      return NextResponse.json({
        error: "No academy found. Please create an academy first.",
        message: "The system requires at least one academy to create users."
      }, { status: 400 });
    }
    
    const adminUser = await prisma.user.create({
      data: {
        id: uuidv4(),
        email: "admin@quicktouch.com",
        password: hashedPassword,
        fullName: "Admin User",
        role: "admin",
        academyId: academy.id,
        isEmailVerified: true
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isEmailVerified: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      message: "Admin user created successfully",
      user: adminUser
    });
  } catch (error) {
    console.error('Admin user creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
