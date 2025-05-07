
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, RefreshCw, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { ValidationResult } from "@/utils/validation/types";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface ScriptChatAssistantProps {
  content: string;
  validationResult: ValidationResult | null;
  onImprovedScript?: (script: string) => void;
}

const ScriptChatAssistant: React.FC<ScriptChatAssistantProps> = ({ 
  content,
  validationResult,
  onImprovedScript
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [improvedScript, setImprovedScript] = useState<string | null>(null);
  const [beforeAfterView, setBeforeAfterView] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Generate a welcome message when component mounts
  useEffect(() => {
    const welcomeMessage = {
      id: "welcome",
      content: "Olá! Sou seu assistente de roteiros. Posso te ajudar a melhorar seu roteiro usando o método de encantamento Disney, analisar seus pontos fortes e fracos, ou responder perguntas sobre como criar roteiros mais envolventes.",
      sender: "assistant" as const,
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
  }, []);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle sending message
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    // Simulate API call to get response
    setTimeout(() => {
      // Example responses based on user input
      let responseContent = "";
      const userInput = inputValue.toLowerCase();
      
      if (userInput.includes("melhorar") || userInput.includes("aprimorar")) {
        responseContent = "Para melhorar seu roteiro, considere aplicar a estrutura Disney: começe com um gancho forte, apresente um conflito claro, crie uma virada envolvente e termine com um chamado à ação irresistível. Seu roteiro atual poderia ter um gancho mais impactante logo nos primeiros segundos.";
      } else if (userInput.includes("analisar") || userInput.includes("análise")) {
        const scores = validationResult ? 
          `Gancho: ${validationResult.gancho}/10\nClareza: ${validationResult.clareza}/10\nCTA: ${validationResult.cta}/10\nConexão Emocional: ${validationResult.emocao}/10` :
          "Ainda não temos uma validação completa para este roteiro.";
        
        responseContent = `Aqui está uma análise do seu roteiro:\n\n${scores}\n\nSeu roteiro tem pontos fortes na estrutura, mas poderia melhorar a conexão emocional com o público-alvo.`;
      } else if (userInput.includes("dica") || userInput.includes("conselho")) {
        responseContent = "Uma dica valiosa: sempre pense no problema real do seu público antes de falar da solução. Use linguagem simples e direta, e crie uma narrativa que resolva uma dor específica. No método Disney, chamamos isso de 'conflito' e é essencial para criar identificação.";
      } else {
        responseContent = "Entendi sua pergunta. Para criar roteiros mais impactantes, foque em contar uma história que resolva um problema real do seu público. Use a estrutura Disney: gancho (capte atenção), conflito (apresente o problema), virada (mostre a solução) e CTA (chamada para ação clara).";
      }
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: responseContent,
        sender: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  // Handle key press in textarea
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle improve script button
  const handleImproveScript = () => {
    setIsImproving(true);
    
    // Simulate API call to improve script
    setTimeout(() => {
      const improvedText = content + "\n\n[Versão aprimorada]\n\nVocê já imaginou acordar todo dia sentindo-se confiante na sua própria pele? ✨\n\nMuitas pessoas tentam diversos tratamentos estéticos, mas acabam decepcionadas com resultados temporários e procedimentos dolorosos.\n\nO Crystal 3D Plus revoluciona esse cenário com sua tecnologia tripla de depilação definitiva que não só elimina os pelos, mas também estimula o colágeno da sua pele, deixando-a mais firme e jovem.\n\nNão perca mais tempo com métodos que não funcionam! Agende agora sua avaliação gratuita e ganhe 20% de desconto na primeira sessão. Vagas limitadas para maio!";
      
      setImprovedScript(improvedText);
      setIsImproving(false);
      
      if (onImprovedScript) {
        onImprovedScript(improvedText);
      }
      
      toast({
        title: "Roteiro aprimorado!",
        description: "O assistente IA criou uma versão otimizada do seu roteiro."
      });
    }, 3000);
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="py-3 px-4">
        <CardTitle className="flex items-center text-lg gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          Assistente de Roteiros
          <Badge variant="secondary" className="ml-2">Disney Method</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 flex flex-col">
        {/* Messages history */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <Avatar className={`h-8 w-8 ${message.sender === 'user' ? 'bg-blue-600' : 'bg-green-600'}`}>
                    <span className="text-xs text-white">
                      {message.sender === 'user' ? 'Eu' : 'IA'}
                    </span>
                  </Avatar>
                  <div className={`p-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    <div className="whitespace-pre-line text-sm">
                      {message.content}
                    </div>
                    <div className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2 max-w-[80%]">
                  <Avatar className="h-8 w-8 bg-green-600">
                    <span className="text-xs text-white">IA</span>
                  </Avatar>
                  <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Pensando...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {/* Input area */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              placeholder="Pergunte algo sobre seu roteiro ou peça sugestões..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="min-h-[80px] resize-none"
            />
            <Button 
              className="self-end"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
            >
              <Send className="h-5 w-5" />
              <span className="sr-only">Enviar</span>
            </Button>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t p-4 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {validationResult && `Score atual: ${validationResult.total.toFixed(1)}/10`}
        </div>
        
        <div className="flex gap-2">
          {improvedScript && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setBeforeAfterView(!beforeAfterView)}
            >
              {beforeAfterView ? (
                <>
                  <ArrowDown className="h-4 w-4 mr-2" />
                  Versão Única
                </>
              ) : (
                <>
                  <ArrowUp className="h-4 w-4 mr-2" />
                  Antes/Depois
                </>
              )}
            </Button>
          )}
          
          <Button 
            onClick={handleImproveScript}
            disabled={isImproving || !content}
            size="sm"
          >
            {isImproving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Aprimorando...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Melhorar Roteiro
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ScriptChatAssistant;
