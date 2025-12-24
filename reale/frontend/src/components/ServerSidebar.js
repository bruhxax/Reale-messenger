import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './AuthProvider';
import { Plus, Settings, LogOut } from 'lucide-react';

export default function ServerSidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);

  // Mock servers data - in real app this would come from API
  const [servers, setServers] = useState([
    {
      id: '1',
      name: 'Reale HQ',
      icon: 'https://api.dicebear.com/6.x/initials/svg?seed=RHQ&backgroundColor=FFD700&textColor=000000',
      unread: 3
    },
    {
      id: '2',
      name: 'Developers',
      icon: 'https://api.dicebear.com/6.x/initials/svg?seed=DEV&backgroundColor=FF8C00&textColor=FFFFFF',
      unread: 0
    },
    {
      id: '3',
      name: 'Designers',
      icon: 'https://api.dicebear.com/6.x/initials/svg?seed=DSN&backgroundColor=FF6B6B&textColor=FFFFFF',
      unread: 1
    }
  ]);

  const handleCreateServer = () => {
    // In real app, this would open a modal to create a new server
    console.log('Create server');
  };

  const handleServerClick = (serverId) => {
    router.push(`/server/${serverId}`);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="w-16 bg-reale-darker flex flex-col items-center py-4 space-y-4 border-r border-reale-gray">
      {/* User profile */}
      <div className="relative">
        <button
          onClick={() => setIsContextMenuOpen(!isContextMenuOpen)}
          className="w-12 h-12 rounded-full overflow-hidden border-2 border-reale-orange hover:border-reale-yellow transition-colors"
        >
          <img
            src={user?.avatar || 'https://api.dicebear.com/6.x/initials/svg?seed=User'}
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </button>

        {isContextMenuOpen && (
          <div className="absolute left-14 bottom-0 bg-reale-gray p-2 rounded-reale-md shadow-lg z-10">
            <button
              onClick={() => router.push('/settings')}
              className="flex items-center space-x-2 w-full text-left p-2 hover:bg-reale-light-gray rounded-reale-sm"
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 w-full text-left p-2 hover:bg-reale-light-gray rounded-reale-sm text-red-400"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Server separator */}
      <div className="w-8 h-px bg-reale-gray"></div>

      {/* Servers list */}
      <div className="space-y-2 flex-1 overflow-y-auto scrollbar-hide">
        {servers.map((server) => (
          <button
            key={server.id}
            onClick={() => handleServerClick(server.id)}
            className="relative w-12 h-12 rounded-xl overflow-hidden hover:rounded-lg transition-all server-icon"
          >
            <img
              src={server.icon}
              alt={server.name}
              className="w-full h-full object-cover"
            />
            {server.unread > 0 && (
              <div className="absolute -top-1 -right-1 bg-reale-orange text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {server.unread}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Create server button */}
      <button
        onClick={handleCreateServer}
        className="w-12 h-12 bg-reale-yellow rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors"
      >
        <Plus size={24} className="text-black" />
      </button>
    </div>
  );
}
