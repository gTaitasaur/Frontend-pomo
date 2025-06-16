import { useState, useEffect } from 'react';

const CoinDisplay = ({ amount, type = 'free' }) => {
  const [displayAmount, setDisplayAmount] = useState(amount);
  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (amount > displayAmount) {
      setIsAnimating(true);
      
      const diff = amount - displayAmount;
      const newParticle = {
        id: Date.now(),
        value: `+${diff}`
      };
      setParticles(prev => [...prev, newParticle]);
      
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, 1000);
      
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }
    
    setDisplayAmount(amount);
  }, [amount, displayAmount]);

  const coinEmoji = type === 'free' ? '🪙' : '💎';
  const coinName = type === 'free' ? 'Freemodoro' : 'Pomocoin';
  const textColor = type === 'free' ? 'text-yellow-600' : 'text-purple-600';

  return (
    <div className="relative inline-flex items-center gap-1">
      <span className={`${textColor} ${isAnimating ? 'coin-animation' : ''}`}>
        {coinEmoji}
      </span>
      <span className={`font-medium ${textColor}`}>
        {displayAmount}
      </span>
      <span className="text-sm text-gray-600">
        {coinName}
      </span>
      
      {/* Partículas de animación */}
      {particles.map(particle => (
        <span
          key={particle.id}
          className="coin-particle"
          style={{
            left: '50%',
            top: '-10px'
          }}
        >
          {particle.value}
        </span>
      ))}
    </div>
  );
};

export default CoinDisplay;