import { MockDatabase } from '../database/pomodoro_db_mock.js';

class AuthService {
  // Simular login con la base de datos mock
  static async login(username, password) {
    try {
      // Buscar usuario por email o username
      const users = await MockDatabase.getUsers();
      const user = users.find(u => 
        (u.username === username || u.email === username) && 
        u.is_active
      );

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // En producción, aquí verificarías el password hash
      // Por ahora, aceptamos cualquier password
      if (password.length < 1) {
        throw new Error('Contraseña inválida');
      }

      // Actualizar último login
      await MockDatabase.updateUser(user.user_id, {
        last_login: new Date()
      });

      // Retornar datos del usuario (sin el password_hash)
      const { password_hash, ...userWithoutPassword } = user;
      return {
        success: true,
        user: userWithoutPassword,
        token: 'fake-jwt-token-' + user.user_id // Simular token
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Registro de nuevo usuario
  static async register(userData) {
    try {
      // Verificar si el email ya existe
      const existingUser = await MockDatabase.getUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }

      // Verificar si el username ya existe
      const users = await MockDatabase.getUsers();
      const usernameExists = users.some(u => u.username === userData.username);
      if (usernameExists) {
        throw new Error('El nombre de usuario ya está en uso');
      }

      // Crear nuevo usuario
      const newUser = await MockDatabase.createUser({
        username: userData.username,
        email: userData.email,
        password_hash: 'hashed_' + userData.password, // Simular hash
        telefono: userData.telefono || null,
        provider: 'email'
      });

      return {
        success: true,
        user: newUser,
        message: 'Usuario registrado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Obtener usuario actual por ID
  static async getCurrentUser(userId) {
    try {
      const user = await MockDatabase.getUserById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      const { password_hash, ...userWithoutPassword } = user;
      return {
        success: true,
        user: userWithoutPassword
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default AuthService;