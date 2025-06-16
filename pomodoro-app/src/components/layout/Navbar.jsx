import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import UserDropdown from './UserDropdown';
import Modal from '../ui/Modal';
import LoginForm from '../auth/LoginForm';
import RegisterForm from '../auth/RegisterForm';
import CoinDisplay from '../ui/CoinDisplay';

const Navbar = () => {
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Saludo según la hora
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'Buenos días';
    if (hour >= 12 && hour < 20) return 'Buenas tardes';
    return 'Buenas noches';
  };

  // Funciones para Modals
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
              <Link 
                to="/" 
                className="text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors"
              >
                Pomosaur
              </Link>
              
              {/* Mostrar monedas si hay usuario logeado */}
              {user && (
                <div className="flex items-center space-x-6">
                  <CoinDisplay amount={user.free_coins} type="free" />
                  <CoinDisplay amount={user.paid_coins} type="paid" />
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