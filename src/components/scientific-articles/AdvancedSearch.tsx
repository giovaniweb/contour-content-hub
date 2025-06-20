import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker'; // MODIFICADO
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ScientificArticleFilters } from '@/hooks/use-scientific-articles'; // Importar a interface de filtros

// Se DatePickerWithRange não existir, precisaremos de uma alternativa ou criar um similar.
// Por agora, vamos assumir sua existência.
// Exemplo de Fallback para DatePickerWithRange se não existir:
// const DatePickerWithRange = ({ onChange }) => (
//   <div>
//     <Input type="date" onChange={e => onChange({ from: e.target.value })} />
//     <Input type="date" onChange={e => onChange({ to: e.target.value })} />
//   </div>
// );

interface Equipment {
  id: string;
  nome: string;
}

interface Language {
  code: string;
  name: string;
}

interface AdvancedSearchProps {
  initialFilters?: Partial<ScientificArticleFilters>;
  onSearch: (filters: Partial<ScientificArticleFilters>) => void;
  onClear?: () => void; // Opcional: para limpar os filtros
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ initialFilters = {}, onSearch, onClear }) => {
  const [searchTerm, setSearchTerm] = useState(initialFilters.search || '');
  const [selectedEquipment, setSelectedEquipment] = useState(initialFilters.equipmentId || '');
  const [keywordsInput, setKeywordsInput] = useState((initialFilters.keywords || []).join(', '));
  const [researchersInput, setResearchersInput] = useState((initialFilters.researchers || []).join(', '));
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialFilters.dateRange?.startDate ? new Date(initialFilters.dateRange.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialFilters.dateRange?.endDate ? new Date(initialFilters.dateRange.endDate) : undefined
  );
  const [selectedLanguage, setSelectedLanguage] = useState(initialFilters.language || '');

  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [languages, setLanguages] = useState<Language[]>([ // Exemplo de idiomas
    { code: 'pt', name: 'Português' },
    { code: 'en', name: 'Inglês' },
    { code: 'es', name: 'Espanhol' },
    { code: 'all', name: 'Todos os idiomas' }, // Opção para limpar filtro de idioma
  ]);

  // Fetch equipments
  useEffect(() => {
    const fetchEquipments = async () => {
      const { data, error } = await supabase
        .from('equipamentos')
        .select('id, nome')
        .eq('ativo', true)
        .order('nome');
      if (error) {
        console.error('Error fetching equipments:', error);
      } else {
        setEquipments(data || []);
      }
    };
    fetchEquipments();
  }, []);

  const handleSearch = () => {
    const filters: Partial<ScientificArticleFilters> = {
      search: searchTerm.trim() || undefined,
      equipmentId: selectedEquipment || undefined,
      keywords: keywordsInput.split(',').map(k => k.trim()).filter(k => k) || undefined,
      researchers: researchersInput.split(',').map(r => r.trim()).filter(r => r) || undefined,
      dateRange: (startDate || endDate) ? {
        startDate: startDate?.toISOString().split('T')[0],
        endDate: endDate?.toISOString().split('T')[0],
      } : undefined,
      language: selectedLanguage === 'all' ? undefined : selectedLanguage || undefined,
    };
    onSearch(filters);
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelectedEquipment('');
    setKeywordsInput('');
    setResearchersInput('');
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedLanguage('');
    if (onClear) {
      onClear();
    }
    // Também chamar onSearch com filtros vazios para resetar a busca
    onSearch({});
  };

  return (
    <div className="p-4 md:p-6 bg-slate-800/50 border border-cyan-500/20 rounded-xl shadow-lg space-y-6 mb-6 aurora-border-enhanced">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Search Term */}
        <div className="space-y-1">
          <Label htmlFor="searchTerm" className="text-slate-300">Termo de Busca</Label>
          <Input
            id="searchTerm"
            placeholder="Buscar por título, descrição, conteúdo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-700/60 border-cyan-500/40 text-slate-100 placeholder-slate-400"
          />
        </div>

        {/* Keywords */}
        <div className="space-y-1">
          <Label htmlFor="keywords" className="text-slate-300">Palavras-chave (separadas por vírgula)</Label>
          <Input
            id="keywords"
            placeholder="Ex: criofrequência, adiposidade"
            value={keywordsInput}
            onChange={(e) => setKeywordsInput(e.target.value)}
            className="bg-slate-700/60 border-cyan-500/40 text-slate-100 placeholder-slate-400"
          />
        </div>

        {/* Researchers */}
        <div className="space-y-1">
          <Label htmlFor="researchers" className="text-slate-300">Pesquisadores (separados por vírgula)</Label>
          <Input
            id="researchers"
            placeholder="Ex: Dr. Fulano, Ciclana Silva"
            value={researchersInput}
            onChange={(e) => setResearchersInput(e.target.value)}
            className="bg-slate-700/60 border-cyan-500/40 text-slate-100 placeholder-slate-400"
          />
        </div>

        {/* Equipment */}
        <div className="space-y-1">
          <Label htmlFor="equipment" className="text-slate-300">Equipamento Relacionado</Label>
          <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
            <SelectTrigger className="bg-slate-700/60 border-cyan-500/40 text-slate-100">
              <SelectValue placeholder="Selecione um equipamento" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-cyan-500/30 text-slate-100">
              <SelectItem value="" className="text-slate-400">Qualquer equipamento</SelectItem>
              {equipments.map((eq) => (
                <SelectItem key={eq.id} value={eq.id}>{eq.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Language */}
        <div className="space-y-1">
          <Label htmlFor="language" className="text-slate-300">Idioma</Label>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="bg-slate-700/60 border-cyan-500/40 text-slate-100">
              <SelectValue placeholder="Selecione um idioma" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-cyan-500/30 text-slate-100">
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code} className={lang.code === "" || lang.code === "all" ? "text-slate-400" : ""}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range - Modificado */}
        <div className="space-y-1">
          <Label htmlFor="startDate" className="text-slate-300">Data de Início</Label>
          <DatePicker
            value={startDate}
            onValueChange={setStartDate}
            placeholder="DD/MM/AAAA"
            className="w-full" // Assegurar que o botão ocupe a largura
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="endDate" className="text-slate-300">Data de Fim</Label>
          <DatePicker
            value={endDate}
            onValueChange={setEndDate}
            placeholder="DD/MM/AAAA"
            className="w-full" // Assegurar que o botão ocupe a largura
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-4 border-t border-slate-700/50">
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

// Nota: Se o componente `DatePickerWithRange` não existir em `@/components/ui/date-range-picker`,
// será necessário criá-lo ou usar uma alternativa. Um DatePicker simples pode exigir dois campos (data de início e fim).
// O shadcn/ui tem um exemplo de `DatePickerWithRange` que pode ser adaptado.
