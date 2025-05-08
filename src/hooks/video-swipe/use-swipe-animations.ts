
import { Variants } from 'framer-motion';

export function useSwipeAnimations() {
  // Create animation variants for the swipe effect
  const variants: Variants = {
    enter: (direction: 'left' | 'right' | null) => {
      return {
        x: direction === 'right' ? 1000 : direction === 'left' ? -1000 : 0,
        opacity: 0
      };
    },
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: 'left' | 'right' | null) => {
      return {
        x: direction === 'left' ? 1000 : direction === 'right' ? -1000 : 0,
        opacity: 0
      };
    }
  };

  return { variants };
}
