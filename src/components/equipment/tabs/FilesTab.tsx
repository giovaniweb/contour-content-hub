
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Download } from "lucide-react";

interface FilesTabProps {
  files: any[];
  equipmentName: string;
}

export const FilesTab: React.FC<FilesTabProps> = ({ files, equipmentName }) => {
  const handleDownload = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-12 w-12 text-gray-400 mb-2" />
        <h3 className="text-lg font-medium mb-1">Nenhum arquivo encontrado</h3>
        <p className="text-muted-foreground mb-4">
          Não há arquivos cadastrados para este equipamento.
        </p>
        <Button asChild>
          <Link to={`/admin/content?equipment=${equipmentName}`}>
            <Upload className="mr-2 h-4 w-4" />
            Adicionar arquivo
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {files.map((file) => (
        <Card key={file.id} className="overflow-hidden h-full">
          <div className="aspect-video bg-gray-100 flex items-center justify-center">
            {file.preview_url ? (
              <img 
                src={file.preview_url} 
                alt={file.nome} 
                className="w-full h-full object-cover"
              />
            ) : (
              <FileText className="h-12 w-12 text-gray-400" />
            )}
          </div>
          <CardContent className="p-4">
            <h4 className="font-medium truncate">{file.nome}</h4>
            <p className="text-sm text-muted-foreground mt-1 truncate">
              {file.tipo || "Documento"}
            </p>
            <div className="mt-2 flex space-x-2">
              <Button size="sm" variant="outline" asChild>
                <a href={file.arquivo_url} target="_blank" rel="noreferrer">
                  Ver arquivo
                </a>
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleDownload(file.arquivo_url)}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
