import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import LoadingFallback from '@/components/LoadingFallback';
import { usePrivacyTerms } from '@/hooks/usePrivacyTerms';
import ReactMarkdown from 'react-markdown';

const PrivacyPolicy: React.FC = () => {
  const { terms, loading, error } = usePrivacyTerms();

  if (loading) {
    return <LoadingFallback message="Carregando política de privacidade..." />;
  }

  if (error) {
    return (
      <AuroraPageLayout>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <p className="text-red-600">Erro ao carregar a política de privacidade.</p>
            <Button asChild className="mt-4">
              <Link to="/">Voltar ao Início</Link>
            </Button>
          </CardContent>
        </Card>
      </AuroraPageLayout>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <AuroraPageLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-8">
            <header className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {terms?.title || 'Política de Privacidade'}
              </h1>
              <p className="text-muted-foreground">
                Última atualização: {terms?.updated_at ? formatDate(terms.updated_at) : 'N/A'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Versão: {terms?.version || 1}
              </p>
            </header>

            <div className="prose prose-slate max-w-none dark:prose-invert">
              <ReactMarkdown>
                {terms?.content || 'Conteúdo não disponível.'}
              </ReactMarkdown>
            </div>

            <footer className="mt-12 pt-8 border-t border-border">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Se você tiver dúvidas sobre esta política de privacidade, 
                  entre em contato conosco.
                </p>
                <Button asChild>
                  <Link to="/">Voltar ao Início</Link>
                </Button>
              </div>
            </footer>
          </CardContent>
        </Card>
      </div>
    </AuroraPageLayout>
  );
};

export default PrivacyPolicy;