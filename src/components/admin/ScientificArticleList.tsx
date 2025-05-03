
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Book, MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import ScientificArticleForm from "./ScientificArticleForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface ScientificArticleListProps {
  articles: any[];
  onDelete: (id: string) => void;
  onUpdate: () => void;
  viewMode: "grid" | "list";
}

const ScientificArticleList: React.FC<ScientificArticleListProps> = ({ 
  articles, 
  onDelete, 
  onUpdate,
  viewMode 
}) => {
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);
  
  const handleEdit = (article: any) => {
    setEditingArticle(article);
  };
  
  const handleDelete = (id: string) => {
    setCurrentArticleId(id);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (currentArticleId) {
      onDelete(currentArticleId);
    }
    setDeleteDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true, 
        locale: ptBR
      });
    } catch {
      return "Data desconhecida";
    }
  };

  return (
    <>
      <div className={viewMode === "grid" 
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
        : "space-y-4"
      }>
        {articles.map((article) => (
          <Card key={article.id} className={viewMode === "list" ? "overflow-hidden" : ""}>
            <CardContent className={`p-0 ${viewMode === "grid" ? "flex flex-col h-full" : ""}`}>
              {viewMode === "grid" ? (
                <div className="flex flex-col h-full">
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
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Dialog open={!!editingArticle} onOpenChange={(open) => !open && setEditingArticle(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Artigo Científico</DialogTitle>
            <DialogDescription>
              Atualize as informações do artigo científico.
            </DialogDescription>
          </DialogHeader>
          {editingArticle && (
            <ScientificArticleForm 
              articleData={editingArticle} 
              onSuccess={() => {
                setEditingArticle(null);
                onUpdate();
              }} 
              onCancel={() => setEditingArticle(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este artigo científico? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ScientificArticleList;
