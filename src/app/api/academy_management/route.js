
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
    const { name, location, description, contactEmail, contactPhone } = await request.json();
   
    // Validate input
    if (!name || !location) {
      return NextResponse.json(
        { error: 'Name and location are required' },
        { status: 400 }
      );
    }

    // Create academy
    const academy = await prisma.academy.create({
      data: {
        id: crypto.randomUUID(),
        name,
        location,
        description: description || null,
        contactEmail: contactEmail || null,
        contactPhone: contactPhone || null,
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

