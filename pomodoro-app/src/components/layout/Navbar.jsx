import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import UserDropdown from './UserDropdown';
import Modal from '../ui/Modal';
import LoginForm from '../auth/LoginForm';
import RegisterForm from '../auth/RegisterForm';

const Navbar = () => {
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Función para obtener el saludo según la hora
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'Buenos días';
    if (hour >= 12 && hour < 20) return 'Buenas tardes';
    return 'Buenas noches';
  };

  // Funciones para manejar los modales
  const switchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const switchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const closeAllModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Lado izquierdo */}
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-gray-800">Pomosaur</h1>
              
              {/* Mostrar monedas si hay usuario logeado */}
              {user && (
                <div className="flex items-center space-x-4 text-sm">
                  <span>Freemodoro: {user.free_coins}</span>
                  <span>Pomocoin: {user.paid_coins}</span>
                </div>
              )}
            </div>

            {/* Lado derecho */}
            <div className="flex items-center">
              {user ? (
                <UserDropdown greeting={getGreeting()} />
              ) : (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">{getGreeting()}!</span>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                  >
                    Iniciar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Modal de Login */}
      <Modal isOpen={showLoginModal} onClose={closeAllModals}>
        <LoginForm 
          onClose={closeAllModals} 
          onSwitchToRegister={switchToRegister}
        />
      </Modal>

      {/* Modal de Registro */}
      <Modal isOpen={showRegisterModal} onClose={closeAllModals}>
        <RegisterForm 
          onClose={closeAllModals}
          onBackToLogin={switchToLogin}
        />
      </Modal>
    </>
  );
};

export default Navbar;