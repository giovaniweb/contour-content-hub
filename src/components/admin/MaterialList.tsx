
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
import { 
  Share2, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  ExternalLink, 
  Download, 
  FileText,
  Image as ImageIcon,
  Box
} from "lucide-react";
import MaterialForm from "./MaterialForm";
import { useToast } from "@/hooks/use-toast";

interface MaterialListProps {
  materials: any[];
  onDelete: (id: string) => Promise<void>;
  onUpdate: () => void;
  viewMode: "grid" | "list";
}

const MaterialList: React.FC<MaterialListProps> = ({ materials, onDelete, onUpdate, viewMode }) => {
  const [editingMaterialId, setEditingMaterialId] = useState<string | null>(null);
  const [deletingMaterialId, setDeletingMaterialId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleEditSuccess = () => {
    setEditingMaterialId(null);
    onUpdate();
    toast({
      title: "Material atualizado",
      description: "As alterações foram salvas com sucesso."
    });
  };

  const handleShareMaterial = (material: any) => {
    // Copy material link to clipboard
    navigator.clipboard.writeText(material.arquivo_url);
    toast({
      title: "Link copiado",
      description: "O link do material foi copiado para a área de transferência."
    });
  };

  const getMaterialIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-6 w-6" />;
      case 'psd':
        return <Box className="h-6 w-6" />;
      case 'logomarca':
      case 'imagem':
        return <ImageIcon className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  const getMaterialTypeLabel = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'pdf':
        return <Badge variant="outline">PDF</Badge>;
      case 'psd':
        return <Badge>PSD</Badge>;
      case 'logomarca':
        return <Badge variant="secondary">Logomarca</Badge>;
      case 'imagem':
        return <Badge variant="outline">Imagem</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {materials.map((material) => (
        <Card key={material.id} className="overflow-hidden flex flex-col">
          <div 
            className="aspect-video bg-muted overflow-hidden cursor-pointer"
            onClick={() => window.open(material.arquivo_url, '_blank')}
          >
            {material.preview_url ? (
              <img 
                src={material.preview_url} 
                alt={material.nome} 
                className="w-full h-full object-cover object-center transition-transform hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                {getMaterialIcon(material.tipo)}
              </div>
            )}
          </div>
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-md line-clamp-2">{material.nome}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Opções</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => window.open(material.arquivo_url, '_blank')}>
                    <Download className="h-4 w-4 mr-2" /> Baixar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEditingMaterialId(material.id)}>
                    <Pencil className="h-4 w-4 mr-2" /> Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setDeletingMaterialId(material.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex gap-2 mt-2">
              {getMaterialTypeLabel(material.tipo)}
              {material.categoria && <Badge variant="outline">{material.categoria}</Badge>}
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-1 p-4 pt-0 flex-grow">
            {material.tags && material.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.open(material.arquivo_url, '_blank')}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleShareMaterial(material)}
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
            <TableHead className="w-[50px]">Tipo</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material) => (
            <TableRow key={material.id}>
              <TableCell>
                <div className="flex justify-center">
                  {getMaterialIcon(material.tipo)}
                </div>
              </TableCell>
              <TableCell className="font-medium">
                <div className="line-clamp-1">{material.nome}</div>
              </TableCell>
              <TableCell>
                {material.categoria ? material.categoria : '-'}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1 max-w-xs">
                  {material.tags && material.tags.map((tag: string, index: number) => 
                    index < 3 ? (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ) : index === 3 ? (
                      <Badge key="more" variant="outline" className="text-xs">
                        +{material.tags.length - 3}
                      </Badge>
                    ) : null
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.open(material.arquivo_url, '_blank')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingMaterialId(material.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDeletingMaterialId(material.id)}
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

      {/* Edit Material Dialog */}
      {editingMaterialId && (
        <Dialog open={!!editingMaterialId} onOpenChange={() => setEditingMaterialId(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Material</DialogTitle>
              <DialogDescription>
                Modifique os detalhes do material conforme necessário.
              </DialogDescription>
            </DialogHeader>
            <MaterialForm 
              materialId={editingMaterialId}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingMaterialId(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingMaterialId} onOpenChange={() => setDeletingMaterialId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente este material
              da biblioteca de conteúdo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={async () => {
                if (deletingMaterialId) {
                  await onDelete(deletingMaterialId);
                  setDeletingMaterialId(null);
                }
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MaterialList;
