import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Video } from "@/types/database";
import { LoaderIcon, X, Plus, AlertTriangle, Stars, RefreshCcw } from "lucide-react";

// Equipamentos disponíveis
const AVAILABLE_EQUIPMENTS = [
  "Adélla Laser",
  "Enygma X-Orbital",
  "Focuskin",
  "Hipro",
  "Hive Pro",
  "Laser Crystal 3D Plus",
  "MultiShape",
  "Reverso",
  "Supreme Pro",
  "Ultralift - Endolaser",
  "Unyque PRO",
  "X-Tonus"
];

// Finalidades disponíveis
const AVAILABLE_PURPOSES = [
  "Rugas",
  "Emagrecimento",
  "Tonificação",
  "Hidratação",
  "Flacidez",
  "Gordura localizada",
  "Lipedema",
  "Sarcopenia"
];

// Áreas do corpo disponíveis
const BODY_AREAS = [
  "Face",
  "Pescoço",
  "Abdômen",
  "Coxas",
  "Glúteos",
  "Braços",
  "Corpo todo",
  "Outro"
];

// Schema de validação do formulário
const videoFormSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  tipo_video: z.enum(["video_pronto", "take"]),
  descricao_curta: z.string().min(1, "Descrição curta é obrigatória"),
  descricao_detalhada: z.string().optional(),
  area_corpo: z.string().min(1, "Área do corpo é obrigatória"),
  otherBodyArea: z.string().optional(),
  url_video: z.string().min(1, "URL do vídeo é obrigatória"),
  preview_url: z.string().optional(),
  duracao: z.string().optional(),
  equipamentos: z.array(z.string()).optional(),
  otherEquipment: z.string().optional(),
  finalidade: z.array(z.string()).optional(),
  otherPurpose: z.string().optional(),
  tags: z.array(z.string()).optional(),
  newTag: z.string().optional(),
});

// Tipo dos dados do formulário
type VideoFormValues = z.infer<typeof videoFormSchema>;

interface VideoFormProps {
  videoId?: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

const VideoForm: React.FC<VideoFormProps> = ({ videoId, onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingVideo, setIsFetchingVideo] = useState(false);
  const [isLoadingAIDescription, setIsLoadingAIDescription] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [customEquipmentOpen, setCustomEquipmentOpen] = useState(false);
  const [customPurposeOpen, setCustomPurposeOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [tagError, setTagError] = useState("");
  const [isLoadingThumbnail, setIsLoadingThumbnail] = useState(false);
  const { toast } = useToast();

  // Form setup
  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: {
      titulo: "",
      tipo_video: "video_pronto",
      descricao_curta: "",
      descricao_detalhada: "",
      area_corpo: "",
      otherBodyArea: "",
      url_video: "",
      preview_url: "",
      duracao: "",
      equipamentos: [],
      otherEquipment: "",
      finalidade: [],
      otherPurpose: "",
      tags: [],
      newTag: "",
    },
  });

  const handleAddTag = () => {
    const tagValue = newTag.trim();
    
    if (tagValue === "") {
      setTagError("Tag não pode ser vazia");
      return;
    }
    
    if (tags.includes(tagValue)) {
      setTagError("Esta tag já foi adicionada");
      return;
    }
    
    setTags([...tags, tagValue]);
    setNewTag("");
    setTagError("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Função para limpar e normalizar URL do Vimeo
  const cleanVimeoUrl = (url: string): string => {
    if (!url) return url;
    
    // Remove espaços em branco no início e fim
    let cleanUrl = url.trim();
    
    // Processar URLs do Vimeo
    if (cleanUrl.includes('vimeo.com')) {
      // Remover parâmetros de compartilhamento que podem causar problemas
      if (cleanUrl.includes('?share=copy')) {
        cleanUrl = cleanUrl.split('?share=copy')[0];
      }
      
      // Se tiver parâmetros de tempo (#t=), remover também
      if (cleanUrl.includes('#t=')) {
        cleanUrl = cleanUrl.split('#t=')[0];
      }
      
      // Garantir formato player para incorporação
      if (!cleanUrl.includes('player.vimeo.com')) {
        // Extrair o ID do vídeo Vimeo
        const vimeoIdMatch = cleanUrl.match(/vimeo\.com\/(\d+)/);
        if (vimeoIdMatch && vimeoIdMatch[1]) {
          cleanUrl = `https://player.vimeo.com/video/${vimeoIdMatch[1]}`;
        }
      }
    }
    
    return cleanUrl;
  };

  // Buscar thumbnail do vídeo do Vimeo
  const fetchVimeoThumbnail = async (url: string) => {
    if (!url || !url.includes('vimeo.com')) {
      return;
    }

    setIsLoadingThumbnail(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('get-vimeo-thumbnail', {
        body: { url }
      });

      if (error) {
        console.error('Erro ao buscar thumbnail:', error);
        toast({
          variant: "destructive",
          title: "Erro ao buscar thumbnail",
          description: "Não foi possível obter a thumbnail do vídeo Vimeo."
        });
        return;
      }

      if (data.success && data.thumbnail_url) {
        form.setValue('preview_url', data.thumbnail_url);
        
        // Se o título estiver vazio, preencha com o título do vídeo
        if (!form.getValues('titulo') && data.title) {
          form.setValue('titulo', data.title);
        }
        
        // Se a descrição estiver vazia, preencha com a descrição do vídeo
        if (!form.getValues('descricao_curta') && data.description) {
          form.setValue('descricao_curta', data.description);
        }
        
        toast({
          title: "Thumbnail obtida",
          description: "Thumbnail do vídeo Vimeo foi carregada com sucesso."
        });
      }
    } catch (error) {
      console.error('Erro ao buscar thumbnail:', error);
      toast({
        variant: "destructive",
        title: "Erro ao buscar thumbnail",
        description: "Ocorreu um erro ao tentar obter a thumbnail do vídeo."
      });
    } finally {
      setIsLoadingThumbnail(false);
    }
  };

  // Fetch user profile to get equipment preferences
  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile, error } = await supabase
          .from('perfis')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (profile && profile.equipamentos && profile.equipamentos.length > 0) {
          // Set default equipment based on user profile
          const validEquipments = profile.equipamentos.filter(eq => AVAILABLE_EQUIPMENTS.includes(eq));
          if (validEquipments.length > 0) {
            form.setValue('equipamentos', validEquipments);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Fetch video data if editing
  const fetchVideoData = async () => {
    if (!videoId) {
      fetchUserProfile();
      return;
    }
    
    setIsFetchingVideo(true);
    
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('id', videoId)
        .single();
        
      if (error) throw error;
      
      if (data) {
        // Set form data from fetched video
        form.reset({
          titulo: data.titulo || "",
          tipo_video: data.tipo_video || "video_pronto",
          descricao_curta: data.descricao_curta || "",
          descricao_detalhada: data.descricao_detalhada || "",
          area_corpo: data.area_corpo || "",
          otherBodyArea: !BODY_AREAS.includes(data.area_corpo) ? data.area_corpo : "",
          url_video: data.url_video || "",
          preview_url: data.preview_url || "",
          duracao: data.duracao || "",
          equipamentos: data.equipamentos || [],
          otherEquipment: "",
          finalidade: data.finalidade || [],
          otherPurpose: "",
          tags: [],
        });
        
        // Set tags
        if (data.tags && Array.isArray(data.tags)) {
          setTags(data.tags);
        }
      }
    } catch (error) {
      console.error('Error fetching video data:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do vídeo para edição."
      });
    } finally {
      setIsFetchingVideo(false);
    }
  };

  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  const handleVideoUrlChange = async (url: string) => {
    form.setValue('url_video', url);
    
    // Se for URL do Vimeo, buscar automaticamente a thumbnail
    if (url && url.includes('vimeo.com')) {
      await fetchVimeoThumbnail(url);
    }
  };

  // Generate AI description
  const generateDescription = async () => {
    const title = form.getValues('titulo');
    const shortDesc = form.getValues('descricao_curta');
    const equipment = form.getValues('equipamentos');
    const bodyArea = form.getValues('area_corpo');
    const purposes = form.getValues('finalidade');
    
    if (!title || !shortDesc) {
      toast({
        variant: "destructive",
        title: "Dados insuficientes",
        description: "Preencha pelo menos o título e a descrição curta para gerar uma descrição detalhada."
      });
      return;
    }
    
    setIsGeneratingDescription(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-content-description', {
        body: {
          title,
          shortDescription: shortDesc,
          equipment: equipment?.join(', '),
          bodyArea,
          purposes: purposes?.join(', ')
        }
      });
      
      if (error) throw error;
      
      if (data && data.description) {
        form.setValue('descricao_detalhada', data.description);
        toast({
          title: "Descrição gerada",
          description: "A descrição detalhada foi gerada com sucesso."
        });
      }
    } catch (error) {
      console.error('Error generating description:', error);
      toast({
        variant: "destructive",
        title: "Erro na geração",
        description: "Não foi possível gerar a descrição detalhada."
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  // Submit form data
  const onSubmit = async (formData: VideoFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Handle custom equipment
      let finalEquipments = formData.equipamentos || [];
      if (customEquipmentOpen && formData.otherEquipment) {
        finalEquipments.push(formData.otherEquipment);
      }
      
      // Handle custom purpose
      let finalPurposes = formData.finalidade || [];
      if (customPurposeOpen && formData.otherPurpose) {
        finalPurposes.push(formData.otherPurpose);
      }

      // Limpar a URL do vídeo antes de enviar
      const cleanedVideoUrl = cleanVimeoUrl(formData.url_video);

      // Prepare data for submission
      const videoData = {
        titulo: formData.titulo,
        tipo_video: formData.tipo_video,
        equipamentos: finalEquipments,
        area_corpo: formData.area_corpo === "Outro" ? formData.otherBodyArea : formData.area_corpo,
        finalidade: finalPurposes,
        url_video: cleanedVideoUrl,
        preview_url: formData.preview_url,
        descricao_curta: formData.descricao_curta,
        descricao_detalhada: formData.descricao_detalhada,
        duracao: formData.duracao,
        tags: tags,
        data_upload: new Date().toISOString(),
      };
      
      let response;
      
      if (videoId) {
        // Update existing video
        response = await supabase
          .from('videos')
          .update(videoData)
          .eq('id', videoId);
      } else {
        // Create new video
        response = await supabase
          .from('videos')
          .insert([videoData]);
      }
      
      const { error } = response;
      
      if (error) throw error;
      
      onSuccess();
      
    } catch (error) {
      console.error('Error saving video data:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: videoId 
          ? "Não foi possível atualizar o vídeo." 
          : "Não foi possível adicionar o vídeo."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetchingVideo) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoaderIcon className="w-6 h-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Carregando dados...</span>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Título e Tipo */}
          <FormField
            control={form.control}
            name="titulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Título do vídeo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tipo_video"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <FormControl>
                  <RadioGroup 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    className="flex"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="video_pronto" id="video_pronto" />
                      <Label htmlFor="video_pronto">Vídeo Pronto</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="take" id="take" />
                      <Label htmlFor="take">Take Bruto</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Descrição Curta */}
          <FormField
            control={form.control}
            name="descricao_curta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição Curta</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Breve descrição do conteúdo" 
                    className="resize-none"
                    rows={2}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Descrição Detalhada */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <FormLabel>Descrição Detalhada</FormLabel>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={generateDescription}
                disabled={isGeneratingDescription}
                className="flex items-center gap-1"
              >
                {isGeneratingDescription ? (
                  <>
                    <LoaderIcon className="h-3 w-3 animate-spin mr-1" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Stars className="h-3 w-3 mr-1" />
                    Gerar com IA
                  </>
                )}
              </Button>
            </div>
            <FormField
              control={form.control}
              name="descricao_detalhada"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea 
                      placeholder="Descrição detalhada do conteúdo e técnica" 
                      className="resize-none"
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Área do Corpo */}
          <div>
            <FormField
              control={form.control}
              name="area_corpo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Área do Corpo</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a área do corpo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BODY_AREAS.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo personalizado para Área do Corpo */}
            {form.watch("area_corpo") === "Outro" && (
              <FormField
                control={form.control}
                name="otherBodyArea"
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormLabel>Especifique a área</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite a área do corpo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Duração */}
          <FormField
            control={form.control}
            name="duracao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duração (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="ex: 1:45" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* URL do Vídeo */}
          <div>
            <FormField
              control={form.control}
              name="url_video"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do Vídeo</FormLabel>
                  <div className="flex gap-2">
                    <FormControl className="flex-grow">
                      <Input 
                        placeholder="URL do vídeo (YouTube, Vimeo, etc.)" 
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                        onBlur={(e) => {
                          field.onBlur();
                          // Ao sair do campo, tentar buscar a thumbnail
                          if (e.target.value && e.target.value.includes('vimeo.com')) {
                            fetchVimeoThumbnail(e.target.value);
                          }
                        }}
                      />
                    </FormControl>
                    {field.value && field.value.includes('vimeo.com') && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        disabled={isLoadingThumbnail}
                        onClick={() => fetchVimeoThumbnail(field.value)}
                      >
                        {isLoadingThumbnail ? (
                          <LoaderIcon className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCcw className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Para vídeos do Vimeo, utilize o formato: https://vimeo.com/NUMERODOVIDEO
                  </p>
                  {isLoadingThumbnail && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Buscando detalhes do vídeo...
                    </p>
                  )}
                </FormItem>
              )}
            />
          </div>

          {/* URL da Thumbnail */}
          <FormField
            control={form.control}
            name="preview_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL da Thumbnail (opcional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="URL da imagem de prévia" 
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Preview da thumbnail se existir */}
        {form.watch("preview_url") && (
          <div>
            <Label>Preview da Thumbnail</Label>
            <div className="aspect-video bg-muted rounded-lg overflow-hidden mt-2">
              <img 
                src={form.watch("preview_url")} 
                alt="Thumbnail preview" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
          </div>
        )}

        <Separator />

        {/* Equipamentos */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Equipamentos</Label>
            <div className="flex items-center">
              <Switch 
                id="custom-equipment"
                checked={customEquipmentOpen}
                onCheckedChange={setCustomEquipmentOpen}
              />
              <Label htmlFor="custom-equipment" className="ml-2 text-sm">
                Personalizado
              </Label>
            </div>
          </div>

          <div className="space-y-4">
            {/* Lista de equipamentos padrão */}
            <FormField
              control={form.control}
              name="equipamentos"
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {AVAILABLE_EQUIPMENTS.map((equipment) => (
                      <FormField
                        key={equipment}
                        control={form.control}
                        name="equipamentos"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={equipment}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(equipment)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), equipment])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== equipment
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {equipment}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />

            {/* Campo para equipamento personalizado */}
            {customEquipmentOpen && (
              <FormField
                control={form.control}
                name="otherEquipment"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex space-x-2">
                        <Input placeholder="Digite um equipamento personalizado" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Exibição de equipamentos selecionados */}
            <div className="flex flex-wrap gap-1 mt-2">
              {form.watch("equipamentos")?.map((equipment) => (
                <Badge key={equipment} variant="outline">
                  {equipment}
                </Badge>
              ))}
              {customEquipmentOpen && form.watch("otherEquipment") && (
                <Badge variant="outline">
                  {form.watch("otherEquipment")}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Finalidades */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Finalidades</Label>
            <div className="flex items-center">
              <Switch 
                id="custom-purpose"
                checked={customPurposeOpen}
                onCheckedChange={setCustomPurposeOpen}
              />
              <Label htmlFor="custom-purpose" className="ml-2 text-sm">
                Personalizado
              </Label>
            </div>
          </div>

          <div className="space-y-4">
            {/* Lista de finalidades padrão */}
            <FormField
              control={form.control}
              name="finalidade"
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {AVAILABLE_PURPOSES.map((purpose) => (
                      <FormField
                        key={purpose}
                        control={form.control}
                        name="finalidade"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={purpose}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(purpose)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), purpose])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== purpose
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {purpose}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />

            {/* Campo para finalidade personalizada */}
            {customPurposeOpen && (
              <FormField
                control={form.control}
                name="otherPurpose"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex space-x-2">
                        <Input placeholder="Digite uma finalidade personalizada" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Exibição de finalidades selecionadas */}
            <div className="flex flex-wrap gap-1 mt-2">
              {form.watch("finalidade")?.map((purpose) => (
                <Badge key={purpose} variant="secondary">
                  {purpose}
                </Badge>
              ))}
              {customPurposeOpen && form.watch("otherPurpose") && (
                <Badge variant="secondary">
                  {form.watch("otherPurpose")}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Tags */}
        <div>
          <Label>Tags</Label>
          <div className="flex items-center space-x-2 mt-2">
            <Input
              placeholder="Adicionar tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-grow"
            />
            <Button 
              type="button" 
              onClick={handleAddTag}
              variant="outline"
            >
              Adicionar
            </Button>
          </div>
          {tagError && <p className="text-destructive text-sm mt-1">{tagError}</p>}
          
          <div className="flex flex-wrap gap-1 mt-4">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="flex items-center gap-1">
                {tag}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleRemoveTag(tag)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                const isDirty = form.formState.isDirty || tags.length > 0;
                if (isDirty) {
                  setConfirmCancel(true);
                } else {
                  onCancel();
                }
              }}
            >
              Cancelar
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                {videoId ? 'Salvando...' : 'Adicionando...'}
              </>
            ) : (
              videoId ? 'Salvar Alterações' : 'Adicionar Vídeo'
            )}
          </Button>
        </div>
      </form>

      {/* Confirmation dialog for canceling with unsaved changes */}
      <AlertDialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Descartar alterações?</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem alterações não salvas. Se sair agora, todas as alterações serão perdidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmCancel(false)}>
              Continuar Editando
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setConfirmCancel(false);
              if (onCancel) onCancel();
            }}>
              Descartar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Form>
  );
};

export default VideoForm;
