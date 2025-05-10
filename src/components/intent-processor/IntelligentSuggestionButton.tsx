
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface IntelligentSuggestionButtonProps {
  onSuggestionReceived?: (suggestionData: any) => void;
  buttonText?: string;
  className?: string;
  userContext?: Record<string, any>;
}

const IntelligentSuggestionButton: React.FC<IntelligentSuggestionButtonProps> = ({
  onSuggestionReceived,
  buttonText = "Me dá uma sugestão inteligente",
  className = "",
  userContext = {}
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Você precisa estar logado",
          description: "Para receber sugestões personalizadas, faça login primeiro.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      const user_id = session.user.id;
      
      // Prepare request data
      const requestData = {
        mensagem_usuario: userContext.mensagem_usuario || "Preciso de ajuda para criar conteúdo",
        user_id,
        dados_usuario: {
          procedimentos: userContext.procedimentos || ["botox", "ultrassom"],
          nivel_digital: userContext.nivel_digital || "médio"
        }
      };
      
      // Call the intent-core function
      const { data, error } = await supabase.functions.invoke("intent-core", {
        body: requestData,
      });
      
      if (error) {
        throw error;
      }
      
      // Save intent to history
      await supabase.from('intent_history').insert({
        user_id,
        mensagem_usuario: requestData.mensagem_usuario,
        intencao_detectada: data.intencao || "Não identificada",
        acao_executada: data.acao_recomendada || "Nenhuma"
      });
      
      // Call the callback with the suggestion data
      if (onSuggestionReceived && data) {
        onSuggestionReceived(data);
      }
      
      // Show success toast
      toast({
        title: "Sugestão inteligente gerada",
        description: "Baseado no seu perfil, temos uma sugestão personalizada.",
      });
      
    } catch (error) {
      console.error("Erro ao gerar sugestão:", error);
      toast({
        title: "Erro ao gerar sugestão",
        description: "Não foi possível processar sua solicitação. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleClick} 
      disabled={loading}
      className={`gap-2 ${className}`}
      variant="default"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Brain className="h-4 w-4" />
      )}
      {buttonText}
    </Button>
  );
};

export default IntelligentSuggestionButton;
