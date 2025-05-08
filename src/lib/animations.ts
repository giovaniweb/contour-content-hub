
/**
 * Animation utility constants and helper functions
 */

// Spring animation presets for Framer Motion
export const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 300,
  damping: 30
};

export const GENTLE_SPRING = {
  type: "spring",
  stiffness: 200,
  damping: 25
};

// Ease transitions
export const EASE_TRANSITION = {
  type: "tween", 
  ease: [0.25, 0.1, 0.25, 1],
  duration: 0.3
};

// Staggered children animation
export const staggerChildren = (staggerTime: number = 0.05) => ({
  animate: {
    transition: {
      staggerChildren: staggerTime
    }
  }
});

// Item animation variants
export const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

// Fade animation variants
export const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

// Scale animation variants
export const scaleVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
};

// Slide animation variants
export const slideVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

// Slide up animation variants
export const slideUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Card hover animation
export const cardHoverVariants = {
  rest: { scale: 1, boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" },
  hover: { scale: 1.02, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.15)" }
};

