
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LanguageFilterProps {
  language: string;
  onLanguageChange: (value: string) => void;
}

export const LanguageFilter: React.FC<LanguageFilterProps> = ({ 
  language, 
  onLanguageChange 
}) => {
  return (
    <div>
      <Select
        value={language}
        onValueChange={onLanguageChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Idioma" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="pt">Português</SelectItem>
          <SelectItem value="en">Inglês</SelectItem>
          <SelectItem value="es">Espanhol</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
