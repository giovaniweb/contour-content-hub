
import React from 'react';

const SearchStyles: React.FC = () => {
  return (
    <style>
      {`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;900&display=swap');
        
        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }
        
        /* Pulse animation for send button on hover */
        @keyframes pulse-glow {
          0% {
            box-shadow: 0 0 5px rgba(120, 120, 255, 0.2);
          }
          50% {
            box-shadow: 0 0 15px rgba(120, 120, 255, 0.5);
          }
          100% {
            box-shadow: 0 0 5px rgba(120, 120, 255, 0.2);
          }
        }
        
        /* Shimmer animation for loading states */
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
          background: linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%);
          background-size: 200% 100%;
        }
      `}
    </style>
  );
};

export default SearchStyles;
