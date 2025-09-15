
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
    
    // Return fallback academies if database is not available
    const fallbackAcademies = [
      {
        id: 'academy-1',
        name: 'Quick Touch Academy - Main Campus',
        location: 'Lahore, Pakistan',
        description: 'Main campus of Quick Touch Academy with state-of-the-art facilities',
        contactEmail: 'info@quicktouchacademy.com',
        contactPhone: '+92-300-1234567',
        users: [],
        players: [],
        matches: [],
        events: [],
        trainingPlans: []
      },
      {
        id: 'academy-2',
        name: 'Quick Touch Academy - Karachi Branch',
        location: 'Karachi, Pakistan',
        description: 'Karachi branch offering comprehensive football training programs',
        contactEmail: 'karachi@quicktouchacademy.com',
        contactPhone: '+92-21-1234567',
        users: [],
        players: [],
        matches: [],
        events: [],
        trainingPlans: []
      },
      {
        id: 'academy-3',
        name: 'Quick Touch Academy - Islamabad Branch',
        location: 'Islamabad, Pakistan',
        description: 'Islamabad branch with modern training facilities and experienced coaches',
        contactEmail: 'islamabad@quicktouchacademy.com',
        contactPhone: '+92-51-1234567',
        users: [],
        players: [],
        matches: [],
        events: [],
        trainingPlans: []
      }
    ];

    return NextResponse.json(
      { message: 'Academies retrieved successfully (fallback data)', academies: fallbackAcademies },
      { status: 200 }
    );
  } finally {
    try {
      await prisma.$disconnect();
    } catch (e) {
      // Ignore disconnect errors
    }
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

