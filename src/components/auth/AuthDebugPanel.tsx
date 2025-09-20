import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, RefreshCw, Bug, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const AuthDebugPanel: React.FC = () => {
  const { user, session, isAuthenticated, isLoading, refreshAuth, validateAuthState, debugAuth } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<boolean | null>(null);

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const result = await validateAuthState();
      setValidationResult(result);
      if (result) {
        toast.success('Estado de autenticação válido!');
      } else {
        toast.warning('Estado de autenticação inválido ou inconsistente');
      }
    } catch (error) {
      console.error('Erro na validação:', error);
      toast.error('Erro ao validar estado de autenticação');
    } finally {
      setIsValidating(false);
    }
  };

  const handleDebugConsole = () => {
    debugAuth();
    toast.info('Informações de debug enviadas para o console');
  };

  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bug className="h-5 w-5" />
                Auth Debug Panel
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Status Overview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Status da Autenticação</div>
                <div className="flex items-center gap-2">
                  {isAuthenticated ? (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Autenticado
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="h-3 w-3 mr-1" />
                      Não Autenticado
                    </Badge>
                  )}
                  {isLoading && (
                    <Badge variant="secondary">
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Carregando
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Validação</div>
                <div className="flex items-center gap-2">
                  {validationResult === true && (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Válido
                    </Badge>
                  )}
                  {validationResult === false && (
                    <Badge variant="destructive">
                      <XCircle className="h-3 w-3 mr-1" />
                      Inválido
                    </Badge>
                  )}
                  {validationResult === null && (
                    <Badge variant="outline">Não testado</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* User Information */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Informações do Usuário</div>
              <div className="bg-muted/50 rounded p-3 space-y-1 text-sm">
                <div><strong>ID:</strong> {user?.id || 'N/A'}</div>
                <div><strong>Nome:</strong> {user?.nome || 'N/A'}</div>
                <div><strong>Email:</strong> {user?.email || 'N/A'}</div>
                <div><strong>Role:</strong> {user?.role || 'N/A'}</div>
                <div><strong>Workspace:</strong> {user?.workspace_id || 'N/A'}</div>
              </div>
            </div>

            {/* Session Information */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Informações da Sessão</div>
              <div className="bg-muted/50 rounded p-3 space-y-1 text-sm">
                <div><strong>Sessão Ativa:</strong> {session ? 'Sim' : 'Não'}</div>
                <div><strong>User ID da Sessão:</strong> {session?.user?.id || 'N/A'}</div>
                <div><strong>Email da Sessão:</strong> {session?.user?.email || 'N/A'}</div>
                {session?.expires_at && (
                  <div><strong>Expira em:</strong> {new Date(session.expires_at * 1000).toLocaleString()}</div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleValidate}
                disabled={isValidating}
              >
                {isValidating ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Validar Estado
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshAuth}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Completo
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDebugConsole}
              >
                <Bug className="h-4 w-4 mr-2" />
                Debug Console
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default AuthDebugPanel;