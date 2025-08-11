import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useUserEquipments } from '@/hooks/useUserEquipments';
import { filterValidEquipments } from '@/utils/equipmentValidation';
import { 
  Wand2, 
  Sparkles, 
  BookOpen, 
  Brain, 
  Target, 
  Zap,
  Loader2,
  Settings,
  Lightbulb,
  TrendingUp
} from "lucide-react";

interface ScriptFormNovoProps {
  onSubmit: (formData: any) => void;
  isGenerating: boolean;
  onToggleInsights: () => void;
  showInsights: boolean;
}

const ScriptFormNovo: React.FC<ScriptFormNovoProps> = ({
  onSubmit,
  isGenerating,
  onToggleInsights,
  showInsights
}) => {
  const { equipments, loading: equipmentsLoading } = useUserEquipments();
  const [formData, setFormData] = useState({
    topic: '',
    format: '',
    objective: '',
    style: '',
    equipment: '',
    channel: 'instagram',
    additionalInfo: ''
  });

  const [useScientificBasis, setUseScientificBasis] = useState(true);

  // Filter valid equipments for the dropdown
  const validEquipments = filterValidEquipments(equipments);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.topic || !formData.format || !formData.objective) {
      return;
    }

    onSubmit({
      ...formData,
      useScientificBasis
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatOptions = [
    { value: 'carrossel', label: 'Carrossel Instagram', icon: '🎠' },
    { value: 'stories_10x', label: 'Stories 10x', icon: '📱' },
    { value: 'reels', label: 'Reels', icon: '🎬' },
    { value: 'video_longo', label: 'Vídeo Longo', icon: '📹' },
    { value: 'artigo', label: 'Artigo Blog', icon: '📝' }
  ];

  const disabledFormats = new Set(['video_longo','artigo']);

  const objectiveOptions = [
    { value: 'atrair', label: 'Atrair Atenção', icon: '🎯', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    { value: 'conectar', label: 'Criar Conexão', icon: '💖', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
    { value: 'vender', label: 'Fazer Vender', icon: '💰', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    { value: 'reativar', label: 'Reativar', icon: '🔄', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' }
  ];

  const styleOptions = [
    { value: 'educativo', label: 'Educativo', icon: '🎓' },
    { value: 'inspiracional', label: 'Inspiracional', icon: '✨' },
    { value: 'conversacional', label: 'Conversacional', icon: '💬' },
    { value: 'vendas', label: 'Vendas', icon: '🚀' },
    { value: 'storytelling', label: 'Storytelling', icon: '📖' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-white">Configuração do Roteiro</CardTitle>
                <p className="text-slate-400 text-sm">Defina os parâmetros para gerar seu roteiro personalizado</p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleInsights}
              className={`${showInsights ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : ''}`}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Insights Científicos
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tópico Principal */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <Label htmlFor="topic" className="text-white font-medium">
                Tópico Principal *
              </Label>
              <Input
                id="topic"
                placeholder="Ex: Tratamento de lipedema, Rejuvenescimento facial..."
                value={formData.topic}
                onChange={(e) => handleInputChange('topic', e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                required
              />
            </motion.div>

            {/* Formato */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <Label className="text-white font-medium">Formato do Conteúdo *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {formatOptions.map((format) => {
                  const isDisabled = disabledFormats.has(format.value);
                  const isActive = formData.format === format.value;
                  return (
                    <motion.button
                      key={format.value}
                      type="button"
                      whileHover={!isDisabled ? { scale: 1.02 } : undefined}
                      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
                      onClick={() => !isDisabled && handleInputChange('format', format.value)}
                      disabled={isDisabled}
                      aria-disabled={isDisabled}
                      title={isDisabled ? 'Em breve' : undefined}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        isActive
                          ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                          : 'border-slate-600 bg-slate-700/30 text-slate-300 hover:border-slate-500'
                      } ${isDisabled ? 'opacity-60 cursor-not-allowed hover:border-slate-600' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{format.icon}</span>
                        <span className="text-sm font-medium">{format.label}</span>
                        {isDisabled && (
                          <span className="ml-auto flex items-center gap-1 text-xs text-slate-400">
                            <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-80" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Em breve
                          </span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Objetivo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <Label className="text-white font-medium">Objetivo Marketing *</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {objectiveOptions.map((objective) => (
                  <motion.button
                    key={objective.value}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInputChange('objective', objective.value)}
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      formData.objective === objective.value
                        ? objective.color
                        : 'border-slate-600 bg-slate-700/30 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">{objective.icon}</span>
                      <span className="text-xs font-medium text-center">{objective.label}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Estilo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <Label className="text-white font-medium">Estilo de Comunicação</Label>
              <Select value={formData.style} onValueChange={(value) => handleInputChange('style', value)}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Selecione o estilo..." />
                </SelectTrigger>
                <SelectContent>
                  {styleOptions.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      <div className="flex items-center gap-2">
                        <span>{style.icon}</span>
                        <span>{style.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            {/* Equipamento */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <Label className="text-white font-medium">
                Equipamento (Opcional)
              </Label>
              <Select 
                value={formData.equipment} 
                onValueChange={(value) => handleInputChange('equipment', value)}
              >
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Selecione um equipamento ou outros assuntos..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="outros_assuntos" className="text-slate-300 hover:bg-slate-700">
                    <div className="flex items-center gap-2">
                      <span>📝</span>
                      <span>Outros assuntos (sem equipamento específico)</span>
                    </div>
                  </SelectItem>
                  {equipmentsLoading ? (
                    <SelectItem value="loading" disabled className="text-slate-400">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Carregando equipamentos...</span>
                      </div>
                    </SelectItem>
                  ) : validEquipments.length > 0 ? (
                    validEquipments.map((equipment) => (
                      <SelectItem 
                        key={equipment.id} 
                        value={equipment.nome}
                        className="text-slate-300 hover:bg-slate-700"
                      >
                        <div className="flex items-center gap-2">
                          <span>⚡</span>
                          <span>{equipment.nome}</span>
                          {equipment.categoria && (
                            <Badge variant="secondary" className="text-xs ml-2">
                              {equipment.categoria === 'estetico' ? 'Estético' : 'Médico'}
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no_equipment" disabled className="text-slate-400">
                      Nenhum equipamento disponível
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </motion.div>

            {/* Informações Adicionais */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-2"
            >
              <Label htmlFor="additionalInfo" className="text-white font-medium">
                Informações Adicionais
              </Label>
              <Textarea
                id="additionalInfo"
                placeholder="Adicione contexto específico, público-alvo, tom desejado..."
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 min-h-[100px]"
              />
            </motion.div>

            {/* Configurações Avançadas */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="p-4 bg-slate-700/30 rounded-lg border border-slate-600"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-blue-400" />
                  <div>
                    <h4 className="text-white font-medium">Base Científica</h4>
                    <p className="text-sm text-slate-400">Utilizar artigos científicos para fundamentar o roteiro</p>
                  </div>
                </div>
                <Switch
                  checked={useScientificBasis}
                  onCheckedChange={setUseScientificBasis}
                />
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                type="submit"
                disabled={isGenerating || !formData.topic || !formData.format || !formData.objective}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 h-auto"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Gerando Roteiro...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Wand2 className="w-5 h-5" />
                    <span>Gerar Roteiro com IA</span>
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ScriptFormNovo;