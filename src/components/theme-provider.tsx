
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

// Create the ThemeProviderContext
export const ThemeProviderContext = React.createContext<{
  theme: string | undefined;
  setTheme: (theme: string) => void;
}>({
  theme: undefined,
  setTheme: () => null,
});

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    // Set default theme to system preference
    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);
  }, []);

  const value = React.useMemo(
    () => ({
      theme,
      setTheme: (newTheme: string) => {
        localStorage.setItem('theme', newTheme);
        setTheme(newTheme);
      },
    }),
    [theme]
  );

  return (
    <ThemeProviderContext.Provider value={value}>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </ThemeProviderContext.Provider>
  );
}

export { useTheme } from "next-themes"
