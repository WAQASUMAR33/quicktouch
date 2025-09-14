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

// GET: Fetch all events and matches
export async function GET(request) {
  try {
    const user = await getUserFromToken(request);
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
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

    // Filter by type if specified
    if (type) {
      whereClause.type = type;
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      include: {
        Academy: {
          select: { id: true, name: true, location: true }
        },
        Attendance: {
          select: {
            id: true,
            playerId: true,
            status: true,
            player: {
              select: { fullName: true, position: true }
            }
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    // Also fetch matches
    const matches = await prisma.match.findMany({
      where: whereClause,
      include: {
        Academy: {
          select: { id: true, name: true, location: true }
        },
        Attendance: {
          select: {
            id: true,
            playerId: true,
            status: true,
            player: {
              select: { fullName: true, position: true }
            }
          }
        },
        playerStats: {
          select: {
            playerId: true,
            goals: true,
            assists: true,
            minutesPlayed: true,
            player: {
              select: { fullName: true, position: true }
            }
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    return NextResponse.json({ 
      events: [...events, ...matches.map(match => ({ ...match, type: 'match' }))] 
    }, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST: Create a new event or match
export async function POST(request) {
  try {
    const user = await getUserFromToken(request);
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only coaches and admins can create events
    if (!['admin', 'coach'].includes(user.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.date || !data.location || !data.type) {
      return NextResponse.json(
        { error: 'Missing required fields: title, date, location, type' },
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

    // Create event or match based on type
    if (data.type === 'match') {
      const match = await prisma.match.create({
        data: {
          title: data.title,
          date: new Date(data.date),
          location: data.location,
          type: data.type,
          academyId: userRecord.academyId
        },
        include: {
          academy: {
            select: { id: true, name: true, location: true }
          }
        }
      });

      return NextResponse.json({
        id: match.id,
        title: match.title,
        date: match.date,
        location: match.location,
        type: match.type,
        academyId: match.academyId,
        academy: match.academy,
        createdAt: match.createdAt,
        message: "Match created successfully",
      }, { status: 201 });
    } else {
      const event = await prisma.event.create({
        data: {
          title: data.title,
          description: data.description || '',
          date: new Date(data.date),
          location: data.location,
          type: data.type,
          academyId: userRecord.academyId
        },
        include: {
          academy: {
            select: { id: true, name: true, location: true }
          }
        }
      });

      return NextResponse.json({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        location: event.location,
        type: event.type,
        academyId: event.academyId,
        academy: event.academy,
        createdAt: event.createdAt,
        message: "Event created successfully",
      }, { status: 201 });
    }
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create event", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}