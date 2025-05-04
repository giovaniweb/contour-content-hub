
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Sparkles, ArrowRight, Check, Download, ChevronDown, ChevronUp, Wand } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CalendarDialog from "@/components/script/CalendarDialog";

interface ImplementationPlanProps {
  strategy: any;
  diagnosticData: any;
  onReset: () => void;
}

const ImplementationPlan: React.FC<ImplementationPlanProps> = ({
  strategy,
  diagnosticData,
  onReset
}) => {
  const [activeTab, setActiveTab] = useState<string>("calendar");
  const [schedule, setSchedule] = useState<any>({
    date: new Date(),
    implementation: [
      { task: "Criar programa de indicação", week: 1, done: false },
      { task: "Configurar campanhas no Meta/Facebook", week: 1, done: false },
      { task: "Preparar calendário de conteúdo", week: 1, done: false },
      { task: "Gravar primeiros vídeos educativos", week: 2, done: false },
      { task: "Lançar campanha de fidelização", week: 2, done: false },
      { task: "Configurar sistema de métricas", week: 3, done: false },
      { task: "Primeira análise de resultados", week: 4, done: false },
      { task: "Ajustes na estratégia", week: 4, done: false },
    ],
  });
  const [contentQuantity, setContentQuantity] = useState<number>(5);
  const [bigIdeas, setBigIdeas] = useState<any[]>([]);
  const [selectedBigIdea, setSelectedBigIdea] = useState<any>(null);
  const [expandedScript, setExpandedScript] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isCalendarDialogOpen, setIsCalendarDialogOpen] = useState<boolean>(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Ensure that the objects have safe default values
  const safeStrategy = strategy || {};
  const safeOrganic = safeStrategy.organic || {};
  const safeDiagnosticData = diagnosticData || {};
  const safeMainProcedures = safeDiagnosticData.mainProcedures || ['tratamento estético'];
  
  // Create a safe content types array to prevent undefined access
  const contentTypes = safeOrganic.contentTypes || [];
  const primaryTopic = safeOrganic.primaryTopic || 'tratamentos estéticos';

  const handleDownload = () => {
    toast({
      title: "Plano estratégico gerado",
      description: "O documento foi baixado com sucesso.",
    });
  };

  const handleCalendarAdd = () => {
    toast({
      title: "Ações adicionadas ao calendário",
      description: "Seu calendário de marketing foi atualizado.",
    });
  };

  const handleTaskToggle = (index: number) => {
    const updatedSchedule = { ...schedule };
    updatedSchedule.implementation[index].done = !updatedSchedule.implementation[index].done;
    setSchedule(updatedSchedule);
    
    toast({
      title: updatedSchedule.implementation[index].done ? "Tarefa concluída" : "Tarefa reaberta",
      description: updatedSchedule.implementation[index].task,
    });
  };

  // Generate big ideas based on content types and diagnostic data
  const generateBigIdeas = () => {
    setIsGenerating(true);
    
    // Example big ideas (in a real app, this would call an AI API)
    setTimeout(() => {
      const generatedIdeas = Array(contentQuantity).fill(null).map((_, idx) => {
        const types = ['educational', 'before-after', 'testimonials'];
        const availableTypes = contentTypes.length > 0 ? contentTypes : types;
        const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        
        let title = '';
        let description = '';
        
        switch(randomType) {
          case 'educational':
            title = `Os segredos de ${primaryTopic} que ninguém conta`;
            description = `Conteúdo educativo sobre ${safeMainProcedures[0]} focado nas dúvidas mais comuns`;
            break;
          case 'before-after':
            title = `Transformação incrível com ${safeMainProcedures[0]}`;
            description = `Antes e depois com explicação detalhada do processo e resultados`;
            break;
          case 'testimonials':
            title = `Por que minhas clientes escolhem ${primaryTopic}`;
            description = `Depoimento real de cliente satisfeita com resultados de ${safeMainProcedures[0]}`;
            break;
          default:
            title = `${primaryTopic} - o que você precisa saber`;
            description = `Visão geral sobre ${safeMainProcedures[0]} e seus benefícios`;
        }
        
        return {
          id: idx + 1,
          title,
          description,
          type: randomType,
          marketingObjective: ['🟡 Atrair Atenção', '🟢 Criar Conexão', '🔴 Fazer Comprar'][idx % 3]
        };
      });
      
      setBigIdeas(generatedIdeas);
      setIsGenerating(false);
      
      toast({
        title: "Big Ideas geradas com sucesso",
        description: `${contentQuantity} ideias de conteúdo foram criadas para você`,
      });
    }, 1500);
  };
  
  // Expand big idea into full content script
  const expandBigIdea = (idea: any) => {
    setIsGenerating(true);
    setSelectedBigIdea(idea);
    
    // Example script generation (in a real app, this would call an AI API)
    setTimeout(() => {
      const script = {
        ...idea,
        content: `# Roteiro: ${idea.title}\n\n## Introdução (0:00 - 0:15)\n"Olá, pessoal! Hoje vamos falar sobre ${primaryTopic} e como isso pode transformar seus resultados."\n\n## Desenvolvimento (0:15 - 0:45)\n"O que muitas pessoas não sabem é que ${safeMainProcedures[0]} pode...\nVamos mostrar como funciona na prática..."\n\n## Exemplos e resultados (0:45 - 1:30)\n"Veja aqui alguns dos resultados impressionantes que conseguimos...\nNote a diferença em apenas X sessões..."\n\n## Conclusão (1:30 - 2:00)\n"É por isso que ${safeMainProcedures[0]} tem sido tão procurado...\nSe você ficou interessado, entre em contato agora mesmo!"\n\n## Chamada para ação\n"Agende sua avaliação gratuita hoje mesmo! Link na bio."`,
      };
      
      setExpandedScript(script);
      setIsGenerating(false);
      
      toast({
        title: "Roteiro expandido",
        description: "O roteiro completo foi gerado com base na Big Idea",
      });
    }, 2000);
  };
  
  const handleContentGeneration = (customTopic = '') => {
    const topic = customTopic || primaryTopic;
    navigate(`/custom-gpt?mode=advanced&topic=${encodeURIComponent(topic)}`);
  };
  
  const addToCalendar = (script: any) => {
    setExpandedScript(script);
    setIsCalendarDialogOpen(true);
  };
  
  const handleScheduleScript = async (date: Date, timeSlot: string) => {
    toast({
      title: "Conteúdo agendado",
      description: `"${expandedScript?.title}" foi agendado com sucesso para publicação.`,
    });
    setIsCalendarDialogOpen(false);
  };
  
  // Group tasks by week
  const tasksByWeek = schedule.implementation.reduce((acc: any, task: any) => {
    if (!acc[task.week]) {
      acc[task.week] = [];
    }
    acc[task.week].push(task);
    return acc;
  }, {});

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Plano de Implementação Estratégica</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="calendar">Calendário de Ações</TabsTrigger>
            <TabsTrigger value="content">Conteúdos Sugeridos</TabsTrigger>
            <TabsTrigger value="summary">Resumo Estratégico</TabsTrigger>
          </TabsList>
          
          {/* Calendário de Ações */}
          <TabsContent value="calendar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-dashed">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    Cronograma de Implementação
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ScrollArea className="h-[300px]">
                    {Object.keys(tasksByWeek).sort().map((week) => (
                      <div key={week} className="mb-4">
                        <h3 className="font-medium text-sm mb-2">Semana {week}</h3>
                        <ul className="space-y-2">
                          {tasksByWeek[week].map((task: any, i: number) => {
                            const taskIndex = schedule.implementation.findIndex(
                              (t: any) => t.task === task.task
                            );
                            
                            return (
                              <li key={i} className="flex items-start gap-2">
                                <div
                                  className={`h-5 w-5 rounded-full border flex-shrink-0 cursor-pointer flex items-center justify-center mt-0.5 ${
                                    task.done
                                      ? "bg-primary border-primary text-primary-foreground"
                                      : "border-muted-foreground"
                                  }`}
                                  onClick={() => handleTaskToggle(taskIndex)}
                                >
                                  {task.done && <Check className="h-3 w-3" />}
                                </div>
                                <span
                                  className={task.done ? "line-through text-muted-foreground" : ""}
                                >
                                  {task.task}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </ScrollArea>
                  
                  <Button 
                    className="w-full mt-4" 
                    onClick={handleCalendarAdd}
                  >
                    Adicionar ao Calendário
                  </Button>
                </CardContent>
              </Card>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Selecione a data de início</p>
                <Calendar
                  mode="single"
                  selected={schedule.date}
                  onSelect={(date) => setSchedule({ ...schedule, date })}
                  className="rounded-md border pointer-events-auto"
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Conteúdos Sugeridos */}
          <TabsContent value="content">
            <div className="space-y-4">
              {/* Content Generator */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-4">Gerador de Big Ideas</h3>
                
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="contentQuantity">Quantidade de ideias a gerar</Label>
                    <div className="flex gap-2">
                      <Input
                        id="contentQuantity"
                        type="number"
                        min={1}
                        max={10}
                        value={contentQuantity}
                        onChange={(e) => setContentQuantity(parseInt(e.target.value) || 1)}
                        className="w-20"
                      />
                      <Button 
                        onClick={generateBigIdeas}
                        disabled={isGenerating}
                        className="flex-1"
                      >
                        {isGenerating ? (
                          <>Gerando...</>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Gerar Big Ideas
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {bigIdeas.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-2">Big Ideas Geradas</h4>
                      <ScrollArea className="h-[250px] border rounded-md p-3 bg-card">
                        {bigIdeas.map((idea) => (
                          <div key={idea.id} className="mb-4 border-b pb-3 last:border-b-0">
                            <div className="flex justify-between">
                              <h5 className="font-medium">{idea.title}</h5>
                              <span className="text-xs bg-muted px-2 py-1 rounded-md">
                                {idea.marketingObjective}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground my-2">
                              {idea.description}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => expandBigIdea(idea)}
                              >
                                <Wand className="mr-2 h-4 w-4" />
                                Expandir para Roteiro
                              </Button>
                              <Button
                                size="sm" 
                                variant="ghost"
                                onClick={() => addToCalendar(idea)}
                              >
                                <CalendarIcon className="mr-1 h-4 w-4" />
                                Agendar
                              </Button>
                            </div>
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Expanded Script */}
              {expandedScript && (
                <div className="border p-4 rounded-lg mt-4 bg-card">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Roteiro Expandido</h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addToCalendar(expandedScript)}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Agendar Publicação
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setExpandedScript(null)}
                      >
                        Fechar
                      </Button>
                    </div>
                  </div>
                  
                  <ScrollArea className="h-[300px] mt-2">
                    <div className="whitespace-pre-wrap">
                      <h4 className="text-lg font-medium mb-2">{expandedScript.title}</h4>
                      <div className="prose dark:prose-invert prose-sm max-w-none">
                        {expandedScript.content}
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              )}
              
              {!expandedScript && !bigIdeas.length && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium">Temas Sugeridos para Conteúdo</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Baseados no seu diagnóstico e temas principais
                  </p>
                  
                  <div className="space-y-3">
                    {contentTypes.includes('educational') && (
                      <div className="p-3 border rounded-lg bg-white">
                        <h4 className="font-medium">Conteúdos Educativos</h4>
                        <ul className="mt-2 space-y-2 text-sm pl-5 list-disc">
                          <li>"Como funciona {primaryTopic} - passo a passo"</li>
                          <li>"Mitos e verdades sobre {safeMainProcedures[0]}"</li>
                          <li>"Quando você deve considerar {safeMainProcedures[0]}"</li>
                          <li>"Perguntas frequentes sobre {safeMainProcedures[0]}"</li>
                        </ul>
                      </div>
                    )}
                    
                    {contentTypes.includes('before-after') && (
                      <div className="p-3 border rounded-lg bg-white">
                        <h4 className="font-medium">Antes e Depois</h4>
                        <ul className="mt-2 space-y-2 text-sm pl-5 list-disc">
                          <li>"Transformação com {safeMainProcedures[0]} - resultado em X dias"</li>
                          <li>"Antes e depois: {primaryTopic} - resultado natural"</li>
                          <li>"Resultados reais: tratamento de {safeMainProcedures[0]}"</li>
                        </ul>
                      </div>
                    )}
                    
                    {contentTypes.includes('testimonials') && (
                      <div className="p-3 border rounded-lg bg-white">
                        <h4 className="font-medium">Depoimentos</h4>
                        <ul className="mt-2 space-y-2 text-sm pl-5 list-disc">
                          <li>"Depoimento da cliente Maria - sua experiência com {safeMainProcedures[0]}"</li>
                          <li>"Por que escolhi {primaryTopic} - depoimento real"</li>
                          <li>"Como {safeMainProcedures[0]} mudou minha autoestima - história da Ana"</li>
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <Button className="w-full mt-4" onClick={() => handleContentGeneration()}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Gerar Roteiros com IA
                  </Button>
                </div>
              )}
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Próximos Passos para Conteúdo</h3>
                <ol className="space-y-2 pl-5 list-decimal">
                  <li>Definir um dia da semana para gravações</li>
                  <li>Preparar um espaço adequado na clínica com boa iluminação</li>
                  <li>Criar templates padronizados para suas postagens</li>
                  <li>Programar conteúdos usando ferramentas de agendamento</li>
                </ol>
              </div>
            </div>
          </TabsContent>
          
          {/* Resumo Estratégico */}
          <TabsContent value="summary">
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <h3 className="font-medium text-primary">Resumo do Plano Estratégico</h3>
                <p className="text-sm mt-1 mb-4">
                  Este é seu plano personalizado baseado no diagnóstico realizado
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">Meta de faturamento</h4>
                    <p className="text-lg">{safeDiagnosticData.revenueGoal || "Não definido"}</p>
                  </div>
                  
                  <Separator />
                  
                  {safeStrategy.paid && safeStrategy.paid.enabled && (
                    <div>
                      <h4 className="text-sm font-medium">Tráfego Pago</h4>
                      <ul className="mt-1 text-sm space-y-1">
                        <li>• Orçamento mensal: R$ {safeStrategy.paid?.budget || "Não definido"}</li>
                        <li>• Plataforma principal: {
                          safeStrategy.paid?.platform === 'meta' ? 'Meta/Facebook' :
                          safeStrategy.paid?.platform === 'google' ? 'Google' : 'Instagram'
                        }</li>
                        <li>• Objetivo: {
                          safeStrategy.paid?.objective === 'leads' ? 'Gerar leads/consultas' : 'Aumentar conhecimento da marca'
                        }</li>
                        <li>• Faixa etária: {
                          safeStrategy.paid?.ageRange ? 
                            `${safeStrategy.paid.ageRange[0]} a ${safeStrategy.paid.ageRange[1]} anos` : 
                            "Não definido"
                        }</li>
                      </ul>
                    </div>
                  )}
                  
                  {safeOrganic.enabled && (
                    <div>
                      <h4 className="text-sm font-medium">Tráfego Orgânico</h4>
                      <ul className="mt-1 text-sm space-y-1">
                        <li>• Frequência: {
                          safeOrganic.frequency === 'daily' ? 'Diária' :
                          safeOrganic.frequency === '3x' ? '3x por semana' : 'Semanal'
                        }</li>
                        <li>• Tema principal: {primaryTopic}</li>
                        <li>• Tipos de conteúdo: {
                          contentTypes?.length > 0 ?
                            contentTypes
                              .map((type: string) => 
                                type === 'before-after' ? 'Antes e Depois' :
                                type === 'testimonials' ? 'Depoimentos' :
                                type === 'educational' ? 'Conteúdo Educativo' : 'Promoções'
                              )
                              .join(', ') : "Não definido"
                        }</li>
                      </ul>
                    </div>
                  )}
                  
                  {safeStrategy.internal && safeStrategy.internal.enabled && (
                    <div>
                      <h4 className="text-sm font-medium">Marketing Interno</h4>
                      <ul className="mt-1 text-sm space-y-1">
                        {safeStrategy.internal.referralProgram && (
                          <li>• Programa de Indicação</li>
                        )}
                        {safeStrategy.internal.loyaltyProgram && (
                          <li>• Programa de Fidelidade</li>
                        )}
                        {safeStrategy.internal.packages && (
                          <li>• Pacotes e Combos</li>
                        )}
                        {safeStrategy.internal.events && (
                          <li>• Eventos de Relacionamento</li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium">Resultados Esperados (mensal)</h4>
                    <ul className="mt-1 text-sm space-y-1">
                      <li>• Novos clientes: {safeStrategy.expectedResults?.newClients || "Não definido"}</li>
                      <li>• Aumento de receita: {
                        safeStrategy.expectedResults?.revenueIncrease ? 
                        new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(safeStrategy.expectedResults.revenueIncrease) : 
                        "Não definido"
                      }</li>
                      <li>• Horizonte de implementação: {safeStrategy.expectedResults?.timeline || "3 meses"}</li>
                    </ul>
                  </div>
                </div>
                
                <Button className="w-full mt-6" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Plano Completo (PDF)
                </Button>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Mensagem do Consultor</h3>
                <p className="text-sm">
                  Este plano foi personalizado com base nas informações que você compartilhou. 
                  A implementação consistente dessas estratégias pode levar sua clínica ao próximo 
                  nível. Lembre-se que os melhores resultados vêm com persistência e adaptação contínua.
                </p>
                <p className="text-sm mt-2">
                  Use nosso sistema para monitorar seu progresso e fazer ajustes conforme necessário.
                  Estou aqui para ajudar sempre que precisar!
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="justify-between">
        <Button variant="outline" onClick={onReset}>
          Nova Consultoria
        </Button>
        
        <Button onClick={() => handleContentGeneration()}>
          Criar Conteúdos Sugeridos
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
      
      <CalendarDialog
        open={isCalendarDialogOpen}
        onOpenChange={setIsCalendarDialogOpen}
        onSchedule={handleScheduleScript}
        scriptId={expandedScript?.id || ""}
      />
    </Card>
  );
};

export default ImplementationPlan;
