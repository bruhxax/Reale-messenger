const { prisma } = require('../config/database');
const { io } = require('../index');

const createServer = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    const server = await prisma.server.create({
      data: {
        name,
        description,
        icon,
        creatorId: req.user.id,
        members: {
          create: {
            userId: req.user.id,
            role: 'OWNER'
          }
        },
        channels: {
          create: [
            {
              name: 'general',
              type: 'TEXT',
              position: 0
            },
            {
              name: 'voice-chat',
              type: 'VOICE',
              position: 1
            }
          ]
        },
        roles: {
          create: [
            {
              name: 'Admin',
              color: '#FFD700',
              permissions: ['MANAGE_SERVER', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
              position: 1
            },
            {
              name: 'Moderator',
              color: '#00FF00',
              permissions: ['MANAGE_CHANNELS', 'KICK_MEMBERS', 'BAN_MEMBERS'],
              position: 2
            },
            {
              name: 'Member',
              color: '#808080',
              permissions: [],
              position: 3
            }
          ]
        }
      },
      include: {
        members: true,
        channels: true,
        roles: true
      }
    });

    res.status(201).json(server);
  } catch (error) {
    console.error('Create server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserServers = async (req, res) => {
  try {
    const servers = await prisma.server.findMany({
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
        channels: true
      }
    });

    res.json(servers);
  } catch (error) {
    console.error('Get user servers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getServerDetails = async (req, res) => {
  try {
    const { serverId } = req.params;

    const server = await prisma.server.findUnique({
      where: { id: serverId },
      include: {
        members: {
          include: {
            user: true,
            role: true
          }
        },
        channels: true,
        roles: true
      }
    });

    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    // Check if user is member of server
    const isMember = server.members.some(member => member.userId === req.user.id);
    if (!isMember) {
      return res.status(403).json({ error: 'Not a member of this server' });
    }

    res.json(server);
  } catch (error) {
    console.error('Get server details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createChannel = async (req, res) => {
  try {
    const { serverId } = req.params;
    const { name, type, position } = req.body;

    const server = await prisma.server.findUnique({
      where: { id: serverId },
      include: {
        members: true
      }
    });

    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    const isAdmin = server.members.some(
      member => member.userId === req.user.id && ['OWNER', 'ADMIN'].includes(member.role)
    );

    if (!isAdmin) {
      return res.status(403).json({ error: 'Only admins can create channels' });
    }

    const channel = await prisma.channel.create({
      data: {
        name,
        type,
        position,
        serverId
      }
    });

    // Emit new channel to server
    io.to(`server_${serverId}`).emit('new_channel', channel);

    res.status(201).json(channel);
  } catch (error) {
    console.error('Create channel error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getServerChannels = async (req, res) => {
  try {
    const { serverId } = req.params;

    const server = await prisma.server.findUnique({
      where: { id: serverId },
      include: {
        members: true,
        channels: true
      }
    });

    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    // Check if user is member of server
    const isMember = server.members.some(member => member.userId === req.user.id);
    if (!isMember) {
      return res.status(403).json({ error: 'Not a member of this server' });
    }

    res.json(server.channels);
  } catch (error) {
    console.error('Get server channels error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addServerMember = async (req, res) => {
  try {
    const { serverId } = req.params;
    const { userId, roleId } = req.body;

    const server = await prisma.server.findUnique({
      where: { id: serverId },
      include: {
        members: true
      }
    });

    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    const isAdmin = server.members.some(
      member => member.userId === req.user.id && ['OWNER', 'ADMIN'].includes(member.role)
    );

    if (!isAdmin) {
      return res.status(403).json({ error: 'Only admins can add members' });
    }

    const member = await prisma.serverMember.create({
      data: {
        userId,
        serverId,
        roleId
      },
      include: {
        user: true,
        role: true
      }
    });

    // Emit new member to server
    io.to(`server_${serverId}`).emit('new_member', member);

    res.status(201).json(member);
  } catch (error) {
    console.error('Add server member error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const removeServerMember = async (req, res) => {
  try {
    const { serverId, userId } = req.params;

    const server = await prisma.server.findUnique({
      where: { id: serverId },
      include: {
        members: true
      }
    });

    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    const isAdmin = server.members.some(
      member => member.userId === req.user.id && ['OWNER', 'ADMIN'].includes(member.role)
    );

    if (!isAdmin) {
      return res.status(403).json({ error: 'Only admins can remove members' });
    }

    // Cannot remove owner
    const isOwner = server.members.some(
      member => member.userId === userId && member.role === 'OWNER'
    );

    if (isOwner) {
      return res.status(403).json({ error: 'Cannot remove server owner' });
    }

    await prisma.serverMember.delete({
      where: {
        userId_serverId: {
          userId,
          serverId
        }
      }
    });

    // Emit member removed to server
    io.to(`server_${serverId}`).emit('member_removed', {
      userId,
      serverId
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Remove server member error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createRole = async (req, res) => {
  try {
    const { serverId } = req.params;
    const { name, color, permissions, position } = req.body;

    const server = await prisma.server.findUnique({
      where: { id: serverId },
      include: {
        members: true
      }
    });

    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    const isAdmin = server.members.some(
      member => member.userId === req.user.id && ['OWNER', 'ADMIN'].includes(member.role)
    );

    if (!isAdmin) {
      return res.status(403).json({ error: 'Only admins can create roles' });
    }

    const role = await prisma.role.create({
      data: {
        name,
        color,
        permissions,
        position,
        serverId
      }
    });

    res.status(201).json(role);
  } catch (error) {
    console.error('Create role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateRole = async (req, res) => {
  try {
    const { serverId, roleId } = req.params;
    const { name, color, permissions, position } = req.body;

    const server = await prisma.server.findUnique({
      where: { id: serverId },
      include: {
        members: true
      }
    });

    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    const isAdmin = server.members.some(
      member => member.userId === req.user.id && ['OWNER', 'ADMIN'].includes(member.role)
    );

    if (!isAdmin) {
      return res.status(403).json({ error: 'Only admins can update roles' });
    }

    const role = await prisma.role.update({
      where: { id: roleId },
      data: {
        name,
        color,
        permissions,
        position
      }
    });

    res.json(role);
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteRole = async (req, res) => {
  try {
    const { serverId, roleId } = req.params;

    const server = await prisma.server.findUnique({
      where: { id: serverId },
      include: {
        members: true
      }
    });

    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    const isAdmin = server.members.some(
      member => member.userId === req.user.id && ['OWNER', 'ADMIN'].includes(member.role)
    );

    if (!isAdmin) {
      return res.status(403).json({ error: 'Only admins can delete roles' });
    }

    // Cannot delete default roles
    const defaultRoles = ['OWNER', 'ADMIN', 'MODERATOR', 'MEMBER'];
    const role = await prisma.role.findUnique({
      where: { id: roleId }
    });

    if (defaultRoles.includes(role.name)) {
      return res.status(403).json({ error: 'Cannot delete default roles' });
    }

    await prisma.role.delete({
      where: { id: roleId }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createServer,
  getUserServers,
  getServerDetails,
  createChannel,
  getServerChannels,
  addServerMember,
  removeServerMember,
  createRole,
  updateRole,
  deleteRole
};
