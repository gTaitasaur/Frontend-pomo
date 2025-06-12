import { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Verificar si hay un usuario logeado al cargar la app
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        // Extraer el ID del token simulado
        const userId = token.split('-').pop();
        const result = await AuthService.getCurrentUser(userId);
        
        if (result.success) {
          setUser(result.user);
        } else {
          // Token inválido, limpiar
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (username, password) => {
    const result = await AuthService.login(username, password);
    
    if (result.success) {
      setUser(result.user);
      setToken(result.token);
      localStorage.setItem('token', result.token);
    }
    
    return result;
  };

  const register = async (userData) => {
    const result = await AuthService.register(userData);
    return result;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const updateUserCoins = (freeCoins, paidCoins) => {
    if (user) {
      setUser({
        ...user,
        free_coins: freeCoins,
        paid_coins: paidCoins
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      loading,
      updateUserCoins 
    }}>
      {children}
    </AuthContext.Provider>
  );
};