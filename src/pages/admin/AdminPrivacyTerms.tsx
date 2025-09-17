import React, { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import AdminLayout from '@/components/layout/AdminLayout';
import LoadingFallback from '@/components/LoadingFallback';
import { usePrivacyTerms } from '@/hooks/usePrivacyTerms';
import ReactMarkdown from 'react-markdown';

const AdminPrivacyTerms: React.FC = () => {
  const { terms, loading, error, updateTerms } = usePrivacyTerms();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (terms) {
      setTitle(terms.title);
      setContent(terms.content);
    }
  }, [terms]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Título é obrigatório');
      return;
    }

    if (!content.trim()) {
      toast.error('Conteúdo é obrigatório');
      return;
    }

    setIsSaving(true);
    
    try {
      const result = await updateTerms(title, content);
      
      if (result.success) {
        toast.success('Termos de privacidade atualizados com sucesso!');
      } else {
        toast.error(result.error || 'Erro ao atualizar os termos');
      }
    } catch (err) {
      console.error('Erro ao salvar:', err);
      toast.error('Erro inesperado ao salvar os termos');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (loading) {
    return (
      <AdminLayout>
        <LoadingFallback message="Carregando termos de privacidade..." />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <p className="text-red-600">Erro ao carregar os termos de privacidade.</p>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Gerenciar Termos de Privacidade
          </h1>
          <p className="text-muted-foreground mt-2">
            Edite a política de privacidade que será exibida para os usuários
          </p>
        </div>

        {terms && (
          <Card className="mb-6 bg-muted/50">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Versão Atual:</strong> {terms.version}
                </div>
                <div>
                  <strong>Última Atualização:</strong> {formatDate(terms.updated_at)}
                </div>
                <div>
                  <strong>Status:</strong> {terms.is_active ? 'Ativo' : 'Inativo'}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Editor</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Ocultar Preview
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Mostrar Preview
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    size="sm"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título da Página</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Política de Privacidade"
                />
              </div>
              
              <div>
                <Label htmlFor="content">
                  Conteúdo (Markdown suportado)
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Digite o conteúdo dos termos de privacidade..."
                  className="min-h-[400px] font-mono text-sm"
                />
              </div>
              
              <div className="text-xs text-muted-foreground">
                <p><strong>Dica:</strong> Use Markdown para formatação:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li># Título Principal</li>
                  <li>## Subtítulo</li>
                  <li>**Texto em negrito**</li>
                  <li>- Lista com marcadores</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          {showPreview && (
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-background min-h-[400px]">
                  <h1 className="text-2xl font-bold mb-4">{title || 'Título'}</h1>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <h2 className="text-xl font-bold mt-6 mb-3 first:mt-0">
                            {children}
                          </h2>
                        ),
                        h2: ({ children }) => (
                          <h3 className="text-lg font-semibold mt-4 mb-2">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="mb-3 leading-relaxed">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc pl-6 mb-3 space-y-1">
                            {children}
                          </ul>
                        ),
                      }}
                    >
                      {content || '*Digite o conteúdo para ver o preview...*'}
                    </ReactMarkdown>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {terms && (
              <span>
                Versão {terms.version} • 
                Atualizada em {formatDate(terms.updated_at)}
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <History className="h-4 w-4 mr-2" />
              Ver Histórico
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPrivacyTerms;