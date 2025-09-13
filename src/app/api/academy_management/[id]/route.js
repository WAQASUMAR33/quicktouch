import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";


// GET: Retrieve an academy by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Validate ID
    if (!id) {
      return NextResponse.json(
        { error: 'Academy ID is required' },
        { status: 400 }
      );
    }

    // Retrieve academy
    const academy = await prisma.academy.findUnique({
      where: { id },
      include: {
        users: { select: { id: true, fullName: true, email: true, role: true } },
        players: { select: { id: true, fullName: true, position: true } },
        matches: { select: { id: true, title: true, date: true } },
        events: { select: { id: true, title: true, date: true } },
        trainingPlans: { select: { id: true, title: true, date: true } },
      },
    });

    if (!academy) {
      return NextResponse.json(
        { error: 'Academy not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Academy retrieved successfully', academy },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT: Update an academy by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const authUserId = request.headers.get('x-user-id');
    const { name, location, adminIds } = await request.json();

    // Validate input
    if (!id) {
      return NextResponse.json(
        { error: 'Academy ID is required' },
        { status: 400 }
      );
    }
    if (!authUserId) {
      return NextResponse.json(
        { error: 'Unauthorized: User ID required' },
        { status: 401 }
      );
    }
    if (!name && !location && !adminIds) {
      return NextResponse.json(
        { error: 'At least one field (name, location, adminIds) is required' },
        { status: 400 }
      );
    }

    // Verify user is admin
    const user = await prisma.user.findUnique({ where: { id: authUserId } });
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: Only admins can update academies' },
        { status: 403 }
      );
    }

    // Check if academy exists
    const academy = await prisma.academy.findUnique({ where: { id } });
    if (!academy) {
      return NextResponse.json(
        { error: 'Academy not found' },
        { status: 404 }
      );
    }

    // Validate adminIds if provided
    if (adminIds) {
      if (!Array.isArray(adminIds)) {
        return NextResponse.json(
          { error: 'adminIds must be an array' },
          { status: 400 }
        );
      }
      const validAdmins = await prisma.user.findMany({
        where: { id: { in: adminIds }, role: 'admin' },
      });
      if (validAdmins.length !== adminIds.length) {
        return NextResponse.json(
          { error: 'Some admin IDs are invalid or not admins' },
          { status: 400 }
        );
      }
    }

    // Update academy
    const updatedAcademy = await prisma.academy.update({
      where: { id },
      data: {
        name: name || academy.name,
        location: location || academy.location,
        adminIds: adminIds ? JSON.stringify(adminIds) : academy.adminIds,
      },
    });

    return NextResponse.json(
      { message: 'Academy updated successfully', academy: updatedAcademy },
      { status: 200 }
    );
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE: Remove an academy by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const authUserId = request.headers.get('x-user-id');

    // Validate ID and auth
    if (!id) {
      return NextResponse.json(
        { error: 'Academy ID is required' },
        { status: 400 }
      );
    }
    if (!authUserId) {
      return NextResponse.json(
        { error: 'Unauthorized: User ID required' },
        { status: 401 }
      );
    }

    // Verify user is admin
    const user = await prisma.user.findUnique({ where: { id: authUserId } });
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: Only admins can delete academies' },
        { status: 403 }
      );
    }

    // Check if academy exists
    const academy = await prisma.academy.findUnique({ where: { id } });
    if (!academy) {
      return NextResponse.json(
        { error: 'Academy not found' },
        { status: 404 }
      );
    }

    // Delete academy (cascades to related records if configured in schema)
    await prisma.academy.delete({ where: { id } });

    return NextResponse.json(
      { message: 'Academy deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
