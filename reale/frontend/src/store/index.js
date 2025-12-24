import { create } from 'zustand';

const useStore = create((set) => ({
  // Theme
  theme: 'dark',
  setTheme: (theme) => set({ theme }),

  // User
  user: null,
  setUser: (user) => set({ user }),

  // Chats
  chats: [],
  setChats: (chats) => set({ chats }),
  addChat: (chat) => set((state) => ({ chats: [...state.chats, chat] })),
  updateChat: (chatId, updates) => set((state) => ({
    chats: state.chats.map(chat =>
      chat.id === chatId ? { ...chat, ...updates } : chat
    )
  })),

  // Current chat
  currentChatId: null,
  setCurrentChatId: (chatId) => set({ currentChatId: chatId }),

  // Messages
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (messageId, updates) => set((state) => ({
    messages: state.messages.map(message =>
      message.id === messageId ? { ...message, ...updates } : message
    )
  })),

  // Servers
  servers: [],
  setServers: (servers) => set({ servers }),
  addServer: (server) => set((state) => ({ servers: [...state.servers, server] })),
  updateServer: (serverId, updates) => set((state) => ({
    servers: state.servers.map(server =>
      server.id === serverId ? { ...server, ...updates } : server
    )
  })),

  // Current server
  currentServerId: null,
  setCurrentServerId: (serverId) => set({ currentServerId: serverId }),

  // Online users
  onlineUsers: {},
  setOnlineUsers: (onlineUsers) => set({ onlineUsers }),
  updateOnlineUser: (userId, isOnline) => set((state) => ({
    onlineUsers: { ...state.onlineUsers, [userId]: isOnline }
  })),

  // Typing indicators
  typingUsers: {},
  setTypingUsers: (typingUsers) => set({ typingUsers }),
  updateTypingUser: (userId, isTyping) => set((state) => ({
    typingUsers: { ...state.typingUsers, [userId]: isTyping }
  })),

  // Reset store
  reset: () => set({
    theme: 'dark',
    user: null,
    chats: [],
    currentChatId: null,
    messages: [],
    servers: [],
    currentServerId: null,
    onlineUsers: {},
    typingUsers: {}
  })
}));

export { useStore };
