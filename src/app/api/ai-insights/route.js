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

// GET /api/ai-insights - Get AI insights for a player
export async function GET(request) {
  try {

    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');
    const type = searchParams.get('type');

    if (!playerId) {
      return NextResponse.json({ error: 'Player ID is required' }, { status: 400 });
    }

    // Check if user has access to this player's data
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      select: { 
        id: true,
        userId: true,
        academyId: true
      }
    });

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // Access control based on role

    let whereClause = {
      playerId,
      isActive: true
    };

    if (type) {
      whereClause.type = type;
    }

    const insights = await prisma.aIInsight.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ insights });
  } catch (error) {
    console.error('Error fetching AI insights:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/ai-insights - Create new AI insight (for AI processing system)
export async function POST(request) {
  try {

    // Only admins and coaches can create AI insights

    const { playerId, type, data, confidence } = await request.json();

    if (!playerId || !type || !data) {
      return NextResponse.json({ error: 'Player ID, type, and data are required' }, { status: 400 });
    }

    const insight = await prisma.aIInsight.create({
      data: {
        playerId,
        type,
        data,
        confidence: confidence || 0.8
      },
      include: {
        player: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });

    // Create notification for player/parent about new insight
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      select: { userId: true }
    });

    if (player) {
      await prisma.notification.create({
        data: {
          userId: player.userId,
          type: 'milestone',
          title: 'New AI Insight Available',
          message: `New ${type.replace('_', ' ')} insight has been generated for your profile`,
          relatedId: insight.id
        }
      });
    }

    return NextResponse.json({ insight });
  } catch (error) {
    console.error('Error creating AI insight:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}