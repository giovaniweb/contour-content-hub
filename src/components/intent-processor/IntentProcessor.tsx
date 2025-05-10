
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { useIntentProcessor, UserContext, IntentProcessorResult } from '@/hooks/useIntentProcessor';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, upsertUserProfile } from '@/services/userProfileService';

interface IntentProcessorProps {
  initialContext?: UserContext;
  onResult?: (result: IntentProcessorResult) => void;
}

const IntentProcessor: React.FC<IntentProcessorProps> = ({ 
  initialContext = {},
  onResult
}) => {
  const [userMessage, setUserMessage] = useState(initialContext.mensagem_usuario || '');
  const [userContext, setUserContext] = useState<UserContext>(initialContext);
  const { processIntent, loading, result } = useIntentProcessor();
  const navigate = useNavigate();

  useEffect(() => {
    // Carregar o perfil do usuário ao montar o componente
    const loadUserProfile = async () => {
      const profile = await getUserProfile();
      if (profile) {
        // Mesclar dados do perfil com o contexto inicial
        setUserContext(prevContext => ({
          ...prevContext,
          estilo_preferido: prevContext.estilo_preferido || profile.estilo_preferido || undefined,
          tipos_conteudo_validados: prevContext.tipos_conteudo_validados || profile.tipos_conteudo_validados || undefined,
          foco_comunicacao: prevContext.foco_comunicacao || profile.foco_comunicacao || undefined,
          perfil_comportamental: prevContext.perfil_comportamental || profile.perfil_comportamental || undefined,
          insights_performance: prevContext.insights_performance || profile.insights_performance || undefined,
        }));
      }
    };

    loadUserProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Atualize o contexto com a mensagem atual
    const updatedContext = {
      ...userContext,
      mensagem_usuario: userMessage
    };
    
    setUserContext(updatedContext);
    
    // Processa a intenção
    const intentResult = await processIntent(updatedContext);
    
    // Notifica o componente pai se necessário
    if (onResult) {
      onResult(intentResult);
    }
  };

  const handleActionClick = () => {
    if (!result) return;
    
    // Navega para a página apropriada ou executa a ação recomendada
    switch (result.acao_recomendada) {
      case 'script_generator':
        navigate('/script-generator', { state: { ideaText: userMessage } });
        break;
      case 'marketing_consultant':
        navigate('/marketing-consultant');
        break;
      case 'content_explorer':
      case 'scientific_content':
        navigate('/content-planner');
        break;
      case 'sales_script_generator':
        // Assumindo que há ou haverá uma página específica para scripts de vendas
        navigate('/script-generator', { 
          state: { 
            ideaText: userMessage, 
            objective: 'sales' 
          } 
        });
        break;
      default:
        navigate('/dashboard');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Fluida Intelligence Core
        </CardTitle>
        <CardDescription>
          O que você gostaria de criar ou saber hoje?
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Textarea
            placeholder="Descreva sua necessidade ou ideia em detalhes..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            className="min-h-[120px] resize-y"
          />
          
          {result && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Análise da Fluida Intelligence:</h3>
              <p className="text-sm text-muted-foreground mb-2">{result.explicacao}</p>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="text-xs">
                  <span className="font-semibold">Estratégia: </span>
                  <span className="bg-primary/20 px-2 py-0.5 rounded text-primary-foreground">
                    {result.direcionamento_estrategico === 'branding' ? 'Fortalecimento de marca' : 
                     result.direcionamento_estrategico === 'venda' ? 'Vendas' : 'Educação'}
                  </span>
                </div>
                <div className="text-xs">
                  <span className="font-semibold">Categoria: </span>
                  <span className="bg-secondary/20 px-2 py-0.5 rounded">
                    {result.categoria}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <p className="text-xs text-muted-foreground">
            Baseado nos seus padrões de uso e objetivos
          </p>
          
          {!result ? (
            <Button type="submit" disabled={loading || !userMessage.trim()}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando
                </>
              ) : (
                <>
                  Analisar intenção
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleActionClick} variant="default">
              {result.acao_recomendada === 'script_generator' ? 'Criar roteiro' : 
               result.acao_recomendada === 'marketing_consultant' ? 'Consultor de marketing' : 
               result.acao_recomendada === 'content_explorer' ? 'Explorar conteúdo' :
               result.acao_recomendada === 'scientific_content' ? 'Ver pesquisas' :
               'Próximo passo'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export default IntentProcessor;
