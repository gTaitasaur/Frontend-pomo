import { useCallback, useRef } from 'react';

// Hook personalizado para manejar sonidos
export const useSound = () => {
  const audioContextRef = useRef(null);

  // Función base para reproducir un sonido de notificación
  const playNotificationSound = useCallback((frequency = 800, duration = 0.5) => {
    try {
      // Crear o reutilizar el contexto de audio
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      
      // Crear nodos
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Conectar nodos
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Configurar oscilador
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      // Configurar volumen con fade out
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      // Reproducir
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
      
    } catch (error) {
      console.error('Error al reproducir sonido:', error);
    }
  }, []);

  // Sonido para Pomodoro completado: Secuencia ascendente energética
  const playPomodoroComplete = useCallback(() => {
    playNotificationSound(600, 0.15);
    setTimeout(() => playNotificationSound(800, 0.15), 150);
    setTimeout(() => playNotificationSound(1000, 0.3), 300);
  }, [playNotificationSound]);

  // Sonido para Descanso Corto completado: Más suave y relajante
  const playShortBreakComplete = useCallback(() => {
    playNotificationSound(500, 0.2);
    setTimeout(() => playNotificationSound(700, 0.3), 200);
  }, [playNotificationSound]);

  // Sonido para Descanso Largo completado: Celebración especial con 4 notas
  const playLongBreakComplete = useCallback(() => {
    playNotificationSound(400, 0.15);
    setTimeout(() => playNotificationSound(600, 0.15), 150);
    setTimeout(() => playNotificationSound(800, 0.15), 300);
    setTimeout(() => playNotificationSound(1200, 0.4), 450);
  }, [playNotificationSound]);

  // Sonido para clicks: Sutil retroalimentación
  const playClickSound = useCallback(() => {
    playNotificationSound(400, 0.1);
  }, [playNotificationSound]);

  return {
    playNotificationSound,
    playPomodoroComplete,
    playShortBreakComplete,
    playLongBreakComplete,
    playClickSound
  };
};