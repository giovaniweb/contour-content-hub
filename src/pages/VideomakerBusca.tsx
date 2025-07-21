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
import { Search, MapPin, Phone, Instagram, Video, Camera, DollarSign, Check, X } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

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

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="text-center">Carregando videomakers...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Search className="h-6 w-6" />
                Buscar Videomakers
              </CardTitle>
              <CardDescription>
                Encontre videomakers profissionais na sua região
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
                      className="pl-10"
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

          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredVideomakers.length} videomaker(s) encontrado(s)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideomakers.map((videomaker) => (
              <Card key={videomaker.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{videomaker.nome_completo}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-4 w-4" />
                        {videomaker.cidade}
                      </CardDescription>
                    </div>
                    <Badge variant={videomaker.tipo_profissional === 'videomaker' ? 'default' : 'secondary'}>
                      {videomaker.tipo_profissional === 'videomaker' ? 'Videomaker' : 'Storymaker'}
                    </Badge>
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

                  <Button className="w-full" asChild>
                    <a href={`tel:${videomaker.telefone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Entrar em Contato
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredVideomakers.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Nenhum videomaker encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  Tente ajustar os filtros ou buscar por uma cidade diferente.
                </p>
                <Button
                  onClick={() => {
                    setSearchCity('');
                    setFilterType('all');
                    setFilterInvestment('all');
                  }}
                >
                  Limpar Filtros
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default VideomakerBusca;