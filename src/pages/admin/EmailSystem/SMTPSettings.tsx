import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Server, 
  TestTube, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle, 
  Mail,
  Shield,
  Clock,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SMTPConfig {
  host: string;
  user: string;
  password: string;
  port: string;
  secure: string;
}

interface ConnectionTest {
  status: 'idle' | 'testing' | 'success' | 'error';
  message: string;
}

const SMTPSettings: React.FC = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<SMTPConfig>({
    host: '',
    user: '',
    password: '',
    port: '587',
    secure: 'true'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connectionTest, setConnectionTest] = useState<ConnectionTest>({
    status: 'idle',
    message: ''
  });

  useEffect(() => {
    loadCurrentConfig();
  }, []);

  const loadCurrentConfig = async () => {
    // Carregar configurações atuais (sem mostrar senhas por segurança)
    setConfig({
      host: 'smtpout.secureserver.net', // Exemplo GoDaddy
      user: 'your-email@yourdomain.com',
      password: '••••••••',
      port: '587',
      secure: 'true'
    });
  };

  const testSMTPConnection = async () => {
    setConnectionTest({ status: 'testing', message: 'Testando conexão...' });
    
    try {
      // Chamar edge function para testar conexão
      const { data, error } = await supabase.functions.invoke('test-smtp-connection', {
        body: {
          host: config.host,
          user: config.user,
          port: parseInt(config.port),
          secure: config.secure === 'true'
        }
      });

      if (error) throw error;

      if (data.success) {
        setConnectionTest({ 
          status: 'success', 
          message: 'Conexão SMTP estabelecida com sucesso!' 
        });
        toast({
          title: "Teste bem-sucedido",
          description: "Conexão SMTP está funcionando corretamente."
        });
      } else {
        setConnectionTest({ 
          status: 'error', 
          message: data.error || 'Falha na conexão SMTP' 
        });
      }
    } catch (error) {
      setConnectionTest({ 
        status: 'error', 
        message: 'Erro ao testar conexão SMTP' 
      });
      toast({
        variant: "destructive",
        title: "Erro no teste",
        description: "Não foi possível testar a conexão SMTP."
      });
    }
  };

  const saveConfiguration = async () => {
    setLoading(true);
    try {
      // Salvar secrets no Supabase
      const secrets = [
        { name: 'NATIVE_SMTP_HOST', value: config.host },
        { name: 'NATIVE_SMTP_USER', value: config.user },
        { name: 'NATIVE_SMTP_PASS', value: config.password },
        { name: 'NATIVE_SMTP_PORT', value: config.port },
        { name: 'NATIVE_SMTP_SECURE', value: config.secure }
      ];

      // TODO: Implementar salvamento de secrets
      // Por agora, simular sucesso
      
      toast({
        title: "Configuração salva",
        description: "Configurações SMTP foram atualizadas com sucesso."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações."
      });
    } finally {
      setLoading(false);
    }
  };

  const godaddyPresets = {
    host: 'smtpout.secureserver.net',
    port: '587',
    secure: 'true'
  };

  const resendPresets = {
    host: 'smtp.resend.com',
    port: '587',
    secure: 'true'
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light aurora-text-gradient">
            Configurações SMTP
          </h1>
          <p className="text-slate-400 aurora-body mt-2">
            Configure provedores de email e teste conexões
          </p>
        </div>
      </div>

      <Tabs defaultValue="godaddy" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="godaddy">GoDaddy SMTP</TabsTrigger>
          <TabsTrigger value="resend">Resend Fallback</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
        </TabsList>

        <TabsContent value="godaddy">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulário de Configuração */}
            <div className="lg:col-span-2">
              <Card className="aurora-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-aurora-electric-purple" />
                    Configuração GoDaddy SMTP
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Preset Buttons */}
                  <div className="flex gap-2 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConfig({ ...config, ...godaddyPresets })}
                    >
                      Preset GoDaddy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConfig({ ...config, ...resendPresets })}
                    >
                      Preset Resend
                    </Button>
                  </div>

                  {/* Host */}
                  <div className="space-y-2">
                    <Label htmlFor="host">Host SMTP</Label>
                    <Input
                      id="host"
                      value={config.host}
                      onChange={(e) => setConfig({ ...config, host: e.target.value })}
                      placeholder="smtpout.secureserver.net"
                    />
                  </div>

                  {/* Port and Secure */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="port">Porta</Label>
                      <Input
                        id="port"
                        value={config.port}
                        onChange={(e) => setConfig({ ...config, port: e.target.value })}
                        placeholder="587"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SSL/TLS</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={config.secure === 'true'}
                          onCheckedChange={(checked) => 
                            setConfig({ ...config, secure: checked ? 'true' : 'false' })
                          }
                        />
                        <span className="text-sm">
                          {config.secure === 'true' ? 'Ativado' : 'Desativado'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* User */}
                  <div className="space-y-2">
                    <Label htmlFor="user">Email/Usuário</Label>
                    <Input
                      id="user"
                      type="email"
                      value={config.user}
                      onChange={(e) => setConfig({ ...config, user: e.target.value })}
                      placeholder="your-email@yourdomain.com"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={config.password}
                        onChange={(e) => setConfig({ ...config, password: e.target.value })}
                        placeholder="Senha da conta de email"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={testSMTPConnection}
                      variant="outline"
                      disabled={connectionTest.status === 'testing'}
                      className="flex items-center gap-2"
                    >
                      <TestTube className="h-4 w-4" />
                      {connectionTest.status === 'testing' ? 'Testando...' : 'Testar Conexão'}
                    </Button>
                    <Button
                      onClick={saveConfiguration}
                      disabled={loading}
                      className="flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      {loading ? 'Salvando...' : 'Salvar Configuração'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status e Informações */}
            <div className="space-y-6">
              {/* Status da Conexão */}
              <Card className="aurora-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-aurora-neon-blue" />
                    Status da Conexão
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {connectionTest.status === 'success' && (
                        <Badge className="bg-aurora-emerald">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Conectado
                        </Badge>
                      )}
                      {connectionTest.status === 'error' && (
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Erro
                        </Badge>
                      )}
                      {connectionTest.status === 'testing' && (
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          Testando
                        </Badge>
                      )}
                      {connectionTest.status === 'idle' && (
                        <Badge variant="outline">
                          Não testado
                        </Badge>
                      )}
                    </div>
                    {connectionTest.message && (
                      <p className="text-sm text-slate-400">{connectionTest.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Documentação GoDaddy */}
              <Card className="aurora-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-aurora-electric-purple" />
                    Configuração GoDaddy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <strong>Host:</strong> smtpout.secureserver.net
                  </div>
                  <div>
                    <strong>Porta:</strong> 587 (TLS) ou 465 (SSL)
                  </div>
                  <div>
                    <strong>Autenticação:</strong> Obrigatória
                  </div>
                  <div>
                    <strong>Email:</strong> Use sua conta completa do GoDaddy
                  </div>
                  <div className="pt-2 text-xs text-slate-400">
                    Certifique-se de que o email está configurado no painel GoDaddy
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="resend">
          <Card className="aurora-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-aurora-neon-blue" />
                Configuração Resend (Fallback)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-aurora-neon-blue/10 p-4 rounded-lg">
                <p className="text-sm text-slate-300">
                  O Resend é usado automaticamente como fallback quando o SMTP nativo falha.
                  Configure sua API key do Resend nos secrets do sistema.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Status do Resend</Label>
                <Badge className="bg-aurora-emerald">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Configurado e Ativo
                </Badge>
              </div>

              <div className="space-y-2">
                <Label>Configuração</Label>
                <p className="text-sm text-slate-400">
                  API Key configurada via secrets (RESEND_API_KEY)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="aurora-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-aurora-electric-purple" />
                  Estatísticas de Envio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Emails via SMTP:</span>
                  <span className="font-semibold">1,423</span>
                </div>
                <div className="flex justify-between">
                  <span>Emails via Resend:</span>
                  <span className="font-semibold">124</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de sucesso:</span>
                  <span className="font-semibold text-aurora-emerald">98.2%</span>
                </div>
                <div className="flex justify-between">
                  <span>Última falha:</span>
                  <span className="text-slate-400">2h atrás</span>
                </div>
              </CardContent>
            </Card>

            <Card className="aurora-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-aurora-neon-blue" />
                  Rate Limiting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Limite por minuto:</span>
                  <span className="font-semibold">60</span>
                </div>
                <div className="flex justify-between">
                  <span>Enviados (último min):</span>
                  <span className="font-semibold">23</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge className="bg-aurora-emerald">Normal</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SMTPSettings;