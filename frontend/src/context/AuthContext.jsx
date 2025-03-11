// Context/AuthContext.js
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AuthContext, useAuth } from './authContext.utils';
import { authService } from '../services/api';

export { useAuth };
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authService.verifyToken();
          setUser(response.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      console.log('Raw response:', response);
      console.log('Response data:', response.data);
      
      // Handle both possible response structures
      const userData = response.data.user || response.data;
      const token = response.data.token || userData.token;

      if (token) {
        localStorage.setItem('token', token);
        setUser(userData);
        setIsAuthenticated(true);
        return { token, user: userData };
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};