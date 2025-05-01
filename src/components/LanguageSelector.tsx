
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
import { useLanguage, languages } from "@/context/LanguageContext";

const LanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguage, t } = useLanguage();

  const handleLanguageChange = (language: typeof languages[0]) => {
    setLanguage(language);
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
        <p>{t('selectLanguage')}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default LanguageSelector;
