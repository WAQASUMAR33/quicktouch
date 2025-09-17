import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";


// GET: Retrieve an academy by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Validate ID
    if (!id) {
      return NextResponse.json(
        { error: 'Academy ID is required' },
        { status: 400 }
      );
    }

    // Get academy with all fields using raw SQL
    const academyData = await prisma.$queryRaw`
      SELECT id, name, location, description, contactEmail, contactPhone, 
             contactPerson, contactPersonPhone, adminPassword, status, 
             adminIds, createdAt, updatedAt
      FROM Academy 
      WHERE id = ${id}
    `;

    if (!academyData || academyData.length === 0) {
      return NextResponse.json(
        { error: 'Academy not found' },
        { status: 404 }
      );
    }

    const academy = academyData[0];

    // Get related data for the academy
    const users = await prisma.user.findMany({
      where: { academyId: id },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    const players = await prisma.player.findMany({
      where: { academyId: id },
      select: {
        id: true,
        fullName: true,
        position: true,
        age: true,
        createdAt: true
      }
    });

    const events = await prisma.event.findMany({
      where: { academyId: id },
      select: {
        id: true,
        title: true,
        date: true,
        type: true,
        createdAt: true
      }
    });

    const matches = await prisma.match.findMany({
      where: { academyId: id },
      select: {
        id: true,
        title: true,
        date: true,
        type: true,
        createdAt: true
      }
    });

    const trainingPlans = await prisma.trainingPlan.findMany({
      where: { academyId: id },
      select: {
        id: true,
        title: true,
        date: true,
        createdAt: true
      }
    });

    // Add relations to the academy object
    academy.User = users;
    academy.Player = players;
    academy.Event = events;
    academy.Match = matches;
    academy.TrainingPlan = trainingPlans;

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
    const { id } = await params;
    const { name, location, description, contactEmail, contactPhone, contactPerson, contactPersonPhone, status, adminIds } = await request.json();

    // Validate input
    if (!id) {
      return NextResponse.json(
        { error: 'Academy ID is required' },
        { status: 400 }
      );
    }
    if (!name && !location && !description && !contactEmail && !contactPhone && !contactPerson && !contactPersonPhone && !status && !adminIds) {
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

    // Update academy using raw SQL to handle all new fields
    await prisma.$executeRaw`
      UPDATE Academy 
      SET 
        name = COALESCE(${name || null}, name),
        location = COALESCE(${location || null}, location),
        description = COALESCE(${description || null}, description),
        contactEmail = COALESCE(${contactEmail || null}, contactEmail),
        contactPhone = COALESCE(${contactPhone || null}, contactPhone),
        contactPerson = COALESCE(${contactPerson || null}, contactPerson),
        contactPersonPhone = COALESCE(${contactPersonPhone || null}, contactPersonPhone),
        status = COALESCE(${status || null}, status),
        adminIds = COALESCE(${adminIds || null}, adminIds),
        updatedAt = NOW()
      WHERE id = ${id}
    `;

    // Get the updated academy with all fields
    const updatedAcademyData = await prisma.$queryRaw`
      SELECT id, name, location, description, contactEmail, contactPhone, 
             contactPerson, contactPersonPhone, adminPassword, status, 
             adminIds, createdAt, updatedAt
      FROM Academy 
      WHERE id = ${id}
    `;

    const updatedAcademy = updatedAcademyData[0];

    // Get related data for the academy
    const users = await prisma.user.findMany({
      where: { academyId: id },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    const players = await prisma.player.findMany({
      where: { academyId: id },
      select: {
        id: true,
        fullName: true,
        position: true,
        age: true,
        createdAt: true
      }
    });

    const events = await prisma.event.findMany({
      where: { academyId: id },
      select: {
        id: true,
        title: true,
        date: true,
        type: true,
        createdAt: true
      }
    });

    const matches = await prisma.match.findMany({
      where: { academyId: id },
      select: {
        id: true,
        title: true,
        date: true,
        type: true,
        createdAt: true
      }
    });

    const trainingPlans = await prisma.trainingPlan.findMany({
      where: { academyId: id },
      select: {
        id: true,
        title: true,
        date: true,
        createdAt: true
      }
    });

    // Add relations to the academy object
    updatedAcademy.User = users;
    updatedAcademy.Player = players;
    updatedAcademy.Event = events;
    updatedAcademy.Match = matches;
    updatedAcademy.TrainingPlan = trainingPlans;

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
    const { id } = await params;

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

    // Delete related data first to avoid foreign key constraints
    console.log(`Deleting academy ${id} and all related data...`);

    // Delete related data in the correct order
    await prisma.playerStats.deleteMany({ where: { player: { academyId: id } } });
    await prisma.feedback.deleteMany({ where: { player: { academyId: id } } });
    await prisma.attendance.deleteMany({ where: { player: { academyId: id } } });
    await prisma.scoutFavorite.deleteMany({ where: { player: { academyId: id } } });
    
    // Delete players
    await prisma.player.deleteMany({ where: { academyId: id } });
    
    // Delete events
    await prisma.event.deleteMany({ where: { academyId: id } });
    
    // Delete matches
    await prisma.match.deleteMany({ where: { academyId: id } });
    
    // Delete training plans
    await prisma.trainingPlan.deleteMany({ where: { academyId: id } });
    
    // Delete users
    await prisma.user.deleteMany({ where: { academyId: id } });

    // Finally delete the academy
    await prisma.academy.delete({ where: { id } });

    console.log(`Academy ${id} deleted successfully`);

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
