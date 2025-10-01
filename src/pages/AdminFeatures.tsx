import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { usePermissions } from '@/hooks/use-permissions';
import { AppFeature, FeatureStatus } from '@/hooks/useFeatureAccess';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldAlert, History, Save } from 'lucide-react';
import { FeatureBadge } from '@/components/access-control/FeatureBadge';

interface FeaturePermissionRow {
  feature: AppFeature;
  status: FeatureStatus;
  user_count: number;
}

interface StatusChangeLog {
  id: string;
  feature: string;
  old_status: FeatureStatus | null;
  new_status: FeatureStatus;
  changed_at: string;
  changed_by: string;
  notes: string | null;
  affected_users_count: number;
  admin_name?: string;
}

const FEATURE_LABELS: Record<AppFeature, string> = {
  mestre_beleza: 'FluiChat',
  consultor_mkt: 'FluiMKT',
  fluida_roteirista: 'FluiRoteiro',
  videos: 'FluiVideos',
  fotos: 'FluiFotos',
  artes: 'FluiArtes',
  artigos_cientificos: 'FluiArtigos',
  academia: 'FluiAulas',
  equipamentos: 'Equipamentos',
  fotos_antes_depois: 'Fotos Antes/Depois',
  reports: 'Relatórios',
  planner: 'Planejador',
  ideas: 'Ideias',
};

export default function AdminFeatures() {
  const navigate = useNavigate();
  const { isAdmin } = usePermissions();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [features, setFeatures] = useState<FeaturePermissionRow[]>([]);
  const [statusChanges, setStatusChanges] = useState<Partial<Record<AppFeature, FeatureStatus>>>({});
  const [notes, setNotes] = useState<Partial<Record<AppFeature, string>>>({});
  const [logs, setLogs] = useState<StatusChangeLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const adminStatus = await isAdmin();
    setIsAdminUser(adminStatus);
    
    if (!adminStatus) {
      toast({
        title: 'Acesso negado',
        description: 'Você não tem permissão para acessar esta página.',
        variant: 'destructive',
      });
      navigate('/dashboard');
      return;
    }

    await loadFeatures();
    await loadLogs();
  };

  const loadFeatures = async () => {
    try {
      setLoading(true);
      
      // Get all features with their current status and user count
      const { data, error } = await supabase
        .from('user_feature_permissions')
        .select('feature, status, user_id');

      if (error) throw error;

      // Group by feature and count users
      const featureMap = new Map<AppFeature, { status: FeatureStatus; count: number }>();
      
      data?.forEach((row) => {
        const existing = featureMap.get(row.feature as AppFeature);
        if (!existing) {
          featureMap.set(row.feature as AppFeature, { status: row.status as FeatureStatus, count: 1 });
        } else {
          existing.count++;
        }
      });

      const featuresList: FeaturePermissionRow[] = Array.from(featureMap.entries()).map(([feature, data]) => ({
        feature,
        status: data.status,
        user_count: data.count,
      }));

      setFeatures(featuresList);
    } catch (error) {
      console.error('Error loading features:', error);
      toast({
        title: 'Erro ao carregar features',
        description: 'Não foi possível carregar a lista de features.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('feature_status_changes')
        .select(`
          id,
          feature,
          old_status,
          new_status,
          changed_at,
          changed_by,
          notes,
          affected_users_count
        `)
        .order('changed_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Fetch admin names
      const adminIds = [...new Set(data?.map((log) => log.changed_by))];
      const { data: profiles } = await supabase
        .from('perfis')
        .select('id, nome')
        .in('id', adminIds);

      const profileMap = new Map(profiles?.map((p) => [p.id, p.nome]));

      const logsWithNames = data?.map((log) => ({
        ...log,
        admin_name: profileMap.get(log.changed_by) || 'Admin',
      })) || [];

      setLogs(logsWithNames);
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  };

  const handleStatusChange = (feature: AppFeature, newStatus: FeatureStatus) => {
    setStatusChanges((prev) => ({ ...prev, [feature]: newStatus }));
  };

  const handleSave = async (feature: AppFeature) => {
    const newStatus = statusChanges[feature];
    if (!newStatus) return;

    try {
      setSaving(feature);

      const { data, error } = await supabase.functions.invoke('update-feature-status', {
        body: {
          feature,
          newStatus,
          notes: notes[feature] || null,
        },
      });

      if (error) throw error;

      toast({
        title: 'Status atualizado',
        description: `Feature "${FEATURE_LABELS[feature]}" atualizada para ${newStatus}. ${data.affectedUsersCount} usuários afetados.`,
      });

      // Clear pending changes
      setStatusChanges((prev) => {
        const updated = { ...prev };
        delete updated[feature];
        return updated;
      });
      setNotes((prev) => {
        const updated = { ...prev };
        delete updated[feature];
        return updated;
      });

      // Reload data
      await loadFeatures();
      await loadLogs();
    } catch (error: any) {
      console.error('Error updating feature status:', error);
      toast({
        title: 'Erro ao atualizar',
        description: error.message || 'Não foi possível atualizar o status da feature.',
        variant: 'destructive',
      });
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdminUser) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-primary" />
            Gerenciamento de Features
          </h1>
          <p className="text-muted-foreground mt-2">
            Controle o status global de cada feature do sistema
          </p>
        </div>
        <Button variant="outline" onClick={() => setShowLogs(!showLogs)}>
          <History className="w-4 h-4 mr-2" />
          {showLogs ? 'Ocultar' : 'Ver'} Histórico
        </Button>
      </div>

      {/* Logs Section */}
      {showLogs && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Histórico de Alterações</CardTitle>
            <CardDescription>Últimas 50 mudanças de status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start justify-between border-b pb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{FEATURE_LABELS[log.feature as AppFeature]}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {log.old_status && <FeatureBadge status={log.old_status} variant="compact" />}
                        <span className="mx-2">→</span>
                        <FeatureBadge status={log.new_status} variant="compact" />
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Por: {log.admin_name} • {new Date(log.changed_at).toLocaleString('pt-BR')} • {log.affected_users_count} usuários
                    </p>
                    {log.notes && <p className="text-sm mt-1 italic">"{log.notes}"</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features List */}
      <div className="grid gap-4">
        {features.map((feature) => {
          const currentStatus = statusChanges[feature.feature] || feature.status;
          const hasChanges = statusChanges[feature.feature] && statusChanges[feature.feature] !== feature.status;
          const isSaving = saving === feature.feature;

          return (
            <Card key={feature.feature}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle>{FEATURE_LABELS[feature.feature]}</CardTitle>
                    <FeatureBadge status={feature.status} />
                  </div>
                  <Badge variant="secondary">{feature.user_count} usuários</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Novo Status</label>
                    <Select
                      value={currentStatus}
                      onValueChange={(value) => handleStatusChange(feature.feature, value as FeatureStatus)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blocked">🔒 Bloqueado</SelectItem>
                        <SelectItem value="coming_soon">⏳ Em breve</SelectItem>
                        <SelectItem value="beta">🧪 BETA</SelectItem>
                        <SelectItem value="released">✅ Liberado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Observações (opcional)</label>
                    <Textarea
                      placeholder="Motivo da alteração..."
                      value={notes[feature.feature] || ''}
                      onChange={(e) => setNotes((prev) => ({ ...prev, [feature.feature]: e.target.value }))}
                      rows={2}
                    />
                  </div>
                </div>

                {hasChanges && (
                  <Button
                    onClick={() => handleSave(feature.feature)}
                    disabled={isSaving}
                    className="w-full"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Alterações
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
