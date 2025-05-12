
import React from "react";

const NeonTextEffect: React.FC = () => {
  return (
    <style>
      {`
        .hero-neon-text {
          text-shadow: 0 0 5px rgba(0, 148, 251, 0.4), 
                       0 0 10px rgba(0, 148, 251, 0.3), 
                       0 0 15px rgba(0, 148, 251, 0.2),
                       0 0 20px rgba(0, 148, 251, 0.1);
          animation: hero-neon-pulse 2s infinite alternate;
        }

        @keyframes hero-neon-pulse {
          from {
            text-shadow: 0 0 5px rgba(0, 148, 251, 0.4), 
                         0 0 10px rgba(0, 148, 251, 0.3), 
                         0 0 15px rgba(0, 148, 251, 0.2),
                         0 0 20px rgba(0, 148, 251, 0.1);
          }
          to {
            text-shadow: 0 0 10px rgba(0, 148, 251, 0.6), 
                         0 0 20px rgba(0, 148, 251, 0.5), 
                         0 0 30px rgba(0, 148, 251, 0.4),
                         0 0 40px rgba(0, 148, 251, 0.3);
          }
        }
      `}
    </style>
  );
};

export default NeonTextEffect;
