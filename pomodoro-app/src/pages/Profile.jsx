import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthService from '../services/authService';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  // Redirige si no hay usuario
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    
    try {
      // Cambia contraseña usando el servicio
      const result = await AuthService.changePassword(
        user.user_id,
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      if (result.success) {
        toast.success('Contraseña actualizada exitosamente');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordForm(false);
      } else {
        toast.error(result.error.message || 'Error al cambiar la contraseña');
      }
    } catch (error) {
      toast.error('Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Mi Perfil</h1>

      {/* Información del usuario */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Información Personal</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Nombre de usuario</label>
            <p className="mt-1 text-lg text-gray-800">{user.username}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <p className="mt-1 text-lg text-gray-800">{user.email}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600">Teléfono</label>
            <p className="mt-1 text-lg text-gray-800">{user.telefono || 'No especificado'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600">Miembro desde</label>
            <p className="mt-1 text-lg text-gray-800">
              {new Date(user.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Estado Premium */}
        {user.is_premium && (
          <div className="mt-4 p-3 bg-purple-50 rounded-lg">
            <p className="text-purple-700 font-medium">
              ✨ Usuario Premium hasta {new Date(user.premium_expiration).toLocaleDateString('es-ES')}
            </p>
          </div>
        )}
      </div>

      {/* Estadísticas de monedas */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Balance de Monedas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Freemodoros</p>
                <p className="text-2xl font-bold text-yellow-600">{user.free_coins}</p>
              </div>
              <span className="text-3xl">🪙</span>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pomocoins</p>
                <p className="text-2xl font-bold text-purple-600">{user.paid_coins}</p>
              </div>
              <span className="text-3xl">💎</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cambiar contraseña */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Seguridad</h2>
          {!showPasswordForm && (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Cambiar contraseña
            </button>
          )}
        </div>

        {showPasswordForm && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña actual
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Nueva contraseña
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar nueva contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
                disabled={loading}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;