
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Download, Loader2, FileText } from 'lucide-react';
import { TechnicalDocument } from '@/types/document';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface DocumentHeaderProps {
  document: TechnicalDocument;
  addingContent: boolean;
  onExtractContent: () => void;
}

const DocumentHeader: React.FC<DocumentHeaderProps> = ({ 
  document, 
  addingContent, 
  onExtractContent 
}) => {
  const navigate = useNavigate();
  
  const getDocumentTypeLabel = (type: string) => {
    switch(type) {
      case 'artigo_cientifico': return 'Artigo Científico';
      case 'ficha_tecnica': return 'Ficha Técnica';
      case 'protocolo': return 'Protocolo';
      default: return 'Outro';
    }
  };
  
  const getLanguageLabel = (code: string) => {
    switch(code) {
      case 'pt': return 'Português';
      case 'en': return 'Inglês';
      case 'es': return 'Espanhol';
      default: return code;
    }
  };
  
  const handleDownloadFile = async () => {
    if (document?.link_dropbox) {
      try {
        toast("Iniciando download");
        
        // Get the file URL
        let url = document.link_dropbox;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url;
        }
        
        // Open the URL in a new tab - this avoids using document.body
        window.open(url, '_blank');
        
        toast("Download iniciado", {
          description: "O PDF foi aberto em uma nova aba"
        });
      } catch (error) {
        console.error("Erro no download:", error);
        toast("Erro no download");
      }
    } else {
      toast("Arquivo não disponível");
    }
  };

  return (
    <>
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/documents')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Voltar para Documentos
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold">{document.titulo}</h1>
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDownloadFile}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          
          {!document.conteudo_extraido && (
            <Button 
              variant="default" 
              size="sm"
              onClick={onExtractContent}
              disabled={addingContent}
            >
              {addingContent ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Extrair Conteúdo
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <p className="text-muted-foreground mb-3">
        {document.descricao || 'Sem descrição disponível'}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="secondary">
          {getDocumentTypeLabel(document.tipo)}
        </Badge>
        
        {document.idioma_original && (
          <Badge variant="outline">
            {getLanguageLabel(document.idioma_original)}
          </Badge>
        )}
        
        {document.equipamento_nome && (
          <Badge variant="outline">
            Equip: {document.equipamento_nome}
          </Badge>
        )}
      </div>
    </>
  );
};

export default DocumentHeader;
