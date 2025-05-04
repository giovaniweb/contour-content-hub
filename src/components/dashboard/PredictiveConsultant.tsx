
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MessageSquare, Lightbulb, TrendingUp, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface Suggestion {
  id: string;
  title: string;
  message: string;
  type: 'equipment' | 'content' | 'strategy' | 'motivation';
  actionText: string;
  actionPath: string;
  isNew: boolean;
}

const PredictiveConsultant: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Simulated data - In a real implementation, this would come from the backend
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const mockSuggestions: Suggestion[] = [
        {
          id: '1',
          title: 'Associação de equipamentos',
          message: 'Vejo que você tem usado o Hipro para papada. Já pensou em associar com o Unyque Pro para resultados de firmeza mais visíveis?',
          type: 'equipment',
          actionText: 'Ver roteiro para Instagram',
          actionPath: '/custom-gpt?preset=hipro_unyque',
          isNew: true
        },
        {
          id: '2',
          title: 'Crescimento notável!',
          message: 'Você está crescendo muito com o Hipro! E me permita dizer: depois que começou com a Fluida, seu marketing ficou afiado. Como consultor, indico considerar o Ultralift como próximo passo.',
          type: 'strategy',
          actionText: 'Conhecer o Ultralift',
          actionPath: '/admin/content?tab=equipment&id=ultralift',
          isNew: true
        },
        {
          id: '3',
          title: 'Retome suas postagens',
          message: 'Lembra que você me contou que queria ver sua clínica com mais movimento? Notei que você está há alguns dias sem postar. Posso te ajudar a voltar com uma campanha de volta à ativa com o que você já tem?',
          type: 'motivation',
          actionText: 'Criar campanha de reativação',
          actionPath: '/marketing-consultant',
          isNew: false
        }
      ];
      
      setSuggestions(mockSuggestions);
      setLoading(false);
    }, 1500);
  }, []);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    
    // Mark as read (in a real implementation, this would update the database)
    setSuggestions(prev => 
      prev.map(s => s.id === suggestion.id ? {...s, isNew: false} : s)
    );
  };

  const handleActionClick = (suggestion: Suggestion) => {
    toast({
      title: "Ação iniciada",
      description: `Redirecionando para ${suggestion.actionText}...`,
    });
    navigate(suggestion.actionPath);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'equipment':
        return <Sparkles className="h-4 w-4 text-yellow-500" />;
      case 'content':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'strategy':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'motivation':
        return <Lightbulb className="h-4 w-4 text-purple-500" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'equipment':
        return 'Equipamento';
      case 'content':
        return 'Conteúdo';
      case 'strategy':
        return 'Estratégia';
      case 'motivation':
        return 'Motivação';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <Card className="w-full h-[320px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Analisando seus dados...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Fluida Te Entende
            <Badge variant="outline" className="ml-2 bg-primary/10 text-xs">
              Novo
            </Badge>
          </CardTitle>
          {suggestions.some(s => s.isNew) && (
            <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-200">
              {suggestions.filter(s => s.isNew).length} novas
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="grid grid-cols-1 gap-0 p-0">
        <div className="flex h-[240px]">
          {/* Suggestions list */}
          <div className={`border-r ${selectedSuggestion ? 'hidden md:block md:w-1/3' : 'w-full'}`}>
            <div className="h-full overflow-auto">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`p-3 border-b cursor-pointer flex items-center gap-3 hover:bg-muted/50 transition-colors ${
                    selectedSuggestion?.id === suggestion.id ? 'bg-muted/50' : ''
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    suggestion.type === 'equipment' ? 'bg-yellow-100' :
                    suggestion.type === 'content' ? 'bg-blue-100' :
                    suggestion.type === 'strategy' ? 'bg-green-100' :
                    'bg-purple-100'
                  }`}>
                    {getIconForType(suggestion.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">{suggestion.title}</p>
                      {suggestion.isNew && (
                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {suggestion.message.substring(0, 50)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected suggestion detail */}
          {selectedSuggestion ? (
            <div className="flex-1 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`
                  ${selectedSuggestion.type === 'equipment' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                    selectedSuggestion.type === 'content' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                    selectedSuggestion.type === 'strategy' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                    'bg-purple-100 text-purple-800 hover:bg-purple-200'}
                `}>
                  {getTypeLabel(selectedSuggestion.type)}
                </Badge>
                <h3 className="font-medium">{selectedSuggestion.title}</h3>
              </div>
              
              <div className="flex gap-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="bg-muted p-3 rounded-lg text-sm">
                  {selectedSuggestion.message}
                </div>
              </div>
              
              <Button 
                onClick={() => handleActionClick(selectedSuggestion)}
                className="w-full"
              >
                {selectedSuggestion.actionText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center p-4 text-center">
              <div className="max-w-xs">
                <p className="text-muted-foreground text-sm">
                  Selecione uma sugestão para ver os detalhes e ações recomendadas
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-3">
        <p className="text-xs text-muted-foreground">
          Baseado nos seus padrões de uso e objetivos
        </p>
        <Button variant="link" size="sm" onClick={() => navigate('/marketing-consultant')}>
          Consultor de Marketing
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PredictiveConsultant;
