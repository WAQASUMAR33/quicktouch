import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';
import jwt from 'jsonwebtoken';

// Helper function to get user from JWT token
async function getUserFromToken(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');
    return decoded;
  } catch (error) {
    return null;
  }
}

// GET /api/player-comparison - Get all comparisons made by a scout
export async function GET(request) {
  try {
    const user = await getUserFromToken(request);
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only scouts can access comparisons
    if (user.role !== 'scout') {
      return NextResponse.json({ error: 'Access denied. Scouts only.' }, { status: 403 });
    }

    const comparisons = await prisma.playerComparison.findMany({
      where: { scoutId: user.userId },
      include: {
        player1: {
          select: {
            id: true,
            fullName: true,
            age: true,
            height: true,
            position: true,
            playerStats: {
              select: {
                goals: true,
                assists: true,
                minutesPlayed: true
              }
            }
          }
        },
        player2: {
          select: {
            id: true,
            fullName: true,
            age: true,
            height: true,
            position: true,
            playerStats: {
              select: {
                goals: true,
                assists: true,
                minutesPlayed: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ comparisons });
  } catch (error) {
    console.error('Error fetching player comparisons:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/player-comparison - Create a new player comparison
export async function POST(request) {
  try {
    const user = await getUserFromToken(request);
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only scouts can create comparisons
    if (user.role !== 'scout') {
      return NextResponse.json({ error: 'Access denied. Scouts only.' }, { status: 403 });
    }

    const { player1Id, player2Id, notes } = await request.json();

    if (!player1Id || !player2Id) {
      return NextResponse.json({ error: 'Both player IDs are required' }, { status: 400 });
    }

    if (player1Id === player2Id) {
      return NextResponse.json({ error: 'Cannot compare a player with themselves' }, { status: 400 });
    }

    // Get player data for comparison
    const [player1, player2] = await Promise.all([
      prisma.player.findUnique({
        where: { id: player1Id },
        include: {
          playerStats: true,
          advancedStats: true,
          feedback: {
            include: {
              coach: {
                select: { fullName: true }
              }
            }
          }
        }
      }),
      prisma.player.findUnique({
        where: { id: player2Id },
        include: {
          playerStats: true,
          advancedStats: true,
          feedback: {
            include: {
              coach: {
                select: { fullName: true }
              }
            }
          }
        }
      })
    ]);

    if (!player1 || !player2) {
      return NextResponse.json({ error: 'One or both players not found' }, { status: 404 });
    }

    // Calculate comparison data
    const comparisonData = {
      player1: {
        id: player1.id,
        name: player1.fullName,
        age: player1.age,
        height: player1.height,
        position: player1.position,
        totalGoals: player1.playerStats.reduce((sum, stat) => sum + stat.goals, 0),
        totalAssists: player1.playerStats.reduce((sum, stat) => sum + stat.assists, 0),
        totalMinutes: player1.playerStats.reduce((sum, stat) => sum + stat.minutesPlayed, 0),
        averageRating: player1.feedback.length > 0 
          ? player1.feedback.reduce((sum, feedback) => sum + feedback.rating, 0) / player1.feedback.length 
          : 0,
        passAccuracy: player1.advancedStats.length > 0 
          ? player1.advancedStats.reduce((sum, stat) => sum + stat.passAccuracy, 0) / player1.advancedStats.length 
          : 0,
        distanceCovered: player1.advancedStats.length > 0 
          ? player1.advancedStats.reduce((sum, stat) => sum + stat.distanceCovered, 0) / player1.advancedStats.length 
          : 0
      },
      player2: {
        id: player2.id,
        name: player2.fullName,
        age: player2.age,
        height: player2.height,
        position: player2.position,
        totalGoals: player2.playerStats.reduce((sum, stat) => sum + stat.goals, 0),
        totalAssists: player2.playerStats.reduce((sum, stat) => sum + stat.assists, 0),
        totalMinutes: player2.playerStats.reduce((sum, stat) => sum + stat.minutesPlayed, 0),
        averageRating: player2.feedback.length > 0 
          ? player2.feedback.reduce((sum, feedback) => sum + feedback.rating, 0) / player2.feedback.length 
          : 0,
        passAccuracy: player2.advancedStats.length > 0 
          ? player2.advancedStats.reduce((sum, stat) => sum + stat.passAccuracy, 0) / player2.advancedStats.length 
          : 0,
        distanceCovered: player2.advancedStats.length > 0 
          ? player2.advancedStats.reduce((sum, stat) => sum + stat.distanceCovered, 0) / player2.advancedStats.length 
          : 0
      },
      comparison: {
        goalsDifference: player1.playerStats.reduce((sum, stat) => sum + stat.goals, 0) - 
                        player2.playerStats.reduce((sum, stat) => sum + stat.goals, 0),
        assistsDifference: player1.playerStats.reduce((sum, stat) => sum + stat.assists, 0) - 
                          player2.playerStats.reduce((sum, stat) => sum + stat.assists, 0),
        ratingDifference: (player1.feedback.length > 0 
          ? player1.feedback.reduce((sum, feedback) => sum + feedback.rating, 0) / player1.feedback.length 
          : 0) - (player2.feedback.length > 0 
          ? player2.feedback.reduce((sum, feedback) => sum + feedback.rating, 0) / player2.feedback.length 
          : 0)
      }
    };

    const comparison = await prisma.playerComparison.create({
      data: {
        scoutId: user.userId,
        player1Id,
        player2Id,
        comparisonData,
        notes
      },
      include: {
        player1: {
          select: {
            id: true,
            fullName: true,
            age: true,
            height: true,
            position: true
          }
        },
        player2: {
          select: {
            id: true,
            fullName: true,
            age: true,
            height: true,
            position: true
          }
        }
      }
    });

    return NextResponse.json({ comparison });
  } catch (error) {
    console.error('Error creating player comparison:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}