import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ScientificArticleFilters } from '@/hooks/use-scientific-articles'; // Still using this for structure
import { ProcessingStatusEnum } from '@/types/document'; // Import enum for status

interface Equipment {
  id: string;
  nome: string;
}

// Language filter is removed as it's not in unified_documents directly
// interface Language {
//   code: string;
//   name: string;
// }

interface StatusOption {
    value: ProcessingStatusEnum | '';
    label: string;
}

interface AdvancedSearchProps {
  initialFilters?: Partial<ScientificArticleFilters>;
  onSearch: (filters: Partial<ScientificArticleFilters>) => void;
  onClear?: () => void;
  availableStatuses?: StatusOption[]; // Make statuses configurable from parent
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
    initialFilters = {},
    onSearch,
    onClear,
    availableStatuses = [ // Default statuses if not provided
        { value: 'concluido', label: 'Concluído' },
        { value: 'falhou', label: 'Falhou' },
        { value: 'processando', label: 'Processando' },
        { value: 'pendente', label: 'Pendente' },
        { value: '', label: 'Qualquer Status' },
    ]
}) => {
  const [searchTerm, setSearchTerm] = useState(initialFilters.search || '');
  const [selectedEquipment, setSelectedEquipment] = useState(initialFilters.equipmentId || '');
  // Use `palavras_chave` and `autores` corresponding to UnifiedDocument fields
  const [palavrasChaveInput, setPalavrasChaveInput] = useState((initialFilters.palavras_chave || []).join(', '));
  const [autoresInput, setAutoresInput] = useState((initialFilters.autores || []).join(', '));
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialFilters.dateRange?.startDate ? new Date(initialFilters.dateRange.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialFilters.dateRange?.endDate ? new Date(initialFilters.dateRange.endDate) : undefined
  );
  // const [selectedLanguage, setSelectedLanguage] = useState(initialFilters.language || ''); // Language filter removed
  const [selectedStatus, setSelectedStatus] = useState<ProcessingStatusEnum | ''>(initialFilters.status_processamento || 'concluido');


  const [equipments, setEquipments] = useState<Equipment[]>([]);
  // const [languages, setLanguages] = useState<Language[]>([ ... ]); // Removed

  useEffect(() => {
    const fetchEquipments = async () => {
      const { data, error } = await supabase
        .from('equipamentos')
        .select('id, nome')
        .eq('ativo', true) // Assuming 'ativo' field exists
        .order('nome');
      if (error) {
        console.error('Error fetching equipments:', error);
      } else {
        setEquipments(data || []);
      }
    };
    fetchEquipments();
  }, []);

  // Update local state if initialFilters change from parent (e.g. after clearing)
  useEffect(() => {
    setSearchTerm(initialFilters.search || '');
    setSelectedEquipment(initialFilters.equipmentId || '');
    setPalavrasChaveInput((initialFilters.palavras_chave || []).join(', '));
    setAutoresInput((initialFilters.autores || []).join(', '));
    setStartDate(initialFilters.dateRange?.startDate ? new Date(initialFilters.dateRange.startDate) : undefined);
    setEndDate(initialFilters.dateRange?.endDate ? new Date(initialFilters.dateRange.endDate) : undefined);
    setSelectedStatus(initialFilters.status_processamento || 'concluido');
  }, [initialFilters]);


  const handleSearch = () => {
    const filters: Partial<ScientificArticleFilters> = {
      search: searchTerm.trim() || undefined,
      equipmentId: selectedEquipment || undefined,
      palavras_chave: palavrasChaveInput.split(',').map(k => k.trim()).filter(k => k).length > 0
                      ? palavrasChaveInput.split(',').map(k => k.trim()).filter(k => k)
                      : undefined,
      autores: autoresInput.split(',').map(r => r.trim()).filter(r => r).length > 0
               ? autoresInput.split(',').map(r => r.trim()).filter(r => r)
               : undefined,
      dateRange: (startDate || endDate) ? {
        startDate: startDate?.toISOString().split('T')[0],
        endDate: endDate?.toISOString().split('T')[0],
      } : undefined,
      // language: selectedLanguage === 'all' ? undefined : selectedLanguage || undefined, // Language filter removed
      status_processamento: selectedStatus || undefined, // Pass empty string as undefined effectively
    };
    onSearch(filters);
  };

  const handleClear = () => {
    // Reset local state
    setSearchTerm('');
    setSelectedEquipment('');
    setPalavrasChaveInput('');
    setAutoresInput('');
    setStartDate(undefined);
    setEndDate(undefined);
    // setSelectedLanguage(''); // Language filter removed
    setSelectedStatus('concluido'); // Default to 'concluido' or parent's default

    // Trigger parent's onClear or directly call onSearch with default/empty filters
    if (onClear) {
      onClear(); // This should reset parent's currentFilters, which then flow back via initialFilters
    } else {
      // If no onClear, directly reset search to default state
      onSearch({ status_processamento: 'concluido' });
    }
  };

  return (
    <div className="p-4 md:p-6 bg-slate-800/50 border border-cyan-500/20 rounded-xl shadow-lg space-y-6 mb-6 aurora-border-enhanced">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-end">
        {/* Search Term */}
        <div className="space-y-1">
          <Label htmlFor="searchTerm" className="text-slate-300">Termo de Busca</Label>
          <Input
            id="searchTerm"
            placeholder="Título, conteúdo, palavras-chave, autores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-700/60 border-cyan-500/40 text-slate-100 placeholder-slate-400"
          />
        </div>

        {/* Palavras-chave */}
        <div className="space-y-1">
          <Label htmlFor="palavrasChave" className="text-slate-300">Palavras-chave (separadas por vírgula)</Label>
          <Input
            id="palavrasChave"
            placeholder="Ex: criofrequência, adiposidade"
            value={palavrasChaveInput}
            onChange={(e) => setPalavrasChaveInput(e.target.value)}
            className="bg-slate-700/60 border-cyan-500/40 text-slate-100 placeholder-slate-400"
          />
        </div>

        {/* Autores */}
        <div className="space-y-1">
          <Label htmlFor="autores" className="text-slate-300">Autores (separados por vírgula)</Label>
          <Input
            id="autores"
            placeholder="Ex: Dr. Fulano, Ciclana Silva"
            value={autoresInput}
            onChange={(e) => setAutoresInput(e.target.value)}
            className="bg-slate-700/60 border-cyan-500/40 text-slate-100 placeholder-slate-400"
          />
        </div>

        {/* Equipment */}
        <div className="space-y-1">
          <Label htmlFor="equipment" className="text-slate-300">Equipamento</Label>
          <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
            <SelectTrigger className="bg-slate-700/60 border-cyan-500/40 text-slate-100">
              <SelectValue placeholder="Selecione equipamento" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-cyan-500/30 text-slate-100">
              <SelectItem value="" className="text-slate-400">Qualquer equipamento</SelectItem>
              {equipments.map((eq) => (
                <SelectItem key={eq.id} value={eq.id}>{eq.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Processing Status */}
        <div className="space-y-1">
          <Label htmlFor="status_processamento" className="text-slate-300">Status do Processamento</Label>
          <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as ProcessingStatusEnum | '')}>
            <SelectTrigger className="bg-slate-700/60 border-cyan-500/40 text-slate-100">
              <SelectValue placeholder="Selecione um status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-cyan-500/30 text-slate-100">
              {availableStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value} className={status.value === "" ? "text-slate-400" : ""}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>


        {/* Language filter removed */}
        {/* <div className="space-y-1"> ... </div> */}

        {/* Date Range */}
        <div className="space-y-1">
          <Label htmlFor="startDate" className="text-slate-300">Data de Upload (Início)</Label>
          <DatePicker
            value={startDate}
            onValueChange={setStartDate}
            placeholder="DD/MM/AAAA"
            className="w-full"
          />
        </div>
        <div className="space-y-1 md:col-span-1 lg:col-span-2"> {/* Adjust span for layout */}
          <Label htmlFor="endDate" className="text-slate-300">Data de Upload (Fim)</Label>
           <DatePicker
            value={endDate}
            onValueChange={setEndDate}
            placeholder="DD/MM/AAAA"
            className="w-full"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-4 border-t border-slate-700/50 mt-2">
        <Button
            variant="outline"
            onClick={handleClear}
            className="w-full sm:w-auto border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
        >
            <X className="mr-2 h-4 w-4" />
            Limpar Filtros
        </Button>
        <Button
            onClick={handleSearch}
            className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600"
        >
            <Search className="mr-2 h-4 w-4" />
            Buscar Artigos
        </Button>
      </div>
    </div>
  );
};

export default AdvancedSearch;
