
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, FileText, ExternalLink, Eye, Download } from "lucide-react";
import { processPdfUrl, downloadPdf } from "@/utils/pdfUtils";
import PdfViewer from "@/components/documents/PdfViewer";
import { toast } from "sonner";

interface FilePreviewProps {
  file: File | null;
  fileUrl: string | null;
  onClearFile?: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, fileUrl, onClearFile }) => {
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  if (!file && !fileUrl) {
    return null;
  }

  // Check if URL is valid for preview
  const isValidUrl = fileUrl && fileUrl.trim().length > 0;
  
  const handleDownload = async () => {
    if (!fileUrl) {
      toast.error("Nenhum arquivo disponível para download");
      return;
    }
    
    try {
      setIsDownloading(true);
      await downloadPdf(fileUrl, file?.name);
      toast.success("Download iniciado");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Erro ao iniciar download");
    } finally {
      setIsDownloading(false);
    }
  };
  
  return (
    <div className="border rounded-md p-4 bg-muted/20 mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h4 className="text-sm font-medium">
              {file?.name || "Documento PDF"}
            </h4>
            {file && (
              <p className="text-xs text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {fileUrl && (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsPdfViewerOpen(true)}
                className="flex items-center gap-1"
              >
                <Eye className="h-4 w-4 mr-1" />
                Visualizar
              </Button>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                <Download className="h-4 w-4 mr-1" />
                {isDownloading ? "Baixando..." : "Download"}
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => window.open(fileUrl, '_blank', 'noopener,noreferrer')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </>
          )}
          
          {onClearFile && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearFile}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* PDF Viewer Dialog */}
      {isValidUrl && (
        <PdfViewer
          isOpen={isPdfViewerOpen}
          onOpenChange={setIsPdfViewerOpen}
          title={file?.name || "Documento PDF"}
          pdfUrl={fileUrl}
        />
      )}
    </div>
  );
};

export default FilePreview;
