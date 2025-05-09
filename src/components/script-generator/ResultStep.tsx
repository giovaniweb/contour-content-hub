
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, Download, Share2, Sparkles, ThumbsUp, CalendarRange } from 'lucide-react';
import { motion } from 'framer-motion';
import { GeneratedScript, FormData } from '@/types/script';
import ScriptToPlannerModal from './ScriptToPlannerModal';

interface ResultStepProps {
  generatedScript: GeneratedScript;
  formData: FormData;
  onCopyScript: () => void;
  onBackToEdit: () => void;
  onNewScript: () => void;
  isPlannerModalOpen: boolean;
  setIsPlannerModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResultStep: React.FC<ResultStepProps> = ({
  generatedScript,
  formData,
  onCopyScript,
  onBackToEdit,
  onNewScript,
  isPlannerModalOpen,
  setIsPlannerModalOpen,
}) => {
  const handleAddToPlanner = () => {
    setIsPlannerModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      <motion.div
        className="relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header section */}
        <motion.div
          className="bg-gradient-to-r from-fluida-blue to-fluida-pink text-white p-6 rounded-t-2xl flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Seu Roteiro Mágico</h2>
          </div>
          
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={onCopyScript} title="Copiar roteiro" className="text-white hover:bg-white/20">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Compartilhar roteiro" className="text-white hover:bg-white/20">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Baixar como PDF" className="text-white hover:bg-white/20">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
        
        {/* Content section */}
        <motion.div
          className="bg-white dark:bg-gray-800 p-8 rounded-b-2xl shadow-xl border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="space-y-8">
            {/* Title and metadata */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-fluida-blue to-fluida-pink bg-clip-text text-transparent">
                {generatedScript.title}
              </h3>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-sm font-medium text-blue-800 dark:text-blue-200">
                  Intenção: {formData.objective === 'emotion' ? 'Emocionar' : 'Vender'}
                </span>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 rounded-full text-sm font-medium text-purple-800 dark:text-purple-200">
                  Duração: {generatedScript.duration}
                </span>
                <div className="px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-300 text-white rounded-full text-sm font-medium flex items-center">
                  <ThumbsUp className="h-3 w-3 mr-1" />
                  Score Final: {generatedScript.finalScore}/10
                </div>
              </div>
            </motion.div>
            
            {/* Script structure */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div
                className="col-span-1 lg:col-span-2 space-y-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="p-6 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/30 border border-blue-100 dark:border-blue-800 hover:shadow-lg transition-shadow">
                  <h4 className="text-sm uppercase text-gray-500 dark:text-gray-400 mb-2 font-semibold tracking-wider">Abertura</h4>
                  <p className="text-lg font-medium">{generatedScript.opening}</p>
                </div>
                
                <div className="p-6 rounded-xl bg-gradient-to-r from-gray-50 to-purple-50 dark:from-gray-800 dark:to-purple-900/30 border border-purple-100 dark:border-purple-800 hover:shadow-lg transition-shadow">
                  <h4 className="text-sm uppercase text-gray-500 dark:text-gray-400 mb-2 font-semibold tracking-wider">Parte Principal</h4>
                  <p className="text-base whitespace-pre-line">{generatedScript.body}</p>
                </div>
                
                <div className="p-6 rounded-xl bg-gradient-to-r from-gray-50 to-pink-50 dark:from-gray-800 dark:to-pink-900/30 border border-pink-100 dark:border-pink-800 hover:shadow-lg transition-shadow">
                  <h4 className="text-sm uppercase text-gray-500 dark:text-gray-400 mb-2 font-semibold tracking-wider">Fechamento</h4>
                  <p className="text-lg font-medium">{generatedScript.closing}</p>
                </div>
              </motion.div>
              
              <motion.div
                className="col-span-1 space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm uppercase text-gray-500 dark:text-gray-400 mb-3 font-semibold tracking-wider">Visual Sugerido</h4>
                  <p className="text-sm italic">{generatedScript.visualSuggestion}</p>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm uppercase text-gray-500 dark:text-gray-400 mb-2 font-semibold tracking-wider">Frase Final</h4>
                    <p className="text-sm font-medium">{generatedScript.finalPhrase}</p>
                  </div>
                </div>
                
                <div className="p-6 rounded-xl bg-gradient-to-br from-white to-amber-50 dark:from-gray-800 dark:to-amber-900/20 border border-amber-200 dark:border-amber-800/40">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-300 flex items-center justify-center text-white">
                      <ThumbsUp className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium">Avaliação de Impacto</h4>
                      <div className="flex items-center">
                        <div className="flex">
                          {Array.from({ length: Math.round(generatedScript.finalScore) }).map((_, i) => (
                            <div key={i} className="text-amber-500">★</div>
                          ))}
                          {Array.from({ length: 10 - Math.round(generatedScript.finalScore) }).map((_, i) => (
                            <div key={i} className="text-gray-300 dark:text-gray-600">★</div>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">({generatedScript.finalScore}/10)</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {formData.objective === 'emotion' 
                      ? "Este roteiro tem alto potencial de engajar emocionalmente sua audiência e criar conexão duradoura."
                      : "Este roteiro foi otimizado para maximizar conversões e possui elementos persuasivos eficazes."}
                  </p>
                </div>
              </motion.div>
            </div>
            
            {/* Disney magic version */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Sparkles className="h-5 w-5 text-yellow-500 mr-2" />
                Versão refinada com Magia Disney
              </h3>
              
              <div className="p-6 rounded-xl backdrop-blur-sm bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-950/60 dark:to-purple-950/60 border border-blue-100 dark:border-blue-800 shadow-lg">
                <p className="whitespace-pre-line">{generatedScript.refinedScript}</p>
              </div>
            </motion.div>
            
            {/* Actions */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 pt-4 mt-8 border-t border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Button 
                variant="outline" 
                className="gap-2" 
                onClick={onBackToEdit}
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar e editar
              </Button>
              
              <div className="flex-1"></div>
              
              <Button 
                variant="outline"
                className="gap-2 border-fluida-blue text-fluida-blue"
                onClick={handleAddToPlanner}
              >
                <CalendarRange className="h-4 w-4" />
                Usar no Planner
              </Button>
              
              <Button 
                className="gap-2"
                style={{
                  backgroundImage: "linear-gradient(90deg, #0094fb, #f300fc)",
                }}
                onClick={onNewScript}
              >
                <Sparkles className="h-4 w-4" />
                Criar novo roteiro
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Modal for adding to planner */}
      <ScriptToPlannerModal
        open={isPlannerModalOpen}
        onOpenChange={setIsPlannerModalOpen}
        scriptTitle={generatedScript.title}
        scriptContent={`${generatedScript.opening}\n\n${generatedScript.body}\n\n${generatedScript.closing}`}
      />
    </div>
  );
};

export default ResultStep;
