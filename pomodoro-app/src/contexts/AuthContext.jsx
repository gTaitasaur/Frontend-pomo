import { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../services/authService';
import toast from 'react-hot-toast';

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
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token'));

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      if (accessToken) {
        const result = await AuthService.verifyToken(accessToken);
        
        if (result.success) {
          setUser(result.data.user);
        } else {
          // Token inválido, intenta refrescar
          if (refreshToken) {
            const refreshResult = await AuthService.refreshToken(refreshToken);
            if (refreshResult.success) {
              setAccessToken(refreshResult.data.access_token);
              localStorage.setItem('access_token', refreshResult.data.access_token);
              
              // Verificar nuevo token
              const verifyResult = await AuthService.verifyToken(refreshResult.data.access_token);
              if (verifyResult.success) {
                setUser(verifyResult.data.user);
              }
            } else {
              // No se pudo refrescar, limpiar todo
              clearAuth();
            }
          } else {
            clearAuth();
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const clearAuth = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  const login = async (username, password) => {
    const result = await AuthService.login(username, password);
    
    if (result.success) {
      const { user, access_token, refresh_token } = result.data;
      
      setUser(user);
      setAccessToken(access_token);
      setRefreshToken(refresh_token);
      
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
    }
    
    return result;
  };

  const register = async (userData) => {
    const result = await AuthService.register(userData);
    
    if (result.success) {
      toast.success(result.data.message);
    }
    
    return result;
  };

  const logout = async () => {
    await AuthService.logout(refreshToken);
    clearAuth();
    toast.success('Sesión cerrada');
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

  // Función para hacer peticiones autenticadas
  const authenticatedRequest = async (requestFunction) => {
    try {
      const result = await requestFunction(accessToken);
      return result;
    } catch (error) {
      // Si el error es de autenticación, intentar refrescar token
      if (error.code === 'TOKEN_ERROR' && refreshToken) {
        const refreshResult = await AuthService.refreshToken(refreshToken);
        if (refreshResult.success) {
          setAccessToken(refreshResult.data.access_token);
          localStorage.setItem('access_token', refreshResult.data.access_token);
          
          // Reintentar la petición original
          return await requestFunction(refreshResult.data.access_token);
        }
      }
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      loading,
      updateUserCoins,
      isAuthenticated: !!user,
      authenticatedRequest
    }}>
      {children}
    </AuthContext.Provider>
  );
};