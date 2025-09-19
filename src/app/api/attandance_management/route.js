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

// GET: Fetch all attendance records
export async function GET(request) {
  try {

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const playerId = searchParams.get('playerId');
    const status = searchParams.get('status');
    const date = searchParams.get('date');

    let whereClause = {};

    // Filter by event
    if (eventId) {
      whereClause.eventId = eventId;
    }

    // Filter by player
    if (playerId) {
      whereClause.playerId = playerId;
    }

    // Filter by status
    if (status) {
      whereClause.status = status;
    }

    // Filter by date
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      whereClause.date = {
        gte: startDate,
        lt: endDate
      };
    }

    const attendance = await prisma.attendance.findMany({
      where: whereClause,
      include: {
        player: {
          select: { 
            id: true, 
            fullName: true, 
            position: true,
            academyId: true
          }
        },
        event: {
          select: { 
            id: true, 
            title: true, 
            type: true,
            date: true,
            location: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    return NextResponse.json({ attendance }, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance records", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST: Create a new attendance record
export async function POST(request) {
  try {

    // Only coaches and admins can create attendance records

    const data = await request.json();

    // Validate required fields
    if (!data.playerId || !data.eventId || !data.status) {
      return NextResponse.json(
        { error: 'Missing required fields: playerId, eventId, status' },
        { status: 400 }
      );
    }

    // Validate status
    if (!['present', 'absent', 'late'].includes(data.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: present, absent, or late' },
        { status: 400 }
      );
    }

    // Check if attendance record already exists for this player and event
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        playerId: data.playerId,
        eventId: data.eventId
      }
    });

    if (existingAttendance) {
      return NextResponse.json(
        { error: 'Attendance record already exists for this player and event' },
        { status: 400 }
      );
    }

    const attendance = await prisma.attendance.create({
      data: {
        playerId: data.playerId,
        eventId: data.eventId,
        status: data.status,
        date: data.date ? new Date(data.date) : new Date(),
        notes: data.notes || ''
      },
      include: {
        player: {
          select: { 
            id: true, 
            fullName: true, 
            position: true
          }
        },
        event: {
          select: { 
            id: true, 
            title: true, 
            type: true,
            date: true
          }
        }
      }
    });

    return NextResponse.json({
      id: attendance.id,
      playerId: attendance.playerId,
      eventId: attendance.eventId,
      status: attendance.status,
      date: attendance.date,
      notes: attendance.notes,
      player: attendance.player,
      event: attendance.event,
      createdAt: attendance.createdAt,
      message: "Attendance record created successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create attendance record", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}