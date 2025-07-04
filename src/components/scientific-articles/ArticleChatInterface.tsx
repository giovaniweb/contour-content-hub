import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, Bot, User, Loader2, Sparkles, Brain, Lightbulb } from 'lucide-react';
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
      content: `Olá! 👋 Sou seu assistente especialista em análise científica. Estou aqui para ajudar você a explorar e compreender o artigo "${article.titulo_extraido || 'documento'}". 

Posso explicar conceitos, discutir metodologias, analisar resultados ou responder qualquer pergunta sobre o conteúdo. Como posso ajudar?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

    // Focus back to input after sending
    setTimeout(() => inputRef.current?.focus(), 100);

    // Simulated AI response with more realistic delay
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateEnhancedResponse(inputMessage, article),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1200 + Math.random() * 800); // Variable delay for realism
  };

  const generateEnhancedResponse = (question: string, article: UnifiedDocument): string => {
    const lowercaseQuestion = question.toLowerCase();
    
    if (lowercaseQuestion.includes('resumo') || lowercaseQuestion.includes('sobre') || lowercaseQuestion.includes('o que é')) {
      return `📋 **Resumo do Documento**

Este é um ${article.tipo_documento} ${article.equipamento_nome ? `relacionado ao equipamento ${article.equipamento_nome}` : ''}. 

${article.texto_completo ? article.texto_completo.substring(0, 400) + '...' : 'O documento contém informações técnicas especializadas sobre procedimentos estéticos.'}

🔍 **Pontos-chave:**
- Tipo: ${article.tipo_documento}
- Status: ${article.status_processamento}
- Processado em: ${new Date(article.data_upload).toLocaleDateString('pt-BR')}

Gostaria que eu aprofunde algum aspecto específico?`;
    }
    
    if (lowercaseQuestion.includes('autor') || lowercaseQuestion.includes('pesquisador') || lowercaseQuestion.includes('quem')) {
      return article.autores && article.autores.length > 0 
        ? `👥 **Autores e Pesquisadores:**

${article.autores.map((author, index) => `${index + 1}. ${author}`).join('\n')}

Este trabalho representa a colaboração de ${article.autores.length} profissional${article.autores.length > 1 ? 'is' : ''} da área. Cada autor provavelmente contribuiu com sua expertise específica para diferentes aspectos da pesquisa.

Posso explicar mais sobre o background ou contribuições específicas se você tiver interesse em algum autor em particular?`
        : `ℹ️ **Informações sobre Autoria:**

As informações detalhadas sobre os autores não estão disponíveis no momento. Isso pode ocorrer quando o documento está sendo processado ou quando os metadados não foram extraídos completamente.

Posso ajudar com outras informações sobre o conteúdo do documento?`;
    }
    
    if (lowercaseQuestion.includes('palavra-chave') || lowercaseQuestion.includes('tema') || lowercaseQuestion.includes('assunto')) {
      return article.palavras_chave && article.palavras_chave.length > 0
        ? `🏷️ **Palavras-chave e Temas Principais:**

${article.palavras_chave.map((keyword, index) => `• ${keyword}`).join('\n')}

Essas palavras-chave indicam os temas centrais abordados no documento. Elas são fundamentais para:
- Classificação do conteúdo
- Busca em bases de dados
- Identificação de trabalhos relacionados

Gostaria que eu explique algum desses termos específicos ou suas aplicações práticas?`
        : `🔍 **Análise Temática:**

As palavras-chave específicas ainda não foram extraídas ou não estão disponíveis. Baseado no tipo de documento (${article.tipo_documento}) e no equipamento relacionado, posso inferir que se trata de conteúdo técnico especializado.

Posso ajudar analisando o conteúdo disponível ou respondendo perguntas específicas sobre o tema?`;
    }
    
    if (lowercaseQuestion.includes('equipamento') || lowercaseQuestion.includes('tecnologia') || lowercaseQuestion.includes('aparelho')) {
      return article.equipamento_nome 
        ? `🔧 **Equipamento e Tecnologia:**

**Equipamento:** ${article.equipamento_nome}

Este documento está diretamente relacionado ao uso, especificações ou aplicações deste equipamento. Equipamentos em estética são fundamentais para:

- Procedimentos seguros e eficazes
- Resultados padronizados
- Protocolos bem definidos
- Evolução técnica da área

Gostaria de saber mais sobre aplicações específicas, protocolos de uso ou comparações com outras tecnologias?`
        : `💡 **Contexto Tecnológico:**

Este documento não está especificamente associado a um equipamento particular, mas faz parte do conhecimento técnico geral da área de estética.

Mesmo sem um equipamento específico, o conteúdo pode incluir:
- Fundamentos teóricos
- Princípios gerais de aplicação
- Metodologias universais

Posso ajudar com questões técnicas específicas sobre o conteúdo?`;
    }

    if (lowercaseQuestion.includes('metodologia') || lowercaseQuestion.includes('método') || lowercaseQuestion.includes('como')) {
      return `🔬 **Análise Metodológica:**

Baseado no tipo de documento (${article.tipo_documento}), posso orientar sobre aspectos metodológicos relevantes:

**Para Artigos Científicos:**
- Revisão de literatura
- Desenho experimental
- Critérios de inclusão/exclusão
- Análise estatística

**Para Fichas Técnicas:**
- Especificações técnicas
- Protocolos de uso
- Contraindicações
- Procedimentos padrão

**Para Protocolos:**
- Passo a passo detalhado
- Parâmetros de segurança
- Monitoramento de resultados

Você gostaria de explorar algum aspecto metodológico específico?`;
    }

    if (lowercaseQuestion.includes('resultado') || lowercaseQuestion.includes('conclusão') || lowercaseQuestion.includes('eficácia')) {
      return `📊 **Análise de Resultados e Eficácia:**

${article.texto_completo ? 
`Com base no conteúdo disponível, posso destacar aspectos importantes sobre os resultados:

${article.texto_completo.includes('resultado') || article.texto_completo.includes('conclusão') ? 
'O documento apresenta dados sobre eficácia e resultados obtidos.' : 
'O documento contém informações técnicas que podem incluir dados de performance.'}` :
'Para uma análise detalhada dos resultados, seria necessário examinar o documento completo.'}

**Aspectos a considerar:**
- Critérios de avaliação utilizados
- Tempo de acompanhamento
- Variáveis analisadas
- Significância dos resultados

Você tem alguma pergunta específica sobre eficácia ou resultados?`;
    }
    
    return `🤖 **Resposta Especializada:**

Obrigado pela pergunta sobre "${question}". Como especialista em análise de documentos científicos, posso ajudar de várias formas:

**Com base neste documento:**
- Tipo: ${article.tipo_documento}
- Status: ${article.status_processamento}
- Área: ${article.equipamento_nome || 'Estética Avançada'}

**Posso ajudar com:**
• Análise detalhada do conteúdo
• Explicação de conceitos técnicos
• Interpretação de resultados
• Discussão de aplicações práticas
• Comparação com outras pesquisas

💡 **Dica:** Seja mais específico na sua pergunta para obter uma resposta mais direcionada. Por exemplo:
- "Explique a metodologia utilizada"
- "Quais são os principais benefícios?"
- "Como aplicar esses resultados na prática?"

Como posso ajudar de forma mais específica?`;
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "Qual é o resumo deste artigo?",
    "Quem são os autores?",
    "Quais as principais conclusões?",
    "Explique a metodologia utilizada",
  ];

  return (
    <div className="h-full flex flex-col aurora-glass-enhanced border-aurora-electric-purple/30 rounded-lg overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-aurora-electric-purple/20 bg-gradient-to-r from-aurora-electric-purple/10 to-aurora-cyan/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-aurora-electric-purple to-aurora-cyan flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white animate-pulse"></div>
          </div>
          <div>
            <h3 className="aurora-text-gradient-enhanced font-semibold">Assistente IA Científico</h3>
            <p className="text-xs text-slate-400">Especialista em análise de documentos</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 aurora-scrollbar">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 aurora-animate-fade-in ${
            message.type === 'user' ? 'justify-end' : 'justify-start'
          }`}>
            <div className={`flex gap-3 max-w-[85%] ${
              message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-gradient-to-br from-aurora-electric-purple to-aurora-neon-blue' 
                  : 'bg-gradient-to-br from-aurora-cyan to-aurora-emerald'
              }`}>
                {message.type === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div className={`rounded-2xl p-4 ${
                message.type === 'user'
                  ? 'bg-gradient-to-br from-aurora-electric-purple/20 to-aurora-neon-blue/20 border border-aurora-electric-purple/30'
                  : 'bg-gradient-to-br from-aurora-cyan/20 to-aurora-emerald/20 border border-aurora-cyan/30'
              } backdrop-blur-lg`}>
                <div className="prose prose-invert prose-sm max-w-none">
                  <p className="text-white text-sm leading-relaxed mb-0 whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
                <p className="text-xs text-slate-400 mt-2 opacity-70">
                  {message.timestamp.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex gap-3 justify-start aurora-animate-fade-in">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-aurora-cyan to-aurora-emerald flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-gradient-to-br from-aurora-cyan/20 to-aurora-emerald/20 border border-aurora-cyan/30 rounded-2xl p-4 backdrop-blur-lg">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-aurora-cyan rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-aurora-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-aurora-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <p className="text-sm text-aurora-cyan">Analisando documento...</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div className="px-4 py-2 border-t border-aurora-electric-purple/10">
          <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
            <Lightbulb className="h-3 w-3" />
            Sugestões para começar:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(question)}
                className="text-xs border-aurora-electric-purple/30 text-aurora-electric-purple hover:bg-aurora-electric-purple/10 aurora-animate-scale"
                disabled={isLoading}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-aurora-electric-purple/20 bg-gradient-to-r from-aurora-electric-purple/5 to-aurora-cyan/5">
        <div className="flex gap-3">
          <Input
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Faça uma pergunta sobre o documento..."
            className="flex-1 aurora-input border-aurora-electric-purple/30 focus:border-aurora-cyan bg-slate-800/50 backdrop-blur-sm"
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="aurora-button-enhanced bg-gradient-to-r from-aurora-electric-purple to-aurora-cyan hover:from-aurora-electric-purple/80 hover:to-aurora-cyan/80 aurora-animate-scale"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          Pressione Enter para enviar • Shift+Enter para nova linha
        </p>
      </div>
    </div>
  );
};

export default ArticleChatInterface;