
import React from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

interface ScientificArticleControlsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onNewDocument: () => void;
}

const ScientificArticleControls: React.FC<ScientificArticleControlsProps> = ({
  searchTerm,
  setSearchTerm,
  onNewDocument
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-400" />
          <Input
            placeholder="Buscar documentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-cyan-500/30 text-slate-100 placeholder:text-slate-400 rounded-xl backdrop-blur-sm"
          />
        </div>
        <Button variant="outline" size="icon" className="bg-slate-800/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 rounded-xl">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <Button 
        onClick={() => navigate('/admin/scientific-articles/new')}
        className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600 rounded-xl"
      >
        <Plus className="h-4 w-4" />
        Novo Documento
      </Button>
    </div>
  );
};

export default ScientificArticleControls;
