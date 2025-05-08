
import React from 'react';
import { DocumentType } from '@/types/document';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TypeFilterProps {
  documentType: DocumentType | 'all';
  onTypeChange: (value: string) => void;
}

export const TypeFilter: React.FC<TypeFilterProps> = ({ 
  documentType, 
  onTypeChange 
}) => {
  return (
    <div>
      <Select
        value={documentType || "all"}
        onValueChange={onTypeChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Tipo de documento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="artigo_cientifico">Artigo Científico</SelectItem>
          <SelectItem value="ficha_tecnica">Ficha Técnica</SelectItem>
          <SelectItem value="protocolo">Protocolo</SelectItem>
          <SelectItem value="outro">Outro</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
