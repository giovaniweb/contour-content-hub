
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Book, MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ArticleGridViewProps {
  articles: any[];
  formatDate: (dateString: string) => string;
  handleEdit: (article: any) => void;
  handleDelete: (id: string) => void;
}

const ArticleGridView: React.FC<ArticleGridViewProps> = ({ 
  articles, 
  formatDate, 
  handleEdit, 
  handleDelete 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {articles.map((article) => (
        <Card key={article.id}>
          <CardContent className="p-0 flex flex-col h-full">
            <div className="bg-muted p-4 flex items-center">
              <Book className="h-6 w-6 text-muted-foreground mr-2" />
              <h3 className="font-medium line-clamp-1">{article.titulo}</h3>
            </div>
            
            <div className="p-4 flex-1">
              {article.descricao && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {article.descricao}
                </p>
              )}
              
              <div className="flex flex-wrap gap-2 mt-auto">
                <Badge variant="outline">Artigo Científico</Badge>
                
                {article.equipamentos?.nome && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                    {article.equipamentos.nome}
                  </Badge>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-muted-foreground">
                  {formatDate(article.data_criacao)}
                </span>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => window.open(`/documents/${article.id}`, '_blank')}>
                      <Eye className="h-4 w-4 mr-2" /> Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleEdit(article)}>
                      <Pencil className="h-4 w-4 mr-2" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600 focus:text-red-600" 
                      onSelect={() => handleDelete(article.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ArticleGridView;
