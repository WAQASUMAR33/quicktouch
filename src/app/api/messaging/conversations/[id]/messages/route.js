import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
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

// GET /api/messaging/conversations/[id]/messages - Get messages for a conversation
export async function GET(request, { params }) {
  try {
    const user = await getUserFromToken(request);
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: conversationId } = params;

    // Verify user is participant in conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { participant1Id: user.userId },
          { participant2Id: user.userId }
        ]
      }
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: { id: true, fullName: true, profilePhoto: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: user.userId },
        isRead: false
      },
      data: { isRead: true }
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/messaging/conversations/[id]/messages - Send a new message
export async function POST(request, { params }) {
  try {
    const user = await getUserFromToken(request);
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: conversationId } = params;
    const { content, messageType = 'text', mediaUrl } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    // Verify user is participant in conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { participant1Id: user.userId },
          { participant2Id: user.userId }
        ]
      }
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: user.userId,
        content,
        messageType,
        mediaUrl
      },
      include: {
        sender: {
          select: { id: true, fullName: true, profilePhoto: true }
        }
      }
    });

    // Update conversation last message time
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() }
    });

    // Create notification for recipient
    const recipientId = conversation.participant1Id === user.userId 
      ? conversation.participant2Id 
      : conversation.participant1Id;

    await prisma.notification.create({
      data: {
        userId: recipientId,
        type: 'message_received',
        title: 'New Message',
        message: `You have a new message from ${user.email}`,
        relatedId: message.id
      }
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}