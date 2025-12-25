const { prisma } = require('../config/database');
const { getRedisClient } = require('../config/redis');
const { io } = require('../index');

const createChat = async (req, res) => {
  try {
    const { userId, name, isGroup, memberIds } = req.body;

    if (isGroup) {
      // Create group chat
      const chat = await prisma.chat.create({
        data: {
          name,
          isGroup: true,
          creatorId: req.user.id,
          members: {
            create: [
              { userId: req.user.id, role: 'ADMIN' },
              ...memberIds.map(id => ({ userId: id, role: 'MEMBER' }))
            ]
          }
        },
        include: {
          members: true
        }
      });

      res.status(201).json(chat);
    } else {
      // Create private chat
      const existingChat = await prisma.chat.findFirst({
        where: {
          isGroup: false,
          members: {
            every: {
              userId: {
                in: [req.user.id, userId]
              }
            }
          }
        },
        include: {
          members: true
        }
      });

      if (existingChat) {
        return res.json(existingChat);
      }

      const chat = await prisma.chat.create({
        data: {
          isGroup: false,
          members: {
            create: [
              { userId: req.user.id, role: 'MEMBER' },
              { userId: userId, role: 'MEMBER' }
            ]
          }
        },
        include: {
          members: true
        }
      });

      res.status(201).json(chat);
    }
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserChats = async (req, res) => {
  try {
    const chats = await prisma.chat.findMany({
      where: {
        members: {
          some: {
            userId: req.user.id
          }
        }
      },
      include: {
        members: {
          include: {
            user: true
          }
        },
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });

    res.json(chats);
  } catch (error) {
    console.error('Get user chats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getChatDetails = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        members: {
          include: {
            user: true
          }
        },
        pinnedMessage: true
      }
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Check if user is member of chat
    const isMember = chat.members.some(member => member.userId === req.user.id);
    if (!isMember) {
      return res.status(403).json({ error: 'Not a member of this chat' });
    }

    res.json(chat);
  } catch (error) {
    console.error('Get chat details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, replyToId, fileUrl } = req.body;

    // Check if user is member of chat
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        members: true
      }
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const isMember = chat.members.some(member => member.userId === req.user.id);
    if (!isMember) {
      return res.status(403).json({ error: 'Not a member of this chat' });
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId: req.user.id,
        chatId,
        replyToId,
        fileUrl
      },
      include: {
        sender: true,
        replyTo: true
      }
    });

    // Emit message to chat room
    io.to(`chat_${chatId}`).emit('new_message', message);

    // Update last message in chat
    await prisma.chat.update({
      where: { id: chatId },
      data: {
        lastMessageId: message.id,
        lastMessageAt: new Date()
      }
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { limit = 50, before } = req.query;

    // Check if user is member of chat
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        members: true
      }
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const isMember = chat.members.some(member => member.userId === req.user.id);
    if (!isMember) {
      return res.status(403).json({ error: 'Not a member of this chat' });
    }

    const messages = await prisma.message.findMany({
      where: {
        chatId,
        ...(before && { createdAt: { lt: new Date(before) } })
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: parseInt(limit),
      include: {
        sender: true,
        replyTo: true,
        reactions: true
      }
    });

    res.json(messages.reverse());
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const editMessage = async (req, res) => {
  try {
    const { chatId, messageId } = req.params;
    const { content } = req.body;

    const message = await prisma.message.findUnique({
      where: { id: messageId }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.senderId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to edit this message' });
    }

    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: {
        content,
        edited: true
      },
      include: {
        sender: true,
        replyTo: true,
        reactions: true
      }
    });

    // Emit edited message to chat room
    io.to(`chat_${chatId}`).emit('message_edited', updatedMessage);

    res.json(updatedMessage);
  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { chatId, messageId } = req.params;

    const message = await prisma.message.findUnique({
      where: { id: messageId }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.senderId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this message' });
    }

    const deletedMessage = await prisma.message.update({
      where: { id: messageId },
      data: {
        content: '[message deleted]',
        deleted: true
      },
      include: {
        sender: true
      }
    });

    // Emit deleted message to chat room
    io.to(`chat_${chatId}`).emit('message_deleted', deletedMessage);

    res.json(deletedMessage);
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addReaction = async (req, res) => {
  try {
    const { chatId, messageId } = req.params;
    const { emoji } = req.body;

    const existingReaction = await prisma.reaction.findFirst({
      where: {
        messageId,
        userId: req.user.id,
        emoji
      }
    });

    if (existingReaction) {
      return res.status(400).json({ error: 'Reaction already exists' });
    }

    const reaction = await prisma.reaction.create({
      data: {
        emoji,
        userId: req.user.id,
        messageId
      },
      include: {
        user: true
      }
    });

    // Emit reaction to chat room
    io.to(`chat_${chatId}`).emit('reaction_added', reaction);

    res.status(201).json(reaction);
  } catch (error) {
    console.error('Add reaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const removeReaction = async (req, res) => {
  try {
    const { chatId, messageId } = req.params;
    const { emoji } = req.body;

    const reaction = await prisma.reaction.findFirst({
      where: {
        messageId,
        userId: req.user.id,
        emoji
      }
    });

    if (!reaction) {
      return res.status(404).json({ error: 'Reaction not found' });
    }

    await prisma.reaction.delete({
      where: { id: reaction.id }
    });

    // Emit reaction removed to chat room
    io.to(`chat_${chatId}`).emit('reaction_removed', {
      messageId,
      emoji,
      userId: req.user.id
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Remove reaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const pinMessage = async (req, res) => {
  try {
    const { chatId, messageId } = req.params;

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        members: true
      }
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const isAdmin = chat.members.some(
      member => member.userId === req.user.id && member.role === 'ADMIN'
    );

    if (!isAdmin) {
      return res.status(403).json({ error: 'Only admins can pin messages' });
    }

    const message = await prisma.message.findUnique({
      where: { id: messageId }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    await prisma.chat.update({
      where: { id: chatId },
      data: {
        pinnedMessageId: messageId
      }
    });

    // Emit pin message to chat room
    io.to(`chat_${chatId}`).emit('message_pinned', message);

    res.json({ success: true });
  } catch (error) {
    console.error('Pin message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const unpinMessage = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        members: true
      }
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const isAdmin = chat.members.some(
      member => member.userId === req.user.id && member.role === 'ADMIN'
    );

    if (!isAdmin) {
      return res.status(403).json({ error: 'Only admins can unpin messages' });
    }

    await prisma.chat.update({
      where: { id: chatId },
      data: {
        pinnedMessageId: null
      }
    });

    // Emit unpin message to chat room
    io.to(`chat_${chatId}`).emit('message_unpinned');

    res.json({ success: true });
  } catch (error) {
    console.error('Unpin message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createChat,
  getUserChats,
  getChatDetails,
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
  addReaction,
  removeReaction,
  pinMessage,
  unpinMessage
};
