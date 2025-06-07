
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface EmotionalRatingProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const EmotionalRating: React.FC<EmotionalRatingProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const getEmoji = (rating: number) => {
    if (rating <= 2) return '😢';
    if (rating <= 4) return '😕';
    if (rating <= 6) return '😐';
    if (rating <= 8) return '😊';
    return '🤩';
  };

  const getColor = (rating: number) => {
    if (rating <= 2) return '#F87171'; // red
    if (rating <= 4) return '#FB923C'; // orange
    if (rating <= 6) return '#FDE047'; // yellow
    if (rating <= 8) return '#86EFAC'; // green
    return '#C4B5FD'; // aurora lavender
  };

  const displayValue = hoverValue ?? value;

  return (
    <div className="aurora-emotion-scale">
      <div className="flex items-center gap-1">
        {[...Array(10)].map((_, index) => {
          const rating = index + 1;
          const isActive = rating <= displayValue;
          
          return (
            <motion.button
              key={rating}
              className={`aurora-emotion-point ${isActive ? 'active' : ''}`}
              style={{
                backgroundColor: isActive ? getColor(rating) : 'rgba(255, 255, 255, 0.1)',
                color: isActive ? '#1F2937' : 'rgba(255, 255, 255, 0.6)',
              }}
              onClick={() => !disabled && onChange(rating)}
              onMouseEnter={() => !disabled && setHoverValue(rating)}
              onMouseLeave={() => setHoverValue(null)}
              disabled={disabled}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              animate={isActive ? {
                boxShadow: [`0 0 0px ${getColor(rating)}`, `0 0 20px ${getColor(rating)}`, `0 0 0px ${getColor(rating)}`],
              } : {}}
              transition={{
                boxShadow: { duration: 2, repeat: Infinity }
              }}
            >
              {rating}
            </motion.button>
          );
        })}
      </div>
      
      <motion.div
        className="ml-4 text-2xl"
        key={displayValue}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {getEmoji(displayValue)}
      </motion.div>
      
      <div className="ml-2 text-sm text-white/80 font-medium">
        {displayValue}/10
      </div>
    </div>
  );
};

export default EmotionalRating;
