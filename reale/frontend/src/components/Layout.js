import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-reale-black text-white">
      {/* Mobile header */}
      <header className="md:hidden bg-reale-darker p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-reale-yellow rounded-full"></div>
          <span className="font-bold text-lg">Reale</span>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-full bg-reale-gray hover:bg-reale-light-gray"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-reale-darker p-4 border-b border-reale-gray">
          <div className="space-y-2">
            <button
              onClick={() => router.push('/')}
              className="w-full text-left p-2 rounded-reale-md hover:bg-reale-gray"
            >
              Home
            </button>
            <button
              onClick={() => router.push('/settings')}
              className="w-full text-left p-2 rounded-reale-md hover:bg-reale-gray"
            >
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left p-2 rounded-reale-md hover:bg-reale-gray text-red-400"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex">
        {children}
      </main>
    </div>
  );
}
