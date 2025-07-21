
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Book, MessageSquare, Zap, Shield, HeartHandshake, Search, FileText, Video, Lightbulb, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Suporte = () => {
  const { toast } = useToast();
  const [supportForm, setSupportForm] = useState({
    nome: '',
    email: '',
    assunto: '',
    prioridade: '',
    descricao: ''
  });

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Ticket de suporte criado!",
      description: "Nossa equipe entrará em contato em breve.",
    });
    
    setSupportForm({
      nome: '',
      email: '',
      assunto: '',
      prioridade: '',
      descricao: ''
    });
  };

  const handleSupportChange = (field: string, value: string) => {
    setSupportForm(prev => ({ ...prev, [field]: value }));
  };

  const faqItems = [
    {
      question: "Como começar a usar a Fluida?",
      answer: "Após o registro, nossa equipe fará uma sessão de onboarding personalizada. Você terá acesso aos tutoriais interativos e poderá agendar treinamentos específicos para sua equipe."
    },
    {
      question: "Qual é o tempo de resposta do suporte?",
      answer: "Questões críticas: até 1 hora. Problemas técnicos: até 4 horas. Dúvidas gerais: até 24 horas. Todos os tickets são acompanhados até a resolução completa."
    },
    {
      question: "A Fluida se integra com outros sistemas?",
      answer: "Sim! Temos integrações nativas com principais CRMs médicos, WhatsApp Business, Instagram, Facebook e sistemas de agendamento. Também oferecemos API para integrações customizadas."
    },
    {
      question: "Como funciona a geração de conteúdo com IA?",
      answer: "Nossa IA é treinada especificamente para o setor de estética e saúde. Ela analisa seu equipamento, público-alvo e objetivos para gerar scripts, posts e estratégias personalizadas e em conformidade com regulamentações."
    },
    {
      question: "Posso cancelar a qualquer momento?",
      answer: "Sim, não há fidelidade. Você pode cancelar a qualquer momento. Oferecemos também um período de teste gratuito para você conhecer todas as funcionalidades."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 aurora-text-gradient">
          Suporte Fluida: Seu Sucesso é Nossa Missão
        </h1>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Oferecemos suporte completo e especializado para garantir que você extraia o máximo valor da plataforma Fluida. 
          Nossa equipe está dedicada ao seu sucesso.
        </p>
      </div>

      {/* Cards de Tipos de Suporte */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="bg-gradient-to-br from-aurora-electric-purple/20 to-aurora-neon-blue/20 border-aurora-electric-purple/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <HelpCircle className="h-8 w-8 text-aurora-electric-purple" />
              <Badge variant="outline" className="bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30">
                24/7
              </Badge>
            </div>
            <CardTitle className="text-white">Suporte Técnico</CardTitle>
            <CardDescription className="text-white/70">
              Resolução rápida de problemas e configurações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-white/80 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-aurora-emerald" />
                Problemas de login e acesso
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-aurora-emerald" />
                Bugs e funcionalidades
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-aurora-emerald" />
                Configurações da plataforma
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-aurora-emerald/20 to-aurora-electric-purple/20 border-aurora-emerald/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <MessageSquare className="h-8 w-8 text-aurora-emerald" />
              <Badge variant="outline" className="bg-aurora-emerald/20 text-aurora-emerald border-aurora-emerald/30">
                Premium
              </Badge>
            </div>
            <CardTitle className="text-white">Consultoria Estratégica</CardTitle>
            <CardDescription className="text-white/70">
              Estratégias personalizadas para seu negócio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-white/80 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-aurora-emerald" />
                Análise de performance
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-aurora-emerald" />
                Otimização de campanhas
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-aurora-emerald" />
                Estratégias de conteúdo
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-aurora-neon-blue/20 to-aurora-deep-purple/20 border-aurora-neon-blue/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Book className="h-8 w-8 text-aurora-neon-blue" />
              <Badge variant="outline" className="bg-aurora-neon-blue/20 text-aurora-neon-blue border-aurora-neon-blue/30">
                Gratuito
              </Badge>
            </div>
            <CardTitle className="text-white">Treinamento</CardTitle>
            <CardDescription className="text-white/70">
              Capacitação completa na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-white/80 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-aurora-emerald" />
                Workshops ao vivo
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-aurora-emerald" />
                Tutoriais em vídeo
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-aurora-emerald" />
                Certificação profissional
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 mb-12">
        {/* Formulário de Suporte */}
        <Card className="bg-aurora-dark-purple/20 border-aurora-electric-purple/30">
          <CardHeader>
            <CardTitle className="text-2xl text-white">
              Abrir Ticket de Suporte
            </CardTitle>
            <CardDescription className="text-white/70">
              Descreva seu problema e nossa equipe resolverá rapidamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSupportSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-white">Nome</Label>
                  <Input
                    id="nome"
                    value={supportForm.nome}
                    onChange={(e) => handleSupportChange('nome', e.target.value)}
                    className="bg-aurora-space-black/30 border-aurora-electric-purple/20 text-white"
                    placeholder="Seu nome"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={supportForm.email}
                    onChange={(e) => handleSupportChange('email', e.target.value)}
                    className="bg-aurora-space-black/30 border-aurora-electric-purple/20 text-white"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assunto" className="text-white">Assunto</Label>
                  <Select value={supportForm.assunto} onValueChange={(value) => handleSupportChange('assunto', value)}>
                    <SelectTrigger className="bg-aurora-space-black/30 border-aurora-electric-purple/20 text-white">
                      <SelectValue placeholder="Selecione o assunto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tecnico">Problema Técnico</SelectItem>
                      <SelectItem value="conta">Questões de Conta</SelectItem>
                      <SelectItem value="faturamento">Faturamento</SelectItem>
                      <SelectItem value="treinamento">Solicitação de Treinamento</SelectItem>
                      <SelectItem value="consultoria">Consultoria Estratégica</SelectItem>
                      <SelectItem value="integracao">Integração</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prioridade" className="text-white">Prioridade</Label>
                  <Select value={supportForm.prioridade} onValueChange={(value) => handleSupportChange('prioridade', value)}>
                    <SelectTrigger className="bg-aurora-space-black/30 border-aurora-electric-purple/20 text-white">
                      <SelectValue placeholder="Nível de prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">🟢 Baixa</SelectItem>
                      <SelectItem value="media">🟡 Média</SelectItem>
                      <SelectItem value="alta">🟠 Alta</SelectItem>
                      <SelectItem value="critica">🔴 Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-white">Descrição do Problema</Label>
                <Textarea
                  id="descricao"
                  value={supportForm.descricao}
                  onChange={(e) => handleSupportChange('descricao', e.target.value)}
                  className="bg-aurora-space-black/30 border-aurora-electric-purple/20 text-white min-h-[120px]"
                  placeholder="Descreva detalhadamente o problema ou dúvida..."
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-aurora-electric-purple to-aurora-neon-blue hover:opacity-90 text-white"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Criar Ticket de Suporte
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* FAQ */}
        <div className="space-y-6">
          <Card className="bg-aurora-dark-purple/20 border-aurora-electric-purple/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <Lightbulb className="h-6 w-6 text-aurora-electric-purple" />
                Perguntas Frequentes
              </CardTitle>
              <CardDescription className="text-white/70">
                Encontre respostas rápidas para dúvidas comuns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-2">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-aurora-electric-purple/20">
                    <AccordionTrigger className="text-white hover:text-aurora-electric-purple">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-white/80">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Recursos de Autoatendimento */}
          <Card className="bg-gradient-to-br from-aurora-emerald/10 to-aurora-neon-blue/10 border-aurora-emerald/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <Book className="h-6 w-6 text-aurora-emerald" />
                Recursos de Autoatendimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-aurora-space-black/20 rounded-lg">
                  <FileText className="h-8 w-8 text-aurora-emerald mx-auto mb-2" />
                  <p className="text-white font-medium">Base de Conhecimento</p>
                  <p className="text-white/60 text-sm">150+ artigos</p>
                </div>
                <div className="text-center p-4 bg-aurora-space-black/20 rounded-lg">
                  <Video className="h-8 w-8 text-aurora-neon-blue mx-auto mb-2" />
                  <p className="text-white font-medium">Tutoriais em Vídeo</p>
                  <p className="text-white/60 text-sm">50+ vídeos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Garantias de Atendimento */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-br from-aurora-electric-purple/20 to-aurora-dark-purple/20 rounded-lg p-6 border border-aurora-electric-purple/30 text-center">
          <Zap className="h-12 w-12 text-aurora-electric-purple mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Resposta Rápida</h3>
          <p className="text-white/70">Até 1 hora para questões críticas</p>
          <p className="text-white/60 text-sm mt-2">SLA garantido</p>
        </div>
        
        <div className="bg-gradient-to-br from-aurora-emerald/20 to-aurora-electric-purple/20 rounded-lg p-6 border border-aurora-emerald/30 text-center">
          <Shield className="h-12 w-12 text-aurora-emerald mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">99.9% Uptime</h3>
          <p className="text-white/70">Disponibilidade garantida</p>
          <p className="text-white/60 text-sm mt-2">Monitoramento 24/7</p>
        </div>
        
        <div className="bg-gradient-to-br from-aurora-neon-blue/20 to-aurora-deep-purple/20 rounded-lg p-6 border border-aurora-neon-blue/30 text-center">
          <HeartHandshake className="h-12 w-12 text-aurora-neon-blue mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Suporte Humanizado</h3>
          <p className="text-white/70">Atendimento personalizado</p>
          <p className="text-white/60 text-sm mt-2">Equipe especializada</p>
        </div>
      </div>
    </div>
  );
};

export default Suporte;
