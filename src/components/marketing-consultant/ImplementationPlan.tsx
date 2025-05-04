
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Sparkles, ArrowRight, Check, Download } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleContentGeneration = () => {
    // Navigate to the content generation page with pre-filled info
    navigate(`/custom-gpt?mode=advanced&topic=${encodeURIComponent(strategy.organic.primaryTopic)}`);
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
                  className="rounded-md border"
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Conteúdos Sugeridos */}
          <TabsContent value="content">
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium">Temas Sugeridos para Conteúdo</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Baseados no seu diagnóstico e temas principais
                </p>
                
                <div className="space-y-3">
                  {strategy.organic.contentTypes.includes('educational') && (
                    <div className="p-3 border rounded-lg bg-white">
                      <h4 className="font-medium">Conteúdos Educativos</h4>
                      <ul className="mt-2 space-y-2 text-sm pl-5 list-disc">
                        <li>"Como funciona {strategy.organic.primaryTopic} - passo a passo"</li>
                        <li>"Mitos e verdades sobre {diagnosticData.mainProcedures[0]}"</li>
                        <li>"Quando você deve considerar {diagnosticData.mainProcedures[0]}"</li>
                        <li>"Perguntas frequentes sobre {diagnosticData.mainProcedures[0]}"</li>
                      </ul>
                    </div>
                  )}
                  
                  {strategy.organic.contentTypes.includes('before-after') && (
                    <div className="p-3 border rounded-lg bg-white">
                      <h4 className="font-medium">Antes e Depois</h4>
                      <ul className="mt-2 space-y-2 text-sm pl-5 list-disc">
                        <li>"Transformação com {diagnosticData.mainProcedures[0]} - resultado em X dias"</li>
                        <li>"Antes e depois: {strategy.organic.primaryTopic} - resultado natural"</li>
                        <li>"Resultados reais: tratamento de {diagnosticData.mainProcedures[0]}"</li>
                      </ul>
                    </div>
                  )}
                  
                  {strategy.organic.contentTypes.includes('testimonials') && (
                    <div className="p-3 border rounded-lg bg-white">
                      <h4 className="font-medium">Depoimentos</h4>
                      <ul className="mt-2 space-y-2 text-sm pl-5 list-disc">
                        <li>"Depoimento da cliente Maria - sua experiência com {diagnosticData.mainProcedures[0]}"</li>
                        <li>"Por que escolhi {strategy.organic.primaryTopic} - depoimento real"</li>
                        <li>"Como {diagnosticData.mainProcedures[0]} mudou minha autoestima - história da Ana"</li>
                      </ul>
                    </div>
                  )}
                </div>
                
                <Button className="w-full mt-4" onClick={handleContentGeneration}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Gerar Roteiros com IA
                </Button>
              </div>
              
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
                    <p className="text-lg">{diagnosticData.revenueGoal}</p>
                  </div>
                  
                  <Separator />
                  
                  {strategy.paid.enabled && (
                    <div>
                      <h4 className="text-sm font-medium">Tráfego Pago</h4>
                      <ul className="mt-1 text-sm space-y-1">
                        <li>• Orçamento mensal: R$ {strategy.paid.budget}</li>
                        <li>• Plataforma principal: {
                          strategy.paid.platform === 'meta' ? 'Meta/Facebook' :
                          strategy.paid.platform === 'google' ? 'Google' : 'Instagram'
                        }</li>
                        <li>• Objetivo: {
                          strategy.paid.objective === 'leads' ? 'Gerar leads/consultas' : 'Aumentar conhecimento da marca'
                        }</li>
                        <li>• Faixa etária: {strategy.paid.ageRange[0]} a {strategy.paid.ageRange[1]} anos</li>
                      </ul>
                    </div>
                  )}
                  
                  {strategy.organic.enabled && (
                    <div>
                      <h4 className="text-sm font-medium">Tráfego Orgânico</h4>
                      <ul className="mt-1 text-sm space-y-1">
                        <li>• Frequência: {
                          strategy.organic.frequency === 'daily' ? 'Diária' :
                          strategy.organic.frequency === '3x' ? '3x por semana' : 'Semanal'
                        }</li>
                        <li>• Tema principal: {strategy.organic.primaryTopic}</li>
                        <li>• Tipos de conteúdo: {
                          strategy.organic.contentTypes
                            .map((type: string) => 
                              type === 'before-after' ? 'Antes e Depois' :
                              type === 'testimonials' ? 'Depoimentos' :
                              type === 'educational' ? 'Conteúdo Educativo' : 'Promoções'
                            )
                            .join(', ')
                        }</li>
                      </ul>
                    </div>
                  )}
                  
                  {strategy.internal.enabled && (
                    <div>
                      <h4 className="text-sm font-medium">Marketing Interno</h4>
                      <ul className="mt-1 text-sm space-y-1">
                        {strategy.internal.referralProgram && (
                          <li>• Programa de Indicação</li>
                        )}
                        {strategy.internal.loyaltyProgram && (
                          <li>• Programa de Fidelidade</li>
                        )}
                        {strategy.internal.packages && (
                          <li>• Pacotes e Combos</li>
                        )}
                        {strategy.internal.events && (
                          <li>• Eventos de Relacionamento</li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium">Resultados Esperados (mensal)</h4>
                    <ul className="mt-1 text-sm space-y-1">
                      <li>• Novos clientes: {strategy.expectedResults.newClients}</li>
                      <li>• Aumento de receita: {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(strategy.expectedResults.revenueIncrease)}</li>
                      <li>• Horizonte de implementação: {strategy.expectedResults.timeline}</li>
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
        
        <Button onClick={handleContentGeneration}>
          Criar Conteúdos Sugeridos
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImplementationPlan;
