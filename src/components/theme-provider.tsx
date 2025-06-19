
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    
    // Add Montserrat font to the document
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap';
    document.head.appendChild(link);
    
    // Update font in tailwind
    document.documentElement.style.setProperty('--font-sans', '"Montserrat", sans-serif');
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{children}</>;
  }
  
  return (
    <NextThemesProvider {...props} enableSystem={true} defaultTheme="light">
      {children}
    </NextThemesProvider>
  );
}
