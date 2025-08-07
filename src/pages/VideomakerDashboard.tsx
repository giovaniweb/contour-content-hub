import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Video, 
  Eye, 
  Star, 
  MessageSquare, 
  Edit, 
  LogOut, 
  TrendingUp,
  User,
  Phone,
  MapPin,
  Camera,
  DollarSign
} from 'lucide-react';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import { Videomaker } from '@/types/videomaker';

const VideomakerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [videomaker, setVideomaker] = useState<Videomaker | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadVideomakerData();
  }, []);

  const loadVideomakerData = async () => {
    try {
      // Verificar se está logado
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast.error('Você precisa estar logado');
        navigate('/videomaker/login');
        return;
      }

      setUser(user);

      // Buscar dados do videomaker
      const { data: videomakeData, error: videomakerError } = await supabase
        .from('videomakers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (videomakerError) {
        toast.error('Perfil de videomaker não encontrado');
        navigate('/videomaker/cadastro');
        return;
      }

      setVideomaker(videomakeData);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logout realizado com sucesso');
      navigate('/videomaker/login');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  const formatValorDiaria = (valor: string) => {
    const ranges = {
      '300-500': 'R$ 300 a R$ 500',
      '500-800': 'R$ 500 a R$ 800',
      '800-1000': 'R$ 800 a R$ 1.000',
      '1000-1200': 'R$ 1.000 a R$ 1.200',
      'acima-1200': 'Acima de R$ 1.200'
    };
    return ranges[valor as keyof typeof ranges] || valor;
  };

  const statusBadges = [
    {
      icon: User,
      label: 'Dashboard',
      variant: 'secondary' as const,
      color: 'bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30'
    }
  ];

  if (loading) {
    return (
      <AuroraPageLayout>
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <p className="aurora-body">Carregando...</p>
          </div>
        </div>
      </AuroraPageLayout>
    );
  }

  if (!videomaker) {
    return (
      <AuroraPageLayout>
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <p className="aurora-body">Perfil não encontrado</p>
            <Button onClick={() => navigate('/videomaker/cadastro')}>
              Fazer Cadastro
            </Button>
          </div>
        </div>
      </AuroraPageLayout>
    );
  }

  return (
    <AuroraPageLayout>
      <StandardPageHeader
        icon={Video}
        title="Dashboard Videomaker"
        subtitle="Gerencie seu perfil e acompanhe suas métricas"
        statusBadges={statusBadges}
      />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header com ações */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="aurora-heading-enhanced">Olá, {videomaker.nome_completo}!</h1>
            <p className="aurora-body text-muted-foreground">
              {videomaker.tipo_profissional === 'videomaker' ? 'Videomaker' : 'Storymaker'} em {videomaker.cidade}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/videomaker/editar')}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar Perfil
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>

        {/* Cards de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="aurora-glass border-aurora-electric-purple/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-aurora-electric-purple/20 rounded-lg">
                  <Eye className="h-6 w-6 text-aurora-electric-purple" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Visualizações</p>
                  <p className="text-2xl font-bold">127</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="aurora-glass border-aurora-emerald/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-aurora-emerald/20 rounded-lg">
                  <Star className="h-6 w-6 text-aurora-emerald" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avaliações</p>
                  <p className="text-2xl font-bold">{videomaker.total_avaliacoes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="aurora-glass border-aurora-solar-flare/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-aurora-solar-flare/20 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-aurora-solar-flare" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nota Média</p>
                  <p className="text-2xl font-bold">{videomaker.media_avaliacao.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="aurora-glass border-aurora-cosmic-blue/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-aurora-cosmic-blue/20 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-aurora-cosmic-blue" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Comentários</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informações do perfil */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Dados Pessoais */}
          <Card className="aurora-glass border-aurora-electric-purple/30">
            <CardHeader>
              <CardTitle className="aurora-heading flex items-center gap-2">
                <User className="h-5 w-5" />
                Dados Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="aurora-body">{videomaker.telefone}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="aurora-body">{videomaker.cidade}</span>
              </div>
              
              {videomaker.instagram && (
                <div className="flex items-center gap-3">
                  <span className="text-sm">@</span>
                  <span className="aurora-body">{videomaker.instagram}</span>
                </div>
              )}
              
              <div>
                <Badge variant="secondary">
                  {videomaker.tipo_profissional === 'videomaker' ? 'Videomaker' : 'Storymaker'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Equipamentos e Serviços */}
          <Card className="aurora-glass border-aurora-emerald/30">
            <CardHeader>
              <CardTitle className="aurora-heading flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Equipamentos e Serviços
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Câmera/Celular</p>
                <p className="aurora-body">{videomaker.camera_celular}</p>
              </div>
              
              {videomaker.modelo_microfone && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Microfone</p>
                  <p className="aurora-body">{videomaker.modelo_microfone}</p>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {videomaker.possui_iluminacao && (
                  <Badge variant="outline">Possui Iluminação</Badge>
                )}
                {videomaker.emite_nota_fiscal && (
                  <Badge variant="outline">Emite Nota Fiscal</Badge>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="aurora-body font-medium">
                  {formatValorDiaria(videomaker.valor_diaria)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuroraPageLayout>
  );
};

export default VideomakerDashboard;