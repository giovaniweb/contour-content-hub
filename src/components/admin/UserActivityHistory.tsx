import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  Activity, 
  Calendar, 
  Clock, 
  User,
  Video,
  Download,
  FileText,
  Zap
} from 'lucide-react';

interface UserActivityHistoryProps {
  userId: string;
}

interface ActivityItem {
  id: string;
  action_type: string;
  target_type?: string;
  target_id?: string;
  metadata?: any;
  created_at: string;
  xp_awarded?: number;
}

const UserActivityHistory: React.FC<UserActivityHistoryProps> = ({ userId }) => {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['user-activities', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_actions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    }
  });

  const getActivityIcon = (actionType: string) => {
    switch (actionType) {
      case 'video_watch':
      case 'video_download':
        return <Video className="h-4 w-4" />;
      case 'diagnostic_complete':
        return <Zap className="h-4 w-4" />;
      case 'article_view':
        return <FileText className="h-4 w-4" />;
      case 'photo_upload':
        return <Download className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityLabel = (actionType: string) => {
    const labels: Record<string, string> = {
      'video_watch': 'Assistiu vídeo',
      'video_download': 'Baixou vídeo', 
      'diagnostic_complete': 'Completou diagnóstico',
      'article_view': 'Visualizou artigo',
      'photo_upload': 'Fez upload de foto',
      'equipment_view': 'Visualizou equipamento',
      'login': 'Fez login',
      'profile_update': 'Atualizou perfil'
    };
    
    return labels[actionType] || actionType;
  };

  const getActivityColor = (actionType: string) => {
    switch (actionType) {
      case 'video_watch':
        return 'bg-blue-100 text-blue-800';
      case 'video_download':
        return 'bg-green-100 text-green-800';
      case 'diagnostic_complete':
        return 'bg-purple-100 text-purple-800';
      case 'article_view':
        return 'bg-orange-100 text-orange-800';
      case 'photo_upload':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (days > 0) return `${days}d atrás`;
    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}min atrás`;
    return 'Agora mesmo';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">
                  {activities.filter(a => a.action_type === 'video_watch').length}
                </p>
                <p className="text-sm text-muted-foreground">Vídeos Assistidos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">
                  {activities.filter(a => a.action_type === 'diagnostic_complete').length}
                </p>
                <p className="text-sm text-muted-foreground">Diagnósticos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {activities.filter(a => a.action_type === 'video_download').length}
                </p>
                <p className="text-sm text-muted-foreground">Downloads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">
                  {activities.reduce((sum, a) => sum + (a.xp_awarded || 0), 0)}
                </p>
                <p className="text-sm text-muted-foreground">XP Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Histórico de Atividades
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma atividade registrada ainda.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    {getActivityIcon(activity.action_type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getActivityColor(activity.action_type)}>
                        {getActivityLabel(activity.action_type)}
                      </Badge>
                      {activity.xp_awarded && (
                        <Badge variant="outline">
                          +{activity.xp_awarded} XP
                        </Badge>
                      )}
                    </div>
                    
                    {activity.metadata && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {typeof activity.metadata === 'object' ? 
                          (activity.metadata as any)?.title || (activity.metadata as any)?.name || 'Sem detalhes' :
                          'Sem detalhes'
                        }
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(activity.created_at)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(activity.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserActivityHistory;