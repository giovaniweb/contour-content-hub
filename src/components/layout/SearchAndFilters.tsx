import React from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
interface SearchAndFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  additionalControls?: React.ReactNode;
}
const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchValue,
  onSearchChange,
  viewMode,
  onViewModeChange,
  additionalControls
}) => {
  return <div className="container mx-auto px-6 py-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-400" />
            <Input placeholder="Pesquisar..." className="pl-10 bg-slate-800/50 border-cyan-500/30 text-slate-100 placeholder:text-slate-400 rounded-xl backdrop-blur-sm" value={searchValue} onChange={e => onSearchChange(e.target.value)} />
          </div>
          <Button variant="outline" size="icon" className="bg-slate-800/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 rounded-xl">
            <Filter className="h-4 w-4" />
          </Button>
          
          {/* View Mode Toggle */}
          <div className="flex items-center border border-cyan-500/30 rounded-xl bg-slate-800/50 p-1">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => onViewModeChange('grid')} 
              className={`h-8 px-3 ${viewMode === 'grid' ? 'bg-cyan-500 text-white font-medium' : 'text-white hover:text-white hover:bg-slate-700'}`}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => onViewModeChange('list')} 
              className={`h-8 px-3 ${viewMode === 'list' ? 'bg-cyan-500 text-white font-medium' : 'text-white hover:text-white hover:bg-slate-700'}`}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {additionalControls}
      </div>
    </div>;
};
export default SearchAndFilters;