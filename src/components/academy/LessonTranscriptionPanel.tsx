import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LessonTranscriptionPanelProps {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  vimeoUrl: string;
}

export const LessonTranscriptionPanel: React.FC<LessonTranscriptionPanelProps> = ({
  courseId,
  lessonId,
  lessonTitle,
  vimeoUrl
}) => {
  const { toast } = useToast();
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionStatus, setTranscriptionStatus] = useState<'none' | 'processing' | 'available' | 'failed'>('none');

  const handleTranscription = async () => {
    setIsTranscribing(true);
    setTranscriptionStatus('processing');

    // Clean the Vimeo URL before processing
    const cleanUrl = vimeoUrl.trim().replace(/[#?].*$/, '');

    try {
      const { data, error } = await supabase.functions.invoke('auto-ingest-lesson', {
        body: {
          course_id: courseId,
          lesson_id: lessonId,
          title: lessonTitle,
          vimeo_url: cleanUrl,
          language: 'pt-BR'
        }
      });

      if (error) throw error;

      if (data?.success) {
        if (data.alreadyIndexed) {
          setTranscriptionStatus('available');
          toast({
            title: "Transcrição já disponível",
            description: "Esta aula já possui transcrição indexada.",
          });
        } else {
          setTranscriptionStatus('available');
          toast({
            title: "Transcrição processada!",
            description: `${data.chunks_created} chunks de conteúdo indexados.`,
          });
        }
      } else if (data?.noTranscript) {
        setTranscriptionStatus('failed');
        toast({
          title: "Transcrição não disponível",
          description: "Este vídeo não possui legendas/transcrição no Vimeo.",
          variant: "destructive"
        });
      } else if (data?.invalidUrl) {
        setTranscriptionStatus('failed');
        toast({
          title: "URL do Vimeo inválida",
          description: `Formato esperado: https://vimeo.com/123456789. URL recebida: ${data.receivedUrl}`,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Erro na transcrição:', error);
      setTranscriptionStatus('failed');
      
      let errorMessage = "Não foi possível processar a transcrição da aula.";
      
      // Handle specific error cases
      if (error?.message?.includes('Invalid Vimeo URL') || error?.message?.includes('URL do Vimeo inválida')) {
        errorMessage = `URL do Vimeo inválida. Formato esperado: https://vimeo.com/123456789`;
      } else if (error?.message?.includes('The requested video couldn\'t be found')) {
        errorMessage = "Vídeo não encontrado no Vimeo. Verifique se o ID está correto e o vídeo existe.";
      } else if (error?.message?.includes('Missing VIMEO_ACCESS_TOKEN')) {
        errorMessage = "Token de acesso do Vimeo não configurado.";
      } else if (error?.message?.includes('Authorization')) {
        errorMessage = "Erro de autorização com o Vimeo. Verifique as permissões do token.";
      }
      
      toast({
        title: "Erro na transcrição",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const getStatusIcon = () => {
    switch (transcriptionStatus) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (transcriptionStatus) {
      case 'available':
        return 'Transcrição disponível';
      case 'processing':
        return 'Processando transcrição...';
      case 'failed':
        return 'Transcrição falhou';
      default:
        return 'Transcrição não processada';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Transcrição & IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {getStatusText()}
            </p>
            {isTranscribing && (
              <p className="text-xs text-muted-foreground mb-1">
                Processando: {vimeoUrl.trim().replace(/[#?].*$/, '')}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              A transcrição permite que os alunos façam perguntas sobre o conteúdo da aula usando IA.
            </p>
          </div>
          <Button
            onClick={handleTranscription}
            disabled={isTranscribing || transcriptionStatus === 'available'}
            variant={transcriptionStatus === 'available' ? 'outline' : 'default'}
          >
            {isTranscribing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : transcriptionStatus === 'available' ? (
              'Reprocessar'
            ) : (
              'Processar Transcrição'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};