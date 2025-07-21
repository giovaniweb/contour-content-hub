
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, MessageCircle, Clock, Users } from "lucide-react";

const Contato = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateContent = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('custom-gpt', {
          body: {
            tipo: 'bigIdea',
            equipamento: 'Fluida Contact',
            estrategiaConteudo: '🔵 Educar',
            equipamentoData: {
              name: 'Fluida',
              category: 'Plataforma de Marketing para Clínicas',
              description: 'Contato e atendimento especializado'
            },
            prompt: `Crie um conteúdo profissional e acolhedor para a página de contato da Fluida. Inclua:

1. Uma mensagem de boas-vindas calorosa
2. Diferentes formas de contato e quando usar cada uma
3. Horários de atendimento
4. Compromisso com qualidade no atendimento
5. Expectativas de tempo de resposta

Transmita confiança, profissionalismo e acessibilidade. Mostre que a Fluida valoriza cada cliente e está sempre pronta para ajudar.`
          }
        });

        if (error) throw error;
        setContent(data.content || "");
      } catch (error) {
        console.error('Erro ao gerar conteúdo:', error);
        setContent(`# Entre em Contato Conosco

Estamos aqui para transformar o marketing da sua clínica! Nossa equipe especializada está pronta para responder suas dúvidas e ajudar você a alcançar resultados extraordinários.

## 📞 **Canais de Atendimento**

### **Atendimento Comercial**
Para conhecer melhor a Fluida, solicitar demonstrações ou contratar nossos serviços.

### **Suporte Técnico**  
Para dúvidas sobre uso da plataforma, troubleshooting ou orientações técnicas.

### **Parcerias**
Para propostas de parceria, integrações ou colaborações estratégicas.

## ⏰ **Horários de Atendimento**

**Segunda a Sexta:** 9h às 18h
**Sábados:** 9h às 13h  
**Domingos e Feriados:** Atendimento por e-mail

## 🎯 **Nosso Compromisso**

- **Resposta Rápida:** E-mails respondidos em até 2 horas úteis
- **Atendimento Personalizado:** Cada clínica tem necessidades únicas
- **Suporte Contínuo:** Acompanhamento durante toda sua jornada
- **Expertise Comprovada:** Equipe especializada em marketing médico

---

*Sua satisfação é nossa prioridade. Vamos juntos revolucionar o marketing da sua clínica!*`);
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
            <p className="text-white/70">Carregando informações de contato...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-aurora-dark-purple/20 rounded-lg p-6 border border-aurora-electric-purple/20">
          <Mail className="h-8 w-8 text-aurora-electric-purple mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">E-mail Principal</h3>
          <a href="mailto:contato@fluida.com" className="text-aurora-electric-purple hover:underline">
            contato@fluida.com
          </a>
        </div>
        
        <div className="bg-aurora-dark-purple/20 rounded-lg p-6 border border-aurora-electric-purple/20">
          <MessageCircle className="h-8 w-8 text-aurora-electric-purple mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Suporte Técnico</h3>
          <a href="mailto:suporte@fluida.com" className="text-aurora-electric-purple hover:underline">
            suporte@fluida.com
          </a>
        </div>
        
        <div className="bg-aurora-dark-purple/20 rounded-lg p-6 border border-aurora-electric-purple/20">
          <Users className="h-8 w-8 text-aurora-electric-purple mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Parcerias</h3>
          <a href="mailto:parcerias@fluida.com" className="text-aurora-electric-purple hover:underline">
            parcerias@fluida.com
          </a>
        </div>
      </div>

      <div className="bg-aurora-dark-purple/10 rounded-lg p-6 border border-aurora-electric-purple/20 mb-8">
        <div className="flex items-center mb-4">
          <Clock className="h-6 w-6 text-aurora-electric-purple mr-3" />
          <h3 className="text-xl font-semibold text-white">Horários de Atendimento</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-white/90">
          <div>
            <p className="font-medium">Segunda a Sexta</p>
            <p className="text-white/70">9h às 18h</p>
          </div>
          <div>
            <p className="font-medium">Sábados</p>
            <p className="text-white/70">9h às 13h</p>
          </div>
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

export default Contato;
