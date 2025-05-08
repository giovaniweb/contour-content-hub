
import { Variants } from "framer-motion";

export const slideVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  visible: { 
    opacity: 1,
    y: 0
  },
};

export const sidebarVariants: Variants = {
  hidden: { 
    x: "-100%",
    opacity: 0
  },
  visible: { 
    x: 0,
    opacity: 1
  },
};

export const staggerChildren = (staggerTime = 0.1) => {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerTime
      }
    }
  };
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};
