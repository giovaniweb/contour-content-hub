
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes";
import HeroSearch from "@/components/search/HeroSearch";
import HeroResultSection from "@/components/search/HeroResultSection";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resultType, setResultType] = useState<'Video Script' | 'Idea' | 'Strategy' | 'Content'>('Content');
  
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Randomly choose result type for demonstration
      const types: ('Video Script' | 'Idea' | 'Strategy' | 'Content')[] = ['Video Script', 'Idea', 'Strategy', 'Content'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      setResultType(randomType);
      
      // Generate mock result based on query
      if (searchQuery.toLowerCase().includes("roteiro") || randomType === 'Video Script') {
        setResult(`# ${searchQuery}\n\n**Abertura:**\nOlá, bem-vindos ao meu canal! Hoje vamos falar sobre um assunto super importante: ${searchQuery}.\n\n**Desenvolvimento:**\nVamos explorar as principais técnicas e benefícios deste procedimento revolucionário que tem transformado a vida de milhares de pacientes.\n\nPrimeiro, vamos entender como funciona: este tratamento atua diretamente nas camadas profundas da pele, estimulando a produção natural de colágeno.\n\n**Fechamento:**\nEspero que tenham gostado deste conteúdo! Não se esqueçam de deixar seu like, se inscrever no canal e compartilhar com quem precisa conhecer este tratamento incrível.`);
      } else if (searchQuery.toLowerCase().includes("estratégia") || randomType === 'Strategy') {
        setResult(`# Estratégia para ${searchQuery}\n\n1. **Análise de Público**: Identificar o perfil ideal de cliente para ${searchQuery}.\n\n2. **Criação de Conteúdo**: Desenvolver materiais educativos sobre os benefícios e diferenciais.\n\n3. **Calendário Editorial**: Publicações semanais alternando entre conteúdo educativo e promocional.\n\n4. **Campanhas Sazonais**: Aproveitar datas comemorativas para promoções especiais.\n\n5. **Engajamento**: Responder comentários e mensagens em até 2 horas para aumentar conversão.`);
      } else {
        setResult(`# Ideias para ${searchQuery}\n\n- Criar uma série de vídeos curtos explicando os benefícios\n- Desenvolver um e-book gratuito para captura de leads\n- Realizar lives semanais respondendo dúvidas sobre o tema\n- Compartilhar depoimentos de clientes satisfeitos\n- Produzir infográficos comparativos com outros tratamentos\n- Criar uma hashtag exclusiva para campanhas nas redes sociais`);
      }
      
      setIsLoading(false);
    }, 3000);
  };
  
  const handleRetry = () => {
    setResult(null);
    setQuery("");
  };
  
  return (
    <>
      <section className="bg-lavender-gradient py-24 relative overflow-hidden">
        {/* Subtle animated background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fluida-blue rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-fluida-pink rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto text-center px-4">
          <h1 className="font-light text-4xl md:text-5xl lg:text-6xl mb-6 text-gray-800 tracking-wide">
            Seu <span className="neon-highlight">estúdio criativo</span> em um clique
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-gray-600 leading-relaxed">
            Crie roteiros, estratégias e conteúdos para mídias digitais com inteligência artificial
          </p>
          
          <div className="max-w-2xl mx-auto">
            <HeroSearch 
              onSearch={handleSearch}
              suggestions={[
                "Crie roteiro para vídeo sobre rejuvenescimento facial",
                "Estratégias para Instagram sobre estética avançada",
                "Conteúdo para profissionais da medicina estética",
                "Ideias para promover tratamento de criolipólise",
                "Como criar conteúdo para atrair clientes de procedimentos estéticos",
              ]}
            />
          </div>
        </div>
      </section>
      
      {/* Only render the result section if we have a query */}
      {(query || isLoading) && (
        <HeroResultSection
          query={query}
          result={result}
          isLoading={isLoading}
          resultType={resultType}
          onRetry={handleRetry}
        />
      )}
    </>
  );
};

export default HeroSection;
