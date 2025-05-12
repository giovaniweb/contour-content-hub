
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Save, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HeroResultSectionProps {
  query: string;
  result: string | null;
  isLoading: boolean;
  resultType?: 'Video Script' | 'Idea' | 'Strategy' | 'Content';
  onRetry: () => void;
}

const HeroResultSection: React.FC<HeroResultSectionProps> = ({
  query,
  result,
  isLoading,
  resultType = 'Content',
  onRetry,
}) => {
  const { toast } = useToast();

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      toast({
        title: "Copiado!",
        description: "Conteúdo copiado para a área de transferência"
      });
    }
  };
  
  const handleSave = () => {
    toast({
      title: "Conteúdo salvo",
      description: "Seu conteúdo foi salvo com sucesso"
    });
    // Implement save functionality
  };
  
  const handleSendToEditor = () => {
    toast({
      title: "Enviado para o editor",
      description: "Seu conteúdo foi enviado para o editor"
    });
    // Implement send to editor functionality
  };
  
  // Extract a title from the result or use the query
  const extractTitle = () => {
    if (!result) return '';
    
    // Try to find the first sentence or line that could work as a title
    const lines = result.split('\n').filter(line => line.trim().length > 0);
    
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      // If the first line is short enough, use it as the title
      if (firstLine.length < 80) {
        return firstLine;
      }
    }
    
    // Fallback to a portion of the query
    return `Resultado para: "${query.substring(0, 40)}${query.length > 40 ? '...' : ''}"`;
  };

  return (
    <section className="w-full py-12 bg-lavender-gradient">
      <div className="container max-w-4xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {isLoading ? (
            // Loading state
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                <Badge variant="outline" className="bg-gray-100">
                  Gerando...
                </Badge>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-purple-100 shadow-sm p-6 space-y-4">
                <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <div className="h-9 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-9 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="text-center text-sm text-gray-500 font-montserrat">
                Processando sua consulta: "{query}"
              </div>
            </motion.div>
          ) : result ? (
            // Result state
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm border-purple-100 shadow-lg overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge className="mb-2 bg-gradient-to-r from-fluida-blue to-fluida-pink text-white font-medium">
                        {resultType}
                      </Badge>
                      <CardTitle className="text-xl font-montserrat">
                        <span className="neon-highlight">{extractTitle()}</span>
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-100 font-montserrat whitespace-pre-line text-gray-700">
                    {result}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t bg-gray-50/50 p-4">
                  <div className="text-sm text-gray-500">
                    Baseado na consulta: "{query}"
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      <Copy className="h-4 w-4 mr-2" /> Copiar
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" /> Salvar
                    </Button>
                    <Button variant="gradient" size="sm" onClick={handleSendToEditor}>
                      <Send className="h-4 w-4 mr-2" /> Enviar
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ) : (
            // No result state (fallback)
            <motion.div
              key="no-result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <Card className="bg-white/90 backdrop-blur-sm border-purple-100 p-8 shadow">
                <CardContent className="flex flex-col items-center pt-6">
                  <div className="bg-purple-50 p-4 rounded-full mb-4">
                    <svg 
                      width="48" 
                      height="48" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="text-purple-400"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 font-montserrat">
                    Não conseguimos gerar um resultado
                  </h3>
                  <p className="text-gray-600 mb-6 font-montserrat">
                    Tente reformular sua pergunta ou escolha uma das sugestões abaixo.
                  </p>
                  <Button onClick={onRetry}>Tentar novamente</Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HeroResultSection;
