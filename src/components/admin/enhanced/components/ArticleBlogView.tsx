import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Languages, 
  Globe, 
  Clock, 
  User, 
  Tag, 
  FileText,
  Download,
  Loader2,
  Copy,
  CheckCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UnifiedDocument } from '@/types/document';

interface ArticleBlogViewProps {
  article: UnifiedDocument;
  onClose: () => void;
}

const ArticleBlogView: React.FC<ArticleBlogViewProps> = ({ article, onClose }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('pt');
  const [translatedContent, setTranslatedContent] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentDisplayLanguage, setCurrentDisplayLanguage] = useState('pt');
  const [copied, setCopied] = useState(false);

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  ];

  const handleTranslate = async () => {
    if (!selectedLanguage || selectedLanguage === 'pt') {
      return;
    }

    setIsTranslating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('translate-document', {
        body: {
          documentId: article.id,
          targetLanguage: selectedLanguage
        }
      });

      if (error) throw error;

      if (data?.success) {
        setTranslatedContent(data.translatedContent);
        setCurrentDisplayLanguage(selectedLanguage);
        toast({
          title: "Tradução concluída",
          description: `Artigo traduzido para ${languages.find(l => l.code === selectedLanguage)?.name}`,
        });
      }
    } catch (error: any) {
      console.error('Translation error:', error);
      toast({
        variant: "destructive",
        title: "Erro na tradução",
        description: "Não foi possível traduzir o artigo. Tente novamente.",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const copyToClipboard = async () => {
    const contentToCopy = currentDisplayLanguage === 'pt' 
      ? (article.texto_completo || article.raw_text || '')
      : translatedContent;
      
    try {
      await navigator.clipboard.writeText(contentToCopy);
      setCopied(true);
      toast({
        title: "Copiado!",
        description: "Conteúdo copiado para a área de transferência.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível copiar o conteúdo.",
      });
    }
  };

  const currentContent = currentDisplayLanguage === 'pt' 
    ? (article.texto_completo || article.raw_text || '')
    : translatedContent;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content: string) => {
    // Simple formatting: split by double newlines for paragraphs
    return content.split('\n\n').filter(p => p.trim()).map((paragraph, index) => (
      <p key={index} className="mb-4 text-slate-200 leading-relaxed">
        {paragraph.trim()}
      </p>
    ));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
            <FileText className="h-3 w-3 mr-1" />
            {article.tipo_documento?.replace('_', ' ').toUpperCase()}
          </Badge>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={copyToClipboard}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              {copied ? (
                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {copied ? 'Copiado!' : 'Copiar'}
            </Button>
          </div>
        </div>

        {/* Article Title */}
        <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
          {article.titulo_extraido || 'Documento sem título'}
        </h1>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-6">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatDate(article.created_at)}
          </div>
          
          {article.autores && article.autores.length > 0 && (
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {article.autores.join(', ')}
            </div>
          )}
        </div>

        {/* Keywords */}
        {article.palavras_chave && article.palavras_chave.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-400">Palavras-chave:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {article.palavras_chave.map((keyword, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="border-cyan-500/30 text-cyan-300 bg-cyan-500/10"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator className="bg-slate-600" />
      </div>

      {/* Translation Controls */}
      <Card className="aurora-glass border-slate-600 mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-white text-lg">
            <Languages className="h-5 w-5 text-cyan-400" />
            Tradução
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm text-slate-400 mb-2 block">
                Idioma de destino:
              </label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="aurora-glass border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="aurora-glass border-slate-600">
                  {languages.map((lang) => (
                    <SelectItem 
                      key={lang.code} 
                      value={lang.code}
                      className="text-white hover:bg-slate-700"
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button
              onClick={handleTranslate}
              disabled={isTranslating || selectedLanguage === 'pt'}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600 mt-6"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Traduzindo...
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4 mr-2" />
                  Traduzir
                </>
              )}
            </Button>
          </div>

          {currentDisplayLanguage !== 'pt' && (
            <div className="mt-4 p-3 bg-green-600/20 border border-green-500/30 rounded-lg">
              <p className="text-green-300 text-sm">
                ✅ Conteúdo exibido em: {languages.find(l => l.code === currentDisplayLanguage)?.name}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Article Content */}
      <Card className="aurora-glass border-slate-600">
        <CardContent className="p-8">
          {article.thumbnail_url && (
            <div className="mb-8">
              <img 
                src={article.thumbnail_url} 
                alt={article.titulo_extraido || 'Thumbnail do artigo'}
                className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
              />
            </div>
          )}

          <div className="prose prose-invert prose-lg max-w-none">
            {currentContent ? (
              formatContent(currentContent)
            ) : (
              <p className="text-slate-400 italic">
                Conteúdo não disponível para este documento.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleBlogView;