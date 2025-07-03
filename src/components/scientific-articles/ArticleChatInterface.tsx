import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, Bot, User, Loader2 } from 'lucide-react';
import { UnifiedDocument } from '@/types/document';

interface ArticleChatInterfaceProps {
  article: UnifiedDocument;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const ArticleChatInterface: React.FC<ArticleChatInterfaceProps> = ({ article }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: `Olá! Estou aqui para ajudar você a entender melhor o artigo "${article.titulo_extraido || 'documento'}". Você pode fazer perguntas sobre o conteúdo, metodologia, resultados ou qualquer aspecto do documento.`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulated AI response - In real implementation, this would call an edge function
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateMockResponse(inputMessage, article),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateMockResponse = (question: string, article: UnifiedDocument): string => {
    const lowercaseQuestion = question.toLowerCase();
    
    if (lowercaseQuestion.includes('resumo') || lowercaseQuestion.includes('sobre')) {
      return `Este documento é um ${article.tipo_documento} ${article.equipamento_nome ? `relacionado ao equipamento ${article.equipamento_nome}` : ''}. ${article.texto_completo ? article.texto_completo.substring(0, 300) + '...' : 'Informações detalhadas estão disponíveis no documento completo.'}`;
    }
    
    if (lowercaseQuestion.includes('autor') || lowercaseQuestion.includes('pesquisador')) {
      return article.autores && article.autores.length > 0 
        ? `Os autores deste documento são: ${article.autores.join(', ')}.`
        : 'As informações sobre os autores não estão disponíveis no momento.';
    }
    
    if (lowercaseQuestion.includes('palavra-chave') || lowercaseQuestion.includes('tema')) {
      return article.palavras_chave && article.palavras_chave.length > 0
        ? `As principais palavras-chave deste documento são: ${article.palavras_chave.join(', ')}.`
        : 'As palavras-chave não foram extraídas ainda para este documento.';
    }
    
    if (lowercaseQuestion.includes('equipamento') || lowercaseQuestion.includes('tecnologia')) {
      return article.equipamento_nome 
        ? `Este documento está relacionado ao equipamento ${article.equipamento_nome}. Você pode encontrar mais informações técnicas no documento completo.`
        : 'Este documento não está especificamente associado a um equipamento.';
    }
    
    return `Obrigado pela sua pergunta sobre "${question}". Baseado no conteúdo do documento, posso ajudar você com informações específicas. Para respostas mais detalhadas, recomendo consultar o PDF original ou fazer uma pergunta mais específica sobre algum aspecto do documento.`;
  };

  const suggestedQuestions = [
    "Qual é o resumo deste artigo?",
    "Quem são os autores?",
    "Quais as principais conclusões?",
    "Sobre qual equipamento trata?"
  ];

  return (
    <div className="space-y-4">
      <Card className="aurora-glass-enhanced border-aurora-electric-purple/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 aurora-text-gradient-enhanced text-lg">
            <MessageSquare className="h-5 w-5 text-aurora-cyan" />
            Chat Inteligente - Pesquise no Documento
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Messages Area */}
          <div className="h-64 overflow-y-auto space-y-3 p-4 aurora-glass border-aurora-electric-purple/20 rounded-lg">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-aurora-electric-purple' 
                      : 'bg-aurora-cyan'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className={`rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-aurora-electric-purple/20 border border-aurora-electric-purple/30'
                      : 'bg-aurora-cyan/20 border border-aurora-cyan/30'
                  }`}>
                    <p className="text-sm text-white">{message.content}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-aurora-cyan">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-aurora-cyan/20 border border-aurora-cyan/30 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-aurora-cyan" />
                      <p className="text-sm text-white">Analisando documento...</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          <div className="space-y-2">
            <p className="text-sm text-slate-400">Perguntas sugeridas:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage(question)}
                  className="text-xs border-aurora-electric-purple/30 text-aurora-electric-purple hover:bg-aurora-electric-purple/10"
                  disabled={isLoading}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Faça uma pergunta sobre o documento..."
              className="aurora-input"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="aurora-button-enhanced"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleChatInterface;