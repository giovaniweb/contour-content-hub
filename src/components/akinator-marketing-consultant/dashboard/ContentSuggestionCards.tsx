import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { Video, Image, PlayCircle, Calendar, Plus, Sparkles, Target, TrendingUp, Users } from "lucide-react";
import { toast } from "sonner";
import { useContentPlanner } from "@/hooks/useContentPlanner";
import { MarketingConsultantState } from '../types';
interface ContentSuggestionCardsProps {
  state: MarketingConsultantState;
  diagnostic: string;
}
interface ContentSuggestion {
  id: string;
  title: string;
  description: string;
  format: 'vídeo' | 'reels' | 'carrossel' | 'story';
  objective: string;
  equipment?: string;
  estimatedTime: string;
  difficulty: 'Fácil' | 'Médio' | 'Avançado';
}
const ContentSuggestionCards: React.FC<ContentSuggestionCardsProps> = ({
  state,
  diagnostic
}) => {
  const {
    addItem
  } = useContentPlanner();

  // Extrair sugestões do diagnóstico IA
  const extractSuggestionsFromDiagnostic = (): ContentSuggestion[] => {
    const suggestions: ContentSuggestion[] = [];

    // Sugestões baseadas no tipo de clínica e equipamentos
    const isClinicaMedica = state.clinicType === 'clinica_medica';
    const equipamentos = isClinicaMedica ? state.medicalEquipments : state.aestheticEquipments;
    const especialidade = isClinicaMedica ? state.medicalSpecialty : state.aestheticFocus;

    // Sugestões padrão baseadas no perfil
    const baseSuggestions = [{
      id: 'before-after',
      title: `Antes e Depois: ${especialidade}`,
      description: `Showcase transformador de resultados reais com ${especialidade}`,
      format: 'carrossel' as const,
      objective: '🔴 Fazer Comprar',
      estimatedTime: '15-30min',
      difficulty: 'Fácil' as const
    }, {
      id: 'education-reels',
      title: `Mitos vs Verdades: ${especialidade}`,
      description: 'Reel educativo desmistificando dúvidas comuns',
      format: 'reels' as const,
      objective: '🟡 Atrair Atenção',
      estimatedTime: '20-40min',
      difficulty: 'Médio' as const
    }, {
      id: 'process-video',
      title: `Como funciona: Processo Completo`,
      description: 'Vídeo explicativo do atendimento da consulta ao resultado',
      format: 'vídeo' as const,
      objective: '🟢 Criar Conexão',
      estimatedTime: '45-60min',
      difficulty: 'Avançado' as const
    }];

    // Adicionar sugestões específicas por equipamento
    if (equipamentos) {
      const equipList = equipamentos.split(',').map(eq => eq.trim());
      equipList.forEach((equip, index) => {
        if (equip && index < 2) {
          // Máximo 2 equipamentos para não poluir
          baseSuggestions.push({
            id: `equipment-${index}`,
            title: `Destaque: ${equip}`,
            description: `Conteúdo focado nos diferenciais e benefícios do ${equip}`,
            format: index % 2 === 0 ? 'vídeo' : 'carrossel' as const,
            objective: '🔴 Fazer Comprar',
            equipment: equip,
            estimatedTime: '25-45min',
            difficulty: 'Médio' as const
          });
        }
      });
    }

    // Sugestões baseadas no objetivo
    if (state.currentRevenue === 'ate_15k') {
      baseSuggestions.push({
        id: 'credibility',
        title: 'Construindo Credibilidade',
        description: 'Stories mostrando certificações, cursos e experiência',
        format: 'story' as const,
        objective: '🟢 Criar Conexão',
        estimatedTime: '10-20min',
        difficulty: 'Fácil' as const
      });
    }
    return baseSuggestions.slice(0, 6); // Máximo 6 sugestões
  };
  const suggestions = extractSuggestionsFromDiagnostic();
  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'vídeo':
        return <Video className="h-4 w-4" />;
      case 'reels':
        return <PlayCircle className="h-4 w-4" />;
      case 'carrossel':
        return <Image className="h-4 w-4" />;
      case 'story':
        return <Users className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };
  const getFormatColor = (format: string) => {
    switch (format) {
      case 'vídeo':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'reels':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'carrossel':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'story':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil':
        return 'bg-green-500/20 text-green-400';
      case 'Médio':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'Avançado':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };
  const handleAddToPlanner = async (suggestion: ContentSuggestion) => {
    try {
      const newItem = await addItem({
        title: suggestion.title,
        description: suggestion.description,
        format: suggestion.format,
        objective: suggestion.objective,
        status: 'idea',
        tags: ['sugestão-ia', 'diagnóstico', suggestion.equipment].filter(Boolean),
        equipmentName: suggestion.equipment,
        aiGenerated: true
      });
      if (newItem) {
        toast.success("💡 Ideia adicionada ao planejador!", {
          description: `"${suggestion.title}" foi adicionada às suas ideias`
        });
      }
    } catch (error) {
      toast.error("❌ Erro ao adicionar ao planejador", {
        description: "Tente novamente em alguns instantes"
      });
    }
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold aurora-heading flex items-center gap-2 text-slate-50">
            <Sparkles className="h-5 w-5 text-aurora-electric-purple" />
            Sugestões Inteligentes de Conteúdo
          </h3>
          <p className="text-sm aurora-body opacity-70 mt-1 text-slate-400">
            Baseadas no seu diagnóstico personalizado
          </p>
        </div>
        <Badge variant="outline" className="border-aurora-electric-purple/30 text-aurora-electric-purple bg-aurora-electric-purple/10">
          {suggestions.length} ideias prontas
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.map((suggestion, index) => <motion.div key={suggestion.id} initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: index * 0.1
      }}>
            <Card className="aurora-card h-full hover:shadow-lg transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-lg ${getFormatColor(suggestion.format)}`}>
                    {getFormatIcon(suggestion.format)}
                  </div>
                  <div className="flex gap-1">
                    <Badge variant="outline" className={getDifficultyColor(suggestion.difficulty)}>
                      {suggestion.difficulty}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-sm font-semibold aurora-heading line-clamp-2">
                  {suggestion.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-xs aurora-body opacity-80 line-clamp-3">
                  {suggestion.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="aurora-body opacity-70">Objetivo:</span>
                    <Badge variant="outline" className="text-xs">
                      {suggestion.objective}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="aurora-body opacity-70">Tempo:</span>
                    <span className="aurora-body">{suggestion.estimatedTime}</span>
                  </div>
                  
                  {suggestion.equipment && <div className="flex items-center justify-between text-xs">
                      <span className="aurora-body opacity-70">Equipamento:</span>
                      <Badge variant="outline" className="text-xs bg-aurora-sage/20 text-aurora-sage border-aurora-sage/30">
                        {suggestion.equipment}
                      </Badge>
                    </div>}
                </div>
                
                <Button onClick={() => handleAddToPlanner(suggestion)} className="w-full aurora-button text-xs h-8 group-hover:scale-105 transition-transform" size="sm">
                  <Plus className="h-3 w-3 mr-1" />
                  Adicionar ao Planejador
                </Button>
              </CardContent>
            </Card>
          </motion.div>)}
      </div>

      <div className="text-center pt-4">
        <p className="text-xs aurora-body opacity-60">
          💡 Dica: Essas sugestões foram criadas com base no seu diagnóstico. Personalize conforme sua audiência!
        </p>
      </div>
    </div>;
};
export default ContentSuggestionCards;