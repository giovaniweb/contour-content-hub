
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Heart, Share2, Bookmark, MoreVertical, Pencil, Trash2, ExternalLink, Video } from "lucide-react";
import VideoForm from "./VideoForm";
import { useToast } from "@/hooks/use-toast";

interface VideoListProps {
  videos: any[];
  onDelete: (id: string) => Promise<void>;
  onUpdate: () => void;
  viewMode: "grid" | "list";
}

const VideoList: React.FC<VideoListProps> = ({ videos, onDelete, onUpdate, viewMode }) => {
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);
  const [viewVideoUrl, setViewVideoUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleEditSuccess = () => {
    setEditingVideoId(null);
    onUpdate();
    toast({
      title: "Vídeo atualizado",
      description: "As alterações foram salvas com sucesso."
    });
  };

  const handleShareVideo = (video: any) => {
    // Copy video link to clipboard
    navigator.clipboard.writeText(video.url_video);
    toast({
      title: "Link copiado",
      description: "O link do vídeo foi copiado para a área de transferência."
    });
  };

  const getVideoTypeLabel = (type: string) => {
    switch (type) {
      case 'video':
        return <Badge>Vídeo Pronto</Badge>;
      case 'raw':
        return <Badge variant="outline">Take Bruto</Badge>;
      case 'image':
        return <Badge variant="secondary">Imagem</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getVideoThumbUrl = (video: any) => {
    if (video.preview_url) return video.preview_url;
    
    // Default placeholder based on type
    return '/placeholder.svg';
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <Card key={video.id} className="overflow-hidden flex flex-col">
          <div 
            className="aspect-video bg-muted overflow-hidden cursor-pointer"
            onClick={() => setViewVideoUrl(video.url_video)}
          >
            <img 
              src={getVideoThumbUrl(video)} 
              alt={video.titulo} 
              className="w-full h-full object-cover object-center transition-transform hover:scale-105"
            />
          </div>
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg line-clamp-2">{video.titulo}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Opções</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setViewVideoUrl(video.url_video)}>
                    <ExternalLink className="h-4 w-4 mr-2" /> Ver Vídeo
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEditingVideoId(video.id)}>
                    <Pencil className="h-4 w-4 mr-2" /> Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setDeletingVideoId(video.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex gap-2 mt-2">
              {getVideoTypeLabel(video.tipo)}
              {video.equipamento && <Badge variant="outline">{video.equipamento}</Badge>}
            </div>
            <CardDescription className="line-clamp-2 mt-2">
              {video.descricao}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-1 p-4 pt-0 flex-grow">
            {video.tags && video.tags.slice(0, 5).map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {video.tags && video.tags.length > 5 && (
              <Badge variant="secondary" className="text-xs">
                +{video.tags.length - 5}
              </Badge>
            )}
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <div className="flex gap-4">
              <Button variant="ghost" size="icon">
                <Heart className="h-4 w-4" />
                <span className="sr-only">Curtir</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Bookmark className="h-4 w-4" />
                <span className="sr-only">Salvar</span>
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleShareVideo(video)}
            >
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Compartilhar</span>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Thumbnail</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Equipamento</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {videos.map((video) => (
            <TableRow key={video.id}>
              <TableCell>
                <div 
                  className="w-16 h-9 bg-muted rounded overflow-hidden cursor-pointer"
                  onClick={() => setViewVideoUrl(video.url_video)}
                >
                  <img 
                    src={getVideoThumbUrl(video)} 
                    alt={video.titulo} 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">
                <div className="line-clamp-1">{video.titulo}</div>
              </TableCell>
              <TableCell>{getVideoTypeLabel(video.tipo)}</TableCell>
              <TableCell>
                {video.equipamento ? video.equipamento : '-'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setViewVideoUrl(video.url_video)}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingVideoId(video.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDeletingVideoId(video.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <>
      {viewMode === "grid" ? renderGridView() : renderListView()}

      {/* Edit Video Dialog */}
      {editingVideoId && (
        <Dialog open={!!editingVideoId} onOpenChange={() => setEditingVideoId(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Vídeo</DialogTitle>
              <DialogDescription>
                Modifique os detalhes do vídeo conforme necessário.
              </DialogDescription>
            </DialogHeader>
            <VideoForm 
              videoId={editingVideoId}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingVideoId(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingVideoId} onOpenChange={() => setDeletingVideoId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente este vídeo
              da biblioteca de conteúdo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={async () => {
                if (deletingVideoId) {
                  await onDelete(deletingVideoId);
                  setDeletingVideoId(null);
                }
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Video Preview Dialog */}
      <Dialog open={!!viewVideoUrl} onOpenChange={() => setViewVideoUrl(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Visualização do Vídeo</DialogTitle>
          </DialogHeader>
          {viewVideoUrl && (
            <div className="aspect-video">
              <iframe
                src={viewVideoUrl}
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoList;
