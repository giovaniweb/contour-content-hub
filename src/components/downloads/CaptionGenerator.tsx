import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Copy, 
  RefreshCw, 
  Instagram,
  Wand2,
  User,
  Briefcase,
  Heart
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Equipment {
  id: string;
  nome: string;
}

interface CaptionGeneratorProps {
  imageUrl: string;
  equipments?: Equipment[];
  onCaptionGenerated?: (caption: string, hashtags: string) => void;
}

const CaptionGenerator: React.FC<CaptionGeneratorProps> = ({ 
  imageUrl, 
  equipments = [],
  onCaptionGenerated 
}) => {
  const [generating, setGenerating] = useState(false);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [style, setStyle] = useState('criativo');
  const [audience, setAudience] = useState('geral');
  const { toast } = useToast();

  const styleOptions = [
    { value: 'criativo', label: 'Criativo', icon: <Wand2 className="h-4 w-4" /> },
    { value: 'profissional', label: 'Profissional', icon: <Briefcase className="h-4 w-4" /> },
    { value: 'casual', label: 'Casual', icon: <User className="h-4 w-4" /> },
    { value: 'inspiracional', label: 'Inspiracional', icon: <Heart className="h-4 w-4" /> }
  ];

  const audienceOptions = [
    { value: 'geral', label: 'Público Geral' },
    { value: 'jovem', label: 'Jovem (18-30 anos)' },
    { value: 'corporativo', label: 'Corporativo/B2B' },
    { value: 'lifestyle', label: 'Lifestyle' }
  ];

  const generateCaption = async () => {
    setGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-image-caption', {
        body: {
          imageUrl: `https://mksvzhgqnsjfolvskibq.supabase.co/storage/v1/object/public/downloads/${imageUrl}`,
          style,
          audience,
          equipments: equipments.map(eq => eq.nome)
        }
      });

      if (error) throw error;

      if (data.success) {
        setCaption(data.caption);
        setHashtags(data.hashtags);
        
        if (onCaptionGenerated) {
          onCaptionGenerated(data.caption, data.hashtags);
        }

        toast({
          title: "Legenda gerada!",
          description: "Sua legenda personalizada foi criada com sucesso.",
        });
      } else {
        throw new Error(data.error || 'Erro ao gerar legenda');
      }
    } catch (error) {
      console.error('Error generating caption:', error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar legenda",
        description: "Não foi possível gerar a legenda. Tente novamente.",
      });
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${type} copiado para a área de transferência.`,
    });
  };

  const copyFullContent = () => {
    const fullContent = `${caption}\n\n${hashtags}`;
    copyToClipboard(fullContent, 'Conteúdo completo');
  };

  return (
    <Card className="aurora-glass backdrop-blur-md bg-slate-800/70 border-2 border-aurora-electric-purple/50 rounded-lg shadow-lg shadow-aurora-electric-purple/20">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-2">
          <Instagram className="h-5 w-5 text-aurora-electric-purple" />
          Gerador de Legenda IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white font-medium">Estilo da Legenda</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="bg-slate-800/70 border-aurora-electric-purple/30 text-white hover:bg-slate-800/90">
                <SelectValue placeholder="Selecione o estilo" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-aurora-electric-purple/30">
                {styleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-white hover:bg-slate-700">
                    <div className="flex items-center gap-2">
                      {option.icon}
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white font-medium">Público-Alvo</Label>
            <Select value={audience} onValueChange={setAudience}>
              <SelectTrigger className="bg-slate-800/70 border-aurora-electric-purple/30 text-white hover:bg-slate-800/90">
                <SelectValue placeholder="Selecione o público" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-aurora-electric-purple/30">
                {audienceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-white hover:bg-slate-700">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateCaption}
          disabled={generating}
          className="w-full aurora-button aurora-glow hover:aurora-glow-intense"
        >
          {generating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Analisando imagem...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Gerar Legenda
            </>
          )}
        </Button>

        {/* Results */}
        {(caption || hashtags) && (
          <div className="space-y-4">
            {/* Caption */}
            {caption && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Legenda</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(caption, 'Legenda')}
                    className="h-8 px-3 border-aurora-electric-purple/30 text-white"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copiar
                  </Button>
                </div>
                <Textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="bg-slate-800/70 border-aurora-electric-purple/30 text-white resize-none min-h-[100px]"
                  rows={4}
                  placeholder="Sua legenda aparecerá aqui..."
                />
              </div>
            )}

            {/* Hashtags */}
            {hashtags && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Hashtags</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(hashtags, 'Hashtags')}
                    className="h-8 px-3 border-aurora-emerald/30 text-white"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copiar
                  </Button>
                </div>
                <Textarea
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  className="bg-slate-800/50 border-aurora-emerald/30 text-white resize-none"
                  rows={3}
                  placeholder="As hashtags aparecerão aqui..."
                />
              </div>
            )}

            {/* Copy All Button */}
            <Button
              onClick={copyFullContent}
              variant="outline"
              className="w-full border-aurora-neon-blue/30 text-aurora-neon-blue hover:bg-aurora-neon-blue/20"
            >
              <Instagram className="h-4 w-4 mr-2" />
              Copiar Tudo para Instagram
            </Button>

            {/* Style indicators */}
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30">
                {styleOptions.find(s => s.value === style)?.label}
              </Badge>
              <Badge className="bg-aurora-emerald/20 text-aurora-emerald border-aurora-emerald/30">
                {audienceOptions.find(a => a.value === audience)?.label}
              </Badge>
            </div>
          </div>
        )}

        {/* Equipment info */}
        {equipments.length > 0 && (
          <div className="text-sm text-white/60 bg-aurora-neon-blue/10 rounded-lg p-3">
            <p className="mb-2">🏥 <strong>Equipamentos relacionados:</strong></p>
            <div className="flex flex-wrap gap-1">
              {equipments.map((equipment) => (
                <Badge key={equipment.id} variant="outline" className="text-aurora-neon-blue border-aurora-neon-blue/30 text-xs">
                  {equipment.nome}
                </Badge>
              ))}
            </div>
            <p className="mt-2 text-xs">A IA utilizará essas informações para criar legendas mais específicas.</p>
          </div>
        )}

        {/* Help text */}
        <div className="text-sm text-white/60 bg-aurora-electric-purple/10 rounded-lg p-3">
          <p className="mb-1">💡 <strong>Dica:</strong> A IA analisa sua imagem e cria legendas personalizadas!</p>
          <p>• Você pode editar o texto gerado antes de copiar</p>
          <p>• Experimente diferentes estilos para variar o tom</p>
          <p>• As hashtags são escolhidas com base no conteúdo da imagem</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaptionGenerator;