import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart4, 
  ListChecks,
  Calendar, 
  Lightbulb, 
  UserCheck,
  Download,
  Share2
} from 'lucide-react';
import { toast } from 'sonner';
import { MarketingConsultantState } from '@/components/akinator-marketing-consultant/types';
import { calculateStrategicScore, getScoreExplanation } from '@/utils/calculateStrategicScore';
import { DiagnosticSession } from '@/hooks/useDiagnosticPersistence';
import { createSafeHtml } from '@/utils/security';

interface DiagnosticResultsProps {
  state: MarketingConsultantState;
  sessionData: DiagnosticSession;
  onConvertToActions?: () => void;
}

const DiagnosticResults: React.FC<DiagnosticResultsProps> = ({ 
  state, 
  sessionData,
  onConvertToActions 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const scoreBreakdown = calculateStrategicScore(sessionData);
  const scoreExplanations = getScoreExplanation(scoreBreakdown);
  
  const handleDownloadPDF = () => {
    toast.success("Preparando download do diagnóstico", {
      description: "Seu diagnóstico será baixado em alguns instantes."
    });
    // Implementação real seria feita aqui
  };
  
  const handleShare = () => {
    toast.success("Link de compartilhamento gerado", {
      description: "Um link seguro foi copiado para sua área de transferência."
    });
    // Implementação real seria feita aqui
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {/* Score Card */}
        <Card className="p-6 flex-1">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Score Estratégico</h3>
              <span className={`text-xl font-bold ${scoreBreakdown.color}`}>
                {scoreBreakdown.totalScore}/100
              </span>
            </div>
            
            <div className="relative pt-8">
              <div className="w-full bg-muted h-2 rounded-full">
                <motion.div 
                  className={`h-full rounded-full ${
                    scoreBreakdown.totalScore >= 80 ? 'bg-green-500' :
                    scoreBreakdown.totalScore >= 60 ? 'bg-yellow-500' :
                    scoreBreakdown.totalScore >= 40 ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${scoreBreakdown.totalScore}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
              
              <div className="mt-2 text-center">
                <span className={`font-medium text-sm ${scoreBreakdown.color}`}>
                  {scoreBreakdown.label}
                </span>
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              {scoreExplanations.map((explanation, index) => (
                <div key={index} className="text-sm">
                  {explanation}
                </div>
              ))}
            </div>
          </div>
        </Card>
        
        {/* Actions Card */}
        <Card className="p-6 flex-1">
          <h3 className="text-lg font-semibold mb-4">Próximos Passos</h3>
          <div className="space-y-4">
            <Button 
              className="w-full justify-start gap-2" 
              onClick={onConvertToActions}
            >
              <ListChecks className="h-4 w-4" />
              Converter em Plano de Ação
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={handleDownloadPDF}
            >
              <Download className="h-4 w-4" />
              Baixar Diagnóstico (PDF)
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              Compartilhar Resultados
            </Button>
          </div>
        </Card>
      </div>
      
      {/* Diagnostic Content */}
      <Card className="p-6">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart4 className="h-4 w-4" />
              <span className="hidden sm:inline">Visão Geral</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Recomendações</span>
            </TabsTrigger>
            <TabsTrigger value="action-plan" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Plano de Ação</span>
            </TabsTrigger>
            <TabsTrigger value="audience" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Público-Alvo</span>
            </TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="overview" className="mt-0">
                {state.generatedDiagnostic ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div dangerouslySetInnerHTML={createSafeHtml(
                      state.generatedDiagnostic
                        .replace(/^## /gm, '<h3 class="text-xl font-semibold mt-4 mb-2">')
                        .replace(/\n\n/g, '</p><p>')
                        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                    )} />
                  </div>
                ) : (
                  <div className="text-muted-foreground text-center py-8">
                    Diagnóstico não disponível
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="recommendations" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {state.generatedDiagnostic && state.generatedDiagnostic.includes('Sugestões de Conteúdo') ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <div dangerouslySetInnerHTML={createSafeHtml(
                        state.generatedDiagnostic
                          .split('## 💡 Sugestões de Conteúdo Personalizado')[1]
                          .split('##')[0]
                          .replace(/\n\n/g, '</p><p>')
                          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                          .replace(/(\d+\.\s+\*\*[^:]+):/g, '<h4 class="font-medium">$1</h4>')
                      )} />
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-center py-8">
                      Recomendações não disponíveis
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="action-plan" className="mt-0">
                {state.generatedDiagnostic && state.generatedDiagnostic.includes('Plano de Ação') ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div dangerouslySetInnerHTML={createSafeHtml(
                      state.generatedDiagnostic
                        .split('## 📅 Plano de Ação Semanal')[1]
                        .split('##')[0]
                        .replace(/\n\n/g, '</p><p>')
                        .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-primary">$1</strong>')
                        .replace(/- /g, '• ')
                    )} />
                  </div>
                ) : (
                  <div className="text-muted-foreground text-center py-8">
                    Plano de ação não disponível
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="audience" className="mt-0">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Análise de Público-Alvo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h4 className="font-medium mb-2">Perfil</h4>
                      <p className="text-sm text-muted-foreground">
                        {state.targetAudience === '50 anos' ? 
                          'Público maduro, com idade média acima de 50 anos, buscando resultados concretos e seguros.' :
                          state.targetAudience === 'mulheres' ?
                          'Público predominantemente feminino, com foco em tratamentos estéticos e bem-estar.' :
                          state.targetAudience === 'homens' ?
                          'Público masculino, buscando tratamentos específicos e resultados discretos.' :
                          state.targetAudience === 'jovens' ?
                          'Público jovem, interessado em tratamentos preventivos e com foco em tendências.' :
                          'Público diversificado, com diferentes necessidades e expectativas.'
                        }
                      </p>
                    </Card>
                    
                    <Card className="p-4">
                      <h4 className="font-medium mb-2">Preferências</h4>
                      <p className="text-sm text-muted-foreground">
                        {state.communicationStyle === 'emocional_inspirador' ? 
                          'Prefere comunicação emocional e inspiradora, com histórias e depoimentos.' :
                          state.communicationStyle === 'tecnico_educativo' ?
                          'Valoriza informações técnicas e educativas, baseadas em evidências.' :
                          state.communicationStyle === 'direto_objetivo' ?
                          'Busca comunicação direta e objetiva, focada em resultados.' :
                          'Comunicação diversificada, adaptando o estilo conforme o contexto.'
                        }
                      </p>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </Card>
    </div>
  );
};

export default DiagnosticResults;