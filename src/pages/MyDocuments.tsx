import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar, Upload, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const MyDocuments = () => {
  const documents = [
    {
      id: 1,
      title: "Protocolos de Harmonização Facial",
      description: "Documento completo com todos os protocolos atualizados",
      type: "PDF",
      size: "2.5 MB",
      date: "15/01/2024",
      category: "Protocolos"
    },
    {
      id: 2,
      title: "Artigo - Skinbooster Applications",
      description: "Artigo científico sobre aplicações de skinbooster",
      type: "PDF",
      size: "1.8 MB",
      date: "18/01/2024",
      category: "Artigos"
    },
    {
      id: 3,
      title: "Checklist Pré-Procedimento",
      description: "Lista de verificação para procedimentos estéticos",
      type: "DOC",
      size: "856 KB",
      date: "20/01/2024",
      category: "Checklists"
    },
    {
      id: 4,
      title: "Termo de Consentimento",
      description: "Modelo de termo de consentimento atualizado",
      type: "PDF",
      size: "1.2 MB",
      date: "22/01/2024",
      category: "Documentos Legais"
    }
  ];

  const getFileIcon = (type: string) => {
    return <FileText className="h-8 w-8 text-primary" />;
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meus Documentos</h1>
          <p className="text-muted-foreground">
            Biblioteca pessoal de documentos, artigos e protocolos
          </p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Adicionar Documento
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar documentos..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {documents.map((document) => (
          <Card key={document.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getFileIcon(document.type)}
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {document.title}
                    </CardTitle>
                    <CardDescription>
                      {document.description}
                    </CardDescription>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{document.date}</span>
                      </div>
                      <span>{document.type}</span>
                      <span>{document.size}</span>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                        {document.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyDocuments;