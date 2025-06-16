const Modal = ({ isOpen, onClose, children }) => {
    // Si el modal no está abierto, no renderiza
    if (!isOpen) return null;
  
    // Cierra el modal cuando se hace clic en el fondo
    const handleBackdropClick = (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };
  
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={handleBackdropClick}
      >
        {/* Fondo con blur */}
        <div className="absolute inset-0 backdrop-blur-sm"></div>
        
        {/* Contenido del modal */}
        <div className="relative bg-white rounded-lg shadow-xl z-10">
          {children}
        </div>
      </div>
    );
  };
  
  export default Modal;