
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const OQueE = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateContent = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('custom-gpt', {
          body: {
            tipo: 'bigIdea',
            equipamento: 'Fluida Platform',
            estrategiaConteudo: '🔵 Educar',
            equipamentoData: {
              name: 'Fluida',
              category: 'Plataforma de Marketing para Clínicas',
              description: 'Solução completa para gestão e geração de conteúdos de alta performance'
            },
            prompt: `Crie um conteúdo institucional completo e profissional sobre "O que é a Fluida". 

A Fluida é uma plataforma inovadora que revoluciona o marketing digital para clínicas estéticas e de saúde. Inclua:

1. Uma introdução impactante sobre o que é a Fluida
2. Os principais benefícios e diferenciais da plataforma
3. Como a Fluida transforma o marketing das clínicas
4. Os recursos principais: IA, geração de conteúdo, scripts, vídeos
5. Por que escolher a Fluida

Use um tom profissional, mas acessível. O conteúdo deve ser informativo e persuasivo, mostrando o valor da plataforma.`
          }
        });

        if (error) throw error;
        setContent(data.content || "Conteúdo em desenvolvimento...");
      } catch (error) {
        console.error('Erro ao gerar conteúdo:', error);
        setContent(`# O que é a Fluida?

A **Fluida** é uma plataforma revolucionária que transforma completamente a forma como clínicas estéticas e de saúde abordam o marketing digital. Nossa solução integra inteligência artificial avançada com ferramentas especializadas para criar conteúdos de alta performance que realmente convertem.

## 🚀 **Transformação Digital Completa**

A Fluida não é apenas mais uma ferramenta de marketing - é um ecossistema completo que revoluciona a comunicação da sua clínica. Combinamos tecnologia de ponta com conhecimento especializado em estética e saúde para entregar resultados extraordinários.

## 💡 **Principais Diferenciais**

### **Inteligência Artificial Especializada**
Nossa IA foi treinada especificamente para o mercado de estética e saúde, compreendendo as nuances, regulamentações e melhores práticas do setor.

### **Geração Automatizada de Conteúdo**
- Scripts personalizados para diferentes equipamentos
- Conteúdos educativos e promocionais
- Adaptação automática para diferentes plataformas

### **Biblioteca de Conhecimento**
Acesso a uma vasta base de dados científicos, tendências do mercado e estratégias comprovadas de marketing médico.

## 🎯 **Como Transformamos Sua Clínica**

**Antes da Fluida:** Horas criando conteúdo, dificuldade em educar pacientes, baixo engajamento.

**Com a Fluida:** Conteúdo profissional em minutos, pacientes mais educados, resultados mensuráveis.

## 🛠️ **Recursos Principais**

- **Gerador de Scripts Inteligente:** Crie roteiros profissionais para qualquer equipamento ou procedimento
- **Mestre da Beleza IA:** Assistente especializado para estratégias personalizadas
- **Biblioteca de Conteúdos:** Templates e exemplos testados no mercado
- **Análise de Performance:** Métricas e insights para otimização contínua

## 🏆 **Por Que Escolher a Fluida?**

✅ **Especialização Total:** Focamos 100% no mercado de estética e saúde
✅ **Tecnologia Avançada:** IA treinada com conhecimento médico e científico  
✅ **Resultados Comprovados:** Aumenta engajamento e conversões
✅ **Facilidade de Uso:** Interface intuitiva, resultados em minutos
✅ **Suporte Especializado:** Equipe com conhecimento técnico e de marketing médico

---

*A Fluida representa o futuro do marketing médico: inteligente, eficiente e altamente eficaz.*`);
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
            <p className="text-white/70">Gerando conteúdo inteligente...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
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

export default OQueE;
