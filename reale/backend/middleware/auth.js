const jwt = require('jsonwebtoken');
const { getRedisClient } = require('../config/redis');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication required'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
};

const checkOnlineStatus = async (userId) => {
  const redisClient = getRedisClient();
  const isOnline = await redisClient.get(`user_online_${userId}`);
  return !!isOnline;
};

const setOnlineStatus = async (userId, isOnline) => {
  const redisClient = getRedisClient();
  if (isOnline) {
    await redisClient.set(`user_online_${userId}`, '1', 'EX', 300); // 5 minutes
  } else {
    await redisClient.del(`user_online_${userId}`);
  }
};

module.exports = {
  authenticate,
  authenticateSocket,
  checkOnlineStatus,
  setOnlineStatus
};
