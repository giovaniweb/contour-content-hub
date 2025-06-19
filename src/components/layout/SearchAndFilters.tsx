
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
    <div className="container mx-auto px-6 py-4">
      <div className="aurora-glass rounded-2xl border border-aurora-electric-purple/30 p-4 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-aurora-electric-purple aurora-pulse" />
              <Input 
                placeholder="Pesquisar equipamentos..." 
                className="pl-10 aurora-glass border-aurora-electric-purple/30 text-white placeholder:text-white/60 rounded-xl backdrop-blur-sm aurora-focus bg-transparent" 
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            
            {onFilterClick && (
              <Button 
                variant="outline" 
                size="icon" 
                className="aurora-glass border-aurora-electric-purple/30 text-aurora-electric-purple hover:aurora-glow-blue rounded-xl backdrop-blur-sm"
                onClick={onFilterClick}
              >
                <Filter className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onViewModeChange && (
              <div className="flex items-center gap-1 aurora-glass rounded-xl p-1 border border-aurora-electric-purple/20">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`rounded-lg transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'text-aurora-electric-purple aurora-glow bg-aurora-electric-purple/20' 
                      : 'text-white/60 hover:aurora-glow-blue hover:text-aurora-electric-purple'
                  }`}
                  onClick={() => onViewModeChange('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`rounded-lg transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'text-aurora-electric-purple aurora-glow bg-aurora-electric-purple/20' 
                      : 'text-white/60 hover:aurora-glow-blue hover:text-aurora-electric-purple'
                  }`}
                  onClick={() => onViewModeChange('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {additionalControls && (
              <div className="flex items-center gap-2">
                {additionalControls}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilters;
