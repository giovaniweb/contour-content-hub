
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThumbsUp, ThumbsDown, Minus, TrendingUp, Users, Eye, Heart, MessageCircle, Share, Bookmark } from 'lucide-react';
import { approvedScriptsService } from '@/services/approvedScriptsService';

interface EnhancedFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scriptId?: string;
  onFeedbackSubmitted?: (rating: string) => void;
}

const EnhancedFeedbackDialog: React.FC<EnhancedFeedbackDialogProps> = ({
  open,
  onOpenChange,
  scriptId,
  onFeedbackSubmitted
}) => {
  const [rating, setRating] = useState<'bombou' | 'flopou' | 'neutro'>('neutro');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Métricas
  const [metrics, setMetrics] = useState({
    views: '',
    likes: '',
    comments: '',
    shares: '',
    saves: '',
    reach: '',
    impressions: '',
    engagement_rate: '',
    conversion_rate: ''
  });

  const handleMetricChange = (key: string, value: string) => {
    setMetrics(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!scriptId) return;
    
    setIsSubmitting(true);
    
    // Converter métricas string para números
    const numericMetrics = Object.entries(metrics).reduce((acc, [key, value]) => {
      if (value && !isNaN(Number(value))) {
        acc[key] = Number(value);
      }
      return acc;
    }, {} as any);

    const result = await approvedScriptsService.addPerformanceRating(
      scriptId,
      rating,
      numericMetrics,
      notes
    );

    if (result) {
      onFeedbackSubmitted?.(rating);
      onOpenChange(false);
      // Reset form
      setRating('neutro');
      setNotes('');
      setMetrics({
        views: '', likes: '', comments: '', shares: '', saves: '',
        reach: '', impressions: '', engagement_rate: '', conversion_rate: ''
      });
    }
    
    setIsSubmitting(false);
  };

  const getRatingColor = (ratingType: string) => {
    switch (ratingType) {
      case 'bombou': return 'text-green-500 bg-green-50 border-green-200';
      case 'flopou': return 'text-red-500 bg-red-50 border-red-200';
      default: return 'text-yellow-500 bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Avaliação de Performance do Roteiro
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="rating" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rating">Avaliação Geral</TabsTrigger>
            <TabsTrigger value="metrics">Métricas Detalhadas</TabsTrigger>
          </TabsList>

          <TabsContent value="rating" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium mb-3 block">Como foi a performance?</Label>
                <div className="flex gap-3">
                  <Button
                    variant={rating === 'bombou' ? 'default' : 'outline'}
                    onClick={() => setRating('bombou')}
                    className={`flex-1 h-16 flex-col gap-2 ${rating === 'bombou' ? 'bg-green-500 hover:bg-green-600' : ''}`}
                  >
                    <ThumbsUp className="h-5 w-5" />
                    <span className="font-semibold">BOMBOU! 🚀</span>
                  </Button>
                  
                  <Button
                    variant={rating === 'neutro' ? 'default' : 'outline'}
                    onClick={() => setRating('neutro')}
                    className={`flex-1 h-16 flex-col gap-2 ${rating === 'neutro' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}`}
                  >
                    <Minus className="h-5 w-5" />
                    <span className="font-semibold">NEUTRO 😐</span>
                  </Button>
                  
                  <Button
                    variant={rating === 'flopou' ? 'default' : 'outline'}
                    onClick={() => setRating('flopou')}
                    className={`flex-1 h-16 flex-col gap-2 ${rating === 'flopou' ? 'bg-red-500 hover:bg-red-600' : ''}`}
                  >
                    <ThumbsDown className="h-5 w-5" />
                    <span className="font-semibold">FLOPOU 📉</span>
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-lg border-2 border-dashed">
                <Badge className={`mb-3 ${getRatingColor(rating)}`}>
                  Status: {rating.toUpperCase()}
                </Badge>
                <div className="text-sm text-gray-600">
                  {rating === 'bombou' && '🎉 Ótimo! Este roteiro teve excelente performance. A IA vai aprender com este sucesso!'}
                  {rating === 'neutro' && '👍 Performance regular. Pode ser útil para referência futura.'}
                  {rating === 'flopou' && '📊 Performance baixa. A IA vai evitar patterns similares no futuro.'}
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Observações (opcional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Adicione detalhes sobre o que funcionou ou não funcionou..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Visualizações
                </Label>
                <Input
                  type="number"
                  placeholder="Ex: 1000"
                  value={metrics.views}
                  onChange={(e) => handleMetricChange('views', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Alcance
                </Label>
                <Input
                  type="number"
                  placeholder="Ex: 800"
                  value={metrics.reach}
                  onChange={(e) => handleMetricChange('reach', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Curtidas
                </Label>
                <Input
                  type="number"
                  placeholder="Ex: 50"
                  value={metrics.likes}
                  onChange={(e) => handleMetricChange('likes', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Comentários
                </Label>
                <Input
                  type="number"
                  placeholder="Ex: 10"
                  value={metrics.comments}
                  onChange={(e) => handleMetricChange('comments', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Share className="h-4 w-4" />
                  Compartilhamentos
                </Label>
                <Input
                  type="number"
                  placeholder="Ex: 5"
                  value={metrics.shares}
                  onChange={(e) => handleMetricChange('shares', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  Salvamentos
                </Label>
                <Input
                  type="number"
                  placeholder="Ex: 15"
                  value={metrics.saves}
                  onChange={(e) => handleMetricChange('saves', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Taxa de Engajamento (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Ex: 3.5"
                  value={metrics.engagement_rate}
                  onChange={(e) => handleMetricChange('engagement_rate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Taxa de Conversão (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Ex: 1.2"
                  value={metrics.conversion_rate}
                  onChange={(e) => handleMetricChange('conversion_rate', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Avaliação'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedFeedbackDialog;
