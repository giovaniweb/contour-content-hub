import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Link as LinkIcon, Video, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminVideosImport: React.FC = () => {
  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    if (!importUrl.trim()) {
      toast.error('Por favor, insira uma URL válida');
      return;
    }

    setIsImporting(true);
    try {
      // TODO: Implement actual import logic
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success('Vídeo importado com sucesso');
      setImportUrl('');
    } catch (error) {
      toast.error('Erro ao importar vídeo');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Download className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Importar Vídeos</h1>
            <p className="text-slate-400">Importe vídeos de URLs externas (Vimeo, YouTube, etc)</p>
          </div>
        </div>

        {/* Import Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Importar de URL
            </CardTitle>
            <CardDescription>
              Cole a URL do vídeo que deseja importar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="import-url">URL do Vídeo</Label>
              <Input
                id="import-url"
                type="url"
                placeholder="https://vimeo.com/123456789"
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
              />
            </div>

            <Button onClick={handleImport} disabled={isImporting} className="w-full">
              {isImporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Importar Vídeo
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Supported Platforms */}
        <Card>
          <CardHeader>
            <CardTitle>Plataformas Suportadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Video className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">Vimeo</p>
                  <p className="text-xs text-muted-foreground">vimeo.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Video className="h-8 w-8 text-red-500" />
                <div>
                  <p className="font-medium">YouTube</p>
                  <p className="text-xs text-muted-foreground">youtube.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <LinkIcon className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium">URL Direta</p>
                  <p className="text-xs text-muted-foreground">.mp4, .mov, etc</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminVideosImport;
