
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Users, Target, Zap, Heart, TrendingUp, Palette } from "lucide-react";

interface SpecialistsActivatedSectionProps {
  aiSections: any;
}

const SpecialistsActivatedSection: React.FC<SpecialistsActivatedSectionProps> = ({ aiSections }) => {
  // Extrair especialistas da resposta da IA
  const extractSpecialists = () => {
    if (!aiSections?.ativacao_especialistas) return [];
    
    // Tentar extrair especialistas do texto da IA
    const text = aiSections.ativacao_especialistas;
    const specialists = [];
    
    // Padrões para identificar especialistas
    const patterns = [
      /Expert em Conversão/i,
      /Especialista em Storytelling/i,
      /Consultor Criativo/i,
      /Gestor de Tráfego/i,
      /Especialista em Posicionamento/i,
      /Expert em Fidelização/i,
      /Harmonizador de Marca/i
    ];
    
    const specialistNames = [
      'Expert em Conversão',
      'Especialista em Storytelling', 
      'Consultor Criativo',
      'Gestor de Tráfego',
      'Especialista em Posicionamento',
      'Expert em Fidelização',
      'Harmonizador de Marca'
    ];
    
    patterns.forEach((pattern, index) => {
      if (pattern.test(text)) {
        specialists.push({
          name: specialistNames[index],
          focus: getSpecialistFocus(specialistNames[index]),
          mission: extractMission(text, specialistNames[index])
        });
      }
    });
    
    return specialists;
  };
  
  const getSpecialistFocus = (name: string) => {
    const focuses = {
      'Expert em Conversão': 'Leads e Agendamento',
      'Especialista em Storytelling': 'Autoridade Emocional',
      'Consultor Criativo': 'Ideias Virais e Campanhas',
      'Gestor de Tráfego': 'Anúncios e Performance',
      'Especialista em Posicionamento': 'Clareza da Promessa',
      'Expert em Fidelização': 'Retorno e Recorrência',
      'Harmonizador de Marca': 'Visual e Encantamento'
    };
    return focuses[name as keyof typeof focuses] || 'Estratégia Personalizada';
  };
  
  const extractMission = (text: string, specialistName: string) => {
    // Tentar extrair a missão específica do especialista do texto
    const lines = text.split('\n');
    let missionLine = '';
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(specialistName)) {
        // Procurar nas próximas linhas por uma descrição
        for (let j = i; j < Math.min(i + 5, lines.length); j++) {
          if (lines[j].includes('Missão') || lines[j].includes('recomenda') || lines[j].includes('ação')) {
            missionLine = lines[j];
            break;
          }
        }
        break;
      }
    }
    
    return missionLine || 'Otimizar estratégias específicas para sua clínica';
  };
  
  const getIcon = (name: string) => {
    const icons = {
      'Expert em Conversão': Target,
      'Especialista em Storytelling': Heart,
      'Consultor Criativo': Zap,
      'Gestor de Tráfego': TrendingUp,
      'Especialista em Posicionamento': Brain,
      'Expert em Fidelização': Users,
      'Harmonizador de Marca': Palette
    };
    
    const IconComponent = icons[name as keyof typeof icons] || Brain;
    return <IconComponent className="h-5 w-5" />;
  };
  
  const specialists = extractSpecialists();
  
  if (specialists.length === 0) {
    return null;
  }
  
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-foreground">
        🧠 Especialistas Ativados
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {specialists.map((specialist, index) => (
          <Card key={index} className="aurora-glass border-purple-500/30 hover:border-aurora-electric-purple/50 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                <div className="p-2 bg-aurora-electric-purple/20 rounded-full">
                  {getIcon(specialist.name)}
                </div>
                {specialist.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="mb-3 bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30">
                {specialist.focus}
              </Badge>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {specialist.mission}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default SpecialistsActivatedSection;
