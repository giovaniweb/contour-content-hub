
/**
 * Interaction utilities for improved UX
 */

import { useState, useEffect } from 'react';

// Hook for detecting touch vs mouse device
export const useIsTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);
  
  useEffect(() => {
    const touchDevice = 'ontouchstart' in window || 
                       navigator.maxTouchPoints > 0 ||
                       (navigator as any).msMaxTouchPoints > 0;
    setIsTouch(touchDevice);
  }, []);
  
  return isTouch;
};

// Hook for scroll position
export const useScrollPosition = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return { scrollY, isScrolled };
};

// Hook for element dimensions
export const useElementSize = () => {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    if (!ref) return;
    
    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });
    
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref]);
  
  return [setRef, size] as const;
};

// Function to add ripple effect to button
export const addRippleEffect = (event: React.MouseEvent<HTMLElement>) => {
  const button = event.currentTarget;
  
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
  circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
  circle.classList.add('ripple');
  
  const ripple = button.getElementsByClassName('ripple')[0];
  
  if (ripple) {
    ripple.remove();
  }
  
  button.appendChild(circle);
};

// Hook for press-and-hold interaction
export const useLongPress = (
  callback: () => void, 
  duration: number = 500
) => {
  const [pressing, setPressing] = useState(false);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (pressing) {
      timer = setTimeout(callback, duration);
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [pressing, callback, duration]);
  
  return {
    onMouseDown: () => setPressing(true),
    onMouseUp: () => setPressing(false),
    onMouseLeave: () => setPressing(false),
    onTouchStart: () => setPressing(true),
    onTouchEnd: () => setPressing(false),
    pressing
  };
};

