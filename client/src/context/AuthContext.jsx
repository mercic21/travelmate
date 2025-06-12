import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleAuthResponse = (response) => {
    if (response?.token) {
      const userData = {
        id: response._id,
        name: response.name,
        email: response.email,
        isAdmin: response.isAdmin
      };
      localStorage.setItem('token', response.token);
      setUser(userData);
      return { token: response.token, user: userData };
    }
    throw new Error('Invalid response structure');
  };

  const login = async (credentials) => {
    try {
      console.log('AuthContext: Login attempt');
      const response = await authAPI.login(credentials);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      console.log('AuthContext: Login successful');
      return response;
    } catch (error) {
      console.error('AuthContext: Login failed', error);
      localStorage.removeItem('token');
      setUser(null);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      return handleAuthResponse(response);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/auth');
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = await authAPI.getProfile();
        setUser(userData.user || userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = () => {
    return user?.isAdmin === true && user?.email === 'admin@travelmate.com';
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const contextValue = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
