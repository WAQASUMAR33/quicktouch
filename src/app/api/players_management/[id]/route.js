import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// GET: Fetch a single player by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Player ID is required" },
        { status: 400 }
      );
    }

    const player = await prisma.player.findUnique({
      where: { id: id },
      include: {
        Academy: {
          select: {
            id: true,
            name: true,
            location: true
          }
        },
        PlayerStats: {
          select: {
            id: true,
            goals: true,
            assists: true,
            minutesPlayed: true,
            date: true,
            createdAt: true
          },
          orderBy: {
            date: 'desc'
          }
        },
        Feedback: {
          select: {
            id: true,
            rating: true,
            notes: true,
            date: true,
            createdAt: true,
            User: {
              select: {
                fullName: true,
                role: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
    });

    if (!player) {
      return NextResponse.json(
        { error: "Player not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ player }, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch player", details: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update a player by ID
export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Player ID is required" },
        { status: 400 }
      );
    }

    // Parse JSON with error handling
    let data;
    try {
      data = await request.json();
    } catch (jsonError) {
      console.error("JSON Parse Error:", jsonError.message);
      return NextResponse.json(
        { error: "Invalid JSON payload", details: jsonError.message },
        { status: 400 }
      );
    }

    // Validate that at least one field is provided
    if (
      !data.fullName &&
      !data.age &&
      !data.height &&
      !data.position &&
      !data.highlightReels &&
      !data.academyId
    ) {
      return NextResponse.json(
        { error: "At least one field must be provided for update" },
        { status: 400 }
      );
    }

    // Validate age if provided
    if (data.age !== undefined) {
      const age = parseInt(data.age);
      if (isNaN(age) || age < 0 || age > 100) {
        return NextResponse.json(
          { error: "Invalid age: must be a number between 0 and 100" },
          { status: 400 }
        );
      }
    }

    // Validate height if provided
    if (data.height !== undefined) {
      const height = parseFloat(data.height);
      if (isNaN(height) || height < 0 || height > 300) {
        return NextResponse.json(
          { error: "Invalid height: must be a number between 0 and 300 cm" },
          { status: 400 }
        );
      }
    }

    // Update player
    const player = await prisma.player.update({
      where: { id: id },
      data: {
        fullName: data.fullName,
        age: data.age,
        height: data.height,
        position: data.position,
        highlightReels: data.highlightReels,
        academyId: data.academyId,
        updatedAt: new Date(),
      },
      include: {
        Academy: {
          select: {
            id: true,
            name: true,
            location: true
          }
        }
      }
    });

    return NextResponse.json(
      {
        player,
        message: "Player updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT Error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Player not found" },
        { status: 404 }
      );
    }
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Invalid academy ID" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update player", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a player by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Player ID is required" },
        { status: 400 }
      );
    }

    // Check if player exists first
    const player = await prisma.player.findUnique({
      where: { id: id },
      include: {
        PlayerStats: true,
        Feedback: true,
        Attendance: true,
        ScoutFavorite: true
      }
    });

    if (!player) {
      return NextResponse.json(
        { error: "Player not found" },
        { status: 404 }
      );
    }

    // Check if player has associated data
    if (player.PlayerStats.length > 0 || player.Feedback.length > 0 || 
        player.Attendance.length > 0 || player.ScoutFavorite.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete player with associated data (stats, feedback, attendance, or scout favorites)" },
        { status: 400 }
      );
    }

    await prisma.player.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: "Player deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Player not found" },
        { status: 404 }
      );
    }
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Cannot delete player with associated data" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete player", details: error.message },
      { status: 500 }
    );
  }
}