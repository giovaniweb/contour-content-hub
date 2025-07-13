import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface AutoresInputSectionProps {
  autores: string[];
  onAutoresChange: (autores: string[]) => void;
}

const AutoresInputSection: React.FC<AutoresInputSectionProps> = ({
  autores,
  onAutoresChange
}) => {
  const [novoAutor, setNovoAutor] = useState('');

  const adicionarAutor = () => {
    if (novoAutor.trim() && !autores.includes(novoAutor.trim())) {
      onAutoresChange([...autores, novoAutor.trim()]);
      setNovoAutor('');
    }
  };

  const removerAutor = (index: number) => {
    const novosAutores = autores.filter((_, i) => i !== index);
    onAutoresChange(novosAutores);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      adicionarAutor();
    }
  };

  return (
    <div className="space-y-4">
      {/* Lista de autores atual */}
      {autores.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-slate-400">Autores adicionados:</p>
          <div className="flex flex-wrap gap-2">
            {autores.map((autor, index) => (
              <Badge 
                key={index}
                variant="secondary"
                className="bg-aurora-soft-pink/20 text-aurora-soft-pink border-aurora-soft-pink/30 flex items-center gap-2"
              >
                {autor}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removerAutor(index)}
                  className="h-4 w-4 p-0 hover:bg-red-500/20"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Input para adicionar novo autor */}
      <div className="flex gap-2">
        <Input
          value={novoAutor}
          onChange={(e) => setNovoAutor(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite o nome do autor e pressione Enter ou clique em Adicionar"
          className="aurora-glass border-aurora-soft-pink/30 focus:border-aurora-soft-pink"
        />
        <Button
          type="button"
          onClick={adicionarAutor}
          disabled={!novoAutor.trim() || autores.includes(novoAutor.trim())}
          className="aurora-button-enhanced bg-aurora-soft-pink/20 hover:bg-aurora-soft-pink/30 border-aurora-soft-pink/30 text-aurora-soft-pink"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </div>

      <p className="text-xs text-slate-400">
        Adicione os autores um por vez. A IA pode ter identificado alguns automaticamente.
      </p>
    </div>
  );
};

export default AutoresInputSection;