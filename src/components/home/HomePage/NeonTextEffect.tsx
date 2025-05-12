
import React from "react";

const NeonTextEffect: React.FC = () => {
  return (
    <style>
      {`
        .neon-text {
          color: #121212;
          text-shadow: 0 0 1px rgba(91, 140, 247, 0.2), 
                       0 0 2px rgba(91, 140, 247, 0.1);
          letter-spacing: 0.5px;
          font-weight: 300;
        }

        /* Efeito sutil para destacar palavras-chave */
        .neon-highlight {
          color: #3A6CCC;
          font-weight: 500;
        }

        /* Efeito de pulse para elementos interativos */
        .pulse-glow {
          animation: pulse-glow 2s infinite alternate;
        }

        @keyframes pulse-glow {
          from {
            box-shadow: 0 0 5px rgba(91, 140, 247, 0.2), 
                        0 0 10px rgba(91, 140, 247, 0.1);
          }
          to {
            box-shadow: 0 0 15px rgba(91, 140, 247, 0.3), 
                        0 0 20px rgba(91, 140, 247, 0.2);
          }
        }

        /* Hover glow para elementos interativos */
        .hover-glow {
          transition: all 0.3s ease;
        }

        .hover-glow:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(91, 140, 247, 0.2);
        }
        
        /* Background gradient */
        .bg-lavender-gradient {
          background: linear-gradient(to right, #F4F0FF, #EDF5FF);
        }
      `}
    </style>
  );
};

export default NeonTextEffect;
