import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define a type for our language
export type LanguageCode = "pt" | "en" | "es";

// Define a type for our language data
export type Language = {
  code: LanguageCode;
  name: string;
  flag: string;
};

// Define available languages
export const languages: Language[] = [
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" }
];

// Define translations for common UI elements
type Translations = {
  [key: string]: {
    [key in LanguageCode]: string;
  };
};

export const translations: Translations = {
  welcome: {
    pt: "Bem-vindo ao Fluida",
    en: "Welcome to Fluida",
    es: "Bienvenido a Fluida"
  },
  dashboard: {
    pt: "Painel",
    en: "Dashboard",
    es: "Panel"
  },
  scripts: {
    pt: "Roteiros",
    en: "Scripts",
    es: "Guiones"
  },
  media: {
    pt: "Mídia",
    en: "Media",
    es: "Medios"
  },
  calendar: {
    pt: "Calendário",
    en: "Calendar",
    es: "Calendario"
  },
  selectLanguage: {
    pt: "Selecionar idioma",
    en: "Select language",
    es: "Seleccionar idioma"
  },
  actions: {
    pt: "Ações Rápidas",
    en: "Quick Actions",
    es: "Acciones Rápidas"
  },
  generateScript: {
    pt: "Gerar Roteiro",
    en: "Generate Script",
    es: "Generar Guión"
  },
  library: {
    pt: "Biblioteca",
    en: "Library",
    es: "Biblioteca"
  },
  agenda: {
    pt: "Agenda",
    en: "Agenda",
    es: "Agenda"
  },
  bigIdea: {
    pt: "Big Idea",
    en: "Big Idea",
    es: "Gran Idea"
  },
  adminPanel: {
    pt: "Painel de Integração (Admin)",
    en: "Integration Panel (Admin)",
    es: "Panel de Integración (Admin)"
  },
  performance: {
    pt: "Desempenho",
    en: "Performance",
    es: "Rendimiento"
  },
  activityHistory: {
    pt: "Seu histórico de atividade este mês",
    en: "Your activity history this month",
    es: "Tu historial de actividad este mes"
  },
  scriptsCreated: {
    pt: "Roteiros Criados",
    en: "Scripts Created",
    es: "Guiones Creados"
  },
  videosSaved: {
    pt: "Vídeos Salvos",
    en: "Videos Saved",
    es: "Videos Guardados"
  },
  studioContent: {
    pt: "Seu estúdio criativo de conteúdo, em um clique.",
    en: "Your creative content studio, in one click.",
    es: "Tu estudio de contenido creativo, en un clic."
  }
};

// Create the context
type LanguageContextType = {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Language Provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    // You could also store the preference in localStorage here
    localStorage.setItem('preferredLanguage', language.code);
    console.log(`Idioma alterado para: ${language.code}`);
  };

  // Translation function
  const t = (key: string): string => {
    if (translations[key] && translations[key][currentLanguage.code]) {
      return translations[key][currentLanguage.code];
    }
    return key; // Fallback to key if translation not found
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
