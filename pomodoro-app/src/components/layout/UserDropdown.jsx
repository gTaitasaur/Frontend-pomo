import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserDropdown = ({ greeting }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsOpen(false);
  };

  const handleHistoryClick = () => {
    navigate('/history');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
      >
        {/* Imagen del usuario */}
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        <span>{greeting} {user?.username}!</span>
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <button 
            onClick={handleProfileClick}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Mi Perfil
          </button>
          <button 
            onClick={handleHistoryClick}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Historial de Pomos
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Desconectar
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;