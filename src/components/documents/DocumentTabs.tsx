
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Languages, MessageSquare, Lightbulb } from 'lucide-react';
import { TechnicalDocument } from '@/types/document';
import DocumentContent from './DocumentContent';
import DocumentQuestions from './DocumentQuestions';
import DocumentTranslation from './DocumentTranslation';
import DocumentIdeas from './DocumentIdeas';

interface DocumentTabsProps {
  document: TechnicalDocument;
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

const DocumentTabs: React.FC<DocumentTabsProps> = ({ 
  document, 
  activeTab, 
  onChangeTab 
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onChangeTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="content" className="flex items-center">
          <FileText className="mr-2 h-4 w-4" />
          <span>Conteúdo</span>
        </TabsTrigger>
        <TabsTrigger value="translations" className="flex items-center">
          <Languages className="mr-2 h-4 w-4" />
          <span>Traduções</span>
        </TabsTrigger>
        <TabsTrigger value="questions" className="flex items-center">
          <MessageSquare className="mr-2 h-4 w-4" />
          <span>Perguntas</span>
        </TabsTrigger>
        <TabsTrigger value="content-ideas" className="flex items-center">
          <Lightbulb className="mr-2 h-4 w-4" />
          <span>Ideias</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="content">
        <DocumentContent document={document} />
      </TabsContent>
      
      <TabsContent value="translations">
        <DocumentTranslation document={document} />
      </TabsContent>
      
      <TabsContent value="questions">
        <DocumentQuestions document={document} />
      </TabsContent>
      
      <TabsContent value="content-ideas">
        <DocumentIdeas document={document} />
      </TabsContent>
    </Tabs>
  );
};

export default DocumentTabs;
