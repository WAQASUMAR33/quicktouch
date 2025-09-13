import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
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

// PUT: Update attendance record
export async function PUT(request, { params }) {
  try {
    const user = await getUserFromToken(request);
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only coaches and admins can update attendance records
    if (!['admin', 'coach'].includes(user.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { id } = params;
    const data = await request.json();

    // Validate status if provided
    if (data.status && !['present', 'absent', 'late'].includes(data.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: present, absent, or late' },
        { status: 400 }
      );
    }

    // Check if attendance record exists
    const existingAttendance = await prisma.attendance.findUnique({
      where: { id: id }
    });

    if (!existingAttendance) {
      return NextResponse.json(
        { error: 'Attendance record not found' },
        { status: 404 }
      );
    }

    const attendance = await prisma.attendance.update({
      where: { id: id },
      data: {
        ...(data.status && { status: data.status }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.date && { date: new Date(data.date) })
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
      updatedAt: attendance.updatedAt,
      message: "Attendance record updated successfully",
    }, { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to update attendance record", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE: Delete attendance record
export async function DELETE(request, { params }) {
  try {
    const user = await getUserFromToken(request);
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only coaches and admins can delete attendance records
    if (!['admin', 'coach'].includes(user.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { id } = params;

    // Check if attendance record exists
    const existingAttendance = await prisma.attendance.findUnique({
      where: { id: id }
    });

    if (!existingAttendance) {
      return NextResponse.json(
        { error: 'Attendance record not found' },
        { status: 404 }
      );
    }

    await prisma.attendance.delete({
      where: { id: id }
    });

    return NextResponse.json({
      message: "Attendance record deleted successfully"
    }, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete attendance record", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}