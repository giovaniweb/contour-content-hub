
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Wand2 } from "lucide-react";
import FluidaLoadingScreen from '../components/FluidaLoadingScreen';

interface ChatScriptModeProps {
  onScriptGenerated: (script: any) => void;
  onGoBack: () => void;
  generateScript: (data: any) => Promise<void>;
  isGenerating: boolean;
}

const ChatScriptMode: React.FC<ChatScriptModeProps> = ({
  onScriptGenerated,
  onGoBack,
  generateScript,
  isGenerating
}) => {
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState<Array<{
    type: 'user' | 'assistant';
    content: string;
  }>>([]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    
    // Adicionar mensagem do usuário
    const newConversation = [...conversation, { type: 'user' as const, content: userMessage }];
    setConversation(newConversation);

    try {
      // Gerar roteiro baseado na conversa
      await generateScript({
        tipo_conteudo: 'carrossel',
        objetivo: 'atrair',
        canal: 'instagram',
        estilo: 'criativo',
        tema: userMessage,
        conversa: newConversation
      });
      onScriptGenerated(true);
    } catch (error) {
      console.error('Erro ao gerar roteiro:', error);
      // Adicionar mensagem de erro
      setConversation([...newConversation, {
        type: 'assistant',
        content: 'Desculpe, não consegui gerar o roteiro agora. Tente reformular sua ideia ou tente novamente em alguns instantes.'
      }]);
    }
  };

  if (isGenerating) {
    return <FluidaLoadingScreen mentor="criativo" />;
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Card className="aurora-glass border-aurora-electric-purple/30 h-[600px] flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onGoBack} className="text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <CardTitle className="text-white text-center flex-1">
              💬 Chat com FLUIDAROTEIRISTA
            </CardTitle>
          </div>
          <p className="text-sm text-slate-400 text-center">
            Conte sua ideia livremente e eu criarei o roteiro perfeito para você
          </p>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col">
          {/* Área de conversa */}
          <div className="flex-1 space-y-4 mb-4 overflow-y-auto">
            {conversation.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4 py-8"
              >
                <div className="text-6xl">🎬</div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-white">
                    Olá! Sou seu FLUIDAROTEIRISTA pessoal
                  </h3>
                  <p className="text-slate-400">
                    Me conte sobre seu tratamento, público ou objetivo e eu criarei roteiros incríveis para suas redes sociais!
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <Button
                    variant="outline"
                    className="aurora-glass border-aurora-electric-purple/30 text-slate-300 h-auto py-3 px-4"
                    onClick={() => setInput('Roteiro para atrair clientes para harmonização facial')}
                  >
                    "Roteiro para atrair clientes para harmonização facial"
                  </Button>
                  <Button
                    variant="outline"
                    className="aurora-glass border-aurora-electric-purple/30 text-slate-300 h-auto py-3 px-4"
                    onClick={() => setInput('Post sobre tratamento de melasma que gere confiança')}
                  >
                    "Post sobre tratamento de melasma que gere confiança"
                  </Button>
                  <Button
                    variant="outline"
                    className="aurora-glass border-aurora-electric-purple/30 text-slate-300 h-auto py-3 px-4"
                    onClick={() => setInput('Stories para vender protocolo anti-idade')}
                  >
                    "Stories para vender protocolo anti-idade"
                  </Button>
                  <Button
                    variant="outline"
                    className="aurora-glass border-aurora-electric-purple/30 text-slate-300 h-auto py-3 px-4"
                    onClick={() => setInput('Carrossel educativo sobre bioestimuladores')}
                  >
                    "Carrossel educativo sobre bioestimuladores"
                  </Button>
                </div>
              </motion.div>
            )}

            {conversation.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-aurora-gradient-primary text-white'
                    : 'aurora-glass border-aurora-electric-purple/30 text-slate-200'
                }`}>
                  {message.content}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input de mensagem */}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Digite sua ideia para o roteiro..."
              className="flex-1 p-3 rounded-lg bg-slate-800/50 border border-aurora-electric-purple/30 text-white placeholder-slate-400"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim()}
              className="bg-aurora-gradient-primary hover:opacity-90 text-white px-6"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Gerar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatScriptMode;
