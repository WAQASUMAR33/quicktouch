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

// POST: Create a new player
export async function POST(request) {
  try {
    const user = await getUserFromToken(request);
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only coaches and admins can create players
    if (!['admin', 'coach'].includes(user.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.fullName || !data.age || !data.height || !data.position || !data.academyId) {
      return NextResponse.json(
        { error: 'Missing required fields: fullName, age, height, position, academyId' },
        { status: 400 }
      );
    }

    // Validate age
    if (data.age < 5 || data.age > 25) {
      return NextResponse.json(
        { error: 'Age must be between 5 and 25' },
        { status: 400 }
      );
    }

    // Validate height
    if (data.height < 0.5 || data.height > 2.5) {
      return NextResponse.json(
        { error: 'Height must be between 0.5 and 2.5 meters' },
        { status: 400 }
      );
    }

    // Create player
    const player = await prisma.player.create({
      data: {
        fullName: data.fullName,
        age: parseInt(data.age),
        height: parseFloat(data.height),
        position: data.position,
        highlightReels: data.highlightReels || [],
        academyId: data.academyId
      },
      include: {
        academy: {
          select: { id: true, name: true }
        }
      }
    });

    return NextResponse.json(
      {
        id: player.id,
        fullName: player.fullName,
        age: player.age,
        height: player.height,
        position: player.position,
        highlightReels: player.highlightReels,
        academyId: player.academyId,
        academy: player.academy,
        createdAt: player.createdAt,
        updatedAt: player.updatedAt,
        message: "Player created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create player", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET: Fetch all players
export async function GET(request) {
  try {
    const user = await getUserFromToken(request);
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const academyId = searchParams.get('academyId');
    const position = searchParams.get('position');
    const ageMin = searchParams.get('ageMin');
    const ageMax = searchParams.get('ageMax');

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

    // Additional filters
    if (position) {
      whereClause.position = position;
    }

    if (ageMin || ageMax) {
      whereClause.age = {};
      if (ageMin) whereClause.age.gte = parseInt(ageMin);
      if (ageMax) whereClause.age.lte = parseInt(ageMax);
    }

    const players = await prisma.player.findMany({
      where: whereClause,
      include: {
        Academy: {
          select: { id: true, name: true, location: true }
        },
        PlayerStats: {
          select: {
            goals: true,
            assists: true,
            minutesPlayed: true
          }
        },
        Feedback: {
          select: {
            rating: true,
            notes: true,
            date: true
          },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ players }, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch players", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}