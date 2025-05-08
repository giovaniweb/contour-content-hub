
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface SearchFilterProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({ 
  searchInput, 
  setSearchInput 
}) => {
  return (
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
  );
};
