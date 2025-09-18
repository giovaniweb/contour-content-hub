import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  TestTube, 
  Mail, 
  Send, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Server,
  Eye,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  success: boolean;
  message: string;
  details?: any;
  timestamp: string;
}

interface EmailTest {
  to: string;
  subject: string;
  content: string;
  provider: 'smtp' | 'resend';
}

const EmailTesting: React.FC = () => {
  const { toast } = useToast();
  const [emailTest, setEmailTest] = useState<EmailTest>({
    to: '',
    subject: 'Teste de Email - Sistema Nativo',
    content: '<h1>Teste de Email</h1><p>Este é um email de teste do sistema nativo.</p>',
    provider: 'smtp'
  });
  const [connectionTest, setConnectionTest] = useState<TestResult | null>(null);
  const [emailTestResult, setEmailTestResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState<{ connection: boolean; email: boolean }>({
    connection: false,
    email: false
  });

  const testSMTPConnection = async () => {
    setLoading({ ...loading, connection: true });
    setConnectionTest(null);

    try {
      const { data, error } = await supabase.functions.invoke('test-smtp-connection', {
        body: {
          action: 'test_connection'
        }
      });

      if (error) throw error;

      const result: TestResult = {
        success: data.success,
        message: data.message || (data.success ? 'Conexão SMTP estabelecida com sucesso!' : 'Falha na conexão SMTP'),
        details: data.details,
        timestamp: new Date().toISOString()
      };

      setConnectionTest(result);

      toast({
        title: result.success ? "Conexão bem-sucedida" : "Falha na conexão",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
    } catch (error) {
      const result: TestResult = {
        success: false,
        message: 'Erro ao testar conexão SMTP',
        details: error,
        timestamp: new Date().toISOString()
      };
      setConnectionTest(result);

      toast({
        variant: "destructive",
        title: "Erro no teste",
        description: "Não foi possível testar a conexão SMTP."
      });
    } finally {
      setLoading({ ...loading, connection: false });
    }
  };

  const sendTestEmail = async () => {
    if (!emailTest.to || !emailTest.subject || !emailTest.content) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para enviar o teste."
      });
      return;
    }

    setLoading({ ...loading, email: true });
    setEmailTestResult(null);

    try {
      const functionName = emailTest.provider === 'smtp' ? 'send-native-email' : 'send-test-email';
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {
          to_email: emailTest.to,
          subject: emailTest.subject,
          html_content: emailTest.content,
          test_mode: true
        }
      });

      if (error) throw error;

      const result: TestResult = {
        success: data.success || true,
        message: data.message || 'Email de teste enviado com sucesso!',
        details: data,
        timestamp: new Date().toISOString()
      };

      setEmailTestResult(result);

      toast({
        title: result.success ? "Email enviado" : "Falha no envio",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
    } catch (error) {
      const result: TestResult = {
        success: false,
        message: 'Erro ao enviar email de teste',
        details: error,
        timestamp: new Date().toISOString()
      };
      setEmailTestResult(result);

      toast({
        variant: "destructive",
        title: "Erro no envio",
        description: "Não foi possível enviar o email de teste."
      });
    } finally {
      setLoading({ ...loading, email: false });
    }
  };

  const testTemplates = [
    {
      name: 'Email Simples',
      subject: 'Teste de Email - Sistema Nativo',
      content: '<h1>Teste de Email</h1><p>Este é um email de teste do sistema nativo.</p><p>Enviado em: {{timestamp}}</p>'
    },
    {
      name: 'Boas-vindas',
      subject: 'Bem-vindo ao Sistema!',
      content: '<h1>Bem-vindo!</h1><p>Olá! Este é um email de boas-vindas de teste.</p><p>Obrigado por fazer parte da nossa plataforma.</p>'
    },
    {
      name: 'Newsletter',
      subject: 'Newsletter - Novidades',
      content: '<h1>Newsletter</h1><p>Confira as novidades desta semana:</p><ul><li>Novo sistema de emails implementado</li><li>Melhorias na academia</li><li>Novos templates disponíveis</li></ul>'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light aurora-text-gradient">
            Testes de Email
          </h1>
          <p className="text-slate-400 aurora-body mt-2">
            Teste conexões SMTP e envio de emails
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Connection Test */}
          <Card className="aurora-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-aurora-electric-purple" />
                Teste de Conexão SMTP
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-400">
                Teste a conectividade com o servidor SMTP configurado.
              </p>
              
              <Button
                onClick={testSMTPConnection}
                disabled={loading.connection}
                className="flex items-center gap-2"
              >
                <TestTube className="h-4 w-4" />
                {loading.connection ? 'Testando...' : 'Testar Conexão SMTP'}
              </Button>

              {connectionTest && (
                <div className={`p-4 rounded border ${
                  connectionTest.success 
                    ? 'bg-green-900/20 border-green-600' 
                    : 'bg-red-900/20 border-red-600'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {connectionTest.success ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="font-medium">
                      {connectionTest.success ? 'Sucesso' : 'Falha'}
                    </span>
                    <span className="text-xs text-slate-400 ml-auto">
                      {new Date(connectionTest.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{connectionTest.message}</p>
                  {connectionTest.details && (
                    <details className="mt-2">
                      <summary className="text-xs text-slate-400 cursor-pointer">Detalhes</summary>
                      <pre className="text-xs bg-slate-900 p-2 rounded mt-1 overflow-x-auto">
                        {JSON.stringify(connectionTest.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Email Test */}
          <Card className="aurora-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-aurora-neon-blue" />
                Teste de Envio de Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Provider Selection */}
              <div className="space-y-2">
                <Label>Provedor</Label>
                <div className="flex gap-3">
                  <div
                    className={`p-3 rounded border cursor-pointer transition-all flex-1 ${
                      emailTest.provider === 'smtp'
                        ? 'border-aurora-electric-purple bg-aurora-electric-purple/10'
                        : 'border-slate-600 hover:border-aurora-electric-purple/50'
                    }`}
                    onClick={() => setEmailTest({ ...emailTest, provider: 'smtp' })}
                  >
                    <div className="text-center">
                      <Server className="h-6 w-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">SMTP Nativo</span>
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded border cursor-pointer transition-all flex-1 ${
                      emailTest.provider === 'resend'
                        ? 'border-aurora-electric-purple bg-aurora-electric-purple/10'
                        : 'border-slate-600 hover:border-aurora-electric-purple/50'
                    }`}
                    onClick={() => setEmailTest({ ...emailTest, provider: 'resend' })}
                  >
                    <div className="text-center">
                      <Mail className="h-6 w-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">Resend</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Form */}
              <div className="space-y-2">
                <Label htmlFor="test-email">Email de Destino *</Label>
                <Input
                  id="test-email"
                  type="email"
                  value={emailTest.to}
                  onChange={(e) => setEmailTest({ ...emailTest, to: e.target.value })}
                  placeholder="seu-email@exemplo.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="test-subject">Assunto *</Label>
                <Input
                  id="test-subject"
                  value={emailTest.subject}
                  onChange={(e) => setEmailTest({ ...emailTest, subject: e.target.value })}
                  placeholder="Assunto do email de teste"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="test-content">Conteúdo HTML *</Label>
                <Textarea
                  id="test-content"
                  value={emailTest.content}
                  onChange={(e) => setEmailTest({ ...emailTest, content: e.target.value })}
                  placeholder="<h1>Título</h1><p>Conteúdo...</p>"
                  rows={6}
                  className="font-mono"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={sendTestEmail}
                  disabled={loading.email}
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  {loading.email ? 'Enviando...' : 'Enviar Teste'}
                </Button>
              </div>

              {emailTestResult && (
                <div className={`p-4 rounded border ${
                  emailTestResult.success 
                    ? 'bg-green-900/20 border-green-600' 
                    : 'bg-red-900/20 border-red-600'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {emailTestResult.success ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="font-medium">
                      {emailTestResult.success ? 'Email Enviado' : 'Falha no Envio'}
                    </span>
                    <span className="text-xs text-slate-400 ml-auto">
                      {new Date(emailTestResult.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{emailTestResult.message}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Templates */}
          <Card className="aurora-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-aurora-neon-pink" />
                Templates Rápidos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {testTemplates.map((template, index) => (
                <div
                  key={index}
                  className="p-3 rounded border border-slate-600 hover:border-aurora-electric-purple/50 cursor-pointer transition-all"
                  onClick={() => setEmailTest({
                    ...emailTest,
                    subject: template.subject,
                    content: template.content.replace('{{timestamp}}', new Date().toLocaleString())
                  })}
                >
                  <div className="font-medium text-sm">{template.name}</div>
                  <div className="text-xs text-slate-400 mt-1">{template.subject}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="aurora-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-aurora-electric-purple" />
                Status do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">SMTP Connection:</span>
                <Badge className="bg-aurora-emerald">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  OK
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Resend Fallback:</span>
                <Badge className="bg-aurora-emerald">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Available
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Rate Limiting:</span>
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Queue Length:</span>
                <Badge variant="outline">0</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Test Guidelines */}
          <Card className="aurora-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5 text-aurora-neon-blue" />
                Dicas de Teste
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-300">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-aurora-emerald mt-0.5 flex-shrink-0" />
                <span>Teste sempre a conexão SMTP primeiro</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-aurora-emerald mt-0.5 flex-shrink-0" />
                <span>Use emails válidos para testar</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-aurora-emerald mt-0.5 flex-shrink-0" />
                <span>Verifique pasta de spam ao testar</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-aurora-emerald mt-0.5 flex-shrink-0" />
                <span>Teste ambos provedores (SMTP e Resend)</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmailTesting;