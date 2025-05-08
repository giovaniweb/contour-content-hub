
import { Variants } from 'framer-motion';

export interface SwipeAnimationVariants {
  enter: (direction: 'left' | 'right' | null) => { x: number; opacity: number };
  center: { x: number; opacity: number };
  exit: (direction: 'left' | 'right' | null) => { x: number; opacity: number };
}

export function useSwipeAnimations() {
  // Create animation variants for the swipe effect
  const variants: SwipeAnimationVariants = {
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
