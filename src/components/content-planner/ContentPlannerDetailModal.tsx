
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { ContentPlannerItem, ContentPlannerStatus } from "@/types/content-planner";
import { ScriptResponse } from "@/types/script";
import { cn } from "@/lib/utils";
import { fadeIn } from "@/lib/animations";
import { 
  PencilLine,
  FileText, 
  Paperclip, 
  CheckSquare, 
  SendHorizontal, 
  Save, 
  X, 
  Trash2, 
  Instagram, 
  Youtube, 
  ExternalLink
} from "lucide-react";

interface ContentPlannerDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ContentPlannerItem | null;
  onUpdate: (id: string, data: Partial<ContentPlannerItem>) => Promise<ContentPlannerItem | null>;
  onDelete: (id: string) => Promise<boolean>;
}

// Mock script data
const mockScript: ScriptResponse = {
  id: "script-1",
  title: "Script para vídeo sobre tratamentos faciais",
  content: "# Introdução\n\nOlá, pessoal! Hoje vamos falar sobre os tratamentos faciais mais eficientes para rejuvenescimento.\n\n# Benefícios\n\n- Redução de rugas\n- Aumento da elasticidade\n- Uniformização do tom da pele\n\n# Conclusão\n\nEsperamos que essas dicas ajudem você a escolher o tratamento ideal para sua pele!",
  type: "videoScript",
  createdAt: new Date().toISOString(),
  suggestedVideos: [],
  captionTips: [],
};

// Mock attachments
const mockAttachments = [
  { id: "att1", name: "Referencia_visual.jpg", type: "image", url: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7" },
  { id: "att2", name: "Cronograma.pdf", type: "pdf", url: "https://example.com/doc.pdf" },
];

// Mock subtasks
const mockSubtasks = [
  { id: "sub1", text: "Roteiro aprovado", completed: true },
  { id: "sub2", text: "Thumbnail criada", completed: false },
  { id: "sub3", text: "Equipamento reservado", completed: true },
  { id: "sub4", text: "Edição concluída", completed: false },
];

// Mock distribution platforms
const distributionPlatforms = [
  { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-500", published: false },
  { id: "youtube", name: "YouTube", icon: Youtube, color: "text-red-500", published: true },
];

const ContentPlannerDetailModal: React.FC<ContentPlannerDetailModalProps> = ({
  open,
  onOpenChange,
  item,
  onUpdate,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [subtasks, setSubtasks] = useState(mockSubtasks);
  const [newSubtask, setNewSubtask] = useState("");

  // Update local state when item changes
  React.useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description);
    }
  }, [item]);

  if (!item) return null;

  // Save changes
  const handleSave = async () => {
    if (!item) return;
    setSaving(true);
    
    try {
      await onUpdate(item.id, { 
        title, 
        description 
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update item:", error);
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!item) return;
    try {
      const success = await onDelete(item.id);
      if (success) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  // Toggle subtask completion
  const toggleSubtask = (id: string) => {
    setSubtasks(
      subtasks.map(subtask =>
        subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask
      )
    );
  };

  // Add new subtask
  const addSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([
        ...subtasks,
        { id: `sub${Date.now()}`, text: newSubtask, completed: false }
      ]);
      setNewSubtask("");
    }
  };

  // Navigate to script editor
  const goToScriptEditor = () => {
    if (item.scriptId) {
      navigate(`/scripts/${item.scriptId}`);
    } else {
      // If no script, redirect to create a new one
      navigate(`/script-generator?contentId=${item.id}&title=${encodeURIComponent(item.title)}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-2"
          >
            {isEditing ? (
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="text-xl font-semibold"
                placeholder="Título do conteúdo"
              />
            ) : (
              <div className="flex justify-between items-center">
                <DialogTitle className="text-xl">{title}</DialogTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                  <PencilLine className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                {item.format}
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                {item.objective}
              </Badge>
              {item.status && (
                <Badge variant="outline" className={cn(
                  item.status === 'idea' && "bg-blue-50 text-blue-600 border-blue-200",
                  item.status === 'script_generated' && "bg-purple-50 text-purple-600 border-purple-200",
                  item.status === 'approved' && "bg-green-50 text-green-600 border-green-200",
                  item.status === 'scheduled' && "bg-amber-50 text-amber-600 border-amber-200",
                  item.status === 'published' && "bg-indigo-50 text-indigo-600 border-indigo-200"
                )}>
                  {item.status === 'idea' && "Ideia"}
                  {item.status === 'script_generated' && "Roteiro Gerado"}
                  {item.status === 'approved' && "Aprovado"}
                  {item.status === 'scheduled' && "Agendado"}
                  {item.status === 'published' && "Publicado"}
                </Badge>
              )}
            </div>
          </motion.div>
        </DialogHeader>

        {/* Tabs for different sections */}
        <Tabs defaultValue="details" className="w-full mt-4">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="script">Roteiro</TabsTrigger>
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
            <TabsTrigger value="distribution">Distribuição</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                {isEditing ? (
                  <Textarea 
                    id="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Adicione uma descrição detalhada sobre este conteúdo..."
                    className="min-h-[150px]"
                  />
                ) : (
                  <div className="p-3 border rounded-md bg-gray-50 min-h-[100px]">
                    {description || "Sem descrição. Clique no ícone de edição para adicionar."}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Anexos</Label>
                  <Button variant="outline" size="sm">
                    <Paperclip className="h-3.5 w-3.5 mr-1" />
                    Adicionar
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {mockAttachments.map(attachment => (
                    <div 
                      key={attachment.id} 
                      className="border rounded-lg overflow-hidden flex flex-col"
                    >
                      <div className="h-20 overflow-hidden bg-gray-100 relative">
                        {attachment.type === "image" ? (
                          <img 
                            src={attachment.url} 
                            alt={attachment.name}
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <FileText className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <div className="p-2 text-xs truncate">{attachment.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    variant="secondary" 
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Script Tab */}
          <TabsContent value="script">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="space-y-4"
            >
              {item.scriptId ? (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">{mockScript.title}</h3>
                    <Button variant="outline" size="sm" onClick={goToScriptEditor}>
                      <FileText className="h-3.5 w-3.5 mr-1" />
                      Editar Roteiro
                    </Button>
                  </div>
                  
                  <Card className="p-4 bg-gray-50 border rounded-md whitespace-pre-line">
                    <div dangerouslySetInnerHTML={{ __html: mockScript.content.replace(/\n/g, '<br/>') }} />
                  </Card>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md bg-gray-50">
                  <FileText className="h-12 w-12 text-gray-400 mb-3" />
                  <h3 className="font-medium mb-2">Nenhum roteiro vinculado</h3>
                  <p className="text-muted-foreground mb-4">
                    Este conteúdo ainda não tem um roteiro associado.
                  </p>
                  <Button onClick={goToScriptEditor}>
                    Criar Roteiro
                  </Button>
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Checklist Tab */}
          <TabsContent value="checklist">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="space-y-4"
            >
              <div className="space-y-3">
                {subtasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-start space-x-2 p-2 border rounded-md hover:bg-gray-50"
                    onClick={() => toggleSubtask(task.id)}
                  >
                    <Checkbox checked={task.completed} />
                    <Label 
                      className={cn(
                        "cursor-pointer flex-1",
                        task.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {task.text}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                <Input
                  placeholder="Nova tarefa..."
                  value={newSubtask}
                  onChange={e => setNewSubtask(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && addSubtask()}
                  className="flex-1"
                />
                <Button onClick={addSubtask} variant="outline">Adicionar</Button>
              </div>
            </motion.div>
          </TabsContent>

          {/* Distribution Tab */}
          <TabsContent value="distribution">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="space-y-6"
            >
              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-3">Status de Distribuição</h3>
                
                <div className="space-y-3">
                  {distributionPlatforms.map(platform => (
                    <div key={platform.id} className="flex justify-between items-center p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <platform.icon className={cn("h-5 w-5", platform.color)} />
                        <span>{platform.name}</span>
                      </div>
                      
                      {platform.published ? (
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                          Publicado
                        </Badge>
                      ) : (
                        <Button size="sm" variant="outline">
                          <SendHorizontal className="h-3.5 w-3.5 mr-1" />
                          Distribuir
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-3">Detalhes do Agendamento</h3>
                
                {item.scheduledDate ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data agendada:</span>
                      <span className="font-medium">
                        {new Date(item.scheduledDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    
                    {item.scheduledTime && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Horário:</span>
                        <span className="font-medium">{item.scheduledTime}</span>
                      </div>
                    )}
                    
                    {item.calendarEventId && (
                      <Button variant="outline" size="sm" className="w-full mt-2">
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />
                        Ver no Calendário
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Este conteúdo ainda não foi agendado
                  </div>
                )}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 flex-wrap sm:justify-between">
          <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-1" />
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Este conteúdo será permanentemente excluído
                  do planner e todos os seus dados associados serão removidos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                  Excluir Permanentemente
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)} size="sm">
                <PencilLine className="h-4 w-4 mr-1" />
                Editar
              </Button>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)} size="sm">
              <X className="h-4 w-4 mr-1" />
              Fechar
            </Button>
            <Button onClick={handleSave} size="sm" disabled={!isEditing || saving}>
              <Save className="h-4 w-4 mr-1" />
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentPlannerDetailModal;
