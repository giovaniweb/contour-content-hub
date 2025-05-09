
import { Variants } from "framer-motion";

// Define slide variants for page transitions
export const slideVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: -200,
    transition: {
      duration: 0.5
    }
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5
    }
  },
  exit: { 
    opacity: 0, 
    x: 200,
    transition: {
      duration: 0.5
    }
  }
};

// Define fade in animation
export const fadeIn: Variants = {
  hidden: { 
    opacity: 0,
    transition: {
      duration: 0.3
    }
  },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.3
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.3
    }
  }
};

// Modal animation variants
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

// Staggered list item animation
export const listItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.4
    }
  })
};

// Pulse animation
export const pulseVariants: Variants = {
  hidden: {
    scale: 1
  },
  visible: {
    scale: [1, 1.05, 1],
    transition: {
      repeat: Infinity,
      repeatType: "reverse",
      duration: 1.5
    }
  }
};

// Adding missing animations that were causing build errors
export const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4
    }
  }
};

// Function to create staggerChildren variants with customizable delay
export const staggerChildren = (delay: number = 0.1): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: delay
    }
  }
});

// New animation for the idea validator
export const glowingContainerVariants: Variants = {
  hidden: { 
    boxShadow: "0 0 0 rgba(0, 148, 251, 0)",
    opacity: 0,
    y: 20 
  },
  visible: { 
    boxShadow: ["0 0 10px rgba(0, 148, 251, 0.3)", "0 0 20px rgba(243, 0, 252, 0.5)", "0 0 10px rgba(0, 148, 251, 0.3)"],
    opacity: 1,
    y: 0,
    transition: {
      boxShadow: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 3
      },
      opacity: { duration: 0.5 },
      y: { duration: 0.5 }
    }
  }
};

// Typing cursor animation
export const typingCursorVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: [0, 1, 0],
    transition: {
      repeat: Infinity,
      duration: 0.8
    }
  }
};
