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

// GET /api/advanced-stats - Get advanced stats for a player
export async function GET(request) {
  try {

    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');
    const matchId = searchParams.get('matchId');

    if (!playerId) {
      return NextResponse.json({ error: 'Player ID is required' }, { status: 400 });
    }

    // Check access permissions
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      select: { 
        id: true,
        userId: true
      }
    });

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    let whereClause = { playerId };

    if (matchId) {
      whereClause.matchId = matchId;
    }

    const advancedStats = await prisma.advancedPlayerStats.findMany({
      where: whereClause,
      include: {
        match: {
          select: {
            id: true,
            title: true,
            date: true,
            type: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate aggregated stats
    const aggregatedStats = {
      totalMatches: advancedStats.length,
      averagePassAccuracy: advancedStats.length > 0 
        ? advancedStats.reduce((sum, stat) => sum + stat.passAccuracy, 0) / advancedStats.length 
        : 0,
      totalDistanceCovered: advancedStats.reduce((sum, stat) => sum + stat.distanceCovered, 0),
      averageDistancePerMatch: advancedStats.length > 0 
        ? advancedStats.reduce((sum, stat) => sum + stat.distanceCovered, 0) / advancedStats.length 
        : 0,
      totalSprints: advancedStats.reduce((sum, stat) => sum + stat.sprintCount, 0),
      averageSprintsPerMatch: advancedStats.length > 0 
        ? advancedStats.reduce((sum, stat) => sum + stat.sprintCount, 0) / advancedStats.length 
        : 0
    };

    return NextResponse.json({ 
      advancedStats,
      aggregatedStats
    });
  } catch (error) {
    console.error('Error fetching advanced stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/advanced-stats - Create new advanced stats entry
export async function POST(request) {
  try {

    // Only coaches and admins can create advanced stats

    const { 
      playerId, 
      matchId, 
      passAccuracy, 
      distanceCovered, 
      sprintCount, 
      heatmapData 
    } = await request.json();

    if (!playerId || !matchId) {
      return NextResponse.json({ error: 'Player ID and Match ID are required' }, { status: 400 });
    }

    // Verify player and match exist
    const [player, match] = await Promise.all([
      prisma.player.findUnique({
        where: { id: playerId },
        select: { id: true, fullName: true }
      }),
      prisma.match.findUnique({
        where: { id: matchId },
        select: { id: true, title: true }
      })
    ]);

    if (!player || !match) {
      return NextResponse.json({ error: 'Player or match not found' }, { status: 404 });
    }

    const advancedStats = await prisma.advancedPlayerStats.create({
      data: {
        playerId,
        matchId,
        passAccuracy: passAccuracy || 0,
        distanceCovered: distanceCovered || 0,
        sprintCount: sprintCount || 0,
        heatmapData: heatmapData || {}
      },
      include: {
        player: {
          select: {
            id: true,
            fullName: true
          }
        },
        match: {
          select: {
            id: true,
            title: true,
            date: true
          }
        }
      }
    });

    return NextResponse.json({ advancedStats });
  } catch (error) {
    console.error('Error creating advanced stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}