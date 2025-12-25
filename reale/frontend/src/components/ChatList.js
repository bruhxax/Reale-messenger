import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Search, Plus, Pin, Users, MessageSquare, Settings } from 'lucide-react';

export default function ChatList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChat, setActiveChat] = useState(null);

  // Mock chats data - in real app this would come from API
  const [chats, setChats] = useState([
    {
      id: '1',
      name: 'John Doe',
      avatar: 'https://api.dicebear.com/6.x/initials/svg?seed=John',
      lastMessage: 'Hey, how are you?',
      lastMessageTime: '10:30 AM',
      unread: 2,
      isGroup: false,
      isPinned: true,
      online: true
    },
    {
      id: '2',
      name: 'Team Project',
      avatar: 'https://api.dicebear.com/6.x/initials/svg?seed=Team',
      lastMessage: 'Meeting at 3 PM',
      lastMessageTime: 'Yesterday',
      unread: 0,
      isGroup: true,
      isPinned: false,
      online: false
    },
    {
      id: '3',
      name: 'Jane Smith',
      avatar: 'https://api.dicebear.com/6.x/initials/svg?seed=Jane',
      lastMessage: 'Thanks for the help!',
      lastMessageTime: 'Monday',
      unread: 0,
      isGroup: false,
      isPinned: false,
      online: false
    },
    {
      id: '4',
      name: 'Design Review',
      avatar: 'https://api.dicebear.com/6.x/initials/svg?seed=Design',
      lastMessage: 'New mockups ready',
      lastMessageTime: 'Last week',
      unread: 1,
      isGroup: true,
      isPinned: false,
      online: false
    }
  ]);

  const [filteredChats, setFilteredChats] = useState(chats);

  useEffect(() => {
    // Filter chats based on search query
    const filtered = chats.filter(chat =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredChats(filtered);
  }, [searchQuery, chats]);

  const handleChatClick = (chatId) => {
    setActiveChat(chatId);
    router.push(`/chat/${chatId}`);
  };

  const handleCreateChat = () => {
    // In real app, this would open a modal to create a new chat
    console.log('Create chat');
  };

  const pinnedChats = filteredChats.filter(chat => chat.isPinned);
  const regularChats = filteredChats.filter(chat => !chat.isPinned);

  return (
    <div className="w-64 bg-reale-dark border-r border-reale-gray flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-reale-gray flex items-center space-x-2">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-reale-gray rounded-reale-md text-sm focus:outline-none focus:ring-1 focus:ring-reale-yellow"
            />
          </div>
        </div>
        <button
          onClick={handleCreateChat}
          className="p-2 bg-reale-yellow rounded-full hover:bg-yellow-400 transition-colors"
        >
          <Plus size={16} className="text-black" />
        </button>
      </div>

      {/* Chats list */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Pinned chats */}
        {pinnedChats.length > 0 && (
          <div className="px-4 py-2 flex items-center space-x-2 text-xs text-gray-400 border-b border-reale-gray">
            <Pin size={12} />
            <span>PINNED</span>
          </div>
        )}

        {pinnedChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleChatClick(chat.id)}
            className={`chat-item p-3 flex items-center space-x-3 cursor-pointer border-b border-reale-gray ${
              activeChat === chat.id ? 'bg-reale-light-gray' : 'hover:bg-reale-darker'
            }`}
          >
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
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1">
                <span className="font-medium truncate">{chat.name}</span>
                {chat.isGroup && <Users size={12} className="text-gray-400" />}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400 truncate">{chat.lastMessage}</span>
                {chat.unread > 0 && (
                  <div className="bg-reale-orange text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {chat.unread}
                  </div>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-400 whitespace-nowrap">
              {chat.lastMessageTime}
            </div>
          </div>
        ))}

        {/* Regular chats */}
        {regularChats.length > 0 && (
          <div className="px-4 py-2 flex items-center space-x-2 text-xs text-gray-400 border-b border-reale-gray">
            <MessageSquare size={12} />
            <span>ALL CHATS</span>
          </div>
        )}

        {regularChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleChatClick(chat.id)}
            className={`chat-item p-3 flex items-center space-x-3 cursor-pointer border-b border-reale-gray ${
              activeChat === chat.id ? 'bg-reale-light-gray' : 'hover:bg-reale-darker'
            }`}
          >
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
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1">
                <span className="font-medium truncate">{chat.name}</span>
                {chat.isGroup && <Users size={12} className="text-gray-400" />}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400 truncate">{chat.lastMessage}</span>
                {chat.unread > 0 && (
                  <div className="bg-reale-orange text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {chat.unread}
                  </div>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-400 whitespace-nowrap">
              {chat.lastMessageTime}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
