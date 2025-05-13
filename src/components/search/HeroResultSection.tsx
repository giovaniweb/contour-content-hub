
import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes"; 
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FileText, ArrowRight, Loader2 } from "lucide-react";
import Markdown from "react-markdown";

interface HeroResultSectionProps {
  query: string;
  result: string | null;
  isLoading: boolean;
  resultType: 'Video Script' | 'Idea' | 'Strategy' | 'Content';
  onRetry: () => void;
}

const HeroResultSection: React.FC<HeroResultSectionProps> = ({
  query,
  result,
  isLoading,
  resultType,
  onRetry
}) => {
  const navigate = useNavigate();
  
  const handleContinue = () => {
    // Navigate to appropriate page based on result type
    switch(resultType) {
      case 'Video Script':
        navigate(ROUTES.CONTENT.SCRIPTS.GENERATOR, { state: { initialQuery: query, initialResult: result } });
        break;
      case 'Strategy':
        navigate(ROUTES.CONTENT.STRATEGY, { state: { initialQuery: query, initialResult: result } });
        break;
      case 'Idea':
        navigate(ROUTES.CONTENT.IDEAS, { state: { initialQuery: query, initialResult: result } });
        break;
      default:
        navigate(ROUTES.DASHBOARD, { state: { initialQuery: query, initialResult: result } });
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl bg-gradient-to-b from-white/80 to-zinc-100/60 backdrop-blur-md shadow-lg border border-white/20 p-6"
          >
            <h3 className="text-lg font-medium mb-3 flex items-center text-gray-800">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              {resultType === 'Video Script' ? 'Roteiro gerado' : 
               resultType === 'Strategy' ? 'Estratégia sugerida' : 
               resultType === 'Idea' ? 'Ideias geradas' : 'Resultado'}
            </h3>

            <div className="bg-white/70 rounded-lg p-4 my-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                  <p className="text-muted-foreground text-center">
                    Gerando conteúdo personalizado baseado no seu comando...
                  </p>
                </div>
              ) : result ? (
                <div className="prose prose-stone max-w-none">
                  {result.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center">
                  Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.
                </p>
              )}
            </div>

            <div className="flex justify-between items-center mt-6">
              <Button variant="outline" onClick={onRetry}>
                Refinar busca
              </Button>
              
              <Button className="bg-primary text-white" onClick={handleContinue}>
                Continuar {resultType === 'Video Script' ? 'com roteiro' : 
                          resultType === 'Strategy' ? 'com estratégia' : 
                          resultType === 'Idea' ? 'com ideias' : 'com resultado'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroResultSection;
