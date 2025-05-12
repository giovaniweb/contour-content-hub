
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from '@/components/ui/drawer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import IntentProcessor from '@/components/intent-processor/IntentProcessor';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useIntentProcessor } from '@/hooks/useIntentProcessor';

// Mock video data for demonstration
const mockVideos = [
  { id: '1', title: 'Unyque Pro Tutorial', thumbnail: '/lovable-uploads/e96c0d46-8a86-4d83-bea8-bc63b46b1fea.png' },
  { id: '2', title: 'Unyque Pro Demonstração', thumbnail: '/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png' },
  { id: '3', title: 'Benefícios do Unyque Pro', thumbnail: '/lovable-uploads/e96c0d46-8a86-4d83-bea8-bc63b46b1fea.png' }
];

const messages = [
  "Processando sua ideia...",
  "Buscando sugestões ideais...",
  "Nossa IA está trabalhando nisso...",
  "Analisando as melhores opções...",
  "Preparando recomendações personalizadas..."
];

const IntelligentIntentProcessor: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [responseType, setResponseType] = useState<'videos' | 'marketing' | 'script' | 'default' | null>(null);
  const { toast } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Message rotation for the preloader
  React.useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setCurrentMessage(prev => (prev + 1) % messages.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isProcessing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsProcessing(true);
    
    // Process the intent after a simulated delay (would be an API call in production)
    setTimeout(() => {
      const promptLower = prompt.toLowerCase();
      
      // Intent detection logic
      if (promptLower.includes('vídeo') || promptLower.includes('baixar') || promptLower.includes('unyque')) {
        setResponseType('videos');
        setIsDialogOpen(true);
      } else if (promptLower.includes('venda') || promptLower.includes('marketing') || promptLower.includes('melhorar')) {
        setResponseType('marketing');
        setIsDrawerOpen(true);
      } else if (promptLower.includes('roteiro') || promptLower.includes('criar conteúdo') || promptLower.includes('gravar')) {
        setResponseType('script');
        setIsDialogOpen(true);
      } else {
        setResponseType('default');
        setIsDialogOpen(true);
      }
      
      setIsProcessing(false);
    }, 3000); // Simulate processing time for demonstration
  };
  
  const handleCancel = () => {
    setIsProcessing(false);
    toast({
      title: "Processamento cancelado",
      description: "Você pode tentar novamente quando quiser.",
    });
  };
  
  const renderResponseContent = () => {
    switch(responseType) {
      case 'videos':
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Vídeos disponíveis para você</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockVideos.map(video => (
                <div key={video.id} className="rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">{video.title}</h3>
                    <div className="mt-3 flex justify-between">
                      <Button variant="outline" size="sm">Visualizar</Button>
                      <Button variant="default" size="sm">Download</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'marketing':
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-6">Consultor de Marketing IA</h2>
            <p className="text-gray-600 mb-6">Vamos ajudar você a melhorar os resultados da sua clínica com estratégias personalizadas.</p>
            
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Qual área deseja melhorar?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Agendamentos', 'Redes Sociais', 'Campanhas'].map(area => (
                  <Button key={area} variant="outline" className="h-auto py-6 flex flex-col gap-2" onClick={() => {
                    window.location.href = '/marketing-consultant?area=' + encodeURIComponent(area.toLowerCase());
                  }}>
                    <span>{area}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'script':
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-6">Validador de Ideia para Roteiro</h2>
            <p className="text-gray-600 mb-6">Vamos criar um roteiro impressionante para você. Conte-nos mais sobre seu objetivo.</p>
            
            <div className="space-y-6">
              <h3 className="font-medium text-lg">Qual o objetivo desse conteúdo?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Educar', 'Vender', 'Engajar'].map(objective => (
                  <Button key={objective} variant="outline" className="h-auto py-6 flex flex-col gap-2" onClick={() => {
                    window.location.href = '/idea-validator?objective=' + encodeURIComponent(objective.toLowerCase());
                  }}>
                    <span>{objective}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="p-4">
            <IntentProcessor 
              initialContext={{ mensagem_usuario: prompt }} 
              onResult={(result) => {
                console.log("Intent processor result:", result);
              }}
            />
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl mx-auto">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Descreva o que você quer criar ou melhorar..."
          className="flex-1 px-6 py-4 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-fluida-blue shadow-lg text-lg"
        />
        <Button 
          type="submit" 
          className="bg-fluida-blue hover:bg-fluida-blue/90 text-white px-8 py-4 rounded-full flex items-center gap-2 text-lg"
          disabled={isProcessing || !prompt.trim()}
        >
          Começar com IA
          <ArrowRight className="w-5 h-5" />
        </Button>
      </form>

      {/* Preloader */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              className="bg-white rounded-xl p-8 max-w-md w-full relative flex flex-col items-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <button 
                onClick={handleCancel}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                aria-label="Cancelar"
              >
                <X size={20} />
              </button>
              
              <div className="w-16 h-16 mb-4">
                <div className="w-full h-full rounded-full border-4 border-t-fluida-blue border-r-fluida-pink border-b-fluida-blue border-l-fluida-pink animate-spin" />
              </div>
              
              <motion.p
                key={currentMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xl font-medium text-center"
              >
                {messages[currentMessage]}
              </motion.p>
              
              <p className="mt-2 text-sm text-gray-500">
                Analisando sua solicitação...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialog response for videos and scripts */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {responseType === 'videos' ? 'Vídeos disponíveis para você' : 
               responseType === 'script' ? 'Vamos criar seu roteiro' :
               'Sugestão personalizada'}
            </DialogTitle>
            <DialogDescription>
              {responseType === 'videos' ? 'Aqui estão alguns vídeos que podem ajudar você' : 
               responseType === 'script' ? 'Vamos estruturar um roteiro perfeito para sua necessidade' :
               'Aqui está a solução que recomendamos para você'}
            </DialogDescription>
          </DialogHeader>
          {renderResponseContent()}
        </DialogContent>
      </Dialog>

      {/* Drawer response for marketing consultant */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-h-[85vh]">
          <div className="mx-auto w-full max-w-4xl">
            <DrawerHeader>
              <DrawerTitle>Consultor de Marketing IA</DrawerTitle>
              <DrawerDescription>
                Vamos ajudar você a melhorar os resultados da sua clínica
              </DrawerDescription>
            </DrawerHeader>
            {responseType === 'marketing' && renderResponseContent()}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default IntelligentIntentProcessor;
