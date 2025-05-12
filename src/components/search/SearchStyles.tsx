
import React from 'react';

const SearchStyles: React.FC = () => {
  return (
    <style>
      {`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap');
        
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
      `}
    </style>
  );
};

export default SearchStyles;
