
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, TestTube } from 'lucide-react';
import { generateScript, testOpenAIConnection } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';

const ScriptGeneratorTest: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testResult, setTestResult] = useState<string>('');
  const { toast } = useToast();

  const handleTestConnection = async () => {
    setIsTesting(true);
    setConnectionStatus('testing');
    
    try {
      console.log('Iniciando teste de conexão OpenAI...');
      
      const testRequest = {
        type: 'test',
        topic: 'Teste de integração OpenAI',
        tone: 'profissional',
        marketingObjective: '🟢 Criar Conexão'
      };

      const response = await generateScript(testRequest);
      
      console.log('Teste bem-sucedido:', response);
      
      setConnectionStatus('success');
      setTestResult(response.content);
      
      toast({
        title: "✅ OpenAI Funcionando!",
        description: "A integração com OpenAI está funcionando perfeitamente.",
      });
      
    } catch (error) {
      console.error('Teste falhou:', error);
      setConnectionStatus('error');
      setTestResult(error instanceof Error ? error.message : 'Erro desconhecido');
      
      toast({
        title: "❌ Erro na Integração",
        description: error instanceof Error ? error.message : "Falha ao conectar com OpenAI",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'testing':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <TestTube className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'testing':
        return 'Testando conexão...';
      case 'success':
        return 'Conexão funcionando!';
      case 'error':
        return 'Erro na conexão';
      default:
        return 'Pronto para testar';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Teste de Integração OpenAI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <span className="font-medium">{getStatusText()}</span>
          </div>
          <Button 
            onClick={handleTestConnection}
            disabled={isTesting}
            variant={connectionStatus === 'success' ? 'outline' : 'default'}
          >
            {isTesting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Testando...
              </>
            ) : (
              <>
                <TestTube className="h-4 w-4 mr-2" />
                Testar Conexão
              </>
            )}
          </Button>
        </div>

        {connectionStatus === 'success' && testResult && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Teste bem-sucedido! Resposta da OpenAI:</p>
                <div className="bg-muted p-3 rounded text-sm">
                  {testResult.substring(0, 200)}...
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {connectionStatus === 'error' && testResult && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Erro detectado:</p>
                <div className="bg-destructive/10 p-3 rounded text-sm">
                  {testResult}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-muted-foreground">
          <p>Este teste verifica se:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>A chave OpenAI está configurada corretamente</li>
            <li>A edge function está funcionando</li>
            <li>A comunicação com a API OpenAI está ativa</li>
            <li>O sistema consegue gerar roteiros</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScriptGeneratorTest;
