
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import WelcomeBanner from '@/components/home/WelcomeBanner';
import IntentProcessor from '@/components/intent-processor/IntentProcessor';
import IntelligentSuggestionButton from '@/components/intent-processor/IntelligentSuggestionButton';
import IntelligentResponse from '@/components/intent-processor/IntelligentResponse';

// Frases para o banner de boas-vindas
const welcomePhrases = [
  "Que tipo de conteúdo você precisa criar hoje?",
  "Como podemos impulsionar seus resultados?",
  "Qual desafio de marketing você está enfrentando?",
  "O que seus pacientes precisam saber sobre seus tratamentos?"
];

const HomePage: React.FC = () => {
  const [intelligentSuggestion, setIntelligentSuggestion] = useState<any>(null);
  
  // Mock do contexto do usuário para demonstração
  const userContext = {
    procedimentos: ['Botox', 'Preenchimento', 'Laser'],
    estilo_preferido: 'Educacional com toque emocional',
    tipos_conteudo_validados: ['Vídeos curtos', 'Stories', 'Posts informativos'],
    foco_comunicacao: 'Resultados e segurança',
    perfil_comportamental: ['Técnico', 'Educador'],
    insights_performance: ['Conteúdos sobre mitos e verdades tiveram 2x mais engajamento']
  };

  const handleSuggestionReceived = (data: any) => {
    setIntelligentSuggestion(data);
  };

  return (
    <Layout>
      <WelcomeBanner phrases={welcomePhrases} />
      
      <div className="container mx-auto mt-8 mb-16">
        <div className="max-w-3xl mx-auto">
          {!intelligentSuggestion ? (
            <>
              <div className="flex justify-center mb-4">
                <IntelligentSuggestionButton 
                  onSuggestionReceived={handleSuggestionReceived}
                  userContext={userContext}
                  className="mb-6"
                />
              </div>
              <IntentProcessor initialContext={userContext} />
            </>
          ) : (
            <>
              <div className="mb-8">
                <IntelligentResponse data={intelligentSuggestion} />
              </div>
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => setIntelligentSuggestion(null)}
                >
                  Voltar ao processador
                </Button>
              </div>
            </>
          )}
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Aqui iriam outros componentes da homepage como cards de módulos, estatísticas, etc. */}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
