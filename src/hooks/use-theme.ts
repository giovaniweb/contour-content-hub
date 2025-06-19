
import { useTheme as useNextTheme } from 'next-themes';

export const useTheme = () => {
  const { theme, setTheme } = useNextTheme();
  
  return {
    theme: theme || 'light',
    setTheme,
  };
};
