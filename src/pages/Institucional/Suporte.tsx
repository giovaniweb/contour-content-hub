
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, HelpCircle, Book, MessageSquare, Zap, Shield, HeartHandshake } from "lucide-react";

const Suporte = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateContent = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('custom-gpt', {
          body: {
            tipo: 'bigIdea',
            equipamento: 'Fluida Support',
            estrategiaConteudo: '🔵 Educar',
            equipamentoData: {
              name: 'Fluida',
              category: 'Plataforma de Marketing para Clínicas',
              description: 'Suporte técnico e atendimento especializado'
            },
            prompt: `Crie um conteúdo completo e profissional para a página de suporte da Fluida. Inclua:

1. Visão geral do suporte oferecido
2. Diferentes tipos de suporte disponíveis (técnico, estratégico, treinamento)
3. Como obter ajuda rapidamente
4. Recursos de autoatendimento
5. Compromisso com a excelência no atendimento
6. Garantias e SLA de atendimento

Use um tom confiável e tranquilizador, mostrando que os clientes sempre terão o suporte necessário para o sucesso.`
          }
        });

        if (error) throw error;
        setContent(data.content || "");
      } catch (error) {
        console.error('Erro ao gerar conteúdo:', error);
        setContent(`# Suporte Fluida: Seu Sucesso é Nossa Missão

Oferecemos suporte completo e especializado para garantir que você extraia o máximo valor da plataforma Fluida. Nossa equipe está dedicada ao seu sucesso.

## 🛠️ **Tipos de Suporte Disponíveis**

### **Suporte Técnico**
Resolução rápida de problemas técnicos, configurações e troubleshooting da plataforma.

### **Consultoria Estratégica**
Orientações personalizadas para otimizar suas estratégias de marketing e maximizar resultados.

### **Treinamento e Capacitação**
Workshops e treinamentos para dominar todas as funcionalidades da Fluida.

## ⚡ **Atendimento Ágil e Eficiente**

- **Resposta em até 1 hora** para questões críticas
- **Resolução em até 24 horas** para problemas técnicos
- **Acompanhamento contínuo** até a resolução completa

## 📚 **Recursos de Autoatendimento**

- Base de conhecimento completa
- Tutoriais em vídeo passo a passo  
- FAQ com respostas às dúvidas mais comuns
- Guias de melhores práticas

## 🏆 **Nosso Compromisso**

- **Disponibilidade Garantida:** 99.9% de uptime
- **Equipe Especializada:** Profissionais certificados em marketing médico
- **Suporte Proativo:** Monitoramento e alertas preventivos
- **Feedback Contínuo:** Melhorias baseadas nas suas necessidades

---

*Sua tranquilidade é nossa prioridade. Conte conosco para alcançar o sucesso!*`);
      } finally {
        setLoading(false);
      }
    };

    generateContent();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-aurora-electric-purple" />
            <p className="text-white/70">Carregando informações de suporte...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-aurora-dark-purple/20 rounded-lg p-6 border border-aurora-electric-purple/20">
          <HelpCircle className="h-8 w-8 text-aurora-electric-purple mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Suporte Técnico</h3>
          <p className="text-white/70 text-sm mb-4">Resolução rápida de problemas e configurações</p>
          <a href="mailto:suporte@fluida.com" className="text-aurora-electric-purple hover:underline text-sm">
            suporte@fluida.com
          </a>
        </div>
        
        <div className="bg-aurora-dark-purple/20 rounded-lg p-6 border border-aurora-electric-purple/20">
          <MessageSquare className="h-8 w-8 text-aurora-electric-purple mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Consultoria</h3>
          <p className="text-white/70 text-sm mb-4">Estratégias personalizadas para seu negócio</p>
          <a href="mailto:consultoria@fluida.com" className="text-aurora-electric-purple hover:underline text-sm">
            consultoria@fluida.com
          </a>
        </div>
        
        <div className="bg-aurora-dark-purple/20 rounded-lg p-6 border border-aurora-electric-purple/20">
          <Book className="h-8 w-8 text-aurora-electric-purple mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Treinamento</h3>
          <p className="text-white/70 text-sm mb-4">Capacitação completa na plataforma</p>
          <a href="mailto:treinamento@fluida.com" className="text-aurora-electric-purple hover:underline text-sm">
            treinamento@fluida.com
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-br from-aurora-electric-purple/20 to-aurora-dark-purple/20 rounded-lg p-6 border border-aurora-electric-purple/30">
          <Zap className="h-8 w-8 text-aurora-electric-purple mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Resposta Rápida</h3>
          <p className="text-white/70 text-sm">Até 1 hora para questões críticas</p>
        </div>
        
        <div className="bg-gradient-to-br from-aurora-electric-purple/20 to-aurora-dark-purple/20 rounded-lg p-6 border border-aurora-electric-purple/30">
          <Shield className="h-8 w-8 text-aurora-electric-purple mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">99.9% Uptime</h3>
          <p className="text-white/70 text-sm">Disponibilidade garantida</p>
        </div>
        
        <div className="bg-gradient-to-br from-aurora-electric-purple/20 to-aurora-dark-purple/20 rounded-lg p-6 border border-aurora-electric-purple/30">
          <HeartHandshake className="h-8 w-8 text-aurora-electric-purple mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Suporte Humanizado</h3>
          <p className="text-white/70 text-sm">Atendimento personalizado</p>
        </div>
      </div>

      <div className="prose prose-invert max-w-none">
        <div 
          className="text-white/90 leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ 
            __html: content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong class="text-aurora-electric-purple">$1</strong>').replace(/###? (.*?)(?=<br>|$)/g, '<h3 class="text-xl font-semibold text-aurora-electric-purple mt-8 mb-4">$1</h3>').replace(/^# (.*?)(?=<br>|$)/g, '<h1 class="text-3xl font-bold mb-6 aurora-text-gradient">$1</h1>')
          }} 
        />
      </div>
    </div>
  );
};

export default Suporte;
