import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [lifetimeMinutes, setLifetimeMinutes] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Redirigir si no hay usuario
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Cargar historial y lifetime
  useEffect(() => {
    if (user) {
      // Cargar historial completo
      const savedHistory = localStorage.getItem(`pomodoroHistory_${user.user_id}`);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        
        // Filtrar solo los últimos 7 días
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentHistory = parsedHistory.filter(item => 
          new Date(item.completedAt) >= sevenDaysAgo
        );
        
        // Ordenar de más reciente a más antiguo
        recentHistory.sort((a, b) => 
          new Date(b.completedAt) - new Date(a.completedAt)
        );
        
        setHistory(recentHistory);
      }
      
      // Cargar lifetime desde localStorage o usar el valor del usuario
      const savedLifetime = localStorage.getItem(`lifetime_${user.user_id}`);
      if (savedLifetime) {
        setLifetimeMinutes(parseInt(savedLifetime));
      } else {
        setLifetimeMinutes(user.lifetime_session || 0);
      }
    }
  }, [user]);

  // Calcular paginación
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHistory = history.slice(startIndex, endIndex);

  // Función para obtener el nombre del modo
  const getTypeName = (type) => {
    switch (type) {
      case 'pomodoro':
        return 'Pomodoro';
      case 'short_break':
        return 'Descanso Corto';
      case 'long_break':
        return 'Descanso Largo';
      default:
        return 'Sesión';
    }
  };

  // Función para obtener el color del modo
  const getTypeColor = (type) => {
    switch (type) {
      case 'pomodoro':
        return 'text-red-600 bg-red-50';
      case 'short_break':
        return 'text-green-600 bg-green-50';
      case 'long_break':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor((now - date) / (1000 * 60));
      return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    } else if (diffInHours < 48) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // Función para formatear horas y minutos
  const formatLifetime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins} ${mins === 1 ? 'minuto' : 'minutos'}`;
    } else if (mins === 0) {
      return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    } else {
      return `${hours} ${hours === 1 ? 'hora' : 'horas'} y ${mins} ${mins === 1 ? 'minuto' : 'minutos'}`;
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Historial de Pomos</h1>

      {/* Sección de tiempo total */}
      {/*<div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tiempo Total de Pomodoros</h2>
        <div className="text-center">
          <div className="text-5xl font-bold text-red-600 mb-2">
            {formatLifetime(lifetimeMinutes)}
          </div>
          <p className="text-gray-600">
            Has dedicado este tiempo a tus sesiones de pomodoro
          </p>
        </div>
      </div>*/}

      {/* Sección de historial de 7 días */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Últimos 7 días ({history.length} sesiones)
        </h2>
        
        {history.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No has completado ninguna sesión en los últimos 7 días
          </p>
        ) : (
          <>
            {/* Lista de sesiones */}
            <div className="space-y-3 mb-6">
              {currentHistory.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(item.type)}`}>
                      {getTypeName(item.type)}
                    </span>
                    <span className="text-gray-700 font-medium">
                      {item.duration} minutos
                    </span>
                    {item.freemodoroCredited && (
                      <span className="text-yellow-600 text-sm">
                        +{item.freemodoroCredited} 🪙
                      </span>
                    )}
                  </div>
                  <span className="text-gray-500 text-sm">
                    {formatDate(item.completedAt)}
                  </span>
                </div>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        currentPage === index + 1
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Estadísticas adicionales */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-red-700 font-semibold mb-1">Pomodoros</h3>
          <p className="text-2xl font-bold text-red-600">
            {history.filter(h => h.type === 'pomodoro').length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-green-700 font-semibold mb-1">Descansos Cortos</h3>
          <p className="text-2xl font-bold text-green-600">
            {history.filter(h => h.type === 'short_break').length}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-blue-700 font-semibold mb-1">Descansos Largos</h3>
          <p className="text-2xl font-bold text-blue-600">
            {history.filter(h => h.type === 'long_break').length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default History;