
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ValidationResponseProps {
  ideaText: string;
  objective: 'emotion' | 'sales';
}

const ValidationResponse: React.FC<ValidationResponseProps> = ({ ideaText, objective }) => {
  const navigate = useNavigate();
  
  // Generate response based on the idea and objective
  const generateResponse = () => {
    // Positive greeting options
    const greetings = ["Boa!", "Ótima ideia!", "Legal isso!", "Adorei!", "Excelente!"];
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    
    // Determine response based on objective
    if (objective === 'emotion') {
      // For emotional content
      if (ideaText.toLowerCase().includes('massinha') && ideaText.toLowerCase().includes('mães')) {
        return `${randomGreeting} Essa ideia tem cheiro de nostalgia e muito carinho envolvido. Massinha lembra infância, criatividade, tempo junto com quem a gente ama.`;
      } else if (ideaText.toLowerCase().includes('antes e depois')) {
        return `${randomGreeting} Essa ideia toca no coração do público e mostra uma jornada real. Transformações têm uma carga emocional imensa porque mostram superação e mudança.`;
      } else if (ideaText.toLowerCase().includes('tutorial')) {
        return `${randomGreeting} Compartilhar conhecimento é um gesto de generosidade que cria conexão. Esse tipo de conteúdo torna sua marca uma amiga que ajuda, não apenas uma empresa que vende.`;
      } else {
        return `${randomGreeting} Essa ideia tem potencial para criar uma conexão genuína. Conteúdo que emociona fica na memória e aproxima as pessoas da sua marca.`;
      }
    } else {
      // For sales content
      if (ideaText.toLowerCase().includes('massinha') && ideaText.toLowerCase().includes('mães')) {
        return `${randomGreeting} Essa ideia chama atenção e pode converter bem. Use a nostalgia da massinha para criar urgência: quem não quer dar um presente inesquecível?`;
      } else if (ideaText.toLowerCase().includes('antes e depois')) {
        return `${randomGreeting} Essa ideia vende porque prova resultados reais. Antes e depois é irresistível porque mostra exatamente o que o cliente pode esperar.`;
      } else if (ideaText.toLowerCase().includes('tutorial')) {
        return `${randomGreeting} Tutorial é ótimo para mostrar o seu valor e conhecimento. Entregue dicas práticas, mas deixe claro que tem muito mais para oferecer no serviço completo.`;
      } else {
        return `${randomGreeting} Essa ideia tem potencial para converter. Um bom gancho no início e um chamado para ação no final podem transformar visualizações em agendamentos reais.`;
      }
    }
  };
  
  // Get closing statement
  const getClosingStatement = () => {
    const closings = [
      "Vamos transformar isso em um conteúdo incrível?",
      "Partiu montar um roteiro forte com isso?",
      "Vamos criar algo marcante com essa ideia?",
      "Pronto pra transformar essa ideia em realidade?"
    ];
    return closings[Math.floor(Math.random() * closings.length)];
  };
  
  const handleCreateScript = () => {
    // Navigate to script generator with idea and objective data
    navigate('/script-generator', { 
      state: { 
        ideaText: ideaText,
        objective: objective
      }
    });
  };
  
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`p-1 ${
        objective === 'emotion' 
          ? 'bg-gradient-to-r from-pink-500 to-purple-500' 
          : 'bg-gradient-to-r from-amber-500 to-orange-500'
      }`}>
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className={`rounded-full p-3 flex-shrink-0 ${
              objective === 'emotion' 
                ? 'bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400' 
                : 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
            }`}>
              <MessageSquare className="h-6 w-6" />
            </div>
            
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4">
                {objective === 'emotion' ? 'Fluida que emociona diz:' : 'Fluida que vende diz:'}
              </h3>
              
              <p className="text-lg mb-6 leading-relaxed">
                {generateResponse()}
              </p>
              
              <p className="text-lg font-medium mb-6">
                {getClosingStatement()}
              </p>
              
              <div className="mt-8">
                <Button
                  onClick={handleCreateScript}
                  className="bg-gradient-to-r from-fluida-blue to-fluida-pink hover:opacity-90 text-white px-6 py-6 rounded-full text-lg font-medium flex items-center gap-2"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Criar roteiro com Fluida
                  <ArrowRight className="ml-1 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ValidationResponse;
