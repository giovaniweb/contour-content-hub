
import React from 'react';
import TypingAnimation from './TypingAnimation';

interface WelcomeBannerProps {
  title: string;
  phrases: string[];
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ title, phrases }) => {
  return (
    <div className="text-center py-8">
      <h1 className="text-4xl font-bold mb-6">{title}</h1>
      <TypingAnimation phrases={phrases} />
    </div>
  );
};

export default WelcomeBanner;
