import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Video, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface UploadItem {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

const AdminVideosBatch: React.FC = () => {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newUploads: UploadItem[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      status: 'pending',
      progress: 0,
    }));

    setUploads((prev) => [...prev, ...newUploads]);
  };

  const handleUpload = async () => {
    setIsUploading(true);
    
    for (const upload of uploads) {
      if (upload.status !== 'pending') continue;

      setUploads((prev) =>
        prev.map((u) =>
          u.id === upload.id ? { ...u, status: 'uploading' } : u
        )
      );

      try {
        // TODO: Implement actual upload logic
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        setUploads((prev) =>
          prev.map((u) =>
            u.id === upload.id ? { ...u, status: 'success', progress: 100 } : u
          )
        );
      } catch (error) {
        setUploads((prev) =>
          prev.map((u) =>
            u.id === upload.id
              ? { ...u, status: 'error', error: 'Erro no upload' }
              : u
          )
        );
      }
    }

    setIsUploading(false);
    toast.success('Upload em lote concluído');
  };

  const getStatusIcon = (status: UploadItem['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Video className="h-5 w-5 text-slate-400" />;
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Upload className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Upload em Lote</h1>
            <p className="text-slate-400">Faça upload de múltiplos vídeos simultaneamente</p>
          </div>
        </div>

        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle>Selecionar Vídeos</CardTitle>
            <CardDescription>
              Selecione múltiplos arquivos de vídeo para upload
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-primary hover:underline">
                  Clique para selecionar arquivos
                </span>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="video/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
              <p className="text-sm text-muted-foreground mt-2">
                Ou arraste e solte os arquivos aqui
              </p>
            </div>

            {uploads.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">
                    {uploads.length} arquivo(s) selecionado(s)
                  </h3>
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading || uploads.every(u => u.status !== 'pending')}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Iniciar Upload
                      </>
                    )}
                  </Button>
                </div>

                {uploads.map((upload) => (
                  <div
                    key={upload.id}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    {getStatusIcon(upload.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {upload.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(upload.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    {upload.status === 'uploading' && (
                      <div className="w-24 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${upload.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminVideosBatch;
