
import React from "react";

const NeonTextEffect: React.FC = () => {
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

        /* Adicional: efeito para destacar palavras-chave */
        .neon-highlight {
          color: #FFFFFF;
          text-shadow: 0 0 5px rgba(217, 70, 239, 0.5), 
                       0 0 10px rgba(217, 70, 239, 0.4), 
                       0 0 15px rgba(217, 70, 239, 0.3);
          animation: highlight-pulse 2s infinite alternate;
        }

        @keyframes highlight-pulse {
          from {
            text-shadow: 0 0 5px rgba(217, 70, 239, 0.5), 
                         0 0 10px rgba(217, 70, 239, 0.4), 
                         0 0 15px rgba(217, 70, 239, 0.3);
          }
          to {
            text-shadow: 0 0 10px rgba(217, 70, 239, 0.7), 
                         0 0 20px rgba(217, 70, 239, 0.6), 
                         0 0 30px rgba(217, 70, 239, 0.5);
          }
        }
      `}
    </style>
  );
};

export default NeonTextEffect;
