
import React from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Language = {
  code: string;
  name: string;
  flag: string;
};

const languages: Language[] = [
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" }
];

const LanguageSelector: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = React.useState<Language>(languages[0]);

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    // Aqui você pode implementar a lógica de mudança de idioma
    console.log(`Idioma alterado para: ${language.code}`);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="px-2">
                <span className="text-lg mr-1">{currentLanguage.flag}</span>
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {languages.map((language) => (
                <DropdownMenuItem
                  key={language.code}
                  onClick={() => handleLanguageChange(language)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-lg">{language.flag}</span>
                  <span>{language.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>Selecionar idioma</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default LanguageSelector;
