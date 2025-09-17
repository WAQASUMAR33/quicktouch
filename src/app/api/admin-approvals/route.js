import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

// GET: Fetch all pending academy registrations
export async function GET(request) {
  try {
    // Get pending academies
    const academies = await prisma.$queryRaw`
      SELECT id, name, location, description, contactEmail, contactPhone, 
             contactPerson, contactPersonPhone, status, createdAt
      FROM Academy 
      WHERE status = 'pending'
      ORDER BY createdAt DESC
    `;

    return NextResponse.json(
      { 
        message: 'Pending academies retrieved successfully', 
        academies 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET Pending Academies Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending academies' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
