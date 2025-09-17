
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

// GET: Retrieve all academies
export async function GET(request) {
  try {
    // Use raw query to get all fields including the new ones we added
    const academies = await prisma.$queryRaw`
      SELECT id, name, location, description, contactEmail, contactPhone, 
             contactPerson, contactPersonPhone, adminPassword, status, 
             adminIds, createdAt, updatedAt
      FROM Academy 
      ORDER BY createdAt DESC
    `;

    // Get related data for each academy
    const academiesWithRelations = await Promise.all(
      academies.map(async (academy) => {
        // Get users for this academy
        const users = await prisma.user.findMany({
          where: { academyId: academy.id },
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            createdAt: true
          }
        });

        // Get players for this academy
        const players = await prisma.player.findMany({
          where: { academyId: academy.id },
          select: {
            id: true,
            fullName: true,
            position: true,
            age: true,
            createdAt: true
          }
        });

        // Get events for this academy
        const events = await prisma.event.findMany({
          where: { academyId: academy.id },
          select: {
            id: true,
            title: true,
            date: true,
            type: true,
            createdAt: true
          }
        });

        // Get matches for this academy
        const matches = await prisma.match.findMany({
          where: { academyId: academy.id },
          select: {
            id: true,
            title: true,
            date: true,
            type: true,
            createdAt: true
          }
        });

        // Get training plans for this academy
        const trainingPlans = await prisma.trainingPlan.findMany({
          where: { academyId: academy.id },
          select: {
            id: true,
            title: true,
            date: true,
            createdAt: true
          }
        });

        return {
          ...academy,
          User: users,
          Player: players,
          Event: events,
          Match: matches,
          TrainingPlan: trainingPlans
        };
      })
    );

    return NextResponse.json(
      { message: 'Academies retrieved successfully', academies: academiesWithRelations },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET All Error:', error);
    
    // Return fallback academies if database is not available
    const fallbackAcademies = [
      {
        id: 'academy-main-campus',
        name: 'Football Academy - Main Campus',
        location: 'Main City, Country',
        description: 'Main campus with state-of-the-art facilities',
        contactEmail: 'info@footballacademy.com',
        contactPhone: '+1-555-1234567',
        adminIds: '[]',
        createdAt: new Date().toISOString(),
        updatedAt: null,
        User: [],
        Player: [],
        Match: [],
        Event: [],
        TrainingPlan: []
      },
      {
        id: 'academy-karachi-branch',
        name: 'Football Academy - Branch 1',
        location: 'Branch City, Country',
        description: 'Branch offering comprehensive football training programs',
        contactEmail: 'branch1@footballacademy.com',
        contactPhone: '+1-555-1234568',
        adminIds: '[]',
        createdAt: new Date().toISOString(),
        updatedAt: null,
        User: [],
        Player: [],
        Match: [],
        Event: [],
        TrainingPlan: []
      },
      {
        id: 'academy-islamabad-branch',
        name: 'Football Academy - Branch 2',
        location: 'Branch City 2, Country',
        description: 'Branch with modern training facilities and experienced coaches',
        contactEmail: 'branch2@footballacademy.com',
        contactPhone: '+1-555-1234569',
        adminIds: '[]',
        createdAt: new Date().toISOString(),
        updatedAt: null,
        User: [],
        Player: [],
        Match: [],
        Event: [],
        TrainingPlan: []
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
    const { name, location, description, contactEmail, contactPhone, contactPerson, contactPersonPhone, status, adminIds } = await request.json();
   
    // Validate input
    if (!name || !location) {
      return NextResponse.json(
        { error: 'Name and location are required' },
        { status: 400 }
      );
    }

    // Create academy with all required fields including new ones
    const academyId = crypto.randomUUID();
    
    // Use raw SQL to insert with all new fields
    await prisma.$executeRaw`
      INSERT INTO Academy (id, name, location, description, contactEmail, contactPhone, 
                          contactPerson, contactPersonPhone, adminPassword, status, adminIds, createdAt)
      VALUES (${academyId}, ${name}, ${location}, ${description || null}, 
              ${contactEmail || null}, ${contactPhone || null}, 
              ${contactPerson || null}, ${contactPersonPhone || null}, 
              ${null}, ${status || 'approved'}, ${adminIds || '[]'}, NOW())
    `;

    // Get the created academy with all fields
    const academyData = await prisma.$queryRaw`
      SELECT id, name, location, description, contactEmail, contactPhone, 
             contactPerson, contactPersonPhone, adminPassword, status, 
             adminIds, createdAt, updatedAt
      FROM Academy 
      WHERE id = ${academyId}
    `;

    const academy = academyData[0];

    // Add empty relations for new academy
    academy.User = [];
    academy.Player = [];
    academy.Event = [];
    academy.Match = [];
    academy.TrainingPlan = [];

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

