
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

    // 1. Análise baseada na frequência de conteúdo
    if (state.contentFrequency === 'raramente' || state.contentFrequency === 'nao_posto') {
      specialists.push({
        name: "Estrategista Digital",
        specialty: "Estruturação de Conteúdo",
        reason: "pois você precisa organizar sua estratégia de comunicação",
        status: "criando cronograma editorial"
      });
    } else if (state.contentFrequency === 'diario') {
      specialists.push({
        name: "Expert em Engajamento",
        specialty: "Otimização de Alcance",
        reason: "para maximizar o resultado da sua produção constante",
        status: "analisando métricas de engajamento"
      });
    }

    // 2. Análise por Tipo de Clínica e Objetivos
    if (state.clinicType === 'clinica_estetica') {
      if (state.aestheticObjective === 'atrair_leads') {
        specialists.push({
          name: "Especialista em Conversão",
          specialty: "Geração de Leads Estéticos",
          reason: "para atrair mais clientes interessados em tratamentos estéticos",
          status: "estruturando funil de captação"
        });
      } else if (state.aestheticObjective === 'aumentar_recorrencia') {
        specialists.push({
          name: "Expert em Storytelling",
          specialty: "Fidelização de Clientes",
          reason: "para criar conexão emocional e aumentar retorno",
          status: "desenvolvendo narrativas de transformação"
        });
      }

      // Baseado no foco estético
      if (state.aestheticFocus === 'ambos') {
        specialists.push({
          name: "Consultor Criativo",
          specialty: "Marketing Visual Completo",
          reason: "para comunicar efetivamente tratamentos faciais e corporais",
          status: "criando conceito visual unificado"
        });
      }
    }

    if (state.clinicType === 'clinica_medica') {
      if (state.medicalObjective === 'aumentar_autoridade') {
        specialists.push({
          name: "Expert em Storytelling",
          specialty: "Autoridade Médica",
          reason: "para posicionar você como referência na sua especialidade",
          status: "desenvolvendo conteúdo técnico acessível"
        });
      } else if (state.medicalObjective === 'escalar_negocio') {
        specialists.push({
          name: "Analista de Performance",
          specialty: "Escala Estruturada",
          reason: "para crescer mantendo a qualidade médica",
          status: "estruturando sistemas de crescimento"
        });
      }

      // Baseado na especialidade médica
      if (state.medicalSpecialty === 'medicina_estetica' || state.medicalSpecialty === 'dermatologia') {
        specialists.push({
          name: "Consultor Criativo",
          specialty: "Marketing Médico Visual",
          reason: "para comunicar procedimentos estéticos com credibilidade médica",
          status: "equilibrando ciência e apelo visual"
        });
      }
    }

    // 3. Análise baseada no estilo da clínica
    const clinicStyle = state.clinicType === 'clinica_medica' ? state.medicalClinicStyle : state.aestheticClinicStyle;
    
    if (clinicStyle === 'premium') {
      specialists.push({
        name: "Consultor de Grandes Ideias",
        specialty: "Branding Premium",
        reason: "para comunicar exclusividade e alto valor",
        status: "refinando posicionamento de luxo"
      });
    } else if (clinicStyle === 'humanizada') {
      specialists.push({
        name: "Expert em Storytelling",
        specialty: "Conexão Emocional",
        reason: "para fortalecer relacionamento com pacientes",
        status: "desenvolvendo narrativa empática"
      });
    } else if (clinicStyle === 'moderna' || clinicStyle === 'inovadora') {
      specialists.push({
        name: "Consultor Criativo",
        specialty: "Inovação Visual",
        reason: "para transmitir modernidade e tecnologia",
        status: "criando identidade contemporânea"
      });
    }

    // 4. Análise baseada no faturamento e metas
    if (state.currentRevenue === 'ate_15k' && (state.revenueGoal === 'dobrar' || state.revenueGoal === 'triplicar')) {
      specialists.push({
        name: "Especialista em Conversão",
        specialty: "Crescimento Acelerado",
        reason: "para estruturar estratégias de crescimento rápido",
        status: "mapeando oportunidades de escala"
      });
    }

    if (state.currentRevenue === 'acima_60k') {
      specialists.push({
        name: "Analista de Performance",
        specialty: "Otimização de Alto Faturamento",
        reason: "para maximizar eficiência em operações consolidadas",
        status: "analisando métricas avançadas"
      });
    }

    // 5. Análise baseada no estilo de comunicação
    if (state.communicationStyle === 'tecnico') {
      specialists.push({
        name: "Estrategista Digital",
        specialty: "Comunicação Técnica Acessível",
        reason: "para tornar conteúdo técnico mais digestível",
        status: "simplificando linguagem especializada"
      });
    } else if (state.communicationStyle === 'emocional') {
      specialists.push({
        name: "Expert em Storytelling",
        specialty: "Narrativas Emocionais",
        reason: "para amplificar conexões emocionais",
        status: "criando histórias impactantes"
      });
    } else if (state.communicationStyle === 'divertido') {
      specialists.push({
        name: "Expert em Engajamento",
        specialty: "Conteúdo Viral",
        reason: "para criar conteúdos que engajam e divertem",
        status: "desenvolvendo estratégias virais"
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
