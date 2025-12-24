import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './AuthProvider';
import { useSocket } from './SocketProvider';
import { Send, Smile, Paperclip, Mic, MoreVertical, Reply, Edit, Trash, Pin, ThumbsUp } from 'lucide-react';

export default function ChatWindow() {
  const router = useRouter();
  const { user } = useAuth();
  const { socket, isConnected, typingUsers, sendTypingIndicator } = useSocket();
  const { chatId } = router.query;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [editMessageId, setEditMessageId] = useState(null);
  const [editMessageContent, setEditMessageContent] = useState('');
  const messagesEndRef = useRef(null);

  // Mock chat data - in real app this would come from API
  const [chat, setChat] = useState({
    id: chatId,
    name: 'John Doe',
    avatar: 'https://api.dicebear.com/6.x/initials/svg?seed=John',
    isGroup: false,
    members: [
      { id: '1', username: 'John Doe', avatar: 'https://api.dicebear.com/6.x/initials/svg?seed=John' },
      { id: '2', username: 'Current User', avatar: user?.avatar || 'https://api.dicebear.com/6.x/initials/svg?seed=User' }
    ],
    online: true
  });

  // Mock messages - in real app this would come from API
  useEffect(() => {
    if (chatId) {
      const mockMessages = [
        {
          id: '1',
          content: 'Hey, how are you?',
          senderId: '1',
          chatId: chatId,
          createdAt: '2023-05-15T10:30:00Z',
          edited: false,
          deleted: false,
          replyTo: null,
          reactions: [],
          fileUrl: null
        },
        {
          id: '2',
          content: 'I\'m good, thanks! How about you?',
          senderId: '2',
          chatId: chatId,
          createdAt: '2023-05-15T10:32:00Z',
          edited: false,
          deleted: false,
          replyTo: null,
          reactions: [],
          fileUrl: null
        },
        {
          id: '3',
          content: 'Doing great! Working on the Reale messenger project.',
          senderId: '1',
          chatId: chatId,
          createdAt: '2023-05-15T10:35:00Z',
          edited: false,
          deleted: false,
          replyTo: null,
          reactions: [],
          fileUrl: null
        },
        {
          id: '4',
          content: 'That sounds exciting! Let me know if you need any help.',
          senderId: '2',
          chatId: chatId,
          createdAt: '2023-05-15T10:37:00Z',
          edited: false,
          deleted: false,
          replyTo: null,
          reactions: [],
          fileUrl: null
        }
      ];
      setMessages(mockMessages);
    }
  }, [chatId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing indicator
  useEffect(() => {
    if (isTyping && isConnected) {
      const typingTimeout = setTimeout(() => {
        sendTypingIndicator(chatId, false);
        setIsTyping(false);
      }, 3000);

      return () => clearTimeout(typingTimeout);
    }
  }, [isTyping, isConnected, chatId, sendTypingIndicator]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !editMessageId) return;

    if (editMessageId) {
      // Edit existing message
      setMessages(prev => prev.map(msg =>
        msg.id === editMessageId
          ? { ...msg, content: editMessageContent, edited: true }
          : msg
      ));
      setEditMessageId(null);
      setEditMessageContent('');
    } else {
      // Send new message
      const newMsg = {
        id: Date.now().toString(),
        content: newMessage,
        senderId: user.id,
        chatId: chatId,
        createdAt: new Date().toISOString(),
        edited: false,
        deleted: false,
        replyTo: replyTo,
        reactions: [],
        fileUrl: null
      };

      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      setReplyTo(null);
    }
  };

  const handleReply = (message) => {
    setReplyTo(message);
  };

  const handleEdit = (message) => {
    setEditMessageId(message.id);
    setEditMessageContent(message.content);
  };

  const handleDelete = (messageId) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? { ...msg, content: '[message deleted]', deleted: true }
        : msg
    ));
  };

  const handleReaction = (messageId, emoji) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions.find(r => r.emoji === emoji && r.userId === user.id);
        let updatedReactions;

        if (existingReaction) {
          updatedReactions = msg.reactions.filter(r => !(r.emoji === emoji && r.userId === user.id));
        } else {
          updatedReactions = [...msg.reactions, {
            id: Date.now().toString(),
            emoji,
            userId: user.id,
            username: user.username
          }];
        }

        return { ...msg, reactions: updatedReactions };
      }
      return msg;
    }));
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isCurrentUser = (senderId) => senderId === user?.id;

  return (
    <div className="flex-1 flex flex-col bg-reale-darker">
      {/* Chat header */}
      <div className="p-4 border-b border-reale-gray flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={chat.avatar}
              alt={chat.name}
              className="w-10 h-10 rounded-full user-avatar"
            />
            {chat.online && (
              <div className="absolute -bottom-0 -right-0 w-3 h-3 bg-reale-yellow rounded-full border-2 border-reale-black"></div>
            )}
          </div>
          <div>
            <h2 className="font-medium">{chat.name}</h2>
            {typingUsers[chat.members.find(m => m.id !== user?.id)?.id] && (
              <p className="text-xs text-gray-400">typing...</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-reale-gray rounded-full">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${isCurrentUser(message.senderId) ? 'justify-end' : 'justify-start'}`}
          >
            <div className="max-w-xs lg:max-w-md">
              {/* Reply preview */}
              {message.replyTo && (
                <div className={`mb-1 p-2 rounded-reale-sm ${isCurrentUser(message.senderId) ? 'bg-reale-gray ml-2' : 'bg-reale-light-gray mr-2'}`}>
                  <p className="text-xs text-gray-400 truncate">Replying to {message.replyTo.sender.username}</p>
                  <p className="text-sm truncate">{message.replyTo.content}</p>
                </div>
              )}

              {/* Message bubble */}
              <div
                className={`message-bubble ${isCurrentUser(message.senderId) ? 'sent' : 'received'}`}
              >
                {message.deleted ? (
                  <p className="text-gray-400 italic">[message deleted]</p>
                ) : (
                  <>
                    <p>{message.content}</p>
                    {message.edited && <p className="text-xs text-gray-400 mt-1">(edited)</p>}
                  </>
                )}

                {/* Message actions */}
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-400">{formatTime(message.createdAt)}</span>
                  {!isCurrentUser(message.senderId) && (
                    <button
                      onClick={() => handleReaction(message.id, '👍')}
                      className="text-xs hover:text-reale-yellow"
                    >
                      <ThumbsUp size={12} />
                    </button>
                  )}
                  {isCurrentUser(message.senderId) && (
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEdit(message)}
                        className="text-xs hover:text-reale-yellow"
                      >
                        <Edit size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(message.id)}
                        className="text-xs hover:text-red-400"
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => handleReply(message)}
                    className="text-xs hover:text-reale-yellow"
                  >
                    <Reply size={12} />
                  </button>
                </div>

                {/* Reactions */}
                {message.reactions.length > 0 && (
                  <div className="flex items-center space-x-1 mt-1">
                    {message.reactions.map((reaction, index) => (
                      <button
                        key={index}
                        onClick={() => handleReaction(message.id, reaction.emoji)}
                        className="flex items-center space-x-1 bg-reale-gray px-2 py-1 rounded-full text-xs"
                      >
                        <span>{reaction.emoji}</span>
                        <span>{message.reactions.filter(r => r.emoji === reaction.emoji).length}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply preview */}
      {replyTo && (
        <div className="p-2 border-t border-reale-gray bg-reale-gray">
          <div className="flex items-center space-x-2">
            <div className="w-px h-4 bg-reale-light-gray"></div>
            <div className="flex-1">
              <p className="text-xs text-gray-400">Replying to {replyTo.sender.username}</p>
              <p className="text-sm truncate">{replyTo.content}</p>
            </div>
            <button
              onClick={() => setReplyTo(null)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Message input */}
      <div className="p-4 border-t border-reale-gray bg-reale-dark">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <button type="button" className="p-2 hover:bg-reale-gray rounded-full">
            <Smile size={20} />
          </button>
          <button type="button" className="p-2 hover:bg-reale-gray rounded-full">
            <Paperclip size={20} />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={editMessageId ? editMessageContent : newMessage}
              onChange={(e) => {
                if (editMessageId) {
                  setEditMessageContent(e.target.value);
                } else {
                  setNewMessage(e.target.value);
                  if (!isTyping && e.target.value.trim()) {
                    sendTypingIndicator(chatId, true);
                    setIsTyping(true);
                  } else if (isTyping && !e.target.value.trim()) {
                    sendTypingIndicator(chatId, false);
                    setIsTyping(false);
                  }
                }
              }}
              placeholder={editMessageId ? 'Edit message...' : 'Type a message...'}
              className="w-full px-4 py-2 bg-reale-gray rounded-reale-full focus:outline-none focus:ring-1 focus:ring-reale-yellow pr-12"
            />
            {editMessageId && (
              <button
                type="button"
                onClick={() => {
                  setEditMessageId(null);
                  setEditMessageContent('');
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          <button
            type="submit"
            className="p-2 bg-reale-yellow rounded-full hover:bg-yellow-400 transition-colors"
          >
            <Send size={20} className="text-black" />
          </button>
          <button type="button" className="p-2 hover:bg-reale-gray rounded-full">
            <Mic size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
