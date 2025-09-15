import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { v4 as uuidv4 } from "uuid";

export async function POST() {
  try {
    // Check if demo player already exists
    const existingPlayer = await prisma.player.findFirst({
      where: { fullName: "Demo Player" }
    });

    if (existingPlayer) {
      return NextResponse.json({
        message: "Demo player already exists",
        player: {
          id: existingPlayer.id,
          fullName: existingPlayer.fullName,
          age: existingPlayer.age,
          position: existingPlayer.position,
          academyId: existingPlayer.academyId
        }
      });
    }

    // Get the demo user
    const demoUser = await prisma.user.findUnique({
      where: { email: "demo@quicktouch.com" }
    });

    if (!demoUser) {
      return NextResponse.json({
        error: "Demo user not found. Please create demo user first.",
        message: "Run /api/demo-user first to create the demo user."
      }, { status: 400 });
    }

    // Get an academy ID
    let academy = await prisma.academy.findFirst();
    if (!academy) {
      return NextResponse.json({
        error: "No academy found. Please create an academy first.",
        message: "The system requires at least one academy to create players."
      }, { status: 400 });
    }

    // Create demo player
    const player = await prisma.player.create({
      data: {
        id: uuidv4(),
        userId: demoUser.id,
        fullName: "Demo Player",
        age: 18,
        height: 1.75,
        position: "Midfielder",
        highlightReels: JSON.stringify([]),
        academyId: academy.id,
        updatedAt: new Date()
      },
      include: {
        Academy: {
          select: { id: true, name: true, location: true }
        }
      }
    });

    return NextResponse.json({
      message: "Demo player created successfully",
      player: {
        id: player.id,
        fullName: player.fullName,
        age: player.age,
        height: player.height,
        position: player.position,
        academyId: player.academyId,
        academy: player.Academy
      }
    });
  } catch (error) {
    console.error('Demo player creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create demo player', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
