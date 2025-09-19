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

// GET /api/messaging/conversations - Get all conversations for a user
export async function GET(request) {
  try {

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { participant1Id: user.userId },
          { participant2Id: user.userId }
        ]
      },
      include: {
        participant1: {
          select: { id: true, fullName: true, role: true, profilePhoto: true }
        },
        participant2: {
          select: { id: true, fullName: true, role: true, profilePhoto: true }
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: { id: true, fullName: true, profilePhoto: true }
            }
          }
        }
      },
      orderBy: { lastMessageAt: 'desc' }
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/messaging/conversations - Create a new conversation
export async function POST(request) {
  try {

    const { participantId } = await request.json();

    if (!participantId) {
      return NextResponse.json({ error: 'Participant ID is required' }, { status: 400 });
    }

    // Check if conversation already exists
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          {
            participant1Id: user.userId,
            participant2Id: participantId
          },
          {
            participant1Id: participantId,
            participant2Id: user.userId
          }
        ]
      }
    });

    if (existingConversation) {
      return NextResponse.json({ conversation: existingConversation });
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        participant1Id: user.userId,
        participant2Id: participantId,
        lastMessageAt: new Date()
      },
      include: {
        participant1: {
          select: { id: true, fullName: true, role: true, profilePhoto: true }
        },
        participant2: {
          select: { id: true, fullName: true, role: true, profilePhoto: true }
        }
      }
    });

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
