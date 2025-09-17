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

// GET: Fetch a single training program by ID
export async function GET(request, { params }) {
  try {
    const user = await getUserFromToken(request);
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const program = await prisma.trainingPlan.findUnique({
      where: { id },
      include: {
        Academy: {
          select: { id: true, name: true, location: true }
        },
        User: {
          select: { id: true, fullName: true, email: true }
        }
      }
    });

    if (!program) {
      return NextResponse.json(
        { error: "Training program not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this program
    if (user.role !== 'admin' && program.academyId !== user.academyId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json(program, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch training program", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT: Update a training program by ID
export async function PUT(request, { params }) {
  try {
    const user = await getUserFromToken(request);
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only coaches and admins can update training programs
    if (!['admin', 'coach'].includes(user.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { id } = params;
    const data = await request.json();

    // Check if program exists and user has access
    const existingProgram = await prisma.trainingPlan.findUnique({
      where: { id },
      select: { academyId: true, coachId: true }
    });

    if (!existingProgram) {
      return NextResponse.json(
        { error: "Training program not found" },
        { status: 404 }
      );
    }

    // Check access permissions
    if (user.role !== 'admin' && existingProgram.academyId !== user.academyId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Only the coach who created it or admin can edit
    if (user.role !== 'admin' && existingProgram.coachId !== user.userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const program = await prisma.trainingPlan.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        drills: data.drills,
        date: data.date ? new Date(data.date) : undefined,
      },
      include: {
        Academy: {
          select: { id: true, name: true, location: true }
        },
        User: {
          select: { id: true, fullName: true, email: true }
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
      coach: program.User,
      createdAt: program.createdAt,
      message: "Training program updated successfully",
    }, { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Training program not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update training program", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE: Delete a training program by ID
export async function DELETE(request, { params }) {
  try {
    const user = await getUserFromToken(request);
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only coaches and admins can delete training programs
    if (!['admin', 'coach'].includes(user.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { id } = params;

    // Check if program exists and user has access
    const existingProgram = await prisma.trainingPlan.findUnique({
      where: { id },
      select: { academyId: true, coachId: true }
    });

    if (!existingProgram) {
      return NextResponse.json(
        { error: "Training program not found" },
        { status: 404 }
      );
    }

    // Check access permissions
    if (user.role !== 'admin' && existingProgram.academyId !== user.academyId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Only the coach who created it or admin can delete
    if (user.role !== 'admin' && existingProgram.coachId !== user.userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    await prisma.trainingPlan.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: "Training program deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Training program not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete training program", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}