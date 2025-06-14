
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Sparkles, 
  Copy, 
  Download, 
  RefreshCw, 
  Image as ImageIcon,
  CheckCircle,
  Star,
  Calendar,
  BarChart3,
  ThumbsUp
} from 'lucide-react';
import CarouselFormatter from '@/components/fluidaroteirista/components/CarouselFormatter';
import Stories10xFormatter from '@/components/fluidaroteirista/components/Stories10xFormatter';
import ScriptMetrics from '@/components/fluidaroteirista/components/ScriptMetrics';
import FeedbackDialog from '@/components/script/FeedbackDialog';
import { parseAndLimitCarousel } from '@/components/fluidaroteirista/utils/carouselParser';
import { parseStories10xSlides } from '@/components/fluidaroteirista/utils/stories10xParser';
import { useToast } from '@/hooks/use-toast';
import { approvedScriptsService } from '@/services/approvedScriptsService';

interface EnhancedScriptResultsProps {
  results: any[];
  onScriptApproved?: (script: any) => void;
  onNewScript: () => void;
  onGenerateImage?: (script: any) => void;
}

const EnhancedScriptResults: React.FC<EnhancedScriptResultsProps> = ({
  results,
  onScriptApproved,
  onNewScript,
  onGenerateImage
}) => {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [selectedScript, setSelectedScript] = useState<any>(null);
  const [approvalTitle, setApprovalTitle] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [isApprovingScript, setIsApprovingScript] = useState(false);
  const { toast } = useToast();

  const handleCopyScript = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "✅ Copiado!",
      description: "Roteiro copiado para a área de transferência",
    });
  };

  const handleApproveScript = async (script: any) => {
    setSelectedScript(script);
    setApprovalTitle(`Roteiro ${script.formato} - ${script.emocao_central}`);
    setApprovalDialogOpen(true);
  };

  const confirmApproval = async () => {
    if (!selectedScript || !approvalTitle.trim()) return;

    setIsApprovingScript(true);
    
    const approvedScript = await approvedScriptsService.createApprovedScript({
      script_content: selectedScript.roteiro,
      title: approvalTitle,
      format: selectedScript.formato,
      equipment_used: selectedScript.equipamentos_utilizados?.map((eq: any) => eq.nome) || []
    });

    if (approvedScript) {
      toast({
        title: "🎉 Roteiro Aprovado!",
        description: "Roteiro salvo na biblioteca de aprovados",
      });
      
      onScriptApproved?.(approvedScript);
      setApprovalDialogOpen(false);
      setApprovalTitle('');
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível aprovar o roteiro",
        variant: "destructive"
      });
    }
    
    setIsApprovingScript(false);
  };

  const handleSubmitFeedback = async (feedback: string, approved: boolean) => {
    setIsSubmittingFeedback(true);
    
    // Simular envio de feedback
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: approved ? "✅ Roteiro Aprovado!" : "📝 Feedback Enviado",
      description: approved 
        ? "Roteiro foi aprovado e salvo para uso futuro" 
        : "Seu feedback foi registrado para melhorar a IA",
    });
    
    setFeedbackOpen(false);
    setIsSubmittingFeedback(false);
  };

  if (!results || results.length === 0) {
    return null;
  }

  const script = results[0];
  const isCarousel = script.formato === 'carrossel';
  const isStories10x = script.formato === 'stories_10x';

  // Calcular métricas do script
  const wordCount = script.roteiro?.split(' ').length || 0;
  const estimatedTime = Math.ceil(wordCount / 2.5); // ~150 palavras por minuto
  const isWithinTimeLimit = estimatedTime <= 60;

  return (
    <div className="space-y-6">
      {/* Header com ações principais */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Roteiro FLUIDA Gerado! ✨
          </h2>
          <p className="text-gray-600">
            {script.formato?.toUpperCase()} • {script.emocao_central} • {script.mentor}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleApproveScript(script)}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Aprovar Roteiro
          </Button>
          
          <Button
            onClick={() => setFeedbackOpen(true)}
            variant="outline"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Dar Feedback
          </Button>
          
          <Button onClick={onNewScript} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Novo Roteiro
          </Button>
        </div>
      </motion.div>

      {/* Métricas do Script */}
      <ScriptMetrics
        estimatedTime={estimatedTime}
        isWithinTimeLimit={isWithinTimeLimit}
        wordCount={wordCount}
        emocao_central={script.emocao_central}
        formato={script.formato}
        showTime={!isStories10x}
      />

      {/* Conteúdo do Script */}
      <Tabs defaultValue="formatted" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="formatted">📱 Visualização</TabsTrigger>
          <TabsTrigger value="raw">📝 Texto Bruto</TabsTrigger>
        </TabsList>

        <TabsContent value="formatted" className="space-y-4">
          {isCarousel && (
            <CarouselFormatter roteiro={parseAndLimitCarousel(script.roteiro)} />
          )}
          
          {isStories10x && (
            <Stories10xFormatter slides={parseStories10xSlides(script.roteiro)} />
          )}
          
          {!isCarousel && !isStories10x && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  {script.formato?.toUpperCase()} - {script.emocao_central}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                    {script.roteiro}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="raw">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Roteiro Completo</CardTitle>
              <Button
                onClick={() => handleCopyScript(script.roteiro)}
                size="sm"
                variant="outline"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copiar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                  {script.roteiro}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Informações do Script */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Detalhes do Roteiro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Formato</Label>
              <p className="text-sm font-semibold">{script.formato?.toUpperCase()}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Emoção</Label>
              <p className="text-sm font-semibold">{script.emocao_central}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Intenção</Label>
              <p className="text-sm font-semibold">{script.intencao}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Mentor</Label>
              <p className="text-sm font-semibold">{script.mentor}</p>
            </div>
          </div>
          
          {script.equipamentos_utilizados && script.equipamentos_utilizados.length > 0 && (
            <div className="mt-4">
              <Label className="text-sm font-medium text-gray-600 mb-2 block">
                Equipamentos Utilizados
              </Label>
              <div className="flex flex-wrap gap-2">
                {script.equipamentos_utilizados.map((eq: any, index: number) => (
                  <Badge key={index} variant="secondary">
                    {eq.nome}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Aprovação */}
      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Aprovar Roteiro
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="approval-title">Título do Roteiro Aprovado</Label>
              <Input
                id="approval-title"
                placeholder="Ex: Carrossel Rejuvenescimento - Confiança"
                value={approvalTitle}
                onChange={(e) => setApprovalTitle(e.target.value)}
              />
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">O que acontece ao aprovar:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Roteiro será salvo na biblioteca de aprovados</li>
                <li>• Poderá ser enviado para o Content Planner</li>
                <li>• Poderá receber avaliação de performance</li>
                <li>• A IA aprenderá com este roteiro para futuras gerações</li>
              </ul>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                onClick={() => setApprovalDialogOpen(false)}
                disabled={isApprovingScript}
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmApproval}
                disabled={!approvalTitle.trim() || isApprovingScript}
                className="bg-green-500 hover:bg-green-600"
              >
                {isApprovingScript ? 'Aprovando...' : 'Aprovar Roteiro'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Feedback */}
      <FeedbackDialog
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        onSubmitFeedback={handleSubmitFeedback}
        isSubmitting={isSubmittingFeedback}
      />
    </div>
  );
};

export default EnhancedScriptResults;
