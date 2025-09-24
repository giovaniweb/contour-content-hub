import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { checkGiovanniEmail, syncUserEmail } from '@/services/adminService';
import { toast } from 'sonner';
import { Loader2, Mail, User, CheckCircle, AlertCircle, Wrench } from 'lucide-react';

interface GiovanniInfo {
  user_id: string;
  current_email: string;
  name: string;
}

export const GiovanniEmailFix: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [giovanniInfo, setGiovanniInfo] = useState<GiovanniInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fixed, setFixed] = useState(false);

  const handleCheckGiovanni = async () => {
    setLoading(true);
    setError(null);
    setGiovanniInfo(null);
    
    try {
      console.log('🔍 Verificando informações do Giovanni...');
      const result = await checkGiovanniEmail();
      
      if (result.success && result.user_id) {
        setGiovanniInfo({
          user_id: result.user_id,
          current_email: result.current_email || '',
          name: result.name || ''
        });
        toast.success('Informações do Giovanni carregadas com sucesso');
      } else {
        setError(result.error || 'Giovanni não encontrado');
      }
    } catch (err) {
      console.error('Erro ao verificar Giovanni:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      toast.error('Erro ao verificar Giovanni');
    } finally {
      setLoading(false);
    }
  };

  const handleFixEmail = async () => {
    if (!giovanniInfo) return;
    
    setFixing(true);
    try {
      console.log('🔧 Corrigindo email do Giovanni...');
      
      // Email correto que deveria estar nos dois lugares
      const correctEmail = 'giovani@contourline.com.br';
      
      const result = await syncUserEmail(giovanniInfo.user_id, correctEmail);
      
      if (result.success || result.partialSuccess) {
        setFixed(true);
        toast.success('Email do Giovanni sincronizado com sucesso!');
      } else {
        throw new Error(result.error || 'Falha na sincronização');
      }
    } catch (err) {
      console.error('Erro ao corrigir email:', err);
      toast.error(`Erro ao corrigir email: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    } finally {
      setFixing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Correção de Email - Giovanni
        </CardTitle>
        <CardDescription>
          Ferramenta para corrigir a inconsistência do email do Giovanni entre auth.users e perfis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Status Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {fixed && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Email do Giovanni foi sincronizado com sucesso! Agora ele pode fazer reset de senha.
            </AlertDescription>
          </Alert>
        )}

        {/* Check Button */}
        <div className="flex gap-2">
          <Button 
            onClick={handleCheckGiovanni} 
            disabled={loading}
            variant="outline"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <User className="h-4 w-4 mr-2" />
            )}
            Verificar Giovanni
          </Button>
        </div>

        {/* Giovanni Info Display */}
        {giovanniInfo && (
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <h3 className="font-semibold">Informações do Giovanni:</h3>
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Nome:</span>
                <Badge variant="outline">{giovanniInfo.name}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">User ID:</span>
                <code className="text-xs bg-background px-2 py-1 rounded">
                  {giovanniInfo.user_id}
                </code>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Email atual (perfis):</span>
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  <span className="text-sm">{giovanniInfo.current_email}</span>
                </div>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Problema identificado:</strong> O email em <code>auth.users</code> está como 
                <code className="mx-1">giovani@contoulirne.com.br</code> (com erro), 
                mas em <code>perfis</code> está correto como 
                <code className="mx-1">giovani@contourline.com.br</code>.
              </AlertDescription>
            </Alert>

            {!fixed && (
              <Button 
                onClick={handleFixEmail} 
                disabled={fixing}
                className="w-full"
              >
                {fixing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Corrigir Email no auth.users
              </Button>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
          <p><strong>Como funciona:</strong></p>
          <ol className="list-decimal list-inside space-y-1 mt-2">
            <li>Clique em "Verificar Giovanni" para buscar as informações atuais</li>
            <li>Se o problema for confirmado, clique em "Corrigir Email"</li>
            <li>O sistema sincronizará o email correto em auth.users</li>
            <li>Giovanni poderá então fazer reset de senha normalmente</li>
          </ol>
        </div>

      </CardContent>
    </Card>
  );
};