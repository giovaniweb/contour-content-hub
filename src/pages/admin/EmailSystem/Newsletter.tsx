import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Send, 
  Users, 
  Mail, 
  Calendar, 
  Settings, 
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  UserCheck
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface NewsletterCampaign {
  subject: string;
  html_content: string;
  target_audience: string;
  batch_size: number;
  delay_between_batches: number;
  scheduled_for?: string;
}

interface UserStats {
  total: number;
  active: number;
  premium: number;
  academy: number;
}

const Newsletter: React.FC = () => {
  const { toast } = useToast();
  const [campaign, setCampaign] = useState<NewsletterCampaign>({
    subject: '',
    html_content: '',
    target_audience: 'all',
    batch_size: 50,
    delay_between_batches: 5
  });
  const [userStats, setUserStats] = useState<UserStats>({
    total: 0,
    active: 0,
    premium: 0,
    academy: 0
  });
  const [loading, setLoading] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [sendImmediate, setSendImmediate] = useState(true);

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      // Carregar estatísticas de usuários
      const { data: totalUsers } = await supabase
        .from('perfis')
        .select('id, role')
        .neq('role', 'admin');

      if (totalUsers) {
        setUserStats({
          total: totalUsers.length,
          active: totalUsers.filter(u => u.role !== 'inactive').length,
          premium: totalUsers.filter(u => u.role === 'premium').length,
          academy: totalUsers.filter(u => u.role === 'student').length
        });
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const getTargetCount = () => {
    switch (campaign.target_audience) {
      case 'all':
        return userStats.total;
      case 'active':
        return userStats.active;
      case 'premium':
        return userStats.premium;
      case 'academy':
        return userStats.academy;
      default:
        return 0;
    }
  };

  const sendNewsletter = async () => {
    if (!campaign.subject || !campaign.html_content) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Assunto e conteúdo são obrigatórios."
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-newsletter', {
        body: {
          subject: campaign.subject,
          html_content: campaign.html_content,
          target_audience: campaign.target_audience,
          batch_size: campaign.batch_size,
          delay_between_batches: campaign.delay_between_batches,
          scheduled_for: campaign.scheduled_for
        }
      });

      if (error) throw error;

      toast({
        title: "Newsletter enviada",
        description: `Newsletter enviada para ${getTargetCount()} usuários com sucesso.`
      });

      // Reset form
      setCampaign({
        subject: '',
        html_content: '',
        target_audience: 'all',
        batch_size: 50,
        delay_between_batches: 5
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar",
        description: "Não foi possível enviar a newsletter."
      });
    } finally {
      setLoading(false);
    }
  };

  const previewNewsletter = () => {
    if (!campaign.html_content) {
      toast({
        variant: "destructive",
        title: "Sem conteúdo",
        description: "Adicione conteúdo HTML para visualizar o preview."
      });
      return;
    }
    setPreviewing(true);
  };

  const audienceOptions = [
    { value: 'all', label: 'Todos os Usuários', count: userStats.total },
    { value: 'active', label: 'Usuários Ativos', count: userStats.active },
    { value: 'premium', label: 'Usuários Premium', count: userStats.premium },
    { value: 'academy', label: 'Usuários da Academia', count: userStats.academy }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light aurora-text-gradient">
            Newsletter
          </h1>
          <p className="text-slate-400 aurora-body mt-2">
            Criar e enviar campanhas de newsletter para usuários
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="aurora-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-aurora-electric-purple" />
                Criar Campanha
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject">Assunto *</Label>
                <Input
                  id="subject"
                  value={campaign.subject}
                  onChange={(e) => setCampaign({ ...campaign, subject: e.target.value })}
                  placeholder="Assunto da newsletter..."
                />
              </div>

              {/* Target Audience */}
              <div className="space-y-2">
                <Label>Público Alvo *</Label>
                <div className="grid grid-cols-2 gap-3">
                  {audienceOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`p-3 rounded border cursor-pointer transition-all ${
                        campaign.target_audience === option.value
                          ? 'border-aurora-electric-purple bg-aurora-electric-purple/10'
                          : 'border-slate-600 hover:border-aurora-electric-purple/50'
                      }`}
                      onClick={() => setCampaign({ ...campaign, target_audience: option.value })}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{option.label}</span>
                        <Badge variant="outline">{option.count}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* HTML Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo HTML *</Label>
                <Textarea
                  id="content"
                  value={campaign.html_content}
                  onChange={(e) => setCampaign({ ...campaign, html_content: e.target.value })}
                  placeholder="<h1>Título da Newsletter</h1><p>Conteúdo...</p>"
                  rows={10}
                  className="font-mono"
                />
              </div>

              {/* Batch Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batch-size">Tamanho do Lote</Label>
                  <Input
                    id="batch-size"
                    type="number"
                    value={campaign.batch_size}
                    onChange={(e) => setCampaign({ ...campaign, batch_size: parseInt(e.target.value) })}
                    min="1"
                    max="100"
                  />
                  <p className="text-xs text-slate-400">Emails por lote (max: 100)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delay">Delay entre Lotes (seg)</Label>
                  <Input
                    id="delay"
                    type="number"
                    value={campaign.delay_between_batches}
                    onChange={(e) => setCampaign({ ...campaign, delay_between_batches: parseInt(e.target.value) })}
                    min="1"
                    max="60"
                  />
                  <p className="text-xs text-slate-400">Segundos de espera</p>
                </div>
              </div>

              {/* Scheduling */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="immediate"
                    checked={sendImmediate}
                    onCheckedChange={(checked) => setSendImmediate(checked === true)}
                  />
                  <Label htmlFor="immediate">Enviar Imediatamente</Label>
                </div>
                {!sendImmediate && (
                  <div>
                    <Label htmlFor="scheduled">Agendar Para</Label>
                    <Input
                      id="scheduled"
                      type="datetime-local"
                      value={campaign.scheduled_for}
                      onChange={(e) => setCampaign({ ...campaign, scheduled_for: e.target.value })}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={previewNewsletter}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
                <Button
                  onClick={sendNewsletter}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  {loading ? 'Enviando...' : sendImmediate ? 'Enviar Agora' : 'Agendar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Campaign Summary */}
          <Card className="aurora-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-aurora-neon-blue" />
                Resumo da Campanha
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Destinatários:</span>
                <span className="font-semibold">{getTargetCount()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Lotes:</span>
                <span className="font-semibold">
                  {Math.ceil(getTargetCount() / campaign.batch_size)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tempo estimado:</span>
                <span className="font-semibold">
                  {Math.ceil((getTargetCount() / campaign.batch_size) * campaign.delay_between_batches / 60)} min
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <Badge variant="outline">
                  {sendImmediate ? 'Envio Imediato' : 'Agendado'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* User Statistics */}
          <Card className="aurora-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-aurora-emerald" />
                Estatísticas de Usuários
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Total de Usuários:</span>
                <span className="font-semibold">{userStats.total}</span>
              </div>
              <div className="flex justify-between">
                <span>Usuários Ativos:</span>
                <span className="font-semibold text-aurora-emerald">{userStats.active}</span>
              </div>
              <div className="flex justify-between">
                <span>Usuários Premium:</span>
                <span className="font-semibold text-aurora-neon-blue">{userStats.premium}</span>
              </div>
              <div className="flex justify-between">
                <span>Academia:</span>
                <span className="font-semibold text-aurora-electric-purple">{userStats.academy}</span>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card className="aurora-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-aurora-neon-pink" />
                Boas Práticas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-300">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-aurora-emerald mt-0.5 flex-shrink-0" />
                <span>Use assuntos claros e descritivos</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-aurora-emerald mt-0.5 flex-shrink-0" />
                <span>Segmente sua audiência adequadamente</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-aurora-emerald mt-0.5 flex-shrink-0" />
                <span>Teste sempre antes de enviar</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-aurora-emerald mt-0.5 flex-shrink-0" />
                <span>Use lotes pequenos para evitar spam</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Modal */}
      {previewing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Preview da Newsletter</h3>
                <Button variant="outline" onClick={() => setPreviewing(false)}>
                  Fechar
                </Button>
              </div>
              <p className="text-slate-400 mt-1">Assunto: {campaign.subject}</p>
            </div>
            <div className="p-6">
              <div 
                className="bg-white text-black p-6 rounded"
                dangerouslySetInnerHTML={{ __html: campaign.html_content }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Newsletter;