
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import ParallaxSection from '@/components/ui/parallax/ParallaxSection';
import { useNavigate } from 'react-router-dom';

interface WelcomeBannerProps {
  title?: string;
  phrases: string[];
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ phrases = [] }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handlePromptSubmit = (promptText: string) => {
    toast({
      title: "Recebemos sua solicitação",
      description: `"${promptText}" está sendo processado pelo sistema.`,
    });
    
    // Analyze the prompt to suggest context-appropriate actions
    const promptLower = promptText.toLowerCase();
    
    setTimeout(() => {
      // Suggest appropriate tool based on the prompt content
      if (promptLower.includes('video') || promptLower.includes('gravação')) {
        toast({
          title: "Sugestão de Conteúdo",
          description: "Com base na sua solicitação, recomendamos acessar nossa biblioteca de vídeos.",
          action: (
            <a href="/videos" className="px-3 py-2 bg-fluida-blue text-white rounded-md text-xs">
              Ver Vídeos
            </a>
          ),
        });
      } else if (promptLower.includes('script') || promptLower.includes('roteiro')) {
        toast({
          title: "Sugestão de Ação",
          description: "Com base na sua solicitação, recomendamos acessar o Gerador de Scripts.",
          action: (
            <a href="/script-generator" className="px-3 py-2 bg-fluida-blue text-white rounded-md text-xs">
              Acessar
            </a>
          ),
        });
      } else if (promptLower.includes('ideia') || promptLower.includes('planejar')) {
        toast({
          title: "Planejamento de Conteúdo",
          description: "Para organizar suas ideias, recomendamos utilizar o Planner de Conteúdo.",
          action: (
            <a href="/content-planner" className="px-3 py-2 bg-fluida-blue text-white rounded-md text-xs">
              Abrir Planner
            </a>
          ),
        });
      } else {
        toast({
          title: "Análise Concluída",
          description: "Sugerimos explorar nossas diversas ferramentas para atender sua necessidade.",
          action: (
            <a href="/dashboard" className="px-3 py-2 bg-fluida-blue text-white rounded-md text-xs">
              Dashboard
            </a>
          ),
        });
      }
    }, 2000);
  };
  
  return (
    <ParallaxSection
      backgroundImage="/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png"
      title=""
      description=""
      cards={[]}
      interactive={true}
      typingPhrases={phrases}
      onPromptSubmit={handlePromptSubmit}
      darkOverlay={true}
      className="bg-gradient-to-r from-purple-900 to-indigo-800 min-h-[85vh] sm:min-h-[85vh]"
    />
  );
};

export default WelcomeBanner;
