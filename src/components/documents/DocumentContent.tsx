import React, { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Download, Edit, Loader2, MoreVertical, Share2, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { TechnicalDocument } from '@/types/document';
import { downloadPdfFile } from '@/services/documentService';
import DocumentIdeas from './DocumentIdeas'; // Import DocumentIdeas component

interface DocumentContentProps {
  document: TechnicalDocument;
}

const DocumentContent: React.FC<DocumentContentProps> = ({ document }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'content' | 'ideas'>('content');

  const handleCopyToClipboard = async () => {
    if (!document.conteudo_extraido) {
      toast({
        variant: "destructive",
        title: "Sem conteúdo",
        description: "Este documento ainda não tem conteúdo extraído. Por favor, extraia o conteúdo primeiro."
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(document.conteudo_extraido);
      setIsCopied(true);
      toast({
        title: "Copiado!",
        description: "Conteúdo copiado para a área de transferência."
      });
      setTimeout(() => setIsCopied(false), 3000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erro ao copiar",
        description: "Não foi possível copiar o conteúdo para a área de transferência."
      });
    }
  };

  const handleDownloadPdf = () => {
    if (document?.pdfUrl) {
      downloadPdfFile(document.pdfUrl);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">
          {document.titulo}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handleCopyToClipboard} disabled={isCopied}>
            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={handleDownloadPdf} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" /> Share
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" /> Download
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardDescription className="px-4">
        <div className="flex items-center">
          <Avatar className="mr-2 h-6 w-6">
            <AvatarImage src="https://github.com/shadcn.png" alt="Nelson Sakwa" />
            <AvatarFallback>NS</AvatarFallback>
          </Avatar>
          <span>
            por Nelson Sakwa
          </span>
          <Badge className="ml-2">
            <Sparkles className="mr-1 h-3 w-3" />
            IA
          </Badge>
        </div>
      </CardDescription>
      <CardContent className="pl-4 pb-4">
        <div className="flex gap-4">
          <Button
            variant={activeTab === 'content' ? 'default' : 'outline'}
            onClick={() => setActiveTab('content')}
          >
            Conteúdo
          </Button>
          <Button
            variant={activeTab === 'ideas' ? 'default' : 'outline'}
            onClick={() => setActiveTab('ideas')}
          >
            Ideias
          </Button>
        </div>
      </CardContent>

      {activeTab === 'content' ? (
        <ScrollArea className="h-[calc(100vh-350px)] min-h-[400px] w-full rounded-md border">
          <div className="p-6 space-y-6">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p>{document.descricao}</p>
              <pre className="whitespace-pre-wrap">{document.conteudo_extraido}</pre>
            </div>
          </div>
        </ScrollArea>
      ) : (
        <DocumentIdeas document={document} className="p-6" />
      )}
    </Card>
  );
};

export default DocumentContent;

// Define the Check component since it's used in the original file
const Check = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-check"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
