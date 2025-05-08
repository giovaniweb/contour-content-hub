import React, { useState, useEffect } from 'react';
import { GetDocumentsParams, DocumentType } from '@/types/document';
import { supabase } from '@/integrations/supabase/client';
import { SearchFilter } from './SearchFilter';
import { TypeFilter } from './TypeFilter';
import { EquipmentFilter } from './EquipmentFilter';
import { LanguageFilter } from './LanguageFilter';
import { FilterActions } from './FilterActions';

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
  const handleTypeChange = (value: string) => {
    const typeValue = value as DocumentType | 'all';
    setDocumentType(typeValue);
    updateFilters({
      type: typeValue === 'all' ? undefined : typeValue as DocumentType,
    });
  };
  
  const handleEquipmentChange = (value: string) => {
    setEquipmentId(value);
    updateFilters({
      equipmentId: value === 'all' ? undefined : value,
    });
  };
  
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    updateFilters({
      language: value === 'all' ? undefined : value,
    });
  };
  
  const updateFilters = (newFilters: Partial<GetDocumentsParams>) => {
    onChange({ 
      ...newFilters,
      // Keep other filters
      type: newFilters.type !== undefined ? newFilters.type : (documentType === 'all' ? undefined : documentType),
      equipmentId: newFilters.equipmentId !== undefined ? newFilters.equipmentId : (equipmentId === 'all' ? undefined : equipmentId),
      language: newFilters.language !== undefined ? newFilters.language : (language === 'all' ? undefined : language),
      search: searchInput || undefined
    });
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
      <SearchFilter 
        searchInput={searchInput} 
        setSearchInput={setSearchInput} 
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TypeFilter 
          documentType={documentType} 
          onTypeChange={handleTypeChange} 
        />
        
        <EquipmentFilter 
          equipmentId={equipmentId} 
          equipments={equipments} 
          onEquipmentChange={handleEquipmentChange} 
        />
        
        <LanguageFilter 
          language={language} 
          onLanguageChange={handleLanguageChange} 
        />
      </div>
      
      <FilterActions onClearFilters={clearFilters} />
    </div>
  );
};

export default DocumentFilters;
