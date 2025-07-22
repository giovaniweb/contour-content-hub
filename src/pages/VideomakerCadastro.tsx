import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { VideomakerFormData, ProfessionalType, InvestmentRange } from '@/types/videomaker';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Video, Camera, Instagram, Phone, MapPin, DollarSign, Sparkles, UserPlus } from 'lucide-react';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import { PhotoUpload } from '@/components/videomaker/PhotoUpload';

const VideomakerCadastro: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<VideomakerFormData>({
    nome_completo: '',
    telefone: '',
    video_referencia_url: '',
    instagram: '',
    cidade: '',
    tipo_profissional: 'videomaker',
    camera_celular: '',
    modelo_microfone: '',
    possui_iluminacao: false,
    emite_nota_fiscal: false,
    valor_diaria: '300-500',
    foto_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Você precisa estar logado para se cadastrar como videomaker');
        navigate('/login');
        return;
      }

      const { error } = await supabase
        .from('videomakers')
        .insert([{
          ...formData,
          user_id: user.id
        }]);

      if (error) {
        if (error.code === '23505') {
          toast.error('Você já possui um perfil de videomaker cadastrado');
        } else {
          toast.error('Erro ao cadastrar videomaker: ' + error.message);
        }
        return;
      }

      toast.success('Perfil de videomaker cadastrado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro inesperado ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof VideomakerFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const statusBadges = [
    {
      icon: UserPlus,
      label: 'Cadastro',
      variant: 'secondary' as const,
      color: 'bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30'
    },
    {
      icon: Sparkles,
      label: 'Seja Encontrado',
      variant: 'secondary' as const,
      color: 'bg-aurora-emerald/20 text-aurora-emerald border-aurora-emerald/30'
    }
  ];

  return (
    <AuroraPageLayout>
      <StandardPageHeader
        icon={Video}
        title="Cadastro de Videomaker"
        subtitle="Cadastre-se como videomaker e seja encontrado por clínicas da sua região"
        statusBadges={statusBadges}
      />
      
      <div className="container mx-auto px-6 py-8">
        <Card className="aurora-glass border-aurora-electric-purple/30 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="aurora-heading text-center">Seus Dados Profissionais</CardTitle>
            <CardDescription className="aurora-body text-center">
              Preencha as informações para criar seu perfil profissional
            </CardDescription>
          </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Dados Pessoais */}
                <div className="space-y-4">
                  <h3 className="aurora-heading-enhanced flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Dados Pessoais
                  </h3>
                  
                  {/* Upload de Foto */}
                  <PhotoUpload
                    currentPhotoUrl={formData.foto_url}
                    onPhotoUpload={(url) => handleInputChange('foto_url', url)}
                    onPhotoRemove={() => handleInputChange('foto_url', '')}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome_completo">Nome Completo *</Label>
                      <Input
                        id="nome_completo"
                        value={formData.nome_completo}
                        onChange={(e) => handleInputChange('nome_completo', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone *</Label>
                      <Input
                        id="telefone"
                        value={formData.telefone}
                        onChange={(e) => handleInputChange('telefone', e.target.value)}
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade *</Label>
                      <Input
                        id="cidade"
                        value={formData.cidade}
                        onChange={(e) => handleInputChange('cidade', e.target.value)}
                        placeholder="São Paulo, SP"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tipo_profissional">Tipo de Profissional *</Label>
                      <Select
                        value={formData.tipo_profissional}
                        onValueChange={(value: ProfessionalType) => handleInputChange('tipo_profissional', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="videomaker">Videomaker</SelectItem>
                          <SelectItem value="storymaker">Storymaker</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram</Label>
                      <div className="relative">
                        <Instagram className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="instagram"
                          value={formData.instagram}
                          onChange={(e) => handleInputChange('instagram', e.target.value)}
                          placeholder="@seuusuario"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="video_referencia_url">Vídeo de Referência (URL)</Label>
                      <Input
                        id="video_referencia_url"
                        type="url"
                        value={formData.video_referencia_url}
                        onChange={(e) => handleInputChange('video_referencia_url', e.target.value)}
                        placeholder="https://youtube.com/..."
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Equipamentos */}
                <div className="space-y-4">
                  <h3 className="aurora-heading-enhanced flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Equipamentos
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="camera_celular">Câmera ou Celular *</Label>
                      <Input
                        id="camera_celular"
                        value={formData.camera_celular}
                        onChange={(e) => handleInputChange('camera_celular', e.target.value)}
                        placeholder="iPhone 15, Canon EOS R5, etc."
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="modelo_microfone">Modelo do Microfone</Label>
                      <Input
                        id="modelo_microfone"
                        value={formData.modelo_microfone}
                        onChange={(e) => handleInputChange('modelo_microfone', e.target.value)}
                        placeholder="Rode VideoMic Pro+, etc."
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="possui_iluminacao"
                        checked={formData.possui_iluminacao}
                        onCheckedChange={(checked) => handleInputChange('possui_iluminacao', checked)}
                      />
                      <Label htmlFor="possui_iluminacao">Possui Iluminação</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="emite_nota_fiscal"
                        checked={formData.emite_nota_fiscal}
                        onCheckedChange={(checked) => handleInputChange('emite_nota_fiscal', checked)}
                      />
                      <Label htmlFor="emite_nota_fiscal">Emite Nota Fiscal</Label>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Investimento */}
                <div className="space-y-4">
                  <h3 className="aurora-heading-enhanced flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Investimento
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="valor_diaria">Valor da Diária *</Label>
                    <Select
                      value={formData.valor_diaria}
                      onValueChange={(value: InvestmentRange) => handleInputChange('valor_diaria', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="300-500">R$ 300 a R$ 500</SelectItem>
                        <SelectItem value="500-800">R$ 500 a R$ 800</SelectItem>
                        <SelectItem value="800-1000">R$ 800 a R$ 1.000</SelectItem>
                        <SelectItem value="1000-1200">R$ 1.000 a R$ 1.200</SelectItem>
                        <SelectItem value="acima-1200">Acima de R$ 1.200</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 aurora-button-enhanced"
                  >
                    {loading ? 'Cadastrando...' : 'Cadastrar Perfil'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuroraPageLayout>
  );
};

export default VideomakerCadastro;