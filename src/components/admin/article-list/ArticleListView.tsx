
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

interface ArticleListViewProps {
  articles: any[];
  formatDate: (dateString: string) => string;
  handleEdit: (article: any) => void;
  handleDelete: (id: string) => void;
}

const ArticleListView: React.FC<ArticleListViewProps> = ({ 
  articles, 
  formatDate, 
  handleEdit, 
  handleDelete 
}) => {
  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <Card key={article.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="bg-muted p-4 flex items-center justify-center md:w-16">
                <Book className="h-6 w-6" />
              </div>
              
              <div className="p-4 flex-1">
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <h3 className="font-medium">{article.titulo}</h3>
                    {article.descricao && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        {article.descricao}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center mt-2 md:mt-0 md:ml-2">
                    <Button variant="outline" size="sm" onClick={() => window.open(`/documents/${article.id}`, '_blank')} className="mr-2">
                      <Eye className="h-4 w-4 mr-1" /> Ver
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
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
                
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">Artigo Científico</Badge>
                  
                  {article.equipamentos?.nome && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      {article.equipamentos.nome}
                    </Badge>
                  )}
                  
                  <span className="text-xs text-muted-foreground ml-auto">
                    {formatDate(article.data_criacao)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ArticleListView;
