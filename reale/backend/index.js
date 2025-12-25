require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const serverRoutes = require('./routes/server');
const { authenticateSocket } = require('./middleware/auth');
const { setupDatabase } = require('./config/database');
const { setupRedis } = require('./config/redis');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Database setup
setupDatabase();
setupRedis();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/server', serverRoutes);

// Socket.IO connection
io.use(authenticateSocket);

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userId}`);

  socket.join(`user_${socket.userId}`);

  socket.on('join_chat', (chatId) => {
    socket.join(`chat_${chatId}`);
  });

  socket.on('leave_chat', (chatId) => {
    socket.leave(`chat_${chatId}`);
  });

  socket.on('typing', ({ chatId, isTyping }) => {
    socket.to(`chat_${chatId}`).emit('user_typing', {
      userId: socket.userId,
      isTyping
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };
