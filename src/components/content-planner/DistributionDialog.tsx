import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ContentPlannerItem } from "@/types/content-planner";
import { Calendar, Image, Hash, Instagram, Youtube, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Custom TikTok icon
const TikTokIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
};

interface PlatformConfig {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  connected: boolean;
  suggestedCaption?: string;
  suggestedHashtags?: string[];
}

interface DistributionDialogProps {
  open: boolean;
  onClose: () => void;
  item: ContentPlannerItem | null;
  onDistribute: (platforms: string[]) => void;
}

const platformConfigs: PlatformConfig[] = [
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "text-pink-500",
    connected: true,
    suggestedCaption: "✨ Descubra como nossos tratamentos podem transformar sua pele! Este procedimento traz resultados incríveis em apenas algumas sessões. Agende uma avaliação pelo link na bio! ✨",
    suggestedHashtags: ["estetica", "beleza", "autoestima", "pele", "tratamentofacial", "clinicadeestetica"]
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: TikTokIcon,
    color: "text-black dark:text-white",
    connected: false
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    color: "text-red-500",
    connected: true,
    suggestedCaption: "Neste vídeo demonstramos como funciona o equipamento de última geração para tratamentos faciais. Assista até o final para conhecer todos os benefícios e resultados que você pode obter!",
    suggestedHashtags: ["tratamentofacial", "esteticaavancada", "tecnologiaestetica", "cuidadoscomapele", "antienvelhecimento"]
  }
];

const DistributionDialog: React.FC<DistributionDialogProps> = ({
  open,
  onClose,
  item,
  onDistribute
}) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Record<string, boolean>>({});
  const [activePlatform, setActivePlatform] = useState<string | null>(null);
  const [captions, setCaptions] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});
  const [isScheduling, setIsScheduling] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (open) {
      // Reset state when dialog opens
      setSelectedPlatforms({});
      setCaptions({});
      setIsGenerating({});
      setActivePlatform(null);
    }
  }, [open]);

  const handlePlatformSelection = (platform: string) => {
    setSelectedPlatforms(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));

    // Set as active platform if selected
    if (!selectedPlatforms[platform]) {
      setActivePlatform(platform);
    }
  };

  const handleCaptionChange = (platform: string, caption: string) => {
    setCaptions(prev => ({
      ...prev,
      [platform]: caption
    }));
  };

  const generateCaption = (platform: string) => {
    setIsGenerating(prev => ({ ...prev, [platform]: true }));
    
    // Simulate AI caption generation
    setTimeout(() => {
      const config = platformConfigs.find(p => p.id === platform);
      if (config?.suggestedCaption) {
        setCaptions(prev => ({
          ...prev,
          [platform]: config.suggestedCaption || ""
        }));
      }
      setIsGenerating(prev => ({ ...prev, [platform]: false }));
      
      toast({
        title: "Legenda gerada",
        description: `Legenda para ${platform} gerada com sucesso!`,
      });
    }, 1500);
  };

  const distributeContent = () => {
    const selected = Object.entries(selectedPlatforms)
      .filter(([_, isSelected]) => isSelected)
      .map(([platform]) => platform);
    
    if (selected.length === 0) {
      toast({
        title: "Nenhuma plataforma selecionada",
        description: "Selecione pelo menos uma plataforma para distribuição.",
        variant: "destructive"
      });
      return;
    }

    setIsScheduling(true);
    
    // Simulate distribution process
    setTimeout(() => {
      onDistribute(selected);
      setIsScheduling(false);
      onClose();
      
      toast({
        title: "Conteúdo distribuído",
        description: `Conteúdo distribuído para ${selected.length} plataforma(s) com sucesso!`,
      });
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-fluida-blue to-fluida-pink">
              Distribuir Conteúdo
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Platform selection */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">Escolha as plataformas:</h3>
            
            <div className="space-y-3">
              {platformConfigs.map(platform => (
                <motion.div
                  key={platform.id}
                  whileHover={{ scale: 1.02 }}
                  className={cn(
                    "flex items-center space-x-3 p-3 border rounded-lg cursor-pointer",
                    selectedPlatforms[platform.id] && "border-primary bg-primary/5"
                  )}
                  onClick={() => platform.connected && handlePlatformSelection(platform.id)}
                >
                  {platform.connected ? (
                    <Checkbox
                      id={`platform-${platform.id}`}
                      checked={!!selectedPlatforms[platform.id]}
                      onCheckedChange={() => handlePlatformSelection(platform.id)}
                    />
                  ) : (
                    <div className="w-4 h-4 flex items-center justify-center">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center">
                      <platform.icon className={cn("h-4 w-4 mr-2", platform.color)} />
                      <Label
                        htmlFor={`platform-${platform.id}`}
                        className="cursor-pointer"
                      >
                        {platform.name}
                      </Label>
                    </div>
                    
                    {!platform.connected && (
                      <p className="text-xs text-amber-500 mt-1">
                        Não conectado. Visite Integrações para configurar.
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="pt-2">
              {item && (
                <div className="text-sm">
                  <h4 className="font-medium mb-1">Conteúdo original:</h4>
                  <p className="text-muted-foreground text-xs">{item.title}</p>
                  
                  <div className="mt-2 pt-2 border-t">
                    <h4 className="font-medium mb-1">Formato:</h4>
                    <p className="text-muted-foreground text-xs">{item.format}</p>
                  </div>
                  
                  <div className="mt-2 pt-2 border-t">
                    <h4 className="font-medium mb-1">Tags:</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-0.5 bg-muted text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right column - Platform configuration */}
          <div className="md:col-span-2 space-y-4">
            <Tabs 
              defaultValue="edit" 
              className="w-full"
              value={Object.values(selectedPlatforms).some(Boolean) ? "edit" : "info"}
            >
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="edit">Editar Conteúdo</TabsTrigger>
                <TabsTrigger value="info">Informações</TabsTrigger>
              </TabsList>
              
              <TabsContent value="edit" className="space-y-4 pt-4">
                {!Object.values(selectedPlatforms).some(Boolean) ? (
                  <Alert className="bg-muted">
                    <AlertDescription className="text-center py-4">
                      Selecione pelo menos uma plataforma para configurar a distribuição
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <div className="flex gap-2 mb-4 border-b pb-2">
                      {Object.entries(selectedPlatforms)
                        .filter(([_, isSelected]) => isSelected)
                        .map(([platform]) => {
                          const config = platformConfigs.find(p => p.id === platform);
                          return (
                            <Button
                              key={platform}
                              variant={activePlatform === platform ? "default" : "outline"} 
                              size="sm"
                              onClick={() => setActivePlatform(platform)}
                              className="flex items-center"
                            >
                              {config?.icon && (
                                <config.icon className={cn("h-4 w-4 mr-2", config.color)} />
                              )}
                              {config?.name}
                            </Button>
                          );
                        })}
                    </div>
                    
                    {activePlatform && (
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label>Legenda</Label>
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              onClick={() => generateCaption(activePlatform)}
                              disabled={isGenerating[activePlatform]}
                              className="h-7 text-xs"
                            >
                              {isGenerating[activePlatform] ? (
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              ) : (
                                "Gerar com IA"
                              )}
                            </Button>
                          </div>
                          <Textarea 
                            value={captions[activePlatform] || ""}
                            onChange={(e) => handleCaptionChange(activePlatform, e.target.value)}
                            placeholder="Escreva uma legenda para a publicação..."
                            className="min-h-[120px]"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="block mb-2">Hashtags Sugeridas</Label>
                            <div className="border rounded-md p-2 min-h-[80px] space-y-1 bg-muted/30">
                              {platformConfigs.find(p => p.id === activePlatform)?.suggestedHashtags?.map((hashtag, idx) => (
                                <div key={idx} className="flex items-center">
                                  <Hash className="h-3 w-3 mr-1 text-muted-foreground" />
                                  <span className="text-sm">{hashtag}</span>
                                </div>
                              )) || (
                                <div className="text-sm text-muted-foreground text-center py-2">
                                  Nenhuma hashtag sugerida
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <Label className="block mb-2">Agendamento</Label>
                            <div className="border rounded-md p-2 min-h-[80px] bg-muted/30 flex items-center justify-center">
                              <Button variant="outline" size="sm" className="w-full">
                                <Calendar className="h-4 w-4 mr-2" />
                                Agendar Publicação
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="block mb-2">Sugestões de Thumbnail</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="border rounded-md aspect-video flex items-center justify-center bg-muted/30">
                              <Image className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div className="border rounded-md aspect-video flex items-center justify-center bg-muted/30">
                              <Image className="h-6 w-6 text-muted-foreground" />
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 text-center">
                            Sugestões de thumbnail geradas pela IA
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="info" className="space-y-4 pt-4">
                <Alert>
                  <AlertDescription>
                    <p className="font-medium mb-2">Sobre a distribuição de conteúdo</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>O conteúdo será adaptado para cada plataforma</li>
                      <li>Você pode editar as legendas e hashtags sugeridas</li>
                      <li>As postagens podem ser agendadas ou publicadas imediatamente</li>
                      <li>Conecte suas contas em "Integrações" para distribuição automática</li>
                    </ul>
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Tamanhos recomendados:</h3>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="border rounded-lg p-3">
                      <p className="font-medium"><Instagram className="h-3 w-3 inline mr-1" /> Instagram</p>
                      <ul className="text-muted-foreground space-y-1 mt-2">
                        <li>Feed: 1080 x 1080px</li>
                        <li>Stories: 1080 x 1920px</li>
                        <li>Reels: 1080 x 1920px</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-3">
                      <p className="font-medium"><TikTokIcon className="h-3 w-3 inline mr-1" /> TikTok</p>
                      <ul className="text-muted-foreground space-y-1 mt-2">
                        <li>Vídeo: 1080 x 1920px</li>
                        <li>Duração: 15-60 seg.</li>
                        <li>Vertical (9:16)</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-3">
                      <p className="font-medium"><Youtube className="h-3 w-3 inline mr-1" /> YouTube</p>
                      <ul className="text-muted-foreground space-y-1 mt-2">
                        <li>Vídeo: 1920 x 1080px</li>
                        <li>Thumbnail: 1280 x 720px</li>
                        <li>Shorts: 1080 x 1920px</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <DialogFooter className="pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isScheduling}
          >
            Cancelar
          </Button>
          <Button
            onClick={distributeContent}
            className="bg-gradient-to-r from-fluida-blue to-fluida-pink hover:opacity-90 text-white"
            disabled={!Object.values(selectedPlatforms).some(Boolean) || isScheduling}
          >
            {isScheduling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              'Distribuir Conteúdo'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DistributionDialog;
