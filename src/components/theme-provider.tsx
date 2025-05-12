
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

// Create and export the context
export const ThemeProviderContext = React.createContext({
  theme: "light" as string | undefined,
  setTheme: (theme: string) => {},
});

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<string | undefined>(
    props.defaultTheme || "light"
  );

  React.useEffect(() => {
    // Add Montserrat font to the document
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap';
    document.head.appendChild(link);
    
    // Update font in tailwind
    document.documentElement.style.setProperty('--font-sans', '"Montserrat", sans-serif');
  }, []);

  // Set up the context value
  const contextValue = React.useMemo(
    () => ({
      theme,
      setTheme: (newTheme: string) => {
        setTheme(newTheme);
      },
    }),
    [theme]
  );
  
  return (
    <ThemeProviderContext.Provider value={contextValue}>
      <NextThemesProvider {...props} enableSystem={true} defaultTheme={theme}>
        {children}
      </NextThemesProvider>
    </ThemeProviderContext.Provider>
  );
}
