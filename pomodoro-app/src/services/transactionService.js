// Servicio simulado para manejar transacciones de monedas
import { MockDatabase } from '../database/pomodoro_db_mock.js';

class TransactionService {
  // Crea transacción de Freemodoros ganados por Pomodoro
  static async createPomodoroTransaction(userId, amount, pomodoroMinutes) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
  
      // Crear transacción
      const transaction = await MockDatabase.createTransaction({
        user_id: userId,
        transaction_type: 'earn_free_coins',
        coin_type: 'free',
        amount_free_coins: amount,
        amount_paid_coins: 0,
        description: `Pomodoro de ${pomodoroMinutes} minutos completado`,
        related_type: 'pomodoro_completion',
        related_id: Date.now() // Simulamos un ID único
      });
  
      await MockDatabase.updateUserCoins(userId, amount, 0);
  
      // Obtener usuario ACTUALIZADO después de la transacción
      const updatedUser = await MockDatabase.getUserById(userId);
      
      return {
        success: true,
        data: {
          transaction,
          newBalance: {
            free_coins: updatedUser.free_coins,
            paid_coins: updatedUser.paid_coins
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: 'TRANSACTION_ERROR'
        }
      };
    }
  }

  // Obtener historial de transacciones del usuario
  static async getUserTransactions(userId, limit = 50) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const transactions = await MockDatabase.getTransactionsByUser(userId);
      
      // Ordenar por fecha descendente y limitar
      const sortedTransactions = transactions
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, limit);

      return {
        success: true,
        data: sortedTransactions
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: 'FETCH_ERROR'
        }
      };
    }
  }

  // Obtener balance actual del usuario
  static async getUserBalance(userId) {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const user = await MockDatabase.getUserById(userId);
      
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      return {
        success: true,
        data: {
          free_coins: user.free_coins,
          paid_coins: user.paid_coins,
          is_premium: user.is_premium,
          premium_expiration: user.premium_expiration
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: 'BALANCE_ERROR'
        }
      };
    }
  }

  // Obtener estadísticas de Pomodoros del usuario
  static async getPomodoroStats(userId) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const transactions = await MockDatabase.getTransactionsByUser(userId);
      
      // Filtrar solo transacciones de Pomodoros
      const pomodoroTransactions = transactions.filter(t => 
        t.related_type === 'pomodoro_completion'
      );

      // Calcular estadísticas
      const totalPomodoros = pomodoroTransactions.length;
      const totalFreemodoros = pomodoroTransactions.reduce((sum, t) => 
        sum + t.amount_free_coins, 0
      );
      
      // Estadísticas por día (últimos 7 días)
      const today = new Date();
      const last7Days = {};
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        last7Days[dateKey] = 0;
      }

      pomodoroTransactions.forEach(t => {
        const dateKey = new Date(t.created_at).toISOString().split('T')[0];
        if (last7Days.hasOwnProperty(dateKey)) {
          last7Days[dateKey]++;
        }
      });

      return {
        success: true,
        data: {
          totalPomodoros,
          totalFreemodoros,
          dailyStats: last7Days,
          avgPomodorosPerDay: totalPomodoros / 7
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: 'STATS_ERROR'
        }
      };
    }
  }
}

export default TransactionService;