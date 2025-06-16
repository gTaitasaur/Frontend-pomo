import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const LoginForm = ({ onClose, onSwitchToRegister }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast.error('Por favor, completa todos los campos');
      return;
    }

    setLoading(true);
    const result = await login(formData.username, formData.password);
    
    if (result.success) {
      toast.success('¡Inicio de sesión exitoso!');
      onClose();
    } else {
      toast.error(result.error || 'Error al iniciar sesión');
    }
    
    setLoading(false);
  };

// Para desarrollo: función para auto-completar con usuario demo
const fillDemoUser = () => {
  setFormData({
    username: 'usuario_demo',
    password: 'demo123'
  });
};

  return (
    <div className="p-6 w-96">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Botón demo para desarrollo */}
      <button
        type="button"
        onClick={fillDemoUser}
        className="w-full mb-4 text-sm text-blue-600 hover:text-blue-800"
      >
        Usar credenciales de demo
      </button>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Usuario o Email
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="usuario_demo o demo@ejemplo.com"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa tu contraseña"
            disabled={loading}
          />
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
          <button
            type="button"
            onClick={onSwitchToRegister}
            disabled={loading}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-md transition-colors"
          >
            Registro
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;