import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Videomaker, ProfessionalType, InvestmentRange } from '@/types/videomaker';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Search, MapPin, Phone, Instagram, Video, Camera, DollarSign, Check, X, MessageCircle, User, Sparkles, Users } from 'lucide-react';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import { StarRating, VideomakerRating, AvaliacoesList } from '@/components/videomaker/StarRating';

const VideomakerBusca: React.FC = () => {
  const [videomakers, setVideomakers] = useState<Videomaker[]>([]);
  const [filteredVideomakers, setFilteredVideomakers] = useState<Videomaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [filterType, setFilterType] = useState<ProfessionalType | 'all'>('all');
  const [filterInvestment, setFilterInvestment] = useState<InvestmentRange | 'all'>('all');

  useEffect(() => {
    fetchVideomakers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [videomakers, searchCity, filterType, filterInvestment]);

  const fetchVideomakers = async () => {
    try {
      const { data, error } = await supabase
        .from('videomakers')
        .select('*')
        .eq('ativo', true)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Erro ao buscar videomakers: ' + error.message);
        return;
      }

      setVideomakers(data || []);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro inesperado ao buscar videomakers');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = videomakers;

    // Filtro por cidade
    if (searchCity.trim()) {
      filtered = filtered.filter(vm => 
        vm.cidade.toLowerCase().includes(searchCity.toLowerCase())
      );
    }

    // Filtro por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(vm => vm.tipo_profissional === filterType);
    }

    // Filtro por investimento
    if (filterInvestment !== 'all') {
      filtered = filtered.filter(vm => vm.valor_diaria === filterInvestment);
    }

    setFilteredVideomakers(filtered);
  };

  const formatInvestment = (range: InvestmentRange) => {
    const ranges = {
      '300-500': 'R$ 300 - R$ 500',
      '500-800': 'R$ 500 - R$ 800',
      '800-1000': 'R$ 800 - R$ 1.000',
      '1000-1200': 'R$ 1.000 - R$ 1.200',
      'acima-1200': 'Acima de R$ 1.200'
    };
    return ranges[range];
  };

  const formatPhone = (phone: string) => {
    // Formato básico para telefone brasileiro
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  const generateWhatsAppLink = (phone: string, videomakerName: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Olá ${videomakerName}! Vi seu perfil na plataforma e gostaria de conversar sobre um projeto de vídeo. Você está disponível?`
    );
    return `https://wa.me/55${cleanPhone}?text=${message}`;
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="text-center">Carregando videomakers...</div>
        </div>
      </AppLayout>
    );
  }

  const statusBadges = [
    {
      icon: Users,
      label: `${filteredVideomakers.length} Videomakers`,
      variant: 'secondary' as const,
      color: 'bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30'
    },
    {
      icon: Sparkles,
      label: 'Profissionais',
      variant: 'secondary' as const,
      color: 'bg-aurora-emerald/20 text-aurora-emerald border-aurora-emerald/30'
    }
  ];

  return (
    <AuroraPageLayout>
      <StandardPageHeader
        icon={Search}
        title="Buscar Videomakers"
        subtitle="Encontre videomakers profissionais na sua região"
        statusBadges={statusBadges}
      />
      
      <div className="container mx-auto px-6 py-8">
        <Card className="aurora-glass border-aurora-electric-purple/30 mb-6">
          <CardHeader>
            <CardTitle className="aurora-heading flex items-center gap-2">
              <Search className="h-6 w-6" />
              Filtros de Busca
            </CardTitle>
            <CardDescription className="aurora-body">
              Use os filtros para encontrar o videomaker ideal
            </CardDescription>
          </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="searchCity">Cidade</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="searchCity"
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      placeholder="Digite a cidade..."
                      className="pl-10 aurora-input"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="filterType">Tipo</Label>
                  <Select
                    value={filterType}
                    onValueChange={(value: ProfessionalType | 'all') => setFilterType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="videomaker">Videomaker</SelectItem>
                      <SelectItem value="storymaker">Storymaker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="filterInvestment">Faixa de Preço</Label>
                  <Select
                    value={filterInvestment}
                    onValueChange={(value: InvestmentRange | 'all') => setFilterInvestment(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="300-500">R$ 300 - R$ 500</SelectItem>
                      <SelectItem value="500-800">R$ 500 - R$ 800</SelectItem>
                      <SelectItem value="800-1000">R$ 800 - R$ 1.000</SelectItem>
                      <SelectItem value="1000-1200">R$ 1.000 - R$ 1.200</SelectItem>
                      <SelectItem value="acima-1200">Acima de R$ 1.200</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mb-6">
            <p className="text-sm aurora-body">
              {filteredVideomakers.length} videomaker(s) encontrado(s)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideomakers.map((videomaker) => (
              <Card key={videomaker.id} className="aurora-glass border-aurora-electric-purple/30 hover:border-aurora-electric-purple/60 transition-all">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    {/* Foto do videomaker */}
                    <div className="w-16 h-16 rounded-full aurora-glass border border-aurora-electric-purple/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {videomaker.foto_url ? (
                        <img
                          src={videomaker.foto_url}
                          alt={videomaker.nome_completo}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-8 w-8 text-aurora-electric-purple" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg truncate aurora-heading">{videomaker.nome_completo}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1 aurora-body">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{videomaker.cidade}</span>
                          </CardDescription>
                        </div>
                        <Badge variant={videomaker.tipo_profissional === 'videomaker' ? 'default' : 'secondary'}>
                          {videomaker.tipo_profissional === 'videomaker' ? 'Videomaker' : 'Storymaker'}
                        </Badge>
                      </div>
                      
                      {/* Avaliação */}
                      {videomaker.total_avaliacoes > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          <StarRating value={videomaker.media_avaliacao} readonly size="sm" />
                          <span className="text-sm text-muted-foreground">
                            {videomaker.media_avaliacao} ({videomaker.total_avaliacoes} avaliações)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Contato */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{formatPhone(videomaker.telefone)}</span>
                    </div>
                    
                    {videomaker.instagram && (
                      <div className="flex items-center gap-2 text-sm">
                        <Instagram className="h-4 w-4 text-muted-foreground" />
                        <span>{videomaker.instagram}</span>
                      </div>
                    )}
                    
                    {videomaker.video_referencia_url && (
                      <div className="flex items-center gap-2 text-sm">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={videomaker.video_referencia_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Ver vídeo de referência
                        </a>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Equipamentos */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm flex items-center gap-1">
                      <Camera className="h-4 w-4" />
                      Equipamentos
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div><strong>Câmera:</strong> {videomaker.camera_celular}</div>
                      {videomaker.modelo_microfone && (
                        <div><strong>Microfone:</strong> {videomaker.modelo_microfone}</div>
                      )}
                      <div className="flex gap-2 mt-2">
                        <Badge variant={videomaker.possui_iluminacao ? 'default' : 'secondary'} className="text-xs">
                          {videomaker.possui_iluminacao ? (
                            <>
                              <Check className="h-3 w-3 mr-1" />
                              Iluminação
                            </>
                          ) : (
                            <>
                              <X className="h-3 w-3 mr-1" />
                              Sem iluminação
                            </>
                          )}
                        </Badge>
                        <Badge variant={videomaker.emite_nota_fiscal ? 'default' : 'secondary'} className="text-xs">
                          {videomaker.emite_nota_fiscal ? (
                            <>
                              <Check className="h-3 w-3 mr-1" />
                              Nota Fiscal
                            </>
                          ) : (
                            <>
                              <X className="h-3 w-3 mr-1" />
                              Sem NF
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Investimento */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      Valor da Diária
                    </h4>
                    <div className="text-lg font-bold text-primary">
                      {formatInvestment(videomaker.valor_diaria)}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" asChild>
                      <a 
                        href={generateWhatsAppLink(videomaker.telefone, videomaker.nome_completo)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp
                      </a>
                    </Button>
                    
                    <VideomakerRating
                      videomaker={videomaker}
                      onRatingSubmitted={() => fetchVideomakers()}
                    />
                  </div>
                  
                  {/* Lista de avaliações */}
                  <AvaliacoesList videomaker_id={videomaker.id} />
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredVideomakers.length === 0 && (
            <Card className="aurora-glass border-aurora-electric-purple/30">
              <CardContent className="text-center py-12">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg aurora-glass border border-aurora-electric-purple/30">
                  <Search className="h-6 w-6 text-aurora-electric-purple" />
                </div>
                <h3 className="text-lg font-semibold mb-2 aurora-heading">Nenhum videomaker encontrado</h3>
                <p className="aurora-body mb-4">
                  Tente ajustar os filtros ou buscar por uma cidade diferente.
                </p>
                <Button
                  onClick={() => {
                    setSearchCity('');
                    setFilterType('all');
                    setFilterInvestment('all');
                  }}
                  className="aurora-button-enhanced"
                >
                  Limpar Filtros
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AuroraPageLayout>
  );
};

export default VideomakerBusca;