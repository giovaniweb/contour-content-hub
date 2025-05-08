
import React from 'react';

const AnimationStyles: React.FC = () => {
  return (
    <style>
      {`
      .typing-animation {
        border-right: 2px solid currentColor;
        padding-right: 5px;
        animation: blink 1s step-end infinite;
      }
      
      @keyframes blink {
        from, to { border-color: transparent }
        50% { border-color: currentColor; }
      }
      `}
    </style>
  );
};

export default AnimationStyles;
