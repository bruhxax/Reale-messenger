import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../components/AuthProvider';
import ChatList from '../components/ChatList';
import ServerSidebar from '../components/ServerSidebar';
import ChatWindow from '../components/ChatWindow';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-reale-yellow"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-reale-black text-white">
      <ServerSidebar />
      <ChatList />
      <ChatWindow />
    </div>
  );
}
