
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDiagnosticPersistence } from '@/hooks/useDiagnosticPersistence';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { toast } from 'sonner';

const DiagnosticReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { savedDiagnostics } = useDiagnosticPersistence();
  
  const session = savedDiagnostics.find(s => s.id === id);
  
  if (!session) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Diagnóstico não encontrado</h1>
          <Button onClick={() => navigate('/diagnostic-history')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Histórico
          </Button>
        </div>
      </div>
    );
  }

  const handleDownloadPdf = async () => {
    try {
      toast.loading("Gerando PDF...", { id: "pdf-gen" });
      
      // Chamar a edge function para gerar PDF
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: session.id,
          title: `Relatório ${session.clinicTypeLabel} - ${session.specialty}`,
          htmlString: session.state.generatedDiagnostic || '',
          type: 'diagnostic-report'
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar PDF');
      }

      const data = await response.json();
      
      if (data.success && data.pdfUrl) {
        // Abrir PDF em nova aba
        window.open(data.pdfUrl, '_blank');
        toast.success("PDF gerado com sucesso!", { id: "pdf-gen" });
      } else {
        throw new Error(data.error || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error("Erro ao gerar PDF", { 
        description: "Tente novamente em alguns instantes",
        id: "pdf-gen" 
      });
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const dateInfo = formatDate(session.timestamp);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/diagnostic-history')}
            className="bg-aurora-glass border-aurora-electric-purple/30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-white">
              Relatório: {session.clinicTypeLabel}
            </h1>
            <p className="text-white/70">
              {session.specialty} • {dateInfo.date} às {dateInfo.time}
            </p>
          </div>
        </div>

        <Button onClick={handleDownloadPdf} className="bg-aurora-gradient-primary">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Content */}
      <div className="bg-aurora-glass border border-aurora-electric-purple/30 rounded-xl p-6">
        <div className="prose prose-invert max-w-none">
          {session.state.generatedDiagnostic ? (
            <div 
              className="text-white leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: session.state.generatedDiagnostic.replace(/\n/g, '<br/>') 
              }}
            />
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Diagnóstico incompleto
              </h3>
              <p className="text-white/70">
                Este diagnóstico ainda não foi finalizado.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticReport;
