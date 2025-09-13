
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

// GET: Retrieve all academies
export async function GET(request) {
  try {
    const academies = await prisma.academy.findMany({
      include: {
        users: { select: { id: true, fullName: true, email: true, role: true } },
        players: { select: { id: true, fullName: true, position: true } },
        matches: { select: { id: true, title: true, date: true } },
        events: { select: { id: true, title: true, date: true } },
        trainingPlans: { select: { id: true, title: true, date: true } },
      },
    });

    return NextResponse.json(
      { message: 'Academies retrieved successfully', academies },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET All Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST: Create a new academy
export async function POST(request) {
  try {
    const { name, location, adminIds } = await request.json();
   
    // Validate input
    if (!name || !location) {
      return NextResponse.json(
        { error: 'Name and location are required' },
        { status: 400 }
      );
    }
   

    // Verify user is admin
    const user = await prisma.user.findUnique({ where: { id: authUserId } });
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: Only admins can create academies' },
        { status: 403 }
      );
    }

    // Validate adminIds if provided
    let validatedAdminIds = [];
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
      validatedAdminIds = adminIds;
    }

    // Create academy
    const academy = await prisma.academy.create({
      data: {
        name,
        location,
        adminIds: JSON.stringify(validatedAdminIds),
        createdAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: 'Academy created successfully', academy },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

