import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    // Check what's in the database
    const academies = await prisma.academy.findMany();
    const users = await prisma.user.findMany();
    
    return NextResponse.json({
      academies: academies.length,
      users: users.length,
      academyList: academies.map(a => ({ id: a.id, name: a.name })),
      userList: users.map(u => ({ id: u.id, email: u.email, role: u.role }))
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check database", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST() {
  try {
    // Create a default academy
    const academy = await prisma.academy.create({
      data: {
        id: uuidv4(),
        name: "Football Academy",
        location: "Default Location",
        adminIds: "[]" // Empty JSON array as string
      }
    });

    return NextResponse.json({
      message: "Default academy created successfully",
      academy
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create academy", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


