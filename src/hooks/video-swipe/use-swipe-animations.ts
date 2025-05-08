import { Variants } from 'framer-motion';

// Define a type that matches Framer Motion's Variants type requirements
export interface SwipeAnimationVariants extends Variants {
  enter: (direction: 'left' | 'right' | null) => { x: number; opacity: number };
  center: { x: number; opacity: number };
  exit: (direction: 'left' | 'right' | null) => { x: number; opacity: number };
  [key: string]: any; // This index signature is required for compatibility with Variants
}

// Helper functions to keep the variant definition clean
const getEnterAnimation = (direction: 'left' | 'right' | null) => {
  return {
    x: direction === 'right' ? 1000 : direction === 'left' ? -1000 : 0,
    opacity: 0
  };
};

const getCenterAnimation = () => {
  return {
    x: 0,
    opacity: 1
  };
};

const getExitAnimation = (direction: 'left' | 'right' | null) => {
  return {
    x: direction === 'left' ? 1000 : direction === 'right' ? -1000 : 0,
    opacity: 0
  };
};

export function useSwipeAnimations() {
  // Create animation variants for the swipe effect
  const variants: SwipeAnimationVariants = {
    enter: getEnterAnimation,
    center: getCenterAnimation(),
    exit: getExitAnimation
  };

  return { variants };
}
