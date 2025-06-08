
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
    if (!state) {
      return [
        { name: "Especialista em Conversão", specialty: "Tráfego Pago e Vendas", reason: "para otimizar captação de leads", status: "analisando funil" },
        { name: "Expert em Storytelling", specialty: "Autoridade e Branding", reason: "para construir credibilidade", status: "avaliando narrativa" },
        { name: "Consultor Criativo", specialty: "Visual e Diferenciação", reason: "para destacar sua marca", status: "estrategizando visual" },
        { name: "Estrategista Digital", specialty: "Marketing Estruturado", reason: "para organizar presença online", status: "planejando cronograma" }
      ];
    }

    const specialists = [];
    
    // Especialista em conversão - sempre relevante para captação
    if (state.paidTraffic === 'nunca_usei' || state.clinicType === 'clinica_estetica') {
      specialists.push({
        name: "Especialista em Conversão",
        specialty: "Tráfego Pago e Vendas Diretas",
        reason: state.paidTraffic === 'nunca_usei' 
          ? "pois você precisa estruturar captação de leads qualificados"
          : "para otimizar suas campanhas e aumentar conversões",
        status: "analisando seu funil de vendas"
      });
    }

    // Especialista em storytelling - para autoridade
    if (state.personalBrand === 'nunca' || state.personalBrand === 'raramente' || state.clinicType === 'clinica_medica') {
      specialists.push({
        name: "Expert em Storytelling",
        specialty: "Autoridade e Marca Pessoal",
        reason: state.personalBrand === 'nunca' 
          ? "pois você precisa construir sua credibilidade no mercado"
          : "para fortalecer seu posicionamento como referência",
        status: "avaliando sua narrativa pessoal"
      });
    }

    // Especialista em criatividade - para diferenciação
    if (state.clinicPosition === 'moderna' || state.clinicType === 'clinica_estetica') {
      specialists.push({
        name: "Consultor Criativo",
        specialty: "Identidade Visual e Diferenciação",
        reason: state.clinicPosition === 'moderna'
          ? "pois você precisa de comunicação visual inovadora"
          : "para destacar transformações e resultados",
        status: "desenvolvendo conceito visual"
      });
    }

    // Especialista digital - para iniciantes
    if (state.contentFrequency === 'irregular' || state.personalBrand === 'nunca') {
      specialists.push({
        name: "Estrategista Digital",
        specialty: "Marketing Digital Estruturado",
        reason: "pois você precisa organizar e sistematizar sua presença online",
        status: "planejando cronograma de conteúdo"
      });
    }

    // Garantir pelo menos 4 especialistas
    while (specialists.length < 4) {
      const remaining = [
        { name: "Expert em Engajamento", specialty: "Crescimento Orgânico", reason: "para aumentar alcance natural", status: "identificando trends" },
        { name: "Consultor de Grandes Ideias", specialty: "Conceitos Memoráveis", reason: "para criar campanhas marcantes", status: "conceptualizando" },
        { name: "Analista de Performance", specialty: "ROI e Métricas", reason: "para estruturar acompanhamento", status: "calculando indicadores" }
      ];
      
      specialists.push(remaining[specialists.length - 1]);
    }

    return specialists.slice(0, 4);
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
