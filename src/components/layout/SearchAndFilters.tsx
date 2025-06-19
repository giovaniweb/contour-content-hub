
import React from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchAndFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onFilterClick?: () => void;
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  viewMode?: 'grid' | 'list';
  additionalControls?: React.ReactNode;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchValue,
  onSearchChange,
  onFilterClick,
  onViewModeChange,
  viewMode = 'grid',
  additionalControls
}) => {
  return (
    <div className="container mx-auto px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-400" />
            <Input 
              placeholder="Pesquisar..." 
              className="pl-10 bg-slate-800/50 border-cyan-500/30 text-slate-100 placeholder:text-slate-400 rounded-xl backdrop-blur-sm" 
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          {onFilterClick && (
            <Button 
              variant="outline" 
              size="icon" 
              className="bg-slate-800/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 rounded-xl"
              onClick={onFilterClick}
            >
              <Filter className="h-4 w-4" />
            </Button>
          )}
          {onViewModeChange && (
            <>
              <Button 
                variant="outline" 
                size="icon" 
                className={`bg-slate-800/50 border-cyan-500/30 rounded-xl ${
                  viewMode === 'grid' ? 'text-cyan-400 bg-cyan-500/20' : 'text-slate-400 hover:bg-cyan-500/20'
                }`}
                onClick={() => onViewModeChange('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className={`bg-slate-800/50 border-cyan-500/30 rounded-xl ${
                  viewMode === 'list' ? 'text-cyan-400 bg-cyan-500/20' : 'text-slate-400 hover:bg-cyan-500/20'
                }`}
                onClick={() => onViewModeChange('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
        {additionalControls && (
          <div className="flex items-center gap-2">
            {additionalControls}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilters;
