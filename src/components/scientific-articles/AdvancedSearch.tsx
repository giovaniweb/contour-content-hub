
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Calendar, FileText, User, Tag } from 'lucide-react';
import { ScientificArticleFilters } from '@/hooks/use-scientific-articles';
import { useEquipments } from '@/hooks/useEquipments';

interface AdvancedSearchProps {
  initialFilters?: Partial<ScientificArticleFilters>;
  onSearch: (filters: Partial<ScientificArticleFilters>) => void;
  onClear: () => void;
  availableStatuses?: Array<{value: string, label: string}>;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  initialFilters = {},
  onSearch,
  onClear,
  availableStatuses = []
}) => {
  const { equipments } = useEquipments();
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<Partial<ScientificArticleFilters>>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleFilterChange = (key: keyof ScientificArticleFilters, value: any) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters({});
    onClear();
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof ScientificArticleFilters];
    return value !== undefined && value !== '' && value !== null && 
           (Array.isArray(value) ? value.length > 0 : true);
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Card className="aurora-glass-enhanced border-cyan-500/30">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <Search className="h-5 w-5 text-cyan-400" />
              Busca Avançada de Artigos
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
            >
              <Filter className="h-4 w-4 mr-2" />
              {isExpanded ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Busca Principal */}
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Buscar por título, conteúdo, palavras-chave ou autores..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="aurora-input"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="aurora-button-enhanced bg-cyan-600 hover:bg-cyan-700 text-white px-6"
            >
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
            {hasActiveFilters && (
              <Button
                onClick={handleClear}
                variant="outline"
                className="aurora-button-enhanced border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <X className="h-4 w-4 mr-2" />
                Limpar
              </Button>
            )}
          </div>

          {/* Filtros Expandidos */}
          {isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-slate-600">
              {/* Status de Processamento */}
              {availableStatuses.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-white flex items-center gap-2">
                    <FileText className="h-4 w-4 text-cyan-400" />
                    Status
                  </Label>
                  <Select
                    onValueChange={(value) => 
                      handleFilterChange('status_processamento', value === 'all' ? undefined : value)
                    }
                    value={filters.status_processamento || 'all'}
                  >
                    <SelectTrigger className="aurora-glass border-slate-600 text-white">
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent className="aurora-glass border-slate-600">
                      <SelectItem value="all" className="text-white hover:bg-slate-700">
                        Todos os status
                      </SelectItem>
                      {availableStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value} className="text-white hover:bg-slate-700">
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Equipamento */}
              <div className="space-y-2">
                <Label className="text-white flex items-center gap-2">
                  <Tag className="h-4 w-4 text-cyan-400" />
                  Equipamento
                </Label>
                <Select
                  onValueChange={(value) => 
                    handleFilterChange('equipmentId', value === 'all' ? undefined : value)
                  }
                  value={filters.equipmentId || 'all'}
                >
                  <SelectTrigger className="aurora-glass border-slate-600 text-white">
                    <SelectValue placeholder="Todos equipamentos" />
                  </SelectTrigger>
                  <SelectContent className="aurora-glass border-slate-600">
                    <SelectItem value="all" className="text-white hover:bg-slate-700">
                      Todos equipamentos
                    </SelectItem>
                    {equipments?.map((equipment) => (
                      <SelectItem key={equipment.id} value={equipment.id} className="text-white hover:bg-slate-700">
                        {equipment.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Data de Upload */}
              <div className="space-y-2">
                <Label className="text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-cyan-400" />
                  Data de Upload
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    placeholder="Data inicial"
                    value={filters.dateRange?.startDate || ''}
                    onChange={(e) => 
                      handleFilterChange('dateRange', {
                        ...filters.dateRange,
                        startDate: e.target.value || undefined
                      })
                    }
                    className="aurora-glass border-slate-600 text-white"
                  />
                  <Input
                    type="date"
                    placeholder="Data final"
                    value={filters.dateRange?.endDate || ''}
                    onChange={(e) => 
                      handleFilterChange('dateRange', {
                        ...filters.dateRange,
                        endDate: e.target.value || undefined
                      })
                    }
                    className="aurora-glass border-slate-600 text-white"
                  />
                </div>
              </div>

              {/* Palavras-chave específicas */}
              <div className="space-y-2">
                <Label className="text-white flex items-center gap-2">
                  <Tag className="h-4 w-4 text-cyan-400" />
                  Palavras-chave
                </Label>
                <Input
                  placeholder="Ex: radiofrequência, crioterapia"
                  value={filters.palavras_chave?.join(', ') || ''}
                  onChange={(e) => {
                    const keywords = e.target.value
                      .split(',')
                      .map(k => k.trim())
                      .filter(k => k.length > 0);
                    handleFilterChange('palavras_chave', keywords.length > 0 ? keywords : undefined);
                  }}
                  className="aurora-glass border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              {/* Autores */}
              <div className="space-y-2">
                <Label className="text-white flex items-center gap-2">
                  <User className="h-4 w-4 text-cyan-400" />
                  Autores
                </Label>
                <Input
                  placeholder="Ex: Silva, Rodrigo"
                  value={filters.autores?.join(', ') || ''}
                  onChange={(e) => {
                    const authors = e.target.value
                      .split(',')
                      .map(a => a.trim())
                      .filter(a => a.length > 0);
                    handleFilterChange('autores', authors.length > 0 ? authors : undefined);
                  }}
                  className="aurora-glass border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-600">
              <span className="text-sm text-slate-400">Filtros ativos:</span>
              
              {filters.search && (
                <Badge variant="secondary" className="bg-cyan-600/20 text-cyan-300 border-cyan-500/30">
                  Busca: {filters.search}
                </Badge>
              )}
              
              {filters.status_processamento && (
                <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-500/30">
                  Status: {availableStatuses.find(s => s.value === filters.status_processamento)?.label}
                </Badge>
              )}
              
              {filters.equipmentId && (
                <Badge variant="secondary" className="bg-green-600/20 text-green-300 border-green-500/30">
                  Equipamento: {equipments?.find(e => e.id === filters.equipmentId)?.nome}
                </Badge>
              )}
              
              {filters.dateRange?.startDate && (
                <Badge variant="secondary" className="bg-orange-600/20 text-orange-300 border-orange-500/30">
                  Desde: {filters.dateRange.startDate}
                </Badge>
              )}
              
              {filters.palavras_chave && filters.palavras_chave.length > 0 && (
                <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-300 border-yellow-500/30">
                  Palavras-chave: {filters.palavras_chave.length}
                </Badge>
              )}
              
              {filters.autores && filters.autores.length > 0 && (
                <Badge variant="secondary" className="bg-pink-600/20 text-pink-300 border-pink-500/30">
                  Autores: {filters.autores.length}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedSearch;
