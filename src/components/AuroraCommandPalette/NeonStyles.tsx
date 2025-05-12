
import React from 'react';

const NeonStyles: React.FC = () => {
  return (
    <style>
      {`
      .neon-text {
        color: #FFFFFF;
        text-shadow: 0 0 5px rgba(30, 174, 219, 0.5), 
                     0 0 10px rgba(30, 174, 219, 0.4), 
                     0 0 15px rgba(30, 174, 219, 0.3),
                     0 0 20px rgba(30, 174, 219, 0.2);
        animation: neon-pulse 2s infinite alternate;
      }

      @keyframes neon-pulse {
        from {
          text-shadow: 0 0 5px rgba(30, 174, 219, 0.5), 
                       0 0 10px rgba(30, 174, 219, 0.4), 
                       0 0 15px rgba(30, 174, 219, 0.3),
                       0 0 20px rgba(30, 174, 219, 0.2);
        }
        to {
          text-shadow: 0 0 10px rgba(30, 174, 219, 0.7), 
                       0 0 20px rgba(30, 174, 219, 0.6), 
                       0 0 30px rgba(30, 174, 219, 0.5),
                       0 0 40px rgba(30, 174, 219, 0.4);
        }
      }
      
      /* Animation for suggestion items */
      .neon-suggestion {
        transition: all 0.3s ease;
      }
      
      .neon-suggestion:hover {
        box-shadow: 0 0 8px rgba(30, 174, 219, 0.6), 
                    0 0 16px rgba(30, 174, 219, 0.4);
      }
      `}
    </style>
  );
};

export default NeonStyles;
