import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSound } from '../../hooks/useSound';
import TransactionService from '../../services/transactionService';
import { MockDatabase } from '../../database/pomodoro_db_mock';
import toast from 'react-hot-toast';

// Modos del Timer
const TIMER_MODES = {
  POMODORO: 'pomodoro',
  SHORT_BREAK: 'shortBreak',
  LONG_BREAK: 'longBreak'
};

// Valores predeterminados
const DEFAULT_TIMES = {
  [TIMER_MODES.POMODORO]: 25,
  [TIMER_MODES.SHORT_BREAK]: 5,
  [TIMER_MODES.LONG_BREAK]: 15
};

// Colores los modos
const MODE_COLORS = {
  [TIMER_MODES.POMODORO]: 'bg-red-500',
  [TIMER_MODES.SHORT_BREAK]: 'bg-green-500',
  [TIMER_MODES.LONG_BREAK]: 'bg-blue-500'
};

const PomodoroTimer = () => {
  const { user, updateUserCoins } = useAuth();
  const { playPomodoroComplete, playShortBreakComplete, playLongBreakComplete, playClickSound } = useSound();
  
  // Inicializar con customTimes
  const [customTimes, setCustomTimes] = useState(() => {
    const saved = localStorage.getItem('pomodoroCustomTimes');
    return saved ? JSON.parse(saved) : DEFAULT_TIMES;
  });
  
  // Luego usa customTimes para inicializar los demás estados
  const [mode, setMode] = useState(TIMER_MODES.POMODORO);
  const [timeLeft, setTimeLeft] = useState(customTimes[TIMER_MODES.POMODORO] * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0); // Comienza en 0/4
  const [cycleCount, setCycleCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  const intervalRef = useRef(null);
  const hasCompletedRef = useRef(false);

  // Resetear flag de completado al cambiar modo o contador
  useEffect(() => {
    hasCompletedRef.current = false;
  }, [mode, pomodoroCount]);

  // Guardar estado en localStorage
  useEffect(() => {
    const state = {
      mode,
      timeLeft,
      pomodoroCount,
      cycleCount,
      customTimes,
      lastUpdate: Date.now()
    };
    localStorage.setItem('pomodoroState', JSON.stringify(state));
  }, [mode, timeLeft, pomodoroCount, cycleCount, customTimes]);

  // Restaurar estado desde localStorage al cargar
  useEffect(() => {
    const savedState = localStorage.getItem('pomodoroState');
    if (savedState) {
      const state = JSON.parse(savedState);
      setMode(state.mode);
      setTimeLeft(state.timeLeft);
      setPomodoroCount(state.pomodoroCount || 0); // Iniciar en 0 si no existe
      setCycleCount(state.cycleCount || 0);
      if (state.customTimes) {
        setCustomTimes(state.customTimes);
      }
    }
  }, []);

  // Solicitar permisos de notificación
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Función para mostrar notificación
  const showNotification = useCallback((title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    }
  }, []);

  // Función para completar un timer
  const completeTimer = useCallback(async () => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    
    if (mode === TIMER_MODES.POMODORO) {
      playPomodoroComplete();
      const newCount = pomodoroCount + 1;
      // Calcular y agregar Freemodoros
      const freemodoresToAdd = customTimes[TIMER_MODES.POMODORO];
      if (user) {
        // Crear transacción en la base de datos
        const transactionResult = await TransactionService.createPomodoroTransaction(
          user.user_id,
          freemodoresToAdd,
          customTimes[TIMER_MODES.POMODORO]
        );
        
        if (transactionResult.success) {
          // Actualizar el context con el nuevo balance
          updateUserCoins(
            transactionResult.data.newBalance.free_coins,
            transactionResult.data.newBalance.paid_coins
          );
          
          // Notificación a usuario
          toast.success(`¡+${freemodoresToAdd} Freemodoros ganados! 🪙`, {
            duration: 4000,
            icon: '💰',
          });
        }
      }
      
      // Guardar en historial si está logueado
      if (user) {
        const history = JSON.parse(localStorage.getItem(`pomodoroHistory_${user.user_id}`) || '[]');
        history.push({
          completedAt: new Date().toISOString(),
          duration: customTimes[TIMER_MODES.POMODORO],
          type: 'pomodoro',
          cycleNumber: cycleCount + 1,
          pomodoroInCycle: newCount,
          freemodoroCredited: freemodoresToAdd
        });
        localStorage.setItem(`pomodoroHistory_${user.user_id}`, JSON.stringify(history));
        
        // Actualizar lifetime_session
        try {
          await MockDatabase.updateLifetimeSession(user.user_id, customTimes[TIMER_MODES.POMODORO]);
          const currentLifetime = user.lifetime_session || 0;
          const newLifetime = currentLifetime + customTimes[TIMER_MODES.POMODORO];
          localStorage.setItem(`lifetime_${user.user_id}`, newLifetime.toString());
        } catch (error) {
          console.error('Error actualizando lifetime_session:', error);
        }
      }
      
      // Verificar ciclo completo (después de 4 pomodoros)
      if (newCount >= 4) {
        setPomodoroCount(0); // Resetear contador
        setCycleCount(prev => prev + 1);
        
        // Descanso largo
        setMode(TIMER_MODES.LONG_BREAK);
        setTimeLeft(customTimes[TIMER_MODES.LONG_BREAK] * 60);
        showNotification('¡Ciclo completado! 🎉', 'Has completado 4 pomodoros. Tiempo para un descanso largo');
        toast.success('¡Felicidades! Completaste un ciclo de 4 pomodoros 🎉');
      } else {
        // Descanso corto
        setPomodoroCount(newCount);
        setMode(TIMER_MODES.SHORT_BREAK);
        setTimeLeft(customTimes[TIMER_MODES.SHORT_BREAK] * 60);
        showNotification('¡Pomodoro completado!', `${newCount}/4 completados. Tiempo para un descanso corto`);
        toast.success(`¡Pomodoro ${newCount}/4 completado! Toma un descanso`);
      }
    } else if (mode === TIMER_MODES.SHORT_BREAK) {
      playShortBreakComplete();
      
      // Guardar descanso corto en historial
      if (user) {
        const history = JSON.parse(localStorage.getItem(`pomodoroHistory_${user.user_id}`) || '[]');
        history.push({
          completedAt: new Date().toISOString(),
          duration: customTimes[TIMER_MODES.SHORT_BREAK],
          type: 'short_break',
          cycleNumber: cycleCount + 1,
          pomodoroInCycle: pomodoroCount
        });
        localStorage.setItem(`pomodoroHistory_${user.user_id}`, JSON.stringify(history));
      }
      
      setMode(TIMER_MODES.POMODORO);
      setTimeLeft(customTimes[TIMER_MODES.POMODORO] * 60);
      showNotification('¡Descanso terminado!', 'Tiempo de volver al trabajo');
      toast('¡A trabajar! 💪', { icon: '🍅' });
    } else { // LONG_BREAK
      playLongBreakComplete();
      
      // Guardar descanso largo en historial
      if (user) {
        const history = JSON.parse(localStorage.getItem(`pomodoroHistory_${user.user_id}`) || '[]');
        history.push({
          completedAt: new Date().toISOString(),
          duration: customTimes[TIMER_MODES.LONG_BREAK],
          type: 'long_break',
          cycleNumber: cycleCount,
          pomodoroInCycle: 0
        });
        localStorage.setItem(`pomodoroHistory_${user.user_id}`, JSON.stringify(history));
      }
      
      // Después de un descanso largo, volver a pomodoro
      setMode(TIMER_MODES.POMODORO);
      setTimeLeft(customTimes[TIMER_MODES.POMODORO] * 60);
      showNotification('¡Gran descanso completado!', '¡Listo para un nuevo ciclo!');
      toast.success('¡Excelente! Comenzando nuevo ciclo 🚀');
    }
    
    // Continuar automáticamente
    setIsRunning(true);
  }, [mode, pomodoroCount, cycleCount, customTimes, playPomodoroComplete, playShortBreakComplete, playLongBreakComplete, showNotification, user, updateUserCoins]);

  // Timer principal - CORECCIÓN CLAVE
  useEffect(() => {
    if (isRunning) {
      if (timeLeft === 0) {
        if (!hasCompletedRef.current) {
          completeTimer().catch(console.error);
        }
        return;
      }

      intervalRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }

    return () => clearTimeout(intervalRef.current);
  }, [isRunning, timeLeft, completeTimer]);

  // Funciones de control
  const toggleTimer = () => {
    playClickSound();
    setIsRunning(!isRunning);
    clearTimeout(intervalRef.current);
  };

  const resetTimer = () => {
    playClickSound(); 
    setTimeLeft(customTimes[mode] * 60);
    clearTimeout(intervalRef.current);
    setIsRunning(true);
    hasCompletedRef.current = false;
  };

  const skipTimer = () => {
    playClickSound();
    // Al saltar, cambiar de modo sin dar recompensas
    if (mode === TIMER_MODES.POMODORO) {
      const newCount = pomodoroCount + 1;
      
      if (newCount > 4) {
        setPomodoroCount(1);
        setCycleCount(prev => prev + 1);
        setMode(TIMER_MODES.LONG_BREAK);
        setTimeLeft(customTimes[TIMER_MODES.LONG_BREAK] * 60);
      } else {
        setPomodoroCount(newCount);
        setMode(TIMER_MODES.SHORT_BREAK);
        setTimeLeft(customTimes[TIMER_MODES.SHORT_BREAK] * 60);
      }
    } else {
      // Después de un descanso, volver a pomodoro
      setMode(TIMER_MODES.POMODORO);
      setTimeLeft(customTimes[TIMER_MODES.POMODORO] * 60);
    }
    
    clearTimeout(intervalRef.current);
    setIsRunning(true);
    hasCompletedRef.current = false;
  };

  const changeMode = (newMode) => {
    playClickSound();
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(customTimes[newMode] * 60);
    hasCompletedRef.current = false;
  };

  const updateCustomTime = (timerMode, minutes) => {
    const newTimes = { ...customTimes, [timerMode]: minutes };
    setCustomTimes(newTimes);
    localStorage.setItem('pomodoroCustomTimes', JSON.stringify(newTimes));
    
    if (timerMode === mode && !isRunning) {
      setTimeLeft(minutes * 60);
    }
  };

  // Formatear tiempo
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calcular progreso para el círculo
  const progress = (timeLeft / (customTimes[mode] * 60)) * 100;
  const circumference = 2 * Math.PI * 120; // Radio de 120
  const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-8">
      {/* Indicador de ciclos completados */}
      {cycleCount > 0 && (
        <div className="mb-4 text-sm text-gray-600">
          Ciclos completados: <span className="font-semibold">{cycleCount}</span>
        </div>
      )}

      {/* Modos */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => changeMode(TIMER_MODES.POMODORO)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            mode === TIMER_MODES.POMODORO
              ? 'bg-red-500 text-white scale-105'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Pomodoro
        </button>
        <button
          onClick={() => changeMode(TIMER_MODES.SHORT_BREAK)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            mode === TIMER_MODES.SHORT_BREAK
              ? 'bg-green-500 text-white scale-105'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Descanso Corto
        </button>
        <button
          onClick={() => changeMode(TIMER_MODES.LONG_BREAK)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            mode === TIMER_MODES.LONG_BREAK
              ? 'bg-blue-500 text-white scale-105'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Descanso Largo
        </button>
      </div>

      {/* Timer circular */}
      <div className="relative w-72 h-72 mb-8">
        <svg className="w-full h-full transform -rotate-90">
          {/* Círculo de fondo */}
          <circle
            cx="144"
            cy="144"
            r="120"
            stroke="#e5e7eb"
            strokeWidth="12"
            fill="none"
          />
          {/* Círculo de progreso */}
          <circle
            cx="144"
            cy="144"
            r="120"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className={`transition-all duration-300 ${
              mode === TIMER_MODES.POMODORO ? 'text-red-500' :
              mode === TIMER_MODES.SHORT_BREAK ? 'text-green-500' :
              'text-blue-500'
            }`}
          />
        </svg>
        {/* Tiempo en el centro */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-6xl font-bold text-gray-800">
            {formatTime(timeLeft)}
          </div>
          <div className="text-sm text-gray-600 mt-2">
            {pomodoroCount}/4 Pomodoros
          </div>
          {/* Mostrar potencial de Freemodoros solo si es un Pomodoro y hay usuario */}
          {mode === TIMER_MODES.POMODORO && user && (
            <div className="text-xs text-gray-500 mt-1">
              +{customTimes[TIMER_MODES.POMODORO]} Freemodoros al completar
            </div>
          )}
        </div>
      </div>

      {/* Controles */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={toggleTimer}
          className={`px-8 py-3 rounded-lg font-medium text-white transition-all transform hover:scale-105 ${
            mode === TIMER_MODES.POMODORO ? 'bg-red-500 hover:bg-red-600' :
            mode === TIMER_MODES.SHORT_BREAK ? 'bg-green-500 hover:bg-green-600' :
            'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isRunning ? 'Pausar' : 'Iniciar'}
        </button>
        <button
          onClick={resetTimer}
          className="px-6 py-3 rounded-lg font-medium bg-gray-200 hover:bg-gray-300 transition-all"
        >
          Reiniciar
        </button>
        <button
          onClick={skipTimer}
          className="px-6 py-3 rounded-lg font-medium bg-gray-200 hover:bg-gray-300 transition-all"
        >
          Saltar
        </button>
      </div>

      {/* Botón de configuración */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="text-gray-600 hover:text-gray-800 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Panel de configuración */}
      {showSettings && (
        <div className="mt-6 p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Configuración de Tiempos</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pomodoro (minutos)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={customTimes[TIMER_MODES.POMODORO]}
                onChange={(e) => updateCustomTime(TIMER_MODES.POMODORO, parseInt(e.target.value) || 25)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descanso Corto (minutos)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={customTimes[TIMER_MODES.SHORT_BREAK]}
                onChange={(e) => updateCustomTime(TIMER_MODES.SHORT_BREAK, parseInt(e.target.value) || 5)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descanso Largo (minutos)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={customTimes[TIMER_MODES.LONG_BREAK]}
                onChange={(e) => updateCustomTime(TIMER_MODES.LONG_BREAK, parseInt(e.target.value) || 15)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <button
            onClick={() => setShowSettings(false)}
            className="mt-4 w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer;