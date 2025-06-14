
/**
 * Design system constants and utilities
 */

// Colors (extending Tailwind palette)
export const colors = {
  primary: {
    blue: "bg-fluida-blue",
    pink: "bg-fluida-pink",
    gradient: "bg-gradient-to-r from-fluida-blue to-fluida-pink",
    gradientHover: "hover:bg-gradient-to-r hover:from-fluida-blueDark hover:to-fluida-pinkDark",
    textGradient: "bg-gradient-to-r from-fluida-blue to-fluida-pink bg-clip-text text-transparent"
  },
  card: {
    base: "bg-white dark:bg-gray-800",
    elevated: "bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200",
    glassmorphism: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
  },
  state: {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-amber-500 text-white",
    info: "bg-fluida-blue text-white"
  }
};

// Spacing system
export const spacing = {
  card: "p-4 sm:p-6",
  section: "py-6 px-4 sm:py-8 sm:px-6",
  stack: "space-y-4",
  inline: "space-x-3"
};

// Typography
export const typography = {
  title: "text-2xl sm:text-3xl font-semibold tracking-tight",
  subtitle: "text-lg sm:text-xl font-medium",
  body: "text-base leading-relaxed",
  small: "text-sm",
  tiny: "text-xs"
};

// Border radius
export const radius = {
  sm: "rounded",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full"
};

// Shadows
export const shadows = {
  sm: "shadow-sm",
  md: "shadow",
  lg: "shadow-md",
  xl: "shadow-lg",
  elevated: "shadow-lg shadow-fluida-blue/5"
};

// Responsive patterns
export const responsive = {
  hideOnMobile: "hidden sm:block",
  showOnlyOnMobile: "sm:hidden",
  container: "container mx-auto px-4 sm:px-6 lg:px-8"
};

// Animation presets
export const animations = {
  fadeIn: "animate-fade-in",
  scaleIn: "animate-scale-in",
  hover: "transition-all duration-200 hover:-translate-y-1 hover:shadow-md",
  active: "active:scale-95 transition-transform",
  pulse: "animate-pulse"
};

// Media breakpoints for consistent responsive design
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Common layout patterns
export const layouts = {
  sectionPadding: "py-8 px-4 sm:py-12 sm:px-6 lg:py-16",
  cardGrid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
  flexBetween: "flex items-center justify-between",
  flexCenter: "flex items-center justify-center",
  flexColumn: "flex flex-col",
};
