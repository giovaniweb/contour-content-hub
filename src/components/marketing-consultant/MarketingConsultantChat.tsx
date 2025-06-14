import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import MessageList from "./components/MessageList";
import SuggestedResponses from "./components/SuggestedResponses";
import { useMarketingConsultantChatLogic } from "./hooks/useMarketingConsultantChatLogic";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, ArrowRight, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface MarketingConsultantChatProps {
  onStartConsultation: () => void;
}

const MarketingConsultantChat: React.FC<{ onStartConsultation: () => void }> = ({
  onStartConsultation,
}) => {
  const {
    state: { messages, input, loading, showSuggestions, messagesEndRef, hasSavedData },
    actions: { handleSend, handleStartDiagnostic, handleSetSuggestion },
  } = useMarketingConsultantChatLogic(onStartConsultation);

  const suggestedResponses = hasSavedData
    ? [
        "Quero iniciar um novo diagnóstico",
        "Continuar do diagnóstico anterior",
        "Como o Instagram pode ajudar minha clínica?",
        "O que é o Fluida Te Entende?",
      ]
    : [
        "Quero iniciar o diagnóstico",
        "Como o Instagram pode ajudar minha clínica?",
        "Quais estratégias para atrair mais clientes?",
        "O que é o Fluida Te Entende?",
      ];

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Consultor de Marketing
          {hasSavedData && (
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
              Diagnóstico salvo
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-4">
          <MessageList
            messages={messages}
            loading={loading}
            messagesEndRef={messagesEndRef}
          />
          {/* Sugestões de resposta */}
          {showSuggestions &&
            !loading &&
            messages.length > 0 &&
            messages[messages.length - 1].role === "assistant" && (
              <SuggestedResponses
                suggestedResponses={suggestedResponses}
                onSuggestion={handleSetSuggestion}
              />
            )}
        </ScrollArea>
      </CardContent>

      <CardFooter className="pt-3 border-t flex-col gap-2">
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={(e) => handleSetSuggestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex w-full justify-between">
          <Button onClick={handleStartDiagnostic} variant="default" className="w-full">
            {hasSavedData ? "Iniciar Novo Diagnóstico" : "Iniciar Diagnóstico Completo"}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="ml-2"
            onClick={() => handleSetSuggestion("O que é o Fluida Te Entende?")}
          >
            <Sparkles className="h-4 w-4 mr-1 text-amber-500" />
            Fluida Te Entende
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MarketingConsultantChat;
