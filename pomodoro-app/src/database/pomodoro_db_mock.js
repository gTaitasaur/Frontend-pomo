// Simula la base de datos PostgreSQL con datos de prueba
// ENUMS
const PROVIDER_ENUM = ['email', 'google', 'facebook'];
const POMO_TYPE_ENUM = ['work', 'rest', 'long_rest'];
const FEATURE_TYPE_ENUM = ['background', 'icon', 'sound', 'theme'];
const UNLOCK_TYPE_ENUM = ['freemodoro', 'pomocoin', 'free'];
const TRANSACTION_TYPE_ENUM = ['earn_free_coins', 'buy_paid_coins', 'spend_free_coins', 'spend_paid_coins', 'premium_purchase'];
const COIN_TYPE_ENUM = ['free', 'paid'];
const RELATED_TYPE_ENUM = ['feature', 'premium', 'pomodoro_session'];

// Contadores para IDs auto-incrementales
let userIdCounter = 3;
let transactionIdCounter = 8;
let sessionIdCounter = 10;
let featureIdCounter = 12;
let userFeatureIdCounter = 5;
let tokenIdCounter = 3;
let packageIdCounter = 4;
let premiumPackageIdCounter = 4;

// TABLAS DE DATOS
const mockDatabase = {
  
  // USUARIOS
  usuarios: [
    {
      user_id: 1,
      username: 'usuario_demo',
      email: 'demo@ejemplo.com',
      password_hash: '$2b$10$' + btoa('demo123'), // Contraseña: demo123
      telefono: '+56912345678',
      imagen_perfil: 'https://example.com/avatar1.jpg',
      provider: 'email',
      provider_id: null,
      created_at: new Date('2024-01-15T10:00:00Z'),
      updated_at: new Date('2024-06-10T15:30:00Z'),
      premium: false,
      premium_expiration: null,
      free_coins: 150,
      paid_coins: 0,
      lifetime_session: 45,
      last_login: new Date('2024-06-12T08:00:00Z'),
      is_active: true
    },
    {
      user_id: 2,
      username: 'premium_user',
      email: 'premium@ejemplo.com',
      password_hash: '$2b$10$' + btoa('premium123'),
      telefono: null,
      imagen_perfil: null,
      provider: 'google',
      provider_id: 'google_123456789',
      created_at: new Date('2024-02-01T14:00:00Z'),
      updated_at: new Date('2024-06-11T12:00:00Z'),
      premium: true,
      premium_expiration: new Date('2025-02-01T23:59:59Z'),
      free_coins: 75,
      paid_coins: 200,
      lifetime_session: 120,
      last_login: new Date('2024-06-11T20:15:00Z'),
      is_active: true
    },
    {
      user_id: 3,
      username: 'inactive_user',
      email: 'inactive@ejemplo.com',
      password_hash: '$2b$10$hashedpassword789',
      telefono: '+56987654321',
      imagen_perfil: null,
      provider: 'facebook',
      provider_id: 'facebook_987654321',
      created_at: new Date('2024-03-01T09:00:00Z'),
      updated_at: new Date('2024-05-15T10:30:00Z'),
      premium: false,
      premium_expiration: null,
      free_coins: 25,
      paid_coins: 0,
      lifetime_session: 8,
      last_login: new Date('2024-05-15T10:30:00Z'),
      is_active: false
    }
  ],

  // TRANSACCIONES
  transactions: [
    {
      transaction_id: 1,
      user_id: 1,
      transaction_type: 'earn_free_coins',
      coin_type: 'free',
      amount_free_coins: 25,
      amount_paid_coins: 0,
      money_paid: 0.00,
      related_id: 1,
      related_type: 'pomodoro_session',
      description: 'Monedas ganadas por completar sesión de trabajo',
      transaction_date: new Date('2024-06-12T08:30:00Z')
    },
    {
      transaction_id: 2,
      user_id: 2,
      transaction_type: 'buy_paid_coins',
      coin_type: 'paid',
      amount_free_coins: 0,
      amount_paid_coins: 500,
      money_paid: 9.99,
      related_id: 2,
      related_type: 'premium',
      description: 'Compra de 500 monedas premium - Paquete Popular',
      transaction_date: new Date('2024-06-10T16:45:00Z')
    },
    {
      transaction_id: 3,
      user_id: 1,
      transaction_type: 'spend_free_coins',
      coin_type: 'free',
      amount_free_coins: 50,
      amount_paid_coins: 0,
      money_paid: 0.00,
      related_id: 3,
      related_type: 'feature',
      description: 'Desbloqueo de tema Forest',
      transaction_date: new Date('2024-06-11T10:20:00Z')
    },
    {
      transaction_id: 4,
      user_id: 2,
      transaction_type: 'premium_purchase',
      coin_type: 'paid',
      amount_free_coins: 0,
      amount_paid_coins: 300,
      money_paid: 0.00,
      related_id: 1,
      related_type: 'premium',
      description: 'Compra premium mensual con monedas',
      transaction_date: new Date('2024-06-09T14:00:00Z')
    },
    {
      transaction_id: 5,
      user_id: 1,
      transaction_type: 'earn_free_coins',
      coin_type: 'free',
      amount_free_coins: 15,
      amount_paid_coins: 0,
      money_paid: 0.00,
      related_id: 2,
      related_type: 'pomodoro_session',
      description: 'Monedas ganadas por sesión de descanso',
      transaction_date: new Date('2024-06-12T09:00:00Z')
    },
    {
      transaction_id: 6,
      user_id: 2,
      transaction_type: 'spend_paid_coins',
      coin_type: 'paid',
      amount_free_coins: 0,
      amount_paid_coins: 150,
      money_paid: 0.00,
      related_id: 5,
      related_type: 'feature',
      description: 'Desbloqueo de Iconos Premium por 30 días',
      transaction_date: new Date('2024-06-08T11:30:00Z')
    },
    {
      transaction_id: 7,
      user_id: 1,
      transaction_type: 'earn_free_coins',
      coin_type: 'free',
      amount_free_coins: 35,
      amount_paid_coins: 0,
      money_paid: 0.00,
      related_id: 6,
      related_type: 'pomodoro_session',
      description: 'Bonus por completar sesión larga de trabajo',
      transaction_date: new Date('2024-06-11T16:30:00Z')
    }
  ],

  // HISTORIAL POMODORO
  pomo_hist: [
    {
      session_id: 1,
      user_id: 1,
      duration_minutes: 25,
      pomo_type: 'work',
      start_time: new Date('2024-06-12T08:00:00Z'),
      end_time: new Date('2024-06-12T08:25:00Z'),
      completed: true,
      coins_earned: 25,
      created_at: new Date('2024-06-12T08:25:00Z')
    },
    {
      session_id: 2,
      user_id: 1,
      duration_minutes: 5,
      pomo_type: 'rest',
      start_time: new Date('2024-06-12T08:30:00Z'),
      end_time: new Date('2024-06-12T08:35:00Z'),
      completed: true,
      coins_earned: 15,
      created_at: new Date('2024-06-12T08:35:00Z')
    },
    {
      session_id: 3,
      user_id: 2,
      duration_minutes: 50,
      pomo_type: 'work',
      start_time: new Date('2024-06-11T14:00:00Z'),
      end_time: new Date('2024-06-11T14:50:00Z'),
      completed: true,
      coins_earned: 50,
      created_at: new Date('2024-06-11T14:50:00Z')
    },
    {
      session_id: 4,
      user_id: 1,
      duration_minutes: 25,
      pomo_type: 'work',
      start_time: new Date('2024-06-12T09:00:00Z'),
      end_time: new Date('2024-06-12T09:20:00Z'),
      completed: false,
      coins_earned: 0,
      created_at: new Date('2024-06-12T09:20:00Z')
    },
    {
      session_id: 5,
      user_id: 2,
      duration_minutes: 15,
      pomo_type: 'long_rest',
      start_time: new Date('2024-06-11T15:00:00Z'),
      end_time: new Date('2024-06-11T15:15:00Z'),
      completed: true,
      coins_earned: 30,
      created_at: new Date('2024-06-11T15:15:00Z')
    },
    {
      session_id: 6,
      user_id: 1,
      duration_minutes: 25,
      pomo_type: 'work',
      start_time: new Date('2024-06-11T16:00:00Z'),
      end_time: new Date('2024-06-11T16:25:00Z'),
      completed: true,
      coins_earned: 35,
      created_at: new Date('2024-06-11T16:25:00Z')
    },
    {
      session_id: 7,
      user_id: 2,
      duration_minutes: 30,
      pomo_type: 'work',
      start_time: new Date('2024-06-10T10:00:00Z'),
      end_time: new Date('2024-06-10T10:30:00Z'),
      completed: true,
      coins_earned: 35,
      created_at: new Date('2024-06-10T10:30:00Z')
    },
    {
      session_id: 8,
      user_id: 3,
      duration_minutes: 25,
      pomo_type: 'work',
      start_time: new Date('2024-05-15T09:00:00Z'),
      end_time: new Date('2024-05-15T09:25:00Z'),
      completed: true,
      coins_earned: 25,
      created_at: new Date('2024-05-15T09:25:00Z')
    },
    {
      session_id: 9,
      user_id: 1,
      duration_minutes: 10,
      pomo_type: 'rest',
      start_time: new Date('2024-06-10T14:00:00Z'),
      end_time: new Date('2024-06-10T14:10:00Z'),
      completed: true,
      coins_earned: 10,
      created_at: new Date('2024-06-10T14:10:00Z')
    }
  ],

  // CARACTERÍSTICAS/FEATURES
  features: [
    {
      feature_id: 1,
      name: 'Tema Oscuro',
      feature_type: 'theme',
      unlock_type: 'free',
      cost_free_coins: 0,
      cost_paid_coins: 0,
      cost_money: 0.00,
      duration_days: null,
      is_premium: false,
      is_enabled: true,
      description: 'Tema oscuro para reducir la fatiga visual',
      image_url: 'https://example.com/dark-theme.jpg',
      sort_order: 1,
      created_at: new Date('2024-01-01T00:00:00Z')
    },
    {
      feature_id: 2,
      name: 'Sonidos de Lluvia',
      feature_type: 'sound',
      unlock_type: 'freemodoro',
      cost_free_coins: 100,
      cost_paid_coins: 0,
      cost_money: 0.00,
      duration_days: null,
      is_premium: false,
      is_enabled: true,
      description: 'Sonidos relajantes de lluvia para concentración',
      image_url: 'https://example.com/rain-sound.jpg',
      sort_order: 2,
      created_at: new Date('2024-01-01T00:00:00Z')
    },
    {
      feature_id: 3,
      name: 'Tema Forest',
      feature_type: 'theme',
      unlock_type: 'freemodoro',
      cost_free_coins: 50,
      cost_paid_coins: 0,
      cost_money: 0.00,
      duration_days: null,
      is_premium: false,
      is_enabled: true,
      description: 'Tema inspirado en el bosque',
      image_url: 'https://example.com/forest-theme.jpg',
      sort_order: 3,
      created_at: new Date('2024-01-01T00:00:00Z')
    },
    {
      feature_id: 4,
      name: 'Fondo Personalizado',
      feature_type: 'background',
      unlock_type: 'pomocoin',
      cost_free_coins: 0,
      cost_paid_coins: 75,
      cost_money: 0.00,
      duration_days: null,
      is_premium: true,
      is_enabled: true,
      description: 'Sube tu propio fondo personalizado',
      image_url: 'https://example.com/custom-bg.jpg',
      sort_order: 4,
      created_at: new Date('2024-01-01T00:00:00Z')
    },
    {
      feature_id: 5,
      name: 'Iconos Premium',
      feature_type: 'icon',
      unlock_type: 'pomocoin',
      cost_free_coins: 0,
      cost_paid_coins: 150,
      cost_money: 0.00,
      duration_days: 30,
      is_premium: true,
      is_enabled: true,
      description: 'Colección de iconos premium por 30 días',
      image_url: 'https://example.com/premium-icons.jpg',
      sort_order: 5,
      created_at: new Date('2024-01-01T00:00:00Z')
    },
    {
      feature_id: 6,
      name: 'Música Focus',
      feature_type: 'sound',
      unlock_type: 'freemodoro',
      cost_free_coins: 75,
      cost_paid_coins: 0,
      cost_money: 0.00,
      duration_days: null,
      is_premium: false,
      is_enabled: true,
      description: 'Música diseñada para mejorar la concentración',
      image_url: 'https://example.com/focus-music.jpg',
      sort_order: 6,
      created_at: new Date('2024-01-01T00:00:00Z')
    },
    {
      feature_id: 7,
      name: 'Tema Minimalista',
      feature_type: 'theme',
      unlock_type: 'freemodoro',
      cost_free_coins: 25,
      cost_paid_coins: 0,
      cost_money: 0.00,
      duration_days: null,
      is_premium: false,
      is_enabled: true,
      description: 'Diseño limpio y minimalista',
      image_url: 'https://example.com/minimal-theme.jpg',
      sort_order: 7,
      created_at: new Date('2024-01-01T00:00:00Z')
    },
    {
      feature_id: 8,
      name: 'Fondo Animado',
      feature_type: 'background',
      unlock_type: 'pomocoin',
      cost_free_coins: 0,
      cost_paid_coins: 200,
      cost_money: 0.00,
      duration_days: null,
      is_premium: true,
      is_enabled: true,
      description: 'Fondos con animaciones sutiles',
      image_url: 'https://example.com/animated-bg.jpg',
      sort_order: 8,
      created_at: new Date('2024-01-01T00:00:00Z')
    },
    {
      feature_id: 9,
      name: 'Sonidos de Naturaleza',
      feature_type: 'sound',
      unlock_type: 'pomocoin',
      cost_free_coins: 0,
      cost_paid_coins: 50,
      cost_money: 0.00,
      duration_days: null,
      is_premium: false,
      is_enabled: true,
      description: 'Colección de sonidos de la naturaleza',
      image_url: 'https://example.com/nature-sounds.jpg',
      sort_order: 9,
      created_at: new Date('2024-01-01T00:00:00Z')
    },
    {
      feature_id: 10,
      name: 'Tema Retro',
      feature_type: 'theme',
      unlock_type: 'freemodoro',
      cost_free_coins: 80,
      cost_paid_coins: 0,
      cost_money: 0.00,
      duration_days: null,
      is_premium: false,
      is_enabled: true,
      description: 'Tema inspirado en los años 80',
      image_url: 'https://example.com/retro-theme.jpg',
      sort_order: 10,
      created_at: new Date('2024-01-01T00:00:00Z')
    },
    {
      feature_id: 11,
      name: 'Pack de Iconos Básico',
      feature_type: 'icon',
      unlock_type: 'freemodoro',
      cost_free_coins: 30,
      cost_paid_coins: 0,
      cost_money: 0.00,
      duration_days: null,
      is_premium: false,
      is_enabled: true,
      description: 'Iconos básicos para personalizar tu experiencia',
      image_url: 'https://example.com/basic-icons.jpg',
      sort_order: 11,
      created_at: new Date('2024-01-01T00:00:00Z')
    }
  ],

  // CARACTERÍSTICAS DE USUARIO
  user_feat: [
    {
      user_feature_id: 1,
      user_id: 1,
      feature_id: 1,
      unlock_date: new Date('2024-01-15T10:00:00Z'),
      expiration_date: null,
      is_active: true
    },
    {
      user_feature_id: 2,
      user_id: 1,
      feature_id: 3,
      unlock_date: new Date('2024-06-11T10:20:00Z'),
      expiration_date: null,
      is_active: true
    },
    {
      user_feature_id: 3,
      user_id: 2,
      feature_id: 4,
      unlock_date: new Date('2024-02-01T14:00:00Z'),
      expiration_date: null,
      is_active: true
    },
    {
      user_feature_id: 4,
      user_id: 2,
      feature_id: 5,
      unlock_date: new Date('2024-06-08T11:30:00Z'),
      expiration_date: new Date('2024-07-08T11:30:00Z'),
      is_active: true
    },
    {
      user_feature_id: 5,
      user_id: 1,
      feature_id: 7,
      unlock_date: new Date('2024-05-20T16:00:00Z'),
      expiration_date: null,
      is_active: true
    }
  ],

  // TOKENS DE REFRESCO
  refresh_tokens: [
    {
      token_id: 1,
      token: 'refresh_token_abc123xyz789',
      user_id: 1,
      issued_at: new Date('2024-06-12T08:00:00Z'),
      expires_at: new Date('2024-07-12T08:00:00Z'),
      is_revoked: false,
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      ip_address: '192.168.1.100'
    },
    {
      token_id: 2,
      token: 'refresh_token_def456uvw012',
      user_id: 2,
      issued_at: new Date('2024-06-11T20:15:00Z'),
      expires_at: new Date('2024-07-11T20:15:00Z'),
      is_revoked: false,
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      ip_address: '192.168.1.101'
    },
    {
      token_id: 3,
      token: 'refresh_token_expired123',
      user_id: 1,
      issued_at: new Date('2024-05-01T10:00:00Z'),
      expires_at: new Date('2024-05-31T10:00:00Z'),
      is_revoked: true,
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      ip_address: '192.168.1.100'
    }
  ],

  // PAQUETES DE MONEDAS
  coin_packages: [
    {
      package_id: 1,
      name: 'Paquete Básico',
      paid_coins_amount: 100,
      price_usd: 1.99,
      bonus_percentage: 0,
      is_enabled: true,
      sort_order: 1,
      created_at: new Date('2024-01-01T00:00:00Z')
    },
    {
      package_id: 2,
      name: 'Paquete Popular',
      paid_coins_amount: 500,
      price_usd: 9.99,
      bonus_percentage: 25,
      is_enabled: true,
      sort_order: 2,
      created_at: new Date('2024-01-01T00:00:00Z')
    },
    {
      package_id: 3,
      name: 'Paquete Premium',
      paid_coins_amount: 1000,
      price_usd: 19.99,
      bonus_percentage: 50,
      is_enabled: true,
      sort_order: 3,
      created_at: new Date('2024-01-01T00:00:00Z')
    },
    {
      package_id: 4,
      name: 'Mega Paquete',
      paid_coins_amount: 2500,
      price_usd: 49.99,
      bonus_percentage: 100,
      is_enabled: true,
      sort_order: 4,
      created_at: new Date('2024-01-01T00:00:00Z')
    }
  ],

  // PAQUETES PREMIUM
  premium_packages: [
    {
      premium_package_id: 1,
      name: 'Premium Mensual',
      duration_months: 1,
      price_usd: 4.99,
      price_paid_coins: 300,
      discount_percentage: 0,
      is_enabled: true,
      sort_order: 1,
      created_at: new Date('2024-01-01T00:00:00Z')
    },
    {
      premium_package_id: 2,
      name: 'Premium Trimestral',
      duration_months: 3,
      price_usd: 12.99,
      price_paid_coins: 800,
      discount_percentage: 15,
      is_enabled: true,
      sort_order: 2,
      created_at: new Date('2024-01-01T00:00:00Z')
    },
    {
      premium_package_id: 3,
      name: 'Premium Anual',
      duration_months: 12,
      price_usd: 49.99,
      price_paid_coins: 3000,
      discount_percentage: 25,
      is_enabled: true,
      sort_order: 3,
      created_at: new Date('2024-01-01T00:00:00Z')
    },
    {
      premium_package_id: 4,
      name: 'Premium Semestral',
      duration_months: 6,
      price_usd: 24.99,
      price_paid_coins: 1500,
      discount_percentage: 12,
      is_enabled: true,
      sort_order: 4,
      created_at: new Date('2024-01-01T00:00:00Z')
    }
  ]
};

// FUNCIONES PARA SIMULAR OPERACIONES DE BASE DE DATOS

class MockDatabase {
  // USUARIOS
  static async getUsers() {
    return new Promise(resolve => {
      setTimeout(() => resolve([...mockDatabase.usuarios]), 100);
    });
  }

  static async getUserById(id) {
    return new Promise(resolve => {
      setTimeout(() => {
        const user = mockDatabase.usuarios.find(user => user.user_id === parseInt(id)) || null;
        resolve(user);
      }, 50);
    });
  }

  static async getUserByEmail(email) {
    return new Promise(resolve => {
      setTimeout(() => {
        const user = mockDatabase.usuarios.find(user => user.email === email) || null;
        resolve(user);
      }, 50);
    });
  }

  static async getUserByProvider(provider, providerId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const user = mockDatabase.usuarios.find(user => 
          user.provider === provider && user.provider_id === providerId
        ) || null;
        resolve(user);
      }, 50);
    });
  }

  static async createUser(userData) {
    return new Promise(resolve => {
      setTimeout(() => {
        const newUser = {
          user_id: ++userIdCounter,
          username: userData.username,
          email: userData.email,
          password_hash: userData.password_hash,
          telefono: userData.telefono || null,
          imagen_perfil: userData.imagen_perfil || null,
          provider: userData.provider || 'email',
          provider_id: userData.provider_id || null,
          created_at: new Date(),
          updated_at: new Date(),
          premium: false,
          premium_expiration: null,
          free_coins: 0,
          paid_coins: 0,
          lifetime_session: 0,
          last_login: null,
          is_active: true
        };
        mockDatabase.usuarios.push(newUser);
        resolve(newUser);
      }, 100);
    });
  }

  static async updateUser(id, updates) {
    return new Promise(resolve => {
      setTimeout(() => {
        const userIndex = mockDatabase.usuarios.findIndex(user => user.user_id === parseInt(id));
        if (userIndex === -1) {
          resolve(null);
          return;
        }
        
        mockDatabase.usuarios[userIndex] = {
          ...mockDatabase.usuarios[userIndex],
          ...updates,
          updated_at: new Date()
        };
        resolve(mockDatabase.usuarios[userIndex]);
      }, 100);
    });
  }

  static async deleteUser(id) {
    return new Promise(resolve => {
      setTimeout(() => {
        const userIndex = mockDatabase.usuarios.findIndex(user => user.user_id === parseInt(id));
        if (userIndex === -1) {
          resolve(false);
          return;
        }
        
        // Eliminar usuario y datos relacionados (simula CASCADE)
        const userId = parseInt(id);
        mockDatabase.usuarios.splice(userIndex, 1);
        mockDatabase.transactions = mockDatabase.transactions.filter(t => t.user_id !== userId);
        mockDatabase.pomo_hist = mockDatabase.pomo_hist.filter(p => p.user_id !== userId);
        mockDatabase.user_feat = mockDatabase.user_feat.filter(uf => uf.user_id !== userId);
        mockDatabase.refresh_tokens = mockDatabase.refresh_tokens.filter(rt => rt.user_id !== userId);
        
        resolve(true);
      }, 150);
    });
  }

    // Actualizar lifetime_session del usuario
    static async updateLifetimeSession(userId, minutes) {
      const userIndex = mockData.usuarios.findIndex(u => u.user_id === userId);
      if (userIndex === -1) {
        throw new Error('Usuario no encontrado');
      }
      
      const currentLifetime = mockData.usuarios[userIndex].lifetime_session || 0;
      mockData.usuarios[userIndex].lifetime_session = currentLifetime + minutes;
      
      return mockData.usuarios[userIndex];
    }

  // TRANSACCIONES
  static async getTransactions(limit = 50, offset = 0) {
    return new Promise(resolve => {
      setTimeout(() => {
        const sorted = [...mockDatabase.transactions].sort((a, b) => b.transaction_date - a.transaction_date);
        resolve(sorted.slice(offset, offset + limit));
      }, 50);
    });
  }

  static async getTransactionsByUser(userId, limit = 20, offset = 0) {
    return new Promise(resolve => {
      setTimeout(() => {
        const userTransactions = mockDatabase.transactions
          .filter(t => t.user_id === parseInt(userId))
          .sort((a, b) => b.transaction_date - a.transaction_date)
          .slice(offset, offset + limit);
        resolve(userTransactions);
      }, 50);
    });
  }

  static async getTransactionById(id) {
    return new Promise(resolve => {
      setTimeout(() => {
        const transaction = mockDatabase.transactions.find(t => t.transaction_id === parseInt(id)) || null;
        resolve(transaction);
      }, 50);
    });
  }

  static async createTransaction(transactionData) {
    return new Promise(resolve => {
      setTimeout(() => {
        const newTransaction = {
          transaction_id: ++transactionIdCounter,
          user_id: parseInt(transactionData.user_id),
          transaction_type: transactionData.transaction_type,
          coin_type: transactionData.coin_type || null,
          amount_free_coins: transactionData.amount_free_coins || 0,
          amount_paid_coins: transactionData.amount_paid_coins || 0,
          money_paid: parseFloat(transactionData.money_paid) || 0.00,
          related_id: transactionData.related_id || null,
          related_type: transactionData.related_type || null,
          description: transactionData.description,
          transaction_date: new Date()
        };
        mockDatabase.transactions.push(newTransaction);
        resolve(newTransaction);
      }, 100);
    });
  }

  static async getTransactionsByType(transactionType, limit = 20) {
    return new Promise(resolve => {
      setTimeout(() => {
        const transactions = mockDatabase.transactions
          .filter(t => t.transaction_type === transactionType)
          .sort((a, b) => b.transaction_date - a.transaction_date)
          .slice(0, limit);
        resolve(transactions);
      }, 50);
    });
  }

  // HISTORIAL POMODORO
  static async getPomodoroHistory(userId = null, limit = 20, offset = 0) {
    return new Promise(resolve => {
      setTimeout(() => {
        let sessions = [...mockDatabase.pomo_hist];
        
        if (userId) {
          sessions = sessions.filter(session => session.user_id === parseInt(userId));
        }
        
        sessions = sessions
          .sort((a, b) => b.start_time - a.start_time)
          .slice(offset, offset + limit);
          
        resolve(sessions);
      }, 50);
    });
  }

  static async getPomodoroSessionById(id) {
    return new Promise(resolve => {
      setTimeout(() => {
        const session = mockDatabase.pomo_hist.find(s => s.session_id === parseInt(id)) || null;
        resolve(session);
      }, 50);
    });
  }

  static async createPomodoroSession(sessionData) {
    return new Promise(resolve => {
      setTimeout(() => {
        const newSession = {
          session_id: ++sessionIdCounter,
          user_id: parseInt(sessionData.user_id),
          duration_minutes: parseInt(sessionData.duration_minutes),
          pomo_type: sessionData.pomo_type,
          start_time: new Date(sessionData.start_time) || new Date(),
          end_time: new Date(sessionData.end_time),
          completed: sessionData.completed !== undefined ? sessionData.completed : true,
          coins_earned: parseInt(sessionData.coins_earned) || 0,
          created_at: new Date()
        };
        mockDatabase.pomo_hist.push(newSession);
        resolve(newSession);
      }, 100);
    });
  }

  static async updatePomodoroSession(id, updates) {
    return new Promise(resolve => {
      setTimeout(() => {
        const sessionIndex = mockDatabase.pomo_hist.findIndex(s => s.session_id === parseInt(id));
        if (sessionIndex === -1) {
          resolve(null);
          return;
        }
        
        mockDatabase.pomo_hist[sessionIndex] = {
          ...mockDatabase.pomo_hist[sessionIndex],
          ...updates
        };
        resolve(mockDatabase.pomo_hist[sessionIndex]);
      }, 100);
    });
  }

  static async getUserStats(userId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const sessions = mockDatabase.pomo_hist.filter(s => s.user_id === parseInt(userId));
        const completedSessions = sessions.filter(s => s.completed);
        
        const stats = {
          total_sessions: sessions.length,
          completed_sessions: completedSessions.length,
          incomplete_sessions: sessions.length - completedSessions.length,
          total_minutes: completedSessions.reduce((sum, s) => sum + s.duration_minutes, 0),
          total_coins_earned: completedSessions.reduce((sum, s) => sum + s.coins_earned, 0),
          work_sessions: completedSessions.filter(s => s.pomo_type === 'work').length,
          rest_sessions: completedSessions.filter(s => s.pomo_type === 'rest').length,
          long_rest_sessions: completedSessions.filter(s => s.pomo_type === 'long_rest').length,
          completion_rate: sessions.length > 0 ? (completedSessions.length / sessions.length * 100).toFixed(2) : 0,
          average_session_length: completedSessions.length > 0 ? 
            (completedSessions.reduce((sum, s) => sum + s.duration_minutes, 0) / completedSessions.length).toFixed(2) : 0
        };
        resolve(stats);
      }, 100);
    });
  }

  static async getSessionsByDateRange(userId, startDate, endDate) {
    return new Promise(resolve => {
      setTimeout(() => {
        const sessions = mockDatabase.pomo_hist.filter(s => 
          s.user_id === parseInt(userId) &&
          s.start_time >= new Date(startDate) &&
          s.start_time <= new Date(endDate)
        ).sort((a, b) => b.start_time - a.start_time);
        
        resolve(sessions);
      }, 50);
    });
  }

  // CARACTERÍSTICAS
  static async getFeatures() {
    return new Promise(resolve => {
      setTimeout(() => {
        const features = mockDatabase.features
          .filter(f => f.is_enabled)
          .sort((a, b) => a.sort_order - b.sort_order);
        resolve(features);
      }, 50);
    });
  }

  static async getFeatureById(id) {
    return new Promise(resolve => {
      setTimeout(() => {
        const feature = mockDatabase.features.find(f => f.feature_id === parseInt(id)) || null;
        resolve(feature);
      }, 50);
    });
  }

  static async getFeaturesByType(type) {
    return new Promise(resolve => {
      setTimeout(() => {
        const features = mockDatabase.features
          .filter(f => f.feature_type === type && f.is_enabled)
          .sort((a, b) => a.sort_order - b.sort_order);
        resolve(features);
      }, 50);
    });
  }

  static async getFeaturesByUnlockType(unlockType) {
    return new Promise(resolve => {
      setTimeout(() => {
        const features = mockDatabase.features
          .filter(f => f.unlock_type === unlockType && f.is_enabled)
          .sort((a, b) => a.sort_order - b.sort_order);
        resolve(features);
      }, 50);
    });
  }

  static async getPremiumFeatures() {
    return new Promise(resolve => {
      setTimeout(() => {
        const features = mockDatabase.features
          .filter(f => f.is_premium && f.is_enabled)
          .sort((a, b) => a.sort_order - b.sort_order);
        resolve(features);
      }, 50);
    });
  }

  static async getUserFeatures(userId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const userFeatures = mockDatabase.user_feat.filter(uf => 
          uf.user_id === parseInt(userId) && uf.is_active
        );
        
        const featuresWithDetails = userFeatures.map(uf => {
          const feature = mockDatabase.features.find(f => f.feature_id === uf.feature_id);
          return {
            ...feature,
            user_feature_id: uf.user_feature_id,
            unlock_date: uf.unlock_date,
            expiration_date: uf.expiration_date,
            is_expired: uf.expiration_date ? new Date() > uf.expiration_date : false
          };
        });
        
        resolve(featuresWithDetails);
      }, 50);
    });
  }

  static async getUserFeaturesByType(userId, type) {
    return new Promise(resolve => {
      setTimeout(() => {
        const userFeatures = mockDatabase.user_feat.filter(uf => 
          uf.user_id === parseInt(userId) && uf.is_active
        );
        
        const featuresWithDetails = userFeatures.map(uf => {
          const feature = mockDatabase.features.find(f => f.feature_id === uf.feature_id);
          return {
            ...feature,
            user_feature_id: uf.user_feature_id,
            unlock_date: uf.unlock_date,
            expiration_date: uf.expiration_date,
            is_expired: uf.expiration_date ? new Date() > uf.expiration_date : false
          };
        }).filter(f => f.feature_type === type);
        
        resolve(featuresWithDetails);
      }, 50);
    });
  }

  static async hasUserFeature(userId, featureId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const userFeature = mockDatabase.user_feat.find(uf => 
          uf.user_id === parseInt(userId) && 
          uf.feature_id === parseInt(featureId) && 
          uf.is_active &&
          (!uf.expiration_date || new Date() <= uf.expiration_date)
        );
        resolve(!!userFeature);
      }, 50);
    });
  }

  static async unlockFeature(userId, featureId, expirationDate = null) {
    return new Promise(resolve => {
      setTimeout(() => {
        const existing = mockDatabase.user_feat.find(uf => 
          uf.user_id === parseInt(userId) && uf.feature_id === parseInt(featureId)
        );
        
        if (existing) {
          existing.is_active = true;
          existing.unlock_date = new Date();
          existing.expiration_date = expirationDate ? new Date(expirationDate) : null;
          resolve(existing);
          return;
        }

        const newUserFeature = {
          user_feature_id: ++userFeatureIdCounter,
          user_id: parseInt(userId),
          feature_id: parseInt(featureId),
          unlock_date: new Date(),
          expiration_date: expirationDate ? new Date(expirationDate) : null,
          is_active: true
        };
        mockDatabase.user_feat.push(newUserFeature);
        resolve(newUserFeature);
      }, 100);
    });
  }

  static async deactivateUserFeature(userId, featureId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const userFeatureIndex = mockDatabase.user_feat.findIndex(uf => 
          uf.user_id === parseInt(userId) && uf.feature_id === parseInt(featureId)
        );
        
        if (userFeatureIndex === -1) {
          resolve(false);
          return;
        }
        
        mockDatabase.user_feat[userFeatureIndex].is_active = false;
        resolve(true);
      }, 50);
    });
  }

  // PAQUETES
  static async getCoinPackages() {
    return new Promise(resolve => {
      setTimeout(() => {
        const packages = mockDatabase.coin_packages
          .filter(p => p.is_enabled)
          .sort((a, b) => a.sort_order - b.sort_order);
        resolve(packages);
      }, 50);
    });
  }

  static async getCoinPackageById(id) {
    return new Promise(resolve => {
      setTimeout(() => {
        const package_ = mockDatabase.coin_packages.find(p => p.package_id === parseInt(id)) || null;
        resolve(package_);
      }, 50);
    });
  }

  static async getPremiumPackages() {
    return new Promise(resolve => {
      setTimeout(() => {
        const packages = mockDatabase.premium_packages
          .filter(p => p.is_enabled)
          .sort((a, b) => a.sort_order - b.sort_order);
        resolve(packages);
      }, 50);
    });
  }

  static async getPremiumPackageById(id) {
    return new Promise(resolve => {
      setTimeout(() => {
        const package_ = mockDatabase.premium_packages.find(p => p.premium_package_id === parseInt(id)) || null;
        resolve(package_);
      }, 50);
    });
  }

  // TOKENS DE REFRESCO
  static async createRefreshToken(tokenData) {
    return new Promise(resolve => {
      setTimeout(() => {
        const newToken = {
          token_id: ++tokenIdCounter,
          token: tokenData.token,
          user_id: parseInt(tokenData.user_id),
          issued_at: new Date(),
          expires_at: new Date(tokenData.expires_at),
          is_revoked: false,
          user_agent: tokenData.user_agent || null,
          ip_address: tokenData.ip_address || null
        };
        mockDatabase.refresh_tokens.push(newToken);
        resolve(newToken);
      }, 100);
    });
  }

  static async getRefreshToken(token) {
    return new Promise(resolve => {
      setTimeout(() => {
        const refreshToken = mockDatabase.refresh_tokens.find(t => 
          t.token === token && !t.is_revoked && new Date() < t.expires_at
        ) || null;
        resolve(refreshToken);
      }, 50);
    });
  }

  static async revokeRefreshToken(token) {
    return new Promise(resolve => {
      setTimeout(() => {
        const tokenIndex = mockDatabase.refresh_tokens.findIndex(t => t.token === token);
        if (tokenIndex !== -1) {
          mockDatabase.refresh_tokens[tokenIndex].is_revoked = true;
          resolve(true);
          return;
        }
        resolve(false);
      }, 50);
    });
  }

  static async revokeAllUserTokens(userId) {
    return new Promise(resolve => {
      setTimeout(() => {
        let revokedCount = 0;
        mockDatabase.refresh_tokens.forEach(token => {
          if (token.user_id === parseInt(userId) && !token.is_revoked) {
            token.is_revoked = true;
            revokedCount++;
          }
        });
        resolve(revokedCount);
      }, 100);
    });
  }

  static async cleanExpiredTokens() {
    return new Promise(resolve => {
      setTimeout(() => {
        const now = new Date();
        const initialCount = mockDatabase.refresh_tokens.length;
        mockDatabase.refresh_tokens = mockDatabase.refresh_tokens.filter(token => 
          !token.is_revoked && now < token.expires_at
        );
        const cleanedCount = initialCount - mockDatabase.refresh_tokens.length;
        resolve(cleanedCount);
      }, 100);
    });
  }

  // OPERACIONES CON MONEDAS
  static async updateUserCoins(userId, freeCoinsChange = 0, paidCoinsChange = 0) {
    return new Promise(resolve => {
      setTimeout(() => {
        const userIndex = mockDatabase.usuarios.findIndex(u => u.user_id === parseInt(userId));
        if (userIndex === -1) {
          resolve(null);
          return;
        }
        
        const user = mockDatabase.usuarios[userIndex];
        user.free_coins = Math.max(0, user.free_coins + freeCoinsChange);
        user.paid_coins = Math.max(0, user.paid_coins + paidCoinsChange);
        user.updated_at = new Date();
        
        resolve({
          user_id: user.user_id,
          free_coins: user.free_coins,
          paid_coins: user.paid_coins
        });
      }, 100);
    });
  }

  static async canAffordFeature(userId, featureId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const user = mockDatabase.usuarios.find(u => u.user_id === parseInt(userId));
        const feature = mockDatabase.features.find(f => f.feature_id === parseInt(featureId));
        
        if (!user || !feature) {
          resolve({ canAfford: false, reason: 'Usuario o característica no encontrada' });
          return;
        }
        
        if (feature.unlock_type === 'free') {
          resolve({ canAfford: true, reason: 'Característica gratuita' });
          return;
        }
        
        if (feature.is_premium && !user.premium) {
          resolve({ canAfford: false, reason: 'Requiere suscripción premium' });
          return;
        }
        
        const hasEnoughFreeCoins = feature.cost_free_coins > 0 ? user.free_coins >= feature.cost_free_coins : true;
        const hasEnoughPaidCoins = feature.cost_paid_coins > 0 ? user.paid_coins >= feature.cost_paid_coins : true;
        
        if (!hasEnoughFreeCoins) {
          resolve({ 
            canAfford: false, 
            reason: `Monedas gratis insuficientes. Necesitas ${feature.cost_free_coins}, tienes ${user.free_coins}` 
          });
          return;
        }
        
        if (!hasEnoughPaidCoins) {
          resolve({ 
            canAfford: false, 
            reason: `Monedas premium insuficientes. Necesitas ${feature.cost_paid_coins}, tienes ${user.paid_coins}` 
          });
          return;
        }
        
        resolve({ canAfford: true, reason: 'Suficientes recursos' });
      }, 50);
    });
  }

  // FUNCIONES DE BÚSQUEDA Y FILTRADO
  static async searchFeatures(query, filters = {}) {
    return new Promise(resolve => {
      setTimeout(() => {
        let features = mockDatabase.features.filter(f => f.is_enabled);
        
        // Búsqueda por texto
        if (query) {
          const lowerQuery = query.toLowerCase();
          features = features.filter(f => 
            f.name.toLowerCase().includes(lowerQuery) ||
            f.description.toLowerCase().includes(lowerQuery)
          );
        }
        
        // Filtros
        if (filters.type) {
          features = features.filter(f => f.feature_type === filters.type);
        }
        
        if (filters.unlockType) {
          features = features.filter(f => f.unlock_type === filters.unlockType);
        }
        
        if (filters.isPremium !== undefined) {
          features = features.filter(f => f.is_premium === filters.isPremium);
        }
        
        if (filters.maxCostFree) {
          features = features.filter(f => f.cost_free_coins <= filters.maxCostFree);
        }
        
        if (filters.maxCostPaid) {
          features = features.filter(f => f.cost_paid_coins <= filters.maxCostPaid);
        }
        
        features.sort((a, b) => a.sort_order - b.sort_order);
        resolve(features);
      }, 100);
    });
  }

  static async getAnalytics(userId = null) {
    return new Promise(resolve => {
      setTimeout(() => {
        let sessions = mockDatabase.pomo_hist;
        let transactions = mockDatabase.transactions;
        let users = mockDatabase.usuarios;
        
        if (userId) {
          sessions = sessions.filter(s => s.user_id === parseInt(userId));
          transactions = transactions.filter(t => t.user_id === parseInt(userId));
          users = users.filter(u => u.user_id === parseInt(userId));
        }
        
        const analytics = {
          users: {
            total: users.length,
            active: users.filter(u => u.is_active).length,
            premium: users.filter(u => u.premium).length,
            total_free_coins: users.reduce((sum, u) => sum + u.free_coins, 0),
            total_paid_coins: users.reduce((sum, u) => sum + u.paid_coins, 0)
          },
          sessions: {
            total: sessions.length,
            completed: sessions.filter(s => s.completed).length,
            work_sessions: sessions.filter(s => s.pomo_type === 'work').length,
            rest_sessions: sessions.filter(s => s.pomo_type === 'rest').length,
            long_rest_sessions: sessions.filter(s => s.pomo_type === 'long_rest').length,
            total_minutes: sessions.filter(s => s.completed).reduce((sum, s) => sum + s.duration_minutes, 0),
            total_coins_earned: sessions.reduce((sum, s) => sum + s.coins_earned, 0)
          },
          transactions: {
            total: transactions.length,
            total_money_spent: transactions.reduce((sum, t) => sum + t.money_paid, 0),
            coins_purchased: transactions
              .filter(t => t.transaction_type === 'buy_paid_coins')
              .reduce((sum, t) => sum + t.amount_paid_coins, 0),
            coins_earned: transactions
              .filter(t => t.transaction_type === 'earn_free_coins')
              .reduce((sum, t) => sum + t.amount_free_coins, 0),
            coins_spent: transactions
              .filter(t => t.transaction_type.includes('spend_'))
              .reduce((sum, t) => sum + t.amount_free_coins + t.amount_paid_coins, 0)
          },
          features: {
            total: mockDatabase.features.length,
            enabled: mockDatabase.features.filter(f => f.is_enabled).length,
            premium: mockDatabase.features.filter(f => f.is_premium).length,
            unlocked_total: mockDatabase.user_feat.filter(uf => uf.is_active).length
          }
        };
        
        resolve(analytics);
      }, 150);
    });
  }

  // UTILIDADES AVANZADAS
  static async exportUserData(userId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const user = mockDatabase.usuarios.find(u => u.user_id === parseInt(userId));
        if (!user) {
          resolve(null);
          return;
        }
        
        const userData = {
          user: user,
          transactions: mockDatabase.transactions.filter(t => t.user_id === parseInt(userId)),
          sessions: mockDatabase.pomo_hist.filter(s => s.user_id === parseInt(userId)),
          features: mockDatabase.user_feat
            .filter(uf => uf.user_id === parseInt(userId))
            .map(uf => ({
              ...uf,
              feature_details: mockDatabase.features.find(f => f.feature_id === uf.feature_id)
            })),
          tokens: mockDatabase.refresh_tokens.filter(t => t.user_id === parseInt(userId))
        };
        
        resolve(userData);
      }, 200);
    });
  }

  static async resetDatabase() {
    return new Promise(resolve => {
      setTimeout(() => {
        // Reiniciar contadores
        userIdCounter = 3;
        transactionIdCounter = 8;
        sessionIdCounter = 10;
        featureIdCounter = 12;
        userFeatureIdCounter = 5;
        tokenIdCounter = 3;
        packageIdCounter = 4;
        premiumPackageIdCounter = 4;
        
        // Limpiar todas las tablas y restaurar datos iniciales
        // (aquí irían los datos iniciales de nuevo)
        console.log('Base de datos reiniciada');
        resolve(true);
      }, 100);
    });
  }

  static getDatabase() {
    return mockDatabase;
  }

  static async validateEnums() {
    return new Promise(resolve => {
      setTimeout(() => {
        const errors = [];
        
        // Validar usuarios
        mockDatabase.usuarios.forEach(user => {
          if (!PROVIDER_ENUM.includes(user.provider)) {
            errors.push(`Usuario ${user.user_id}: provider inválido '${user.provider}'`);
          }
        });
        
        // Validar transacciones
        mockDatabase.transactions.forEach(transaction => {
          if (!TRANSACTION_TYPE_ENUM.includes(transaction.transaction_type)) {
            errors.push(`Transacción ${transaction.transaction_id}: transaction_type inválido '${transaction.transaction_type}'`);
          }
          if (transaction.coin_type && !COIN_TYPE_ENUM.includes(transaction.coin_type)) {
            errors.push(`Transacción ${transaction.transaction_id}: coin_type inválido '${transaction.coin_type}'`);
          }
          if (transaction.related_type && !RELATED_TYPE_ENUM.includes(transaction.related_type)) {
            errors.push(`Transacción ${transaction.transaction_id}: related_type inválido '${transaction.related_type}'`);
          }
        });
        
        // Validar sesiones pomodoro
        mockDatabase.pomo_hist.forEach(session => {
          if (!POMO_TYPE_ENUM.includes(session.pomo_type)) {
            errors.push(`Sesión ${session.session_id}: pomo_type inválido '${session.pomo_type}'`);
          }
        });
        
        // Validar características
        mockDatabase.features.forEach(feature => {
          if (!FEATURE_TYPE_ENUM.includes(feature.feature_type)) {
            errors.push(`Característica ${feature.feature_id}: feature_type inválido '${feature.feature_type}'`);
          }
          if (!UNLOCK_TYPE_ENUM.includes(feature.unlock_type)) {
            errors.push(`Característica ${feature.feature_id}: unlock_type inválido '${feature.unlock_type}'`);
          }
        });
        
        resolve({ isValid: errors.length === 0, errors });
      }, 50);
    });
  }
}

// Exportar para uso en módulos ES6 y CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    MockDatabase, 
    ENUMS: {
      PROVIDER_ENUM,
      POMO_TYPE_ENUM,
      FEATURE_TYPE_ENUM,
      UNLOCK_TYPE_ENUM,
      TRANSACTION_TYPE_ENUM,
      COIN_TYPE_ENUM,
      RELATED_TYPE_ENUM
    }
  };
}

// Disponible globalmente en el navegador
if (typeof window !== 'undefined') {
  window.MockDatabase = MockDatabase;
  window.POMODORO_ENUMS = {
    PROVIDER_ENUM,
    POMO_TYPE_ENUM,
    FEATURE_TYPE_ENUM,
    UNLOCK_TYPE_ENUM,
    TRANSACTION_TYPE_ENUM,
    COIN_TYPE_ENUM,
    RELATED_TYPE_ENUM
  };
}

// Función de inicialización para mostrar información de la base de datos
const initMockDatabase = async () => {
  console.log('🚀 Mock Database para Pomodoro App cargada correctamente');
  console.log('📊 Estadísticas iniciales:');
  
  const stats = await MockDatabase.getAnalytics();
  console.log('   👥 Usuarios:', stats.users.total, '(Premium:', stats.users.premium + ')');
  console.log('   ⏱️  Sesiones:', stats.sessions.total, '(Completadas:', stats.sessions.completed + ')');
  console.log('   💰 Transacciones:', stats.transactions.total);
  console.log('   🎨 Características:', stats.features.total, '(Habilitadas:', stats.features.enabled + ')');
  
  const validation = await MockDatabase.validateEnums();
  if (validation.isValid) {
    console.log('✅ Todos los enums son válidos');
  } else {
    console.warn('⚠️  Errores de validación encontrados:', validation.errors);
  }
  
  console.log('💡 Ejemplo de uso:');
  console.log('   const user = await MockDatabase.getUserById(1);');
  console.log('   const features = await MockDatabase.getFeatures();');
  console.log('   const stats = await MockDatabase.getUserStats(1);');
};

// Ejecutar inicialización
initMockDatabase();

export { MockDatabase };