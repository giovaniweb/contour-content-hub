
import React, { useState } from "react";
import { Eye, ThumbsUp, MoreVertical, Trash2, Edit, ExternalLink, MessageSquare, ShoppingCart, RefreshCcw, Phone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
import VideoForm from "./VideoForm";
import { MarketingObjectiveType } from "@/types/script";

// Function to normalize video URLs for embed
const getNormalizedVideoUrl = (url: string): string => {
  if (!url) return '';
  
  // If it's already in player format, return as is
  if (url.includes('player.vimeo.com/video')) {
    return url;
  }
  
  // Extract ID from vimeo.com/ID format
  const vimeoIdMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoIdMatch && vimeoIdMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoIdMatch[1]}`;
  }
  
  // Return original if no match
  return url;
};

// Get icon component based on marketing objective
const getObjectiveIcon = (objective?: MarketingObjectiveType) => {
  switch (objective) {
    case "🟡 Atrair Atenção":
    case "atrair_atencao":
      return <Eye className="h-4 w-4" />;
    case "🟢 Criar Conexão":
    case "criar_conexao":
      return <MessageSquare className="h-4 w-4" />;
    case "🔴 Fazer Comprar":
    case "fazer_comprar":
      return <ShoppingCart className="h-4 w-4" />;
    case "🔁 Reativar Interesse":
    case "reativar_interesse":
      return <RefreshCcw className="h-4 w-4" />;
    case "✅ Fechar Agora":
    case "fechar_agora":
      return <Phone className="h-4 w-4" />;
    default:
      return null;
  }
};

// Get objective title
const getObjectiveTitle = (objective?: MarketingObjectiveType): string => {
  switch (objective) {
    case "🟡 Atrair Atenção":
    case "atrair_atencao":
      return "Atrair Atenção";
    case "🟢 Criar Conexão":
    case "criar_conexao":
      return "Criar Conexão";
    case "🔴 Fazer Comprar":
    case "fazer_comprar":
      return "Fazer Comprar";
    case "🔁 Reativar Interesse":
    case "reativar_interesse":
      return "Reativar Interesse";
    case "✅ Fechar Agora":
    case "fechar_agora":
      return "Fechar Agora";
    default:
      return "";
  }
};

interface VideoListProps {
  videos: any[];
  onDelete: (id: string) => Promise<void>;
  onUpdate: () => void;
  viewMode: "grid" | "list";
}

const VideoList: React.FC<VideoListProps> = ({ videos, onDelete, onUpdate, viewMode }) => {
  const [editingVideo, setEditingVideo] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<any | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleDeleteClick = (id: string) => {
    setDeletingVideoId(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingVideoId) {
      await onDelete(deletingVideoId);
      setDeleteConfirmOpen(false);
      setDeletingVideoId(null);
    }
  };

  const handleEditClick = (video: any) => {
    setEditingVideo(video);
    setIsEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setEditingVideo(null);
    onUpdate();
  };

  const handlePreviewClick = (video: any) => {
    setPreviewVideo(video);
    setIsPreviewOpen(true);
  };

  const handleVideoUpdate = (updatedVideo: any) => {
    // Implement logic to update the video
  };

  const handleVideoAdded = (newVideo: any) => {
    // Implement logic to add a new video
  };

  // Render videos as grid
  if (viewMode === "grid") {
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.map((video) => (
            <div key={video.id} className="border rounded-lg overflow-hidden flex flex-col bg-card">
              <div 
                className="relative aspect-video bg-muted cursor-pointer"
                onClick={() => handlePreviewClick(video)}
              >
                {video.preview_url ? (
                  <img
                    src={video.preview_url}
                    alt={video.titulo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Sem prévia
                  </div>
                )}
                
                {/* Badges de contagem */}
                <div className="absolute bottom-2 right-2 flex gap-1">
                  {video.favoritos_count > 0 && (
                    <Badge variant="secondary" className="flex items-center">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      {video.favoritos_count}
                    </Badge>
                  )}
                  {video.compartilhamentos > 0 && (
                    <Badge variant="secondary" className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {video.compartilhamentos}
                    </Badge>
                  )}
                </div>
                
                {/* Novo badge para objetivo de marketing */}
                {video.objetivo_marketing && (
                  <div className="absolute top-2 left-2">
                    <Badge 
                      variant="secondary" 
                      className="flex items-center gap-1 bg-secondary/80 backdrop-blur-sm"
                      title={getObjectiveTitle(video.objetivo_marketing)}
                    >
                      {getObjectiveIcon(video.objetivo_marketing)}
                    </Badge>
                  </div>
                )}
                
                {/* Menu de ações */}
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="bg-background/80 backdrop-blur-sm rounded-full h-8 w-8 text-muted-foreground hover:text-foreground">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handlePreviewClick(video)}>
                        <Eye className="h-4 w-4 mr-2" /> Ver vídeo
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditClick(video)}>
                        <Edit className="h-4 w-4 mr-2" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClick(video.id)} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="p-3 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-sm line-clamp-1" title={video.titulo}>
                    {video.titulo}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {video.tipo_video === "video_pronto" ? "Pronto" : "Take"}
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2" title={video.descricao_curta}>
                  {video.descricao_curta || "Sem descrição"}
                </p>
                
                <div className="mt-auto">
                  {video.equipamentos && video.equipamentos.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {video.equipamentos.slice(0, 2).map((equipamento: string) => (
                        <Badge key={equipamento} variant="secondary" className="text-xs">
                          {equipamento}
                        </Badge>
                      ))}
                      {video.equipamentos.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{video.equipamentos.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Diálogo de edição */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Vídeo</DialogTitle>
            </DialogHeader>
            {editingVideo && (
              <VideoForm videoData={editingVideo} onSuccess={handleEditSuccess} onCancel={() => setIsEditDialogOpen(false)} />
            )}
          </DialogContent>
        </Dialog>
        
        {/* Diálogo de visualização */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{previewVideo?.titulo}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                {previewVideo?.url_video ? (
                  <iframe 
                    src={getNormalizedVideoUrl(previewVideo.url_video)}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    Não foi possível carregar o vídeo
                  </div>
                )}
              </div>
              
              {previewVideo && (
                <div>
                  <h3 className="font-semibold mb-1">{previewVideo.titulo}</h3>
                  <p className="text-muted-foreground text-sm">{previewVideo.descricao_curta}</p>
                  
                  {previewVideo.descricao_detalhada && (
                    <p className="mt-2 text-sm">{previewVideo.descricao_detalhada}</p>
                  )}
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {previewVideo.equipamentos?.map((equipamento: string) => (
                      <Badge key={equipamento} variant="secondary">
                        {equipamento}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href={previewVideo.url_video} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Abrir no Vimeo
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEditClick(previewVideo)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Confirmação de exclusão */}
        <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir vídeo</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este vídeo? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Sim, excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }
  
  // Render videos as list
  return (
    <>
      <div className="space-y-2">
        {videos.map((video) => (
          <div key={video.id} className="flex border rounded-lg bg-card overflow-hidden">
            <div 
              className="w-32 h-20 bg-muted cursor-pointer"
              onClick={() => handlePreviewClick(video)}
            >
              {video.preview_url ? (
                <img
                  src={video.preview_url}
                  alt={video.titulo}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                  Sem prévia
                </div>
              )}
            </div>
            
            <div className="flex-1 px-4 py-2 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium" onClick={() => handlePreviewClick(video)} style={{ cursor: 'pointer' }}>
                      {video.titulo}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {video.tipo_video === "video_pronto" ? "Pronto" : "Take"}
                    </Badge>
                    
                    {/* Novo badge para objetivo de marketing */}
                    {video.objetivo_marketing && (
                      <Badge 
                        variant="secondary" 
                        className="flex items-center gap-1"
                        title={getObjectiveTitle(video.objetivo_marketing)}
                      >
                        {getObjectiveIcon(video.objetivo_marketing)}
                        <span className="text-xs hidden sm:inline">{getObjectiveTitle(video.objetivo_marketing)}</span>
                      </Badge>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {video.descricao_curta || "Sem descrição"}
                </p>
              </div>
              
              <div className="flex items-center justify-between mt-1">
                <div className="flex gap-2">
                  {video.equipamentos && video.equipamentos.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {video.equipamentos.slice(0, 2).map((equipamento: string) => (
                        <Badge key={equipamento} variant="secondary" className="text-xs">
                          {equipamento}
                        </Badge>
                      ))}
                      {video.equipamentos.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{video.equipamentos.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {(video.favoritos_count > 0 || video.compartilhamentos > 0) && (
                    <div className="flex gap-2 items-center text-muted-foreground">
                      {video.favoritos_count > 0 && (
                        <span className="flex items-center text-xs">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          {video.favoritos_count}
                        </span>
                      )}
                      {video.compartilhamentos > 0 && (
                        <span className="flex items-center text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          {video.compartilhamentos}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-7" onClick={() => handlePreviewClick(video)}>
                    <Eye className="h-4 w-4 mr-1" />
                    <span className="sr-only md:not-sr-only">Ver</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7" onClick={() => handleEditClick(video)}>
                    <Edit className="h-4 w-4 mr-1" />
                    <span className="sr-only md:not-sr-only">Editar</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 text-destructive hover:text-destructive" onClick={() => handleDeleteClick(video.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    <span className="sr-only md:not-sr-only">Excluir</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Diálogo de edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Vídeo</DialogTitle>
          </DialogHeader>
          {editingVideo && (
            <VideoForm videoData={editingVideo} onSuccess={handleEditSuccess} onCancel={() => setIsEditDialogOpen(false)} />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de visualização */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewVideo?.titulo}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              {previewVideo?.url_video ? (
                <iframe 
                  src={getNormalizedVideoUrl(previewVideo.url_video)}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  Não foi possível carregar o vídeo
                </div>
              )}
            </div>
            
            {previewVideo && (
              <div>
                <h3 className="font-semibold mb-1">{previewVideo.titulo}</h3>
                <p className="text-muted-foreground text-sm">{previewVideo.descricao_curta}</p>
                
                {previewVideo.descricao_detalhada && (
                  <p className="mt-2 text-sm">{previewVideo.descricao_detalhada}</p>
                )}
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {previewVideo.equipamentos?.map((equipamento: string) => (
                    <Badge key={equipamento} variant="secondary">
                      {equipamento}
                    </Badge>
                  ))}
                </div>
                
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href={previewVideo.url_video} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Abrir no Vimeo
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEditClick(previewVideo)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Confirmação de exclusão */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir vídeo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este vídeo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Edit Modal */}
      {isEditModalOpen && selectedVideo && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Vídeo</DialogTitle>
              <DialogDescription>
                Faça alterações nas informações do vídeo abaixo.
              </DialogDescription>
            </DialogHeader>
            
            <VideoForm 
              videoData={selectedVideo} 
              onSuccess={handleVideoUpdate} 
              onCancel={() => setIsEditModalOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      )}
      
      {/* Add Video Modal */}
      {isAddModalOpen && (
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Vídeo</DialogTitle>
              <DialogDescription>
                Preencha as informações do vídeo abaixo.
              </DialogDescription>
            </DialogHeader>
            
            <VideoForm 
              onSuccess={handleVideoAdded} 
              onCancel={() => setIsAddModalOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default VideoList;
