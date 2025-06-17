
import React, { useState } from 'react';
import { Send, MessageSquare, Loader2, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: string;
  question: string;
  answer: string;
  timestamp: Date;
}

interface ArticleQuestionPanelProps {
  documentId: string;
  articleTitle: string;
}

const ArticleQuestionPanel: React.FC<ArticleQuestionPanelProps> = ({
  documentId,
  articleTitle
}) => {
  const [question, setQuestion] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const suggestedQuestions = [
    "Qual é o principal objetivo deste estudo?",
    "Quais foram os resultados encontrados?",
    "Qual metodologia foi utilizada?",
    "Quais são as conclusões principais?",
    "Quais equipamentos foram utilizados?"
  ];

  const handleAskQuestion = async (questionText: string) => {
    if (!questionText.trim()) return;

    setIsLoading(true);
    
    try {
      console.log('🤔 Fazendo pergunta para o documento:', documentId);
      
      const { data, error } = await supabase.functions.invoke('ask-document', {
        body: {
          documentId,
          question: questionText
        }
      });

      if (error) {
        console.error('❌ Erro ao fazer pergunta:', error);
        throw new Error(error.message || 'Erro ao processar pergunta');
      }

      if (!data?.success) {
        console.error('❌ Resposta sem sucesso:', data);
        throw new Error(data?.error || 'Erro ao gerar resposta');
      }

      const newQuestion: Question = {
        id: Date.now().toString(),
        question: questionText,
        answer: data.answer,
        timestamp: new Date()
      };

      setQuestions(prev => [newQuestion, ...prev]);
      setQuestion('');

      toast({
        title: 'Pergunta respondida!',
        description: 'A IA analisou o artigo e forneceu uma resposta.'
      });

    } catch (error: any) {
      console.error('💥 Erro ao fazer pergunta:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao fazer pergunta',
        description: error.message || 'Tente novamente em alguns instantes'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAskQuestion(question);
  };

  const handleSuggestedQuestion = (suggestedQ: string) => {
    handleAskQuestion(suggestedQ);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-slate-100">
            Faça uma Pergunta
          </h3>
          <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
            IA
          </Badge>
        </div>
        <p className="text-sm text-slate-400">
          Faça perguntas sobre o conteúdo de "{articleTitle}" e receba respostas baseadas no texto do artigo.
        </p>
      </div>

      {/* Question Input */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Digite sua pergunta sobre o artigo..."
            className="flex-1 bg-slate-700/50 border-cyan-500/30 text-slate-100 placeholder:text-slate-400 rounded-xl"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !question.trim()}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600 rounded-xl px-4"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>

      {/* Suggested Questions */}
      {questions.length === 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-300">Perguntas sugeridas:</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {suggestedQuestions.map((suggestedQ, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleSuggestedQuestion(suggestedQ)}
                disabled={isLoading}
                className="text-left justify-start bg-slate-800/30 border-slate-600/30 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 rounded-lg h-auto py-3 px-4"
              >
                <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-sm">{suggestedQ}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Questions and Answers */}
      {questions.length > 0 && (
        <ScrollArea className="max-h-96">
          <div className="space-y-4">
            {questions.map((q) => (
              <Card key={q.id} className="bg-slate-800/50 border-cyan-500/20 rounded-xl">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-cyan-500/20 rounded-full p-2">
                      <MessageSquare className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-slate-100 mb-1">
                        Sua pergunta:
                      </h4>
                      <p className="text-sm text-slate-300">{q.question}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="bg-slate-700/30 rounded-lg p-4 border-l-4 border-cyan-500/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 text-xs">
                        IA Response
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {q.timestamp.toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {q.answer}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3 text-cyan-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Analisando o artigo...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleQuestionPanel;
