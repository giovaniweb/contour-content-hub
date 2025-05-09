
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface DocumentIdeasProps {
  className?: string;
}

const DocumentIdeas: React.FC<DocumentIdeasProps> = ({ className }) => {
  // Mock data for document ideas
  const ideas = [
    "Como o equipamento X pode ajudar nos tratamentos Y?",
    "Quais são os benefícios do equipamento X comparado com outros similares?",
    "Como explicar o funcionamento do equipamento X para clientes?",
    "Quais resultados podem ser esperados após N sessões?",
    "Como combinar o equipamento X com outros tratamentos?"
  ];

  return (
    <div className={className}>
      <h3 className="text-lg font-medium mb-4">Ideias para Conteúdo</h3>
      <div className="space-y-3">
        {ideas.map((idea, index) => (
          <Card key={index} className="border-l-4 border-l-blue-500">
            <CardContent className="p-4 flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{idea}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DocumentIdeas;
