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
    const { name, location, description, contactEmail, contactPhone } = await request.json();

    // Validate input
    if (!id) {
      return NextResponse.json(
        { error: 'Academy ID is required' },
        { status: 400 }
      );
    }
    if (!name && !location && !description && !contactEmail && !contactPhone) {
      return NextResponse.json(
        { error: 'At least one field is required' },
        { status: 400 }
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


    // Update academy
    const updatedAcademy = await prisma.academy.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(location && { location }),
        ...(description !== undefined && { description }),
        ...(contactEmail !== undefined && { contactEmail }),
        ...(contactPhone !== undefined && { contactPhone }),
        updatedAt: new Date(),
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

    // Validate ID
    if (!id) {
      return NextResponse.json(
        { error: 'Academy ID is required' },
        { status: 400 }
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
