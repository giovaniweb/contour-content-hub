
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, Loader2 } from "lucide-react";

interface ArticleQuestionPanelProps {
  documentId: string;
  documentTitle: string;
}

const ArticleQuestionPanel: React.FC<ArticleQuestionPanelProps> = ({
  documentId,
  documentTitle
}) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState('');

  const handleSubmitQuestion = async () => {
    if (!question.trim()) return;
    
    setIsLoading(true);
    try {
      // Aqui seria a chamada para a API de perguntas sobre documentos
      console.log('Submitting question:', question, 'for document:', documentId);
      
      // Simulação de resposta para teste
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAnswer('Esta é uma resposta simulada para a pergunta sobre o artigo científico. A funcionalidade de IA será implementada posteriormente.');
      
    } catch (error) {
      console.error('Error submitting question:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="aurora-card">
      <CardHeader>
        <CardTitle className="aurora-heading flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-aurora-neon-blue" />
          Fazer Pergunta sobre o Artigo
        </CardTitle>
        <p className="text-sm text-slate-400">
          Faça perguntas específicas sobre: {documentTitle}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Digite sua pergunta sobre o artigo científico..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="aurora-glass border-aurora-electric-purple/30 focus:border-aurora-electric-purple resize-none"
            rows={3}
          />
          <Button
            onClick={handleSubmitQuestion}
            disabled={!question.trim() || isLoading}
            className="aurora-button w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Enviar Pergunta
              </>
            )}
          </Button>
        </div>
        
        {answer && (
          <div className="p-4 aurora-glass rounded-lg border border-aurora-neon-blue/30">
            <h4 className="font-medium text-aurora-neon-blue mb-2">Resposta:</h4>
            <p className="text-slate-300 text-sm">{answer}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ArticleQuestionPanel;
