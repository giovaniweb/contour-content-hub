
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
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
    if (objective === 'emotion') {
      // For emotional content
      if (ideaText.toLowerCase().includes('massinha') && ideaText.toLowerCase().includes('mães')) {
        return "A massinha lembra infância, cuidado e criação — é um gesto que emociona. Isso cria conexão real com quem assiste. É conteúdo que aproxima.";
      } else if (ideaText.toLowerCase().includes('antes e depois')) {
        return "Transformações têm uma carga emocional imensa porque mostram superação e mudança. Isso cria empatia imediata com quem assiste e toca no desejo humano de evolução.";
      } else if (ideaText.toLowerCase().includes('tutorial')) {
        return "Compartilhar conhecimento é um gesto de generosidade que cria conexão. Esse tipo de conteúdo torna sua marca uma amiga que ajuda, não apenas uma empresa que vende.";
      } else {
        return "Essa ideia tem um potencial emocional incrível. Ao focar nas sensações e resultados, você cria uma conexão genuína com o público. É um conteúdo que vai tocar corações.";
      }
    } else {
      // For sales content
      if (ideaText.toLowerCase().includes('massinha') && ideaText.toLowerCase().includes('mães')) {
        return "Essa ideia é perfeita para converter em vendas de presentes para o Dia das Mães. Use a nostalgia da massinha para criar urgência: 'Quer dar um presente inesquecível? Temos apenas 10 vagas para o procedimento X antes do Dia das Mães!'";
      } else if (ideaText.toLowerCase().includes('antes e depois')) {
        return "Transformações são poderosas para vendas porque provam resultados reais. Destaque números e estatísticas: 'Veja como 90% das clientes notam diferença em apenas uma sessão!'";
      } else if (ideaText.toLowerCase().includes('tutorial')) {
        return "Tutoriais que mostram apenas parte da solução são ótimos para vendas. Mostre o suficiente para gerar interesse e termine com um call to action: 'Para resultados completos, agende uma avaliação!'";
      } else {
        return "Essa ideia tem grande potencial comercial. Ao destacar os benefícios e criar um senso de urgência ou exclusividade, você pode converter visualizações em agendamentos reais e vendas efetivas.";
      }
    }
  };
  
  const handleCreateScript = () => {
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
              {objective === 'emotion' ? (
                <Sparkles className="h-6 w-6" />
              ) : (
                <ShoppingBag className="h-6 w-6" />
              )}
            </div>
            
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4">
                {objective === 'emotion' ? 'Fluida que emociona diz:' : 'Fluida que vende diz:'}
              </h3>
              
              <p className="text-lg mb-6 leading-relaxed">
                "Essa ideia tem um toque {objective === 'emotion' ? 'lindo' : 'estratégico'}. {generateResponse()}"
              </p>
              
              <div className="mt-8">
                <p className="text-lg font-medium mb-4">
                  Vamos transformar isso em um roteiro {objective === 'emotion' ? 'que toque corações' : 'que gere resultados'}?
                </p>
                
                <Button
                  onClick={handleCreateScript}
                  className="bg-gradient-to-r from-fluida-blue to-fluida-pink hover:opacity-90 text-white px-6 py-6 rounded-full text-lg font-medium flex items-center gap-2"
                >
                  Criar roteiro agora
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
