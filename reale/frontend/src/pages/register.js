import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../components/AuthProvider';
import Link from 'next/link';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(username, email, password);
      router.push('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-reale-black flex items-center justify-center p-4">
      <div className="bg-reale-darker p-8 rounded-reale-lg w-full max-w-md border border-reale-gray">
        <h1 className="text-2xl font-bold text-center mb-6 text-reale-yellow">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-reale-gray border border-reale-light-gray rounded-reale-md text-white focus:outline-none focus:ring-2 focus:ring-reale-yellow"
              required
              minLength={3}
              maxLength={20}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-reale-gray border border-reale-light-gray rounded-reale-md text-white focus:outline-none focus:ring-2 focus:ring-reale-yellow"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-reale-gray border border-reale-light-gray rounded-reale-md text-white focus:outline-none focus:ring-2 focus:ring-reale-yellow"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-reale-orange hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded-reale-md transition-colors disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-reale-yellow hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
