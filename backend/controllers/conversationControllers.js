import prisma from '../db.js';
export const getMyConversations = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
          },
        },

        UserConversation: {
          where: {
            userId: userId,
          },
          select: {
            unreadCount: true,
            userId: true,
          },
        },
      },
    });
    return res.status(200).json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getMessages = async (req, res) => {
  const currentUserId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 9;
  const conversationId = req.params.conversationId;

  if (!currentUserId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    if (!messages) {
      return res.status(404).json({ message: 'Messages not found' });
    }

    return res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createMessage = async (req, res) => {
  const fromId = req.user?.id;
  const { conversationId } = req.params;
  const { text, toId } = req.body;

  if (!fromId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!text) {
    return res.status(400).json({ message: 'text is required' });
  }

  try {
    let conversation;
    let isNewConversation = false;

    if (!conversationId || conversationId === 'new') {
      // Check if a conversation already exists
      conversation = await prisma.conversation.findFirst({
        where: {
          AND: [
            { users: { some: { id: fromId } } },
            { users: { some: { id: toId } } },
          ],
        },
        include: { users: true },
      });

      if (!conversation) {
        // Create a new conversation
        conversation = await prisma.conversation.create({
          data: {
            users: {
              connect: [{ id: fromId }, { id: toId }],
            },
          },
          include: {
            users: {
              select: { id: true, name: true },
            },
          },
        });

        // Create UserConversation entries for both users
        await prisma.userConversation.createMany({
          data: [
            { userId: fromId, conversationId: conversation.id },
            { userId: toId, conversationId: conversation.id },
          ],
        });

        isNewConversation = true;
      }
    } else {
      // Find existing conversation
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          users: {
            select: { id: true, name: true },
          },
        },
      });

      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }
    }

    const newMessage = await prisma.message.create({
      data: {
        text,
        author: { connect: { id: fromId } },
        conversation: { connect: { id: conversation.id } },
      },
    });

    await prisma.userConversation.updateMany({
      where: {
        conversationId: conversation.id,
        userId: { not: fromId },
      },
      data: {
        unreadCount: { increment: 1 },
      },
    });

    return res.status(201).json({
      message: newMessage,
      isNewConversation,
      conversation,
    });
  } catch (error) {
    console.error('Error creating message:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const checkExistingConversation = async (req, res) => {
  const userId = req.user?.id;
  const otherUserId = req.params.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { users: { some: { id: userId } } },
          { users: { some: { id: otherUserId } } },
        ],
      },
    });

    if (conversation) {
      return res.status(200).json({ id: conversation.id });
    } else {
      return res
        .status(404)
        .json({ message: 'No existing conversation found' });
    }
  } catch (error) {
    console.error('Error checking existing conversation:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const openConversation = async (req, res) => {
  const userId = req.user?.id;
  const { conversationId } = req.params;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Reset unread count for the current user
    await prisma.userConversation.update({
      where: {
        userId_conversationId: {
          userId,
          conversationId,
        },
      },
      data: {
        unreadCount: 0,
      },
    });

    // Return updated conversation and messages
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { messages: true, users: true },
    });

    return res.status(200).json(conversation);
  } catch (error) {
    console.error('Error opening conversation:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
