import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Star, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { VideomakerAvaliacao } from '@/types/videomaker';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  value, 
  onChange, 
  readonly = false,
  size = 'md' 
}) => {
  const [hoverValue, setHoverValue] = useState(0);
  const sizeClass = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} cursor-pointer transition-colors ${
            star <= (hoverValue || value)
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-muted-foreground'
          }`}
          onMouseEnter={() => !readonly && setHoverValue(star)}
          onMouseLeave={() => !readonly && setHoverValue(0)}
          onClick={() => !readonly && onChange?.(star)}
        />
      ))}
    </div>
  );
};

interface VideomakerRatingProps {
  videomaker: {
    id: string;
    nome_completo: string;
    media_avaliacao: number;
    total_avaliacoes: number;
  };
  onRatingSubmitted?: () => void;
}

export const VideomakerRating: React.FC<VideomakerRatingProps> = ({
  videomaker,
  onRatingSubmitted
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Por favor, selecione uma avaliação');
      return;
    }

    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Você precisa estar logado para avaliar');
        return;
      }

      const { error } = await supabase
        .from('videomaker_avaliacoes')
        .upsert({
          videomaker_id: videomaker.id,
          avaliador_id: user.id,
          nota: rating,
          comentario: comment.trim() || null
        });

      if (error) {
        toast.error('Erro ao salvar avaliação: ' + error.message);
        return;
      }

      toast.success('Avaliação enviada com sucesso!');
      setIsOpen(false);
      setRating(0);
      setComment('');
      onRatingSubmitted?.();

    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro inesperado ao enviar avaliação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Star className="h-4 w-4" />
          Avaliar Videomaker
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Avaliar {videomaker.nome_completo}</DialogTitle>
          <DialogDescription>
            Compartilhe sua experiência para ajudar outros usuários
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nota (obrigatório)</Label>
            <div className="flex items-center gap-2">
              <StarRating value={rating} onChange={setRating} size="lg" />
              {rating > 0 && (
                <span className="text-sm text-muted-foreground">
                  {rating === 1 && 'Muito Ruim'}
                  {rating === 2 && 'Ruim'}
                  {rating === 3 && 'Regular'}
                  {rating === 4 && 'Bom'}
                  {rating === 5 && 'Excelente'}
                </span>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comment">Comentário (opcional)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte como foi sua experiência..."
              rows={3}
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || rating === 0}
            className="flex-1"
          >
            {loading ? 'Enviando...' : 'Enviar Avaliação'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface AvaliacoesListProps {
  videomaker_id: string;
}

export const AvaliacoesList: React.FC<AvaliacoesListProps> = ({ videomaker_id }) => {
  const [avaliacoes, setAvaliacoes] = useState<VideomakerAvaliacao[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchAvaliacoes();
  }, [videomaker_id]);

  const fetchAvaliacoes = async () => {
    try {
      const { data, error } = await supabase
        .from('videomaker_avaliacoes')
        .select('*')
        .eq('videomaker_id', videomaker_id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Erro ao buscar avaliações:', error);
        return;
      }

      setAvaliacoes(data || []);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Carregando avaliações...</div>;
  }

  if (avaliacoes.length === 0) {
    return (
      <div className="text-center py-4">
        <MessageCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Ainda não há avaliações</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-sm">Avaliações Recentes</h4>
      <div className="space-y-3">
        {avaliacoes.map((avaliacao) => (
          <Card key={avaliacao.id} className="p-3">
            <div className="flex items-start justify-between mb-2">
              <StarRating value={avaliacao.nota} readonly size="sm" />
              <Badge variant="outline" className="text-xs">
                {new Date(avaliacao.created_at).toLocaleDateString('pt-BR')}
              </Badge>
            </div>
            {avaliacao.comentario && (
              <p className="text-sm text-muted-foreground">{avaliacao.comentario}</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};