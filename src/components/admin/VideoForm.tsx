import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import VideoObjectiveSelector from './VideoObjectiveSelector';
import { MarketingObjectiveType } from '@/utils/api';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define the form schema with Zod
const videoFormSchema = z.object({
  tipo_video: z.enum(["video_pronto", "take"], {
    required_error: "O tipo do vídeo é obrigatório",
  }),
  titulo: z.string().min(2, {
    message: "O título deve ter pelo menos 2 caracteres",
  }),
  descricao_curta: z.string().min(5, {
    message: "A descrição curta deve ter pelo menos 5 caracteres",
  }),
  descricao_detalhada: z.string().optional(),
  url_video: z.string().url({
    message: "URL do vídeo inválida",
  }),
  preview_url: z.string().optional(),
  area_corpo: z.string().optional(),
  categoria: z.string().optional(),
  duracao: z.string().optional(),
  objetivo_marketing: z.enum([
    "atrair_atencao",
    "criar_conexao",
    "fazer_comprar",
    "reativar_interesse",
    "fechar_agora"
  ]).optional(),
});

// Interface for the VideoForm props
interface VideoFormProps {
  video?: any; // For editing existing videos
  onSuccess: () => void;
  onCancel?: () => void;
}

// Function to clean Vimeo URL
const cleanVimeoUrl = (url: string): string => {
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

// Function to fetch video metadata from Vimeo
const fetchVimeoMetadata = async (url: string) => {
  try {
    const response = await fetch('/api/get-vimeo-thumbnail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao buscar metadados do Vimeo');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Vimeo metadata:', error);
    throw error;
  }
};

const VideoForm = ({ video, onSuccess, onCancel }: VideoFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingVimeoData, setFetchingVimeoData] = useState(false);
  const [equipmentOptions, setEquipmentOptions] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [previewUrlState, setPreviewUrlState] = useState<string>("");

  // Initialize the form with default values or video data
  const form = useForm<z.infer<typeof videoFormSchema>>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: video
      ? {
          tipo_video: video.tipo_video || "video_pronto",
          titulo: video.titulo || "",
          descricao_curta: video.descricao_curta || "",
          descricao_detalhada: video.descricao_detalhada || "",
          url_video: video.url_video || "",
          preview_url: video.preview_url || "",
          area_corpo: video.area_corpo || "",
          categoria: video.categoria || "",
          duracao: video.duracao || "",
          objetivo_marketing: video.objetivo_marketing as MarketingObjectiveType || undefined,
        }
      : {
          tipo_video: "video_pronto",
          titulo: "",
          descricao_curta: "",
          descricao_detalhada: "",
          url_video: "",
          preview_url: "",
          area_corpo: "",
          categoria: "",
          duracao: "",
          objetivo_marketing: undefined,
        },
  });

  // Set form field values when video prop changes
  useEffect(() => {
    if (video) {
      form.reset({
        tipo_video: video.tipo_video || "video_pronto",
        titulo: video.titulo || "",
        descricao_curta: video.descricao_curta || "",
        descricao_detalhada: video.descricao_detalhada || "",
        url_video: video.url_video || "",
        preview_url: video.preview_url || "",
        area_corpo: video.area_corpo || "",
        categoria: video.categoria || "",
        duracao: video.duracao || "",
        objetivo_marketing: video.objetivo_marketing as MarketingObjectiveType || undefined,
      });
      
      setPreviewUrlState(video.preview_url || "");
      setSelectedEquipment(video.equipamentos || []);
      setSelectedPurposes(video.finalidade || []);
      setTags(video.tags || []);
    }
  }, [video, form]);

  // Load equipment options
  useEffect(() => {
    const fetchEquipmentOptions = async () => {
      try {
        const { data: perfisData, error: perfisError } = await supabase
          .from('perfis')
          .select('equipamentos');
          
        if (perfisError) throw perfisError;
        
        // Extract unique equipment values from all profiles
        const allEquipments: string[] = [];
        perfisData?.forEach(item => {
          if (item.equipamentos && Array.isArray(item.equipamentos)) {
            item.equipamentos.forEach((equipment: string) => {
              if (equipment && !allEquipments.includes(equipment)) {
                allEquipments.push(equipment);
              }
            });
          }
        });
        
        setEquipmentOptions(allEquipments.sort());
      } catch (error) {
        console.error('Error fetching equipment options:', error);
      }
    };
    
    fetchEquipmentOptions();
  }, []);

  // Update preview URL when video URL changes
  const handleVideoUrlChange = async (url: string) => {
    form.setValue('url_video', url);
    
    if (url && url.includes('vimeo.com')) {
      try {
        setFetchingVimeoData(true);
        const cleanedUrl = cleanVimeoUrl(url);
        form.setValue('url_video', cleanedUrl);
        
        const metadata = await fetchVimeoMetadata(url);
        
        if (metadata.success && metadata.thumbnail_url) {
          setPreviewUrlState(metadata.thumbnail_url);
          form.setValue('preview_url', metadata.thumbnail_url);
          
          // Auto-fill title and description if they're empty
          if (!form.getValues('titulo') && metadata.title) {
            form.setValue('titulo', metadata.title);
          }
          
          if (!form.getValues('descricao_curta') && metadata.description) {
            form.setValue('descricao_curta', metadata.description.substring(0, 100));
          }
          
          if (!form.getValues('descricao_detalhada') && metadata.description) {
            form.setValue('descricao_detalhada', metadata.description);
          }
          
          toast({
            title: "Informações do vídeo obtidas com sucesso",
            description: "Thumbnail, título e descrição foram preenchidos automaticamente.",
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível obter informações do vídeo do Vimeo.",
        });
        console.error("Error fetching Vimeo data:", error);
      } finally {
        setFetchingVimeoData(false);
      }
    }
  };

  // Handle fetching Vimeo data manually
  const handleFetchVimeoData = async () => {
    const videoUrl = form.getValues('url_video');
    if (videoUrl) {
      await handleVideoUrlChange(videoUrl);
    } else {
      toast({
        variant: "destructive",
        title: "URL necessária",
        description: "Insira uma URL do Vimeo antes de atualizar as informações.",
      });
    }
  };

  // Handle checkbox change for equipment
  const handleEquipmentChange = (value: string) => {
    setSelectedEquipment(
      selectedEquipment.includes(value)
        ? selectedEquipment.filter((item) => item !== value)
        : [...selectedEquipment, value]
    );
  };

  // Handle checkbox change for purposes
  const handlePurposeChange = (value: string) => {
    setSelectedPurposes(
      selectedPurposes.includes(value)
        ? selectedPurposes.filter((item) => item !== value)
        : [...selectedPurposes, value]
    );
  };

  // Add tag
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle objective change
  const handleObjectiveChange = (objective: MarketingObjectiveType) => {
    form.setValue('objetivo_marketing', objective);
  };

  // Submit handler
  const onSubmit = async (values: z.infer<typeof videoFormSchema>) => {
    setIsLoading(true);
    
    try {
      const videoData = {
        tipo_video: values.tipo_video,
        titulo: values.titulo,
        descricao_curta: values.descricao_curta,
        descricao_detalhada: values.descricao_detalhada || null,
        url_video: cleanVimeoUrl(values.url_video),
        preview_url: previewUrlState || null,
        area_corpo: values.area_corpo || null,
        categoria: values.categoria || null,
        equipamentos: selectedEquipment.length ? selectedEquipment : null,
        finalidade: selectedPurposes.length ? selectedPurposes : null,
        tags: tags.length ? tags : null,
        duracao: values.duracao || null,
        objetivo_marketing: values.objetivo_marketing || null,
      };
      
      let response;
      
      if (video?.id) {
        // Update existing video
        response = await supabase
          .from('videos')
          .update(videoData)
          .eq('id', video.id);
      } else {
        // Insert new video
        response = await supabase
          .from('videos')
          .insert([videoData]);
      }
      
      if (response.error) throw response.error;
      
      toast({
        title: video?.id ? "Vídeo atualizado" : "Vídeo adicionado",
        description: video?.id 
          ? "O vídeo foi atualizado com sucesso."
          : "O vídeo foi adicionado com sucesso.",
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error saving video:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar o vídeo. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Rest of the component code (render the form)
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="tipo_video"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Vídeo</FormLabel>
                <FormControl>
                  <Select 
                    value={field.value} 
                    onValueChange={(value) => {
                      field.onChange(value as "video_pronto" | "take");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video_pronto">Vídeo pronto</SelectItem>
                      <SelectItem value="take">Take bruto</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="titulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título*</FormLabel>
                <FormControl>
                  <Input placeholder="Título do vídeo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="url_video"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL do Vídeo*</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input 
                      placeholder="https://vimeo.com/123456789" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      onBlur={(e) => {
                        field.onBlur();
                        if (e.target.value) {
                          handleVideoUrlChange(e.target.value);
                        }
                      }}
                    />
                  </FormControl>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    disabled={fetchingVimeoData}
                    onClick={handleFetchVimeoData}
                    title="Atualizar informações do vídeo"
                  >
                    <RefreshCw className={`h-4 w-4 ${fetchingVimeoData ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" /> 
                  Use URLs do Vimeo (vimeo.com/ID ou player.vimeo.com/video/ID)
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="preview_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Thumbnail</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="URL da imagem de prévia" 
                      value={previewUrlState}
                      onChange={(e) => {
                        setPreviewUrlState(e.target.value);
                        field.onChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {previewUrlState && (
              <div>
                <Label>Prévia</Label>
                <div className="mt-2 border rounded-md overflow-hidden aspect-video bg-muted">
                  <img
                    src={previewUrlState}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="descricao_curta"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição Curta*</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Breve descrição do vídeo" 
                  className="resize-none" 
                  rows={2} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="descricao_detalhada"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição Detalhada</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descrição completa do vídeo" 
                  className="resize-none" 
                  rows={4} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="categoria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Estética facial" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="area_corpo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Área do Corpo</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Rosto, Abdômen" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="duracao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duração</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 1:30" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <Label>Equipamentos</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {equipmentOptions.map((equipment) => (
              <div key={equipment} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`equipment-${equipment}`}
                  checked={selectedEquipment.includes(equipment)}
                  onChange={() => handleEquipmentChange(equipment)}
                  className="h-4 w-4 rounded"
                />
                <Label
                  htmlFor={`equipment-${equipment}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {equipment}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <Label>Finalidade</Label>
          <div className="grid grid-cols-2 gap-2">
            {["Rugas", "Flacidez", "Gordura localizada", "Hidratação", "Emagrecimento", "Definição muscular"].map((purpose) => (
              <div key={purpose} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`purpose-${purpose}`}
                  checked={selectedPurposes.includes(purpose)}
                  onChange={() => handlePurposeChange(purpose)}
                  className="h-4 w-4 rounded"
                />
                <Label
                  htmlFor={`purpose-${purpose}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {purpose}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <div className="flex gap-2 items-center">
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Adicione tags e pressione Enter"
            />
            <Button type="button" onClick={addTag} variant="outline">
              Adicionar
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-secondary-foreground/70 hover:text-secondary-foreground ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Novo seletor de objetivo de marketing */}
        <FormField
          control={form.control}
          name="objetivo_marketing"
          render={({ field }) => (
            <VideoObjectiveSelector
              value={field.value}
              onValueChange={handleObjectiveChange}
            />
          )}
        />
        
        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : video?.id ? "Atualizar Vídeo" : "Adicionar Vídeo"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VideoForm;
