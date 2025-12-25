import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthProvider';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState({});

  useEffect(() => {
    if (!token || !user) return;

    // Connect to socket server
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      auth: {
        token
      },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    // Connection events
    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Typing indicators
    newSocket.on('user_typing', ({ userId, isTyping }) => {
      setTypingUsers(prev => ({
        ...prev,
        [userId]: isTyping
      }));
    });

    // Online status updates
    newSocket.on('user_online', ({ userId, isOnline }) => {
      setOnlineUsers(prev => ({
        ...prev,
        [userId]: isOnline
      }));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [token, user]);

  const joinChat = (chatId) => {
    if (socket && isConnected) {
      socket.emit('join_chat', chatId);
    }
  };

  const leaveChat = (chatId) => {
    if (socket && isConnected) {
      socket.emit('leave_chat', chatId);
    }
  };

  const sendTypingIndicator = (chatId, isTyping) => {
    if (socket && isConnected) {
      socket.emit('typing', { chatId, isTyping });
    }
  };

  return (
    <SocketContext.Provider value={{
      socket,
      isConnected,
      typingUsers,
      onlineUsers,
      joinChat,
      leaveChat,
      sendTypingIndicator
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
