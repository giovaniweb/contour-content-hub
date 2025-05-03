
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import ScientificArticleForm from "./ScientificArticleForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import ArticleGridView from './article-list/ArticleGridView';
import ArticleListView from './article-list/ArticleListView';

interface ScientificArticleListProps {
  articles: any[];
  onDelete: (id: string) => void;
  onUpdate: (article: any) => void; // Fixed: Properly define the expected parameter
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
      {viewMode === "grid" ? (
        <ArticleGridView 
          articles={articles} 
          formatDate={formatDate} 
          handleEdit={handleEdit} 
          handleDelete={handleDelete} 
        />
      ) : (
        <ArticleListView 
          articles={articles} 
          formatDate={formatDate} 
          handleEdit={handleEdit} 
          handleDelete={handleDelete} 
        />
      )}
      
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
                onUpdate(editingArticle); // Pass the article to onUpdate
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
