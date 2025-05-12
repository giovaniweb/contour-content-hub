
import React from 'react';

const NeonStyles: React.FC = () => {
  return (
    <style>
      {`
      .neon-text {
        text-shadow: 0 0 5px rgba(0, 148, 251, 0.3), 
                     0 0 10px rgba(0, 148, 251, 0.2), 
                     0 0 15px rgba(243, 0, 252, 0.1);
        animation: neon-pulse 2s infinite alternate;
      }

      @keyframes neon-pulse {
        from {
          text-shadow: 0 0 5px rgba(0, 148, 251, 0.3), 
                       0 0 10px rgba(0, 148, 251, 0.2), 
                       0 0 15px rgba(243, 0, 252, 0.1);
        }
        to {
          text-shadow: 0 0 10px rgba(0, 148, 251, 0.5), 
                       0 0 20px rgba(0, 148, 251, 0.3), 
                       0 0 30px rgba(243, 0, 252, 0.2);
        }
      }
      `}
    </style>
  );
};

export default NeonStyles;
