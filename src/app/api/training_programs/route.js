import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
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

// GET: Fetch all training programs
export async function GET(request) {
  try {
    const user = await getUserFromToken(request);
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const academyId = searchParams.get('academyId');

    let whereClause = {};

    // Filter by academy if user is not admin
    if (user.role !== 'admin') {
      // Get user's academy
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

    const programs = await prisma.trainingPlan.findMany({
      where: whereClause,
      include: {
        Academy: {
          select: { id: true, name: true, location: true }
        },
        User: {
          select: { id: true, fullName: true, email: true }
        }
      },
      orderBy: { date: 'desc' }
    });

    return NextResponse.json({ programs }, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch training programs", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST: Create a new training program
export async function POST(request) {
  try {
    const user = await getUserFromToken(request);
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only coaches and admins can create training programs
    if (!['admin', 'coach'].includes(user.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.date) {
      return NextResponse.json(
        { error: 'Missing required fields: title, date' },
        { status: 400 }
      );
    }

    // Get user's academy
    const userRecord = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { academyId: true }
    });

    if (!userRecord) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const program = await prisma.trainingPlan.create({
      data: {
        title: data.title,
        description: data.description || '',
        drills: data.drills || '',
        date: new Date(data.date),
        coachId: user.userId,
        academyId: userRecord.academyId
      },
      include: {
        Academy: {
          select: { id: true, name: true, location: true }
        }
      }
    });

    return NextResponse.json({
      id: program.id,
      title: program.title,
      description: program.description,
      drills: program.drills,
      date: program.date,
      coachId: program.coachId,
      academyId: program.academyId,
      academy: program.Academy,
      createdAt: program.createdAt,
      message: "Training program created successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create training program", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}