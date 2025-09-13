import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export async function POST() {
  try {
    // Check if demo user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: "demo@quicktouch.com" }
    });

    if (existingUser) {
      return NextResponse.json({
        message: "Demo user already exists",
        user: {
          id: existingUser.id,
          email: existingUser.email,
          fullName: existingUser.fullName,
          role: existingUser.role
        }
      });
    }

    // Create demo user
    const hashedPassword = await bcrypt.hash("demo123", 12);
    
    // First, get an academy ID (we'll use the first one)
    let academy = await prisma.academy.findFirst();
    if (!academy) {
      return NextResponse.json({
        error: "No academy found. Please create an academy first.",
        message: "The system requires at least one academy to create users."
      }, { status: 400 });
    }
    
    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        email: "demo@quicktouch.com",
        password: hashedPassword,
        fullName: "Demo User",
        role: "player",
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
      message: "Demo user created successfully",
      user
    });
  } catch (error) {
    console.error('Demo user creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create demo user', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
