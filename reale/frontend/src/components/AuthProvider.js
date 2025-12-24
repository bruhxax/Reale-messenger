import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check for existing token on initial load
    const storedToken = localStorage.getItem('reale_token');
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await axios.get('/api/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Fetch user error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { user, tokens } = response.data;

      // Store tokens
      localStorage.setItem('reale_token', tokens.accessToken);
      localStorage.setItem('reale_refresh_token', tokens.refreshToken);

      // Set axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;

      setToken(tokens.accessToken);
      setUser(user);

      toast.success('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || 'Login failed';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post('/api/auth/register', {
        username,
        email,
        password
      });

      const { user, tokens } = response.data;

      // Store tokens
      localStorage.setItem('reale_token', tokens.accessToken);
      localStorage.setItem('reale_refresh_token', tokens.refreshToken);

      // Set axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;

      setToken(tokens.accessToken);
      setUser(user);

      toast.success('Registration successful!');
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.error || 'Registration failed';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens and user data
      localStorage.removeItem('reale_token');
      localStorage.removeItem('reale_refresh_token');
      delete axios.defaults.headers.common['Authorization'];

      setToken(null);
      setUser(null);

      toast.success('Logged out successfully');
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('reale_refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await axios.post('/api/auth/refresh-token', {
        refreshToken
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      // Store new tokens
      localStorage.setItem('reale_token', accessToken);
      localStorage.setItem('reale_refresh_token', newRefreshToken);

      // Set axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      setToken(accessToken);

      return accessToken;
    } catch (error) {
      console.error('Refresh token error:', error);
      logout();
      throw error;
    }
  };

  // Add axios interceptor for handling 401 errors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await refreshToken();
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, loading, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
