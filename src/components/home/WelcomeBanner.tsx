
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import ParallaxSection from '@/components/ui/parallax/ParallaxSection';

interface WelcomeBannerProps {
  title?: string;
  phrases: string[];
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ phrases = [] }) => {
  const { toast } = useToast();
  
  const handlePromptSubmit = (promptText: string) => {
    toast({
      title: "Recebemos sua solicitação",
      description: `"${promptText}" está sendo processado pelo sistema.`,
    });
    
    // Here we would integrate with an actual AI system
    setTimeout(() => {
      toast({
        title: "Sugestão de Ação",
        description: "Com base na sua solicitação, recomendamos acessar o Gerador de Scripts.",
        action: (
          <a href="/script-generator" className="px-3 py-2 bg-fluida-blue text-white rounded-md text-xs">
            Acessar
          </a>
        ),
      });
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
      className="bg-gradient-to-r from-purple-900 to-indigo-800"
    />
  );
};

export default WelcomeBanner;
