import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
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

// POST /api/ai-insights/video-analysis - Process video for AI analysis
export async function POST(request) {
  try {
    const user = await getUserFromToken(request);
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only coaches and admins can upload videos for analysis
    if (!['admin', 'coach'].includes(user.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { playerId, videoUrl } = await request.json();

    if (!playerId || !videoUrl) {
      return NextResponse.json({ error: 'Player ID and video URL are required' }, { status: 400 });
    }

    // Verify player exists
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      select: { id: true, fullName: true }
    });

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // Create video analysis record
    const videoAnalysis = await prisma.videoAnalysis.create({
      data: {
        playerId,
        videoUrl,
        analysisData: {
          status: 'processing',
          uploadedBy: user.userId,
          uploadedAt: new Date().toISOString()
        }
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

    // TODO: In a real implementation, you would:
    // 1. Send video to AI processing service
    // 2. Process video for dribbling speed, goal angles, reaction times
    // 3. Update analysisData with results
    // 4. Create AIInsight records based on analysis

    // For now, simulate AI processing
    setTimeout(async () => {
      try {
        const mockAnalysisData = {
          status: 'completed',
          uploadedBy: user.userId,
          uploadedAt: videoAnalysis.createdAt.toISOString(),
          processedAt: new Date().toISOString(),
          metrics: {
            dribblingSpeed: Math.random() * 10 + 5, // 5-15 m/s
            averageGoalAngle: Math.random() * 45 + 15, // 15-60 degrees
            reactionTime: Math.random() * 0.5 + 0.2, // 0.2-0.7 seconds
            ballControl: Math.random() * 2 + 3, // 3-5 rating
            shootingAccuracy: Math.random() * 30 + 60, // 60-90%
            movementEfficiency: Math.random() * 20 + 70 // 70-90%
          },
          recommendations: [
            "Focus on improving reaction time during defensive situations",
            "Work on ball control in tight spaces",
            "Practice shooting from different angles"
          ]
        };

        await prisma.videoAnalysis.update({
          where: { id: videoAnalysis.id },
          data: { 
            analysisData: mockAnalysisData,
            processedAt: new Date()
          }
        });

        // Create AI insight based on analysis
        await prisma.aIInsight.create({
          data: {
            playerId,
            type: 'video_analysis',
            data: {
              videoAnalysisId: videoAnalysis.id,
              keyFindings: mockAnalysisData.metrics,
              recommendations: mockAnalysisData.recommendations
            },
            confidence: 0.85
          }
        });

        // Notify player about completed analysis
        const playerUser = await prisma.player.findUnique({
          where: { id: playerId },
          select: { userId: true }
        });

        if (playerUser) {
          await prisma.notification.create({
            data: {
              userId: playerUser.userId,
              type: 'milestone',
              title: 'Video Analysis Complete',
              message: `Your video analysis is ready with new insights and recommendations`,
              relatedId: videoAnalysis.id
            }
          });
        }
      } catch (error) {
        console.error('Error in simulated AI processing:', error);
      }
    }, 5000); // Simulate 5-second processing time

    return NextResponse.json({ 
      videoAnalysis,
      message: 'Video uploaded for analysis. Results will be available shortly.'
    });
  } catch (error) {
    console.error('Error processing video analysis:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// GET /api/ai-insights/video-analysis - Get video analyses for a player
export async function GET(request) {
  try {
    const user = await getUserFromToken(request);
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');

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

    const hasAccess = 
      user.role === 'admin' ||
      user.role === 'coach' ||
      user.role === 'scout' ||
      (user.role === 'player' && player.userId === user.userId) ||
      (user.role === 'parent' && player.userId === user.userId);

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const videoAnalyses = await prisma.videoAnalysis.findMany({
      where: { playerId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ videoAnalyses });
  } catch (error) {
    console.error('Error fetching video analyses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}