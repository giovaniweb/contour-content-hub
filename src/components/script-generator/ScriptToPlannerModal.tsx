
import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Check, Instagram, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContentDistribution, ContentPlannerStatus } from "@/types/content-planner";
import { useToast } from "@/hooks/use-toast";
import { useContentPlanner } from "@/hooks/useContentPlanner";

interface ScriptToPlannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scriptTitle: string;
  scriptContent: string;
}

const ScriptToPlannerModal: React.FC<ScriptToPlannerModalProps> = ({
  open,
  onOpenChange,
  scriptTitle,
  scriptContent,
}) => {
  const { toast } = useToast();
  const { addItem } = useContentPlanner();
  const [title, setTitle] = useState(scriptTitle);
  const [description, setDescription] = useState(scriptContent);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [status, setStatus] = useState<ContentPlannerStatus>("script_generated");
  const [platforms, setPlatforms] = useState({
    instagram: true,
    youtube: false,
    tiktok: false,
  });

  const handlePlatformChange = (platform: keyof typeof platforms) => {
    setPlatforms(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  const handleSubmit = async () => {
    // Generate distribution string based on selected platforms
    const distributionPlatforms = [];
    if (platforms.instagram) distributionPlatforms.push("Instagram");
    if (platforms.youtube) distributionPlatforms.push("YouTube");
    if (platforms.tiktok) distributionPlatforms.push("TikTok");

    // Convert to proper ContentDistribution type
    let distribution: ContentDistribution = "Instagram";
    
    if (distributionPlatforms.length > 1) {
      distribution = "Múltiplos";
    } else if (distributionPlatforms.length === 1) {
      // We're safe here since we're checking if it's one of our valid types
      distribution = distributionPlatforms[0] as ContentDistribution;
    }

    // Create tags based on content
    const tags = [];
    if (scriptTitle.toLowerCase().includes("tutorial")) tags.push("tutorial");
    if (scriptContent.toLowerCase().includes("antes e depois")) tags.push("antes e depois");
    tags.push("roteiro");

    try {
      // Add item to content planner
      await addItem({
        title,
        description,
        status,
        tags,
        format: "vídeo",
        objective: "🟢 Criar Conexão",
        distribution,
        scriptId: `script-${Date.now()}`,
        authorId: "current-user",
        scheduledDate: date ? date.toISOString() : undefined,
        aiGenerated: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: "Roteiro adicionado ao planner",
        description: "O roteiro foi salvo com sucesso no planner de conteúdo.",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding script to planner:", error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar ao planner",
        description: "Não foi possível adicionar o roteiro ao planner.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Adicionar ao Planner</DialogTitle>
          <DialogDescription>
            Envie este roteiro para o planner de conteúdo e organize sua produção.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do conteúdo"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descrição / Roteiro</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes do roteiro"
              className="h-32"
            />
          </div>

          <div className="grid gap-2">
            <Label>Data de execução prevista</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label>Status inicial</Label>
            <RadioGroup
              value={status}
              onValueChange={(value) => setStatus(value as ContentPlannerStatus)}
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="idea" id="status-idea" />
                <Label htmlFor="status-idea">Ideia</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="script_generated" id="status-script" />
                <Label htmlFor="status-script">Roteiro Pronto</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="approved" id="status-approved" />
                <Label htmlFor="status-approved">Aprovado</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="scheduled" id="status-scheduled" />
                <Label htmlFor="status-scheduled">Agendado</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label>Canais de distribuição</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={platforms.instagram ? "default" : "outline"}
                size="sm"
                className={cn(
                  "flex items-center gap-1",
                  platforms.instagram && "bg-gradient-to-r from-purple-500 to-pink-500"
                )}
                onClick={() => handlePlatformChange("instagram")}
              >
                <Instagram className="h-4 w-4" />
                Instagram
                {platforms.instagram && <Check className="h-3 w-3 ml-1" />}
              </Button>
              <Button
                type="button"
                variant={platforms.youtube ? "default" : "outline"}
                size="sm"
                className={cn(
                  "flex items-center gap-1",
                  platforms.youtube && "bg-red-600"
                )}
                onClick={() => handlePlatformChange("youtube")}
              >
                <Youtube className="h-4 w-4" />
                YouTube
                {platforms.youtube && <Check className="h-3 w-3 ml-1" />}
              </Button>
              <Button
                type="button"
                variant={platforms.tiktok ? "default" : "outline"}
                size="sm"
                className={cn(
                  "flex items-center gap-1", 
                  platforms.tiktok && "bg-black"
                )}
                onClick={() => handlePlatformChange("tiktok")}
              >
                {/* Using a text label instead of an icon since TikTok icon isn't available in lucide-react */}
                <span className="text-xs font-bold">TT</span>
                TikTok
                {platforms.tiktok && <Check className="h-3 w-3 ml-1" />}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-gradient-to-r from-fluida-blue to-fluida-pink text-white"
          >
            Adicionar ao Planner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScriptToPlannerModal;
