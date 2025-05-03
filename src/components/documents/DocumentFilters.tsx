import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GetDocumentsParams, DocumentType } from '@/types/document';
import { Search, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DocumentFiltersProps {
  onChange: (filters: Partial<GetDocumentsParams>) => void;
}

const DocumentFilters: React.FC<DocumentFiltersProps> = ({ onChange }) => {
  const [searchInput, setSearchInput] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType | 'all'>('all');
  const [equipmentId, setEquipmentId] = useState<string>('all');
  const [language, setLanguage] = useState<string>('all');
  const [equipments, setEquipments] = useState<{id: string, nome: string}[]>([]);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  // Fetch equipments for filter
  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const { data, error } = await supabase
          .from('equipamentos')
          .select('id, nome')
          .eq('ativo', true)
          .order('nome');
          
        if (error) throw error;
        
        setEquipments(data || []);
      } catch (error) {
        console.error('Erro ao buscar equipamentos:', error);
      }
    };
    
    fetchEquipments();
  }, []);
  
  // Effect to handle search input with debounce
  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    
    const timeout = setTimeout(() => {
      onChange({ search: searchInput || undefined });
    }, 500);
    
    setDebounceTimeout(timeout);
    
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [searchInput, onChange]);
  
  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case 'type':
        const typeValue = value as DocumentType | 'all';
        setDocumentType(typeValue);
        onChange({ 
          type: typeValue === 'all' ? undefined : typeValue,
          // Keep other filters
          equipmentId: equipmentId === 'all' ? undefined : equipmentId, 
          language: language === 'all' ? undefined : language,
          search: searchInput || undefined
        });
        break;
        
      case 'equipment':
        setEquipmentId(value);
        onChange({ 
          equipmentId: value === 'all' ? undefined : value,
          // Keep other filters
          type: documentType === 'all' ? undefined : documentType,
          language: language === 'all' ? undefined : language,
          search: searchInput || undefined
        });
        break;
        
      case 'language':
        setLanguage(value);
        onChange({ 
          language: value === 'all' ? undefined : value,
          // Keep other filters
          type: documentType === 'all' ? undefined : documentType,
          equipmentId: equipmentId === 'all' ? undefined : equipmentId,
          search: searchInput || undefined
        });
        break;
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchInput('');
    setDocumentType('all');
    setEquipmentId('all');
    setLanguage('all');
    
    onChange({
      type: undefined,
      equipmentId: undefined,
      language: undefined,
      search: undefined
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar por título ou descrição..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-10"
        />
        {searchInput && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            onClick={() => setSearchInput('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Select
            value={documentType}
            onValueChange={(value: string) => handleFilterChange('type', value)}
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
        
        <div>
          <Select
            value={equipmentId}
            onValueChange={(value) => handleFilterChange('equipment', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Equipamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {equipments.map(equipment => (
                <SelectItem key={equipment.id} value={equipment.id}>
                  {equipment.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select
            value={language}
            onValueChange={(value) => handleFilterChange('language', value)}
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
      </div>
      
      <div className="flex justify-end">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={clearFilters}
        >
          <X className="mr-2 h-4 w-4" />
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
};

export default DocumentFilters;
