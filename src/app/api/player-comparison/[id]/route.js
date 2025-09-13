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

// GET /api/player-comparison/[id] - Get specific comparison details
export async function GET(request, { params }) {
  try {
    const user = await getUserFromToken(request);
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const comparison = await prisma.playerComparison.findUnique({
      where: { id },
      include: {
        scout: {
          select: { id: true, fullName: true, role: true }
        },
        player1: {
          select: {
            id: true,
            fullName: true,
            age: true,
            height: true,
            position: true,
            highlightReels: true,
            playerStats: {
              include: {
                match: {
                  select: { title: true, date: true }
                }
              }
            },
            advancedStats: {
              include: {
                match: {
                  select: { title: true, date: true }
                }
              }
            },
            feedback: {
              include: {
                coach: {
                  select: { fullName: true }
                }
              },
              orderBy: { createdAt: 'desc' }
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
            highlightReels: true,
            playerStats: {
              include: {
                match: {
                  select: { title: true, date: true }
                }
              }
            },
            advancedStats: {
              include: {
                match: {
                  select: { title: true, date: true }
                }
              }
            },
            feedback: {
              include: {
                coach: {
                  select: { fullName: true }
                }
              },
              orderBy: { createdAt: 'desc' }
            }
          }
        }
      }
    });

    if (!comparison) {
      return NextResponse.json({ error: 'Comparison not found' }, { status: 404 });
    }

    // Check if user has access to this comparison
    const hasAccess = user.role === 'scout' && comparison.scoutId === user.userId ||
                     user.role === 'admin' ||
                     user.role === 'coach';

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ comparison });
  } catch (error) {
    console.error('Error fetching comparison:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// PUT /api/player-comparison/[id] - Update comparison notes
export async function PUT(request, { params }) {
  try {
    const user = await getUserFromToken(request);
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { notes } = await request.json();

    const comparison = await prisma.playerComparison.findUnique({
      where: { id },
      select: { scoutId: true }
    });

    if (!comparison) {
      return NextResponse.json({ error: 'Comparison not found' }, { status: 404 });
    }

    // Only the scout who created it or admin can update
    if (comparison.scoutId !== user.userId && user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const updatedComparison = await prisma.playerComparison.update({
      where: { id },
      data: { notes },
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

    return NextResponse.json({ comparison: updatedComparison });
  } catch (error) {
    console.error('Error updating comparison:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE /api/player-comparison/[id] - Delete comparison
export async function DELETE(request, { params }) {
  try {
    const user = await getUserFromToken(request);
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const comparison = await prisma.playerComparison.findUnique({
      where: { id },
      select: { scoutId: true }
    });

    if (!comparison) {
      return NextResponse.json({ error: 'Comparison not found' }, { status: 404 });
    }

    // Only the scout who created it or admin can delete
    if (comparison.scoutId !== user.userId && user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    await prisma.playerComparison.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Comparison deleted successfully' });
  } catch (error) {
    console.error('Error deleting comparison:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}