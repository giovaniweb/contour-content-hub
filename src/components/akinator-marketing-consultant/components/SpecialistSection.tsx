
import React from 'react';
import { Users } from "lucide-react";
import { MarketingConsultantState } from '../types';

interface SpecialistSectionProps {
  state?: MarketingConsultantState;
}

interface Specialist {
  name: string;
  specialty: string;
  reason: string;
  status: string;
}

const SpecialistSection: React.FC<SpecialistSectionProps> = ({ state }) => {
  const getRelevantSpecialists = (): Specialist[] => {
    const specialists: Specialist[] = [];
    
    console.log('🔍 Analisando state para especialistas:', state);
    
    if (!state) {
      console.log('⚠️ State vazio, usando especialistas padrão');
      return [
        { name: "Especialista em Conversão", specialty: "Tráfego Pago e Vendas", reason: "para otimizar captação de leads", status: "analisando funil" },
        { name: "Expert em Storytelling", specialty: "Autoridade e Branding", reason: "para construir credibilidade", status: "avaliando narrativa" },
        { name: "Consultor Criativo", specialty: "Visual e Diferenciação", reason: "para destacar sua marca", status: "estrategizando visual" },
        { name: "Estrategista Digital", specialty: "Marketing Estruturado", reason: "para organizar presença online", status: "planejando cronograma" }
      ];
    }

    // 1. Análise de Tráfego Pago - PRIORIDADE ALTA
    if (state.paidTraffic === 'nunca_usei') {
      specialists.push({
        name: "Especialista em Conversão",
        specialty: "Estruturação de Tráfego Pago",
        reason: "pois você nunca usou tráfego pago e precisa começar do zero",
        status: "criando estratégia de captação inicial"
      });
    } else if (state.paidTraffic === 'uso_pouco') {
      specialists.push({
        name: "Especialista em Conversão",
        specialty: "Otimização de Campanhas",
        reason: "para melhorar seus resultados atuais no tráfego pago",
        status: "analisando campanhas existentes"
      });
    } else if (state.paidTraffic === 'sim_regular') {
      specialists.push({
        name: "Analista de Performance",
        specialty: "ROI e Escalabilidade",
        reason: "para escalar suas campanhas que já funcionam",
        status: "calculando métricas avançadas"
      });
    }

    // 2. Análise de Marca Pessoal
    if (state.personalBrand === 'nunca') {
      specialists.push({
        name: "Expert em Storytelling",
        specialty: "Construção de Autoridade",
        reason: "pois você precisa começar a aparecer e construir credibilidade",
        status: "desenvolvendo sua narrativa pessoal"
      });
    } else if (state.personalBrand === 'raramente') {
      specialists.push({
        name: "Estrategista Digital",
        specialty: "Presença Consistente",
        reason: "para criar um cronograma regular de aparições",
        status: "organizando calendário de conteúdo"
      });
    } else if (state.personalBrand === 'sim_sempre') {
      specialists.push({
        name: "Expert em Engajamento",
        specialty: "Crescimento Orgânico",
        reason: "para maximizar o alcance da sua presença ativa",
        status: "identificando oportunidades virais"
      });
    }

    // 3. Análise por Tipo de Clínica
    if (state.clinicType === 'clinica_estetica') {
      if (state.aestheticObjective === 'mais_leads') {
        specialists.push({
          name: "Consultor Criativo",
          specialty: "Marketing Visual para Estética",
          reason: "para destacar transformações e atrair mais clientes",
          status: "desenvolvendo conceito visual impactante"
        });
      } else if (state.aestheticObjective === 'autoridade') {
        specialists.push({
          name: "Expert em Storytelling",
          specialty: "Autoridade em Estética",
          reason: "para posicionar você como referência no mercado estético",
          status: "criando casos de sucesso memoráveis"
        });
      }
    }

    if (state.clinicType === 'clinica_medica') {
      if (state.medicalObjective === 'autoridade') {
        specialists.push({
          name: "Consultor de Grandes Ideias",
          specialty: "Posicionamento Médico Premium",
          reason: "para elevar sua reputação médica no mercado",
          status: "conceptualizando diferenciação premium"
        });
      } else if (state.medicalObjective === 'escala') {
        specialists.push({
          name: "Analista de Performance",
          specialty: "Escala Estruturada",
          reason: "para crescer mantendo qualidade médica",
          status: "estruturando sistemas de crescimento"
        });
      }
    }

    // 4. Análise de Posicionamento
    if (state.clinicPosition === 'premium') {
      specialists.push({
        name: "Consultor de Grandes Ideias",
        specialty: "Branding Premium",
        reason: "para comunicar exclusividade e alto valor",
        status: "refinando posicionamento de luxo"
      });
    } else if (state.clinicPosition === 'moderna') {
      specialists.push({
        name: "Consultor Criativo",
        specialty: "Inovação Visual",
        reason: "para transmitir modernidade e tecnologia",
        status: "criando identidade moderna"
      });
    } else if (state.clinicPosition === 'humanizada') {
      specialists.push({
        name: "Expert em Storytelling",
        specialty: "Conexão Emocional",
        reason: "para fortalecer relacionamento com pacientes",
        status: "desenvolvendo narrativa empática"
      });
    }

    // 5. Análise de Frequência de Conteúdo
    if (state.contentFrequency === 'irregular') {
      specialists.push({
        name: "Estrategista Digital",
        specialty: "Organização de Conteúdo",
        reason: "para criar consistência na sua comunicação",
        status: "estruturando calendário editorial"
      });
    } else if (state.contentFrequency === 'diario') {
      specialists.push({
        name: "Expert em Engajamento",
        specialty: "Maximização de Alcance",
        reason: "para aproveitar melhor sua produção constante",
        status: "otimizando estratégia de engajamento"
      });
    }

    // Remover duplicatas mantendo o primeiro
    const uniqueSpecialists = specialists.filter((specialist, index, self) => 
      index === self.findIndex(s => s.name === specialist.name)
    );

    console.log('✅ Especialistas selecionados:', uniqueSpecialists.map(s => s.name));

    // Garantir 3-4 especialistas
    if (uniqueSpecialists.length < 3) {
      const fallbackSpecialists = [
        { name: "Estrategista Digital", specialty: "Marketing Básico", reason: "para organizar sua estratégia", status: "estruturando fundamentos" },
        { name: "Consultor Criativo", specialty: "Identidade Visual", reason: "para melhorar sua comunicação", status: "desenvolvendo conceito" },
        { name: "Expert em Engajamento", specialty: "Relacionamento", reason: "para conectar com seu público", status: "analisando audiência" }
      ];
      
      fallbackSpecialists.forEach(fallback => {
        if (uniqueSpecialists.length < 4 && !uniqueSpecialists.find(s => s.name === fallback.name)) {
          uniqueSpecialists.push(fallback);
        }
      });
    }

    return uniqueSpecialists.slice(0, 4);
  };

  const specialists = getRelevantSpecialists();

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Users className="h-5 w-5 text-purple-600" />
        <h4 className="font-medium text-purple-900">Especialistas Convocados Para Seu Caso</h4>
      </div>
      
      <div className="space-y-3">
        {specialists.map((specialist, index) => (
          <div key={index} className="bg-white/60 rounded-lg p-3 border border-purple-100">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-purple-900">{specialist.name}</span>
                  <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                    {specialist.specialty}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>{specialist.reason}</strong>
                </p>
                <p className="text-xs text-gray-500">
                  Status: {specialist.status}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-purple-600 font-medium">
          ✨ Cada especialista foi selecionado baseado no seu perfil específico
        </p>
      </div>
    </div>
  );
};

export default SpecialistSection;
