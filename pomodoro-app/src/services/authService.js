import { MockDatabase } from '../database/pomodoro_db_mock.js';

// Simular bcrypt para hash de contraseñas
const hashPassword = (password) => {
  // En producción usarías bcrypt
  return `$2b$10$${btoa(password)}`;
};

const verifyPassword = (password, hash) => {
  // En producción usarías bcrypt.compare
  try {
    const base64Part = hash.replace('$2b$10$', '');
    return atob(base64Part) === password;
  } catch {
    return false;
  }
};

// Generar token JWT simulado
const generateToken = (userId) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    userId, 
    iat: Date.now(),
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
  }));
  const signature = btoa('fake-signature');
  return `${header}.${payload}.${signature}`;
};

// Decodificar token JWT simulado
const decodeToken = (token) => {
  try {
    const [, payload] = token.split('.');
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

class AuthService {
  // Login con validación real de contraseña
  static async login(username, password) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      // Buscar usuario por username o email
      const users = await MockDatabase.getUsers();
      const user = users.find(u => 
        (u.username === username || u.email === username) && 
        u.is_active
      );

      if (!user) {
        throw new Error('Usuario o contraseña incorrectos');
      }

      // Verifica contraseña
      const isValidPassword = verifyPassword(password, user.password_hash);
      if (!isValidPassword) {
        throw new Error('Usuario o contraseña incorrectos');
      }

      // Actualiza último login
      await MockDatabase.updateUser(user.user_id, {
        last_login: new Date()
      });

      // Crea token de sesión
      const token = generateToken(user.user_id);
      
      // Crea refresh token
      const refreshToken = `refresh_${Date.now()}_${user.user_id}`;
      await MockDatabase.createRefreshToken({
        token: refreshToken,
        user_id: user.user_id,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        user_agent: navigator.userAgent,
        ip_address: '127.0.0.1' // En producción obtendrías la IP real
      });

      // Retornar respuesta similar a un backend real
      const { password_hash, ...userWithoutPassword } = user;
      return {
        success: true,
        data: {
          user: userWithoutPassword,
          access_token: token,
          refresh_token: refreshToken,
          token_type: 'Bearer',
          expires_in: 86400 // 24 horas en segundos
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: 'AUTH_ERROR'
        }
      };
    }
  }

  // Registro con hash de contraseña
  static async register(userData) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      // Validaciones del lado del servidor
      if (!userData.username || userData.username.length < 3) {
        throw new Error('El nombre de usuario debe tener al menos 3 caracteres');
      }

      if (!userData.email || !/\S+@\S+\.\S+/.test(userData.email)) {
        throw new Error('Email inválido');
      }

      if (!userData.password || userData.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Verificar si el email ya existe
      const existingUser = await MockDatabase.getUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }

      // Verificar si el username ya existe
      const users = await MockDatabase.getUsers();
      const usernameExists = users.some(u => 
        u.username.toLowerCase() === userData.username.toLowerCase()
      );
      if (usernameExists) {
        throw new Error('El nombre de usuario ya está en uso');
      }

      // Crear nuevo usuario con contraseña hasheada
      const newUser = await MockDatabase.createUser({
        username: userData.username,
        email: userData.email.toLowerCase(),
        password_hash: hashPassword(userData.password),
        telefono: userData.telefono || null,
        provider: 'email',
        imagen_perfil: `https://ui-avatars.com/api/?name=${userData.username}&background=random`
      });

      // Crear transacción de bienvenida (bonus de monedas)
      await MockDatabase.createTransaction({
        user_id: newUser.user_id,
        transaction_type: 'earn_free_coins',
        coin_type: 'free',
        amount_free_coins: 50,
        description: 'Bonus de bienvenida por registro',
        related_type: null
      });

      // Actualizar monedas del usuario
      await MockDatabase.updateUserCoins(newUser.user_id, 50, 0);

      const { password_hash, ...userWithoutPassword } = newUser;
      return {
        success: true,
        data: {
          user: userWithoutPassword,
          message: 'Usuario registrado exitosamente. ¡Has recibido 50 monedas de bienvenida!'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: 'REGISTER_ERROR'
        }
      };
    }
  }

  // Cambiar contraseña
  static async changePassword(userId, currentPassword, newPassword) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      // Buscar usuario
      const user = await MockDatabase.getUserById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar contraseña actual
      const isValidPassword = verifyPassword(currentPassword, user.password_hash);
      if (!isValidPassword) {
        throw new Error('La contraseña actual es incorrecta');
      }

      // Actualizar contraseña
      const newPasswordHash = hashPassword(newPassword);
      await MockDatabase.updateUser(userId, {
        password_hash: newPasswordHash,
        updated_at: new Date()
      });

      return {
        success: true,
        data: {
          message: 'Contraseña actualizada exitosamente'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: 'PASSWORD_CHANGE_ERROR'
        }
      };
    }
  }

  // Verificar token y obtener usuario actual
  static async verifyToken(token) {
    try {
      const decoded = decodeToken(token);
      if (!decoded || decoded.exp < Date.now()) {
        throw new Error('Token expirado');
      }

      const user = await MockDatabase.getUserById(decoded.userId);
      if (!user || !user.is_active) {
        throw new Error('Usuario no válido');
      }

      const { password_hash, ...userWithoutPassword } = user;
      return {
        success: true,
        data: {
          user: userWithoutPassword
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: 'TOKEN_ERROR'
        }
      };
    }
  }

  // Logout (revocar tokens)
  static async logout(refreshToken) {
    try {
      if (refreshToken) {
        await MockDatabase.revokeRefreshToken(refreshToken);
      }
      return {
        success: true,
        data: {
          message: 'Sesión cerrada exitosamente'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: 'LOGOUT_ERROR'
        }
      };
    }
  }

  // Refrescar token
  static async refreshToken(refreshToken) {
    try {
      const tokenData = await MockDatabase.getRefreshToken(refreshToken);
      if (!tokenData) {
        throw new Error('Refresh token inválido');
      }

      const newAccessToken = generateToken(tokenData.user_id);
      
      return {
        success: true,
        data: {
          access_token: newAccessToken,
          token_type: 'Bearer',
          expires_in: 86400
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: 'REFRESH_ERROR'
        }
      };
    }
  }
}

export default AuthService;