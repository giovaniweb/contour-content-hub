import React, { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  FileText, 
  Sparkles, 
  Trash2, 
  Save, 
  PenSquare, 
  Check, 
  ArrowRight, 
  Upload, 
  FileImage, 
  CheckSquare
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { motion } from "framer-motion";
import { modalVariants } from "@/lib/animations";
import { ContentPlannerItem, ContentFormat, ContentDistribution } from "@/types/content-planner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContentPlannerDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ContentPlannerItem | null;
  onUpdate: (item: ContentPlannerItem) => void;
  onDelete: (id: string) => void;
  onGenerateScript?: (item: ContentPlannerItem) => void;
  onValidate?: (item: ContentPlannerItem) => void;
}

const ContentPlannerDetailModal: React.FC<ContentPlannerDetailModalProps> = ({
  open,
  onOpenChange,
  item,
  onUpdate,
  onDelete,
  onGenerateScript,
  onValidate
}) => {
  const { toast } = useToast();
  const [editedItem, setEditedItem] = useState<ContentPlannerItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Roteiro aprovado", checked: false },
    { id: 2, text: "Thumbnail criado", checked: false },
    { id: 3, text: "Conteúdo gravado", checked: false },
    { id: 4, text: "Edição concluída", checked: false },
  ]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [filePreviewUrls, setFilePreviewUrls] = useState<{ file: File, url: string }[]>([]);
  
  useEffect(() => {
    if (item) {
      setEditedItem({...item});
    }
  }, [item]);
  
  const handleSave = () => {
    if (!editedItem) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      onUpdate(editedItem);
      toast({
        title: "Alterações salvas",
        description: "As informações foram atualizadas com sucesso."
      });
      setIsLoading(false);
    }, 500);
  };
  
  const handleDelete = () => {
    if (!editedItem) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      onDelete(editedItem.id);
      onOpenChange(false);
      toast({
        title: "Item removido",
        description: "O item foi removido do planner."
      });
      setIsLoading(false);
    }, 500);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      
      // Generate preview URLs for the new files
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreviewUrls(prev => [
            ...prev, 
            { file, url: reader.result as string }
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  const handleRemoveFile = (file: File) => {
    setUploadedFiles(prev => prev.filter(f => f !== file));
    setFilePreviewUrls(prev => prev.filter(item => item.file !== file));
  };
  
  const handleChecklistChange = (id: number, checked: boolean) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, checked } : item
    ));
  };
  
  const handleDistribute = (platform: string) => {
    toast({
      title: `Enviando para ${platform}`,
      description: "O conteúdo será distribuído em breve."
    });
  };
  
  if (!editedItem) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <motion.div 
          className="flex flex-col h-full"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-lg">{editedItem.title}</span>
              {editedItem.status === "approved" && (
                <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                  Aprovado
                </Badge>
              )}
              {editedItem.status === "published" && (
                <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                  Publicado
                </Badge>
              )}
              {editedItem.aiGenerated && (
                <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">
                  <Sparkles className="h-3 w-3 mr-1" />
                  IA
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              ID: {editedItem.id.substring(0, 8)}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="w-full justify-start mb-4 border-b pb-0">
              <TabsTrigger value="details" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none">
                Detalhes
              </TabsTrigger>
              <TabsTrigger value="script" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none">
                Roteiro
              </TabsTrigger>
              <TabsTrigger value="attachments" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none">
                Anexos
              </TabsTrigger>
              <TabsTrigger value="checklist" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none">
                Checklist
              </TabsTrigger>
              <TabsTrigger value="distribution" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none">
                Distribuição
              </TabsTrigger>
            </TabsList>
            
            <ScrollArea className="flex-1 overflow-y-auto pr-4">
              <TabsContent value="details" className="mt-0 h-full">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={editedItem.title}
                      onChange={(e) => setEditedItem({...editedItem, title: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={editedItem.description || ''}
                      onChange={(e) => setEditedItem({...editedItem, description: e.target.value})}
                      rows={5}
                      className="min-h-[120px]"
                      placeholder="Adicione detalhes sobre este conteúdo..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="format">Formato</Label>
                      <Select 
                        value={editedItem.format} 
                        onValueChange={(value) => setEditedItem({...editedItem, format: value as ContentFormat})}
                      >
                        <SelectTrigger id="format">
                          <SelectValue placeholder="Selecione o formato" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Formatos</SelectLabel>
                            <SelectItem value="vídeo">Vídeo</SelectItem>
                            <SelectItem value="story">Story</SelectItem>
                            <SelectItem value="carrossel">Carrossel</SelectItem>
                            <SelectItem value="reels">Reels</SelectItem>
                            <SelectItem value="texto">Texto</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={editedItem.status} 
                        onValueChange={(value) => setEditedItem({...editedItem, status: value as any})}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="idea">Ideia</SelectItem>
                          <SelectItem value="approved">Executar</SelectItem>
                          <SelectItem value="published">Publicar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="objective">Objetivo</Label>
                      <Select 
                        value={editedItem.objective} 
                        onValueChange={(value) => setEditedItem({...editedItem, objective: value})}
                      >
                        <SelectTrigger id="objective">
                          <SelectValue placeholder="Selecione o objetivo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="🟡 Atrair Atenção">🟡 Atrair Atenção</SelectItem>
                          <SelectItem value="🟢 Criar Conexão">🟢 Criar Conexão</SelectItem>
                          <SelectItem value="🔴 Fazer Comprar">🔴 Fazer Comprar</SelectItem>
                          <SelectItem value="🔁 Reativar Interesse">🔁 Reativar Interesse</SelectItem>
                          <SelectItem value="✅ Fechar Agora">✅ Fechar Agora</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="distribution">Canal de Distribuição</Label>
                      <Select 
                        value={editedItem.distribution || ''} 
                        onValueChange={(value) => setEditedItem({...editedItem, distribution: value as ContentDistribution})}
                      >
                        <SelectTrigger id="distribution">
                          <SelectValue placeholder="Selecione o canal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Instagram">Instagram</SelectItem>
                          <SelectItem value="YouTube">YouTube</SelectItem>
                          <SelectItem value="TikTok">TikTok</SelectItem>
                          <SelectItem value="Blog">Blog</SelectItem>
                          <SelectItem value="Múltiplos">Múltiplos</SelectItem>
                          <SelectItem value="Outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                    <Input
                      id="tags"
                      value={editedItem.tags.join(', ')}
                      onChange={(e) => {
                        const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                        setEditedItem({...editedItem, tags: tagsArray});
                      }}
                      placeholder="skin, facial, botox, etc."
                    />
                  </div>
                  
                  {editedItem.scheduledDate && (
                    <div>
                      <Label htmlFor="scheduledDate">Data de Publicação</Label>
                      <Input
                        id="scheduledDate"
                        type="date"
                        value={new Date(editedItem.scheduledDate).toISOString().split('T')[0]}
                        onChange={(e) => setEditedItem({...editedItem, scheduledDate: new Date(e.target.value).toISOString()})}
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="script" className="mt-0">
                {editedItem.scriptId ? (
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-500" />
                          Roteiro Vinculado
                        </CardTitle>
                        <CardDescription>
                          ID do Roteiro: {editedItem.scriptId}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-muted p-4 rounded-md">
                          <p className="text-sm">
                            # {editedItem.title}
                            
                            ## Introdução
                            Este é um roteiro para {editedItem.format} sobre {editedItem.title}.
                            
                            ## Objetivo: {editedItem.objective}
                            
                            ## Conteúdo Principal
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel diam at nunc finibus tempor. Sed euismod, velit at congue tincidunt, nisl nunc aliquet nisl, nec tincidunt nisl velit at magna.
                            
                            ## Conclusão
                            Chame para ação específica com foco no objetivo.
                          </p>
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button variant="outline" className="flex items-center gap-2">
                            <PenSquare className="h-4 w-4" />
                            Editar Roteiro
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhum roteiro vinculado</h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                      Este item ainda não possui um roteiro. Gere um novo roteiro para ter mais detalhes sobre o conteúdo.
                    </p>
                    {onGenerateScript && (
                      <Button onClick={() => onGenerateScript(editedItem)} className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Gerar Roteiro
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="attachments" className="mt-0">
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Anexos</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-8">
                      <div className="flex flex-col items-center justify-center">
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <Label 
                          htmlFor="file-upload" 
                          className="font-medium cursor-pointer"
                        >
                          Clique para fazer upload
                        </Label>
                        <span className="text-sm text-muted-foreground mt-1">
                          ou arraste e solte os arquivos aqui
                        </span>
                        <input 
                          id="file-upload" 
                          type="file" 
                          onChange={handleFileChange}
                          className="hidden"
                          multiple
                          accept="image/*,video/*,application/pdf"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {filePreviewUrls.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Arquivos anexados ({filePreviewUrls.length})</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {filePreviewUrls.map((item, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square bg-muted rounded-md overflow-hidden">
                              {item.file.type.startsWith('image/') ? (
                                <img 
                                  src={item.url} 
                                  alt={item.file.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="flex items-center justify-center w-full h-full">
                                  <FileImage className="h-10 w-10 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-white hover:bg-white/20"
                                onClick={() => handleRemoveFile(item.file)}
                              >
                                Remover
                              </Button>
                            </div>
                            <div className="mt-1 text-xs truncate">{item.file.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="checklist" className="mt-0">
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Lista de Tarefas</Label>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          {checklist.map((item) => (
                            <div key={item.id} className="flex items-center space-x-3">
                              <Checkbox 
                                id={`checklist-${item.id}`} 
                                checked={item.checked}
                                onCheckedChange={(checked) => 
                                  handleChecklistChange(item.id, checked === true)
                                }
                              />
                              <Label htmlFor={`checklist-${item.id}`} className={`${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                                {item.text}
                              </Label>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-6 pt-4 border-t flex justify-between items-center">
                          <div>
                            <Label className="text-sm">Progresso</Label>
                            <div className="w-full bg-muted mt-1 rounded-full h-2 overflow-hidden">
                              <div 
                                className="bg-primary h-2 rounded-full"
                                style={{ 
                                  width: `${(checklist.filter(item => item.checked).length / checklist.length) * 100}%` 
                                }}
                              >
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {checklist.filter(item => item.checked).length}/{checklist.length}
                          </Badge>
                        </div>
                        
                        <div className="mt-4">
                          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                            <CheckSquare className="h-4 w-4" />
                            Adicionar Item
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="distribution" className="mt-0">
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Canal de Distribuição</Label>
                    <Select 
                      value={editedItem.distribution || ''} 
                      onValueChange={(value) => setEditedItem({...editedItem, distribution: value as ContentDistribution})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o canal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="YouTube">YouTube</SelectItem>
                        <SelectItem value="TikTok">TikTok</SelectItem>
                        <SelectItem value="Blog">Blog</SelectItem>
                        <SelectItem value="Múltiplos">Múltiplos</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Opções de Distribuição</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button 
                        variant="outline" 
                        className="flex items-center justify-between w-full"
                        onClick={() => handleDistribute('Instagram')}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 flex items-center justify-center text-white">
                            <span className="text-lg font-bold">In</span>
                          </div>
                          <span>Instagram</span>
                        </div>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="flex items-center justify-between w-full"
                        onClick={() => handleDistribute('Facebook')}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                            <span className="text-lg font-bold">f</span>
                          </div>
                          <span>Facebook</span>
                        </div>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="flex items-center justify-between w-full"
                        onClick={() => handleDistribute('YouTube')}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white">
                            <span className="text-lg font-bold">▶</span>
                          </div>
                          <span>YouTube</span>
                        </div>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="flex items-center justify-between w-full"
                        onClick={() => handleDistribute('TikTok')}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white">
                            <span className="text-lg font-bold">TT</span>
                          </div>
                          <span>TikTok</span>
                        </div>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      
                      <div className="pt-2">
                        <Label className="text-sm font-medium mb-2 block">Status de Publicação</Label>
                        <div className="flex items-center gap-2">
                          {editedItem.status === "published" ? (
                            <Badge className="bg-green-100 text-green-800">Publicado</Badge>
                          ) : editedItem.status === "approved" ? (
                            <Badge className="bg-blue-100 text-blue-800">Para Executar</Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-800">Ideia</Badge>
                          )}
                          
                          {editedItem.scheduledDate && (
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(editedItem.scheduledDate).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
          
          <DialogFooter className="mt-6 pt-4 border-t flex justify-between">
            <div>
              <Button 
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Excluir
              </Button>
            </div>
            
            <div className="flex gap-2">
              {onValidate && editedItem.status === "idea" && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onValidate(editedItem)}
                  disabled={isLoading}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Validar Ideia
                </Button>
              )}
              
              {onGenerateScript && editedItem.status === "idea" && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onGenerateScript(editedItem)}
                  disabled={isLoading}
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  Gerar Roteiro
                </Button>
              )}
              
              <Button 
                onClick={handleSave} 
                size="sm"
                disabled={isLoading}
              >
                <Save className="h-4 w-4 mr-1" />
                Salvar
              </Button>
            </div>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentPlannerDetailModal;
