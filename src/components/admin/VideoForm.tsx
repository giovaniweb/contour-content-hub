
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VideoFormProps {
  videoId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const VideoForm: React.FC<VideoFormProps> = ({ videoId, onSuccess, onCancel }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [equipmentOptions] = useState([
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
    "X-Tonus",
    "Outro"
  ]);
  
  const [bodyAreas] = useState([
    "Face", 
    "Pescoço", 
    "Abdômen", 
    "Coxas", 
    "Glúteos", 
    "Braços",
    "Corpo todo", 
    "Outro"
  ]);
  
  const [purposeOptions] = useState([
    "Anti-aging", 
    "Emagrecimento", 
    "Tonificação", 
    "Hidratação", 
    "Flacidez",
    "Gordura localizada",
    "Criação de conteúdo",
    "Educacional",
    "Outro"
  ]);

  const [formData, setFormData] = useState({
    titulo: "",
    tipo_video: "video_pronto",
    equipamentos: [] as string[],
    area_corpo: "",
    finalidade: [] as string[],
    url_video: "",
    preview_url: "",
    descricao_curta: "",
    descricao_detalhada: "",
    tags: [] as string[],
    otherEquipment: "",
    otherBodyArea: "",
    otherPurpose: "",
  });

  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };
  
  const toggleEquipment = (equipment: string) => {
    const index = formData.equipamentos.indexOf(equipment);
    if (index === -1) {
      setFormData({ ...formData, equipamentos: [...formData.equipamentos, equipment] });
    } else {
      setFormData({ 
        ...formData, 
        equipamentos: formData.equipamentos.filter(e => e !== equipment) 
      });
    }
  };

  const togglePurpose = (purpose: string) => {
    const index = formData.finalidade.indexOf(purpose);
    if (index === -1) {
      setFormData({ ...formData, finalidade: [...formData.finalidade, purpose] });
    } else {
      setFormData({ 
        ...formData, 
        finalidade: formData.finalidade.filter(p => p !== purpose) 
      });
    }
  };

  const fetchVideo = async (id: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setFormData({
          ...formData,
          titulo: data.titulo || "",
          tipo_video: data.tipo_video || "video_pronto",
          equipamentos: data.equipamentos || [],
          area_corpo: data.area_corpo || "",
          finalidade: data.finalidade || [],
          url_video: data.url_video || "",
          preview_url: data.preview_url || "",
          descricao_curta: data.descricao_curta || data.descricao || "",
          descricao_detalhada: data.descricao_detalhada || "",
          tags: data.tags || [],
          otherEquipment: "",
          otherBodyArea: "",
          otherPurpose: "",
        });
      }
    } catch (error) {
      console.error('Error fetching video:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar vídeo",
        description: "Não foi possível carregar os dados do vídeo."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (videoId) {
      fetchVideo(videoId);
    }
  }, [videoId]);

  const generateWithAI = async () => {
    try {
      setIsGenerating(true);
      
      // Only send what we need to generate content
      const contextData = {
        title: formData.titulo,
        equipments: formData.equipamentos,
        bodyArea: formData.area_corpo,
        purposes: formData.finalidade,
        description: formData.descricao_curta,
        type: formData.tipo_video
      };
      
      // Call OpenAI Edge Function to generate content and tags
      const response = await fetch(`${process.env.SUPABASE_URL}/functions/v1/generate-content-description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Get the session token from Supabase auth
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify(contextData)
      });
      
      if (!response.ok) {
        throw new Error(`Erro na função: ${response.status}`);
      }
      
      const result = await response.json();
      
      setFormData({
        ...formData,
        descricao_detalhada: result.detailedDescription || formData.descricao_detalhada
      });
      
      setSuggestedTags(result.suggestedTags || []);
      
      toast({
        title: "Conteúdo gerado",
        description: "Descrição e tags geradas com sucesso."
      });
    } catch (error) {
      console.error('Error generating content with AI:', error);
      toast({
        variant: "destructive",
        title: "Erro na geração de conteúdo",
        description: "Não foi possível gerar o conteúdo com IA. Por favor, tente novamente."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTagClick = (tag: string) => {
    if (formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: formData.tags.filter(t => t !== tag)
      });
    } else {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag]
      });
    }
  };

  const handleAddCustomTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
      const newTag = (e.target as HTMLInputElement).value.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData({
          ...formData,
          tags: [...formData.tags, newTag]
        });
      }
      (e.target as HTMLInputElement).value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      // Handle custom entries
      let finalEquipments = [...formData.equipamentos];
      if (formData.otherEquipment && !equipmentOptions.includes(formData.otherEquipment)) {
        finalEquipments.push(formData.otherEquipment);
      }
      
      let finalPurposes = [...formData.finalidade];
      if (formData.otherPurpose && !purposeOptions.includes(formData.otherPurpose)) {
        finalPurposes.push(formData.otherPurpose);
      }

      // Prepare data for submission
      const videoData = {
        titulo: formData.titulo,
        tipo_video: formData.tipo_video,
        equipamentos: finalEquipments,
        area_corpo: formData.area_corpo === "Outro" ? formData.otherBodyArea : formData.area_corpo,
        finalidade: finalPurposes,
        url_video: formData.url_video,
        preview_url: formData.preview_url,
        descricao_curta: formData.descricao_curta,
        descricao_detalhada: formData.descricao_detalhada,
        tags: formData.tags
      };

      // Create new tags if they don't exist
      const tagPromises = formData.tags.map(async (tag) => {
        const { error } = await supabase
          .from('tags')
          .upsert({ nome: tag }, { onConflict: 'nome' });
        
        if (error) {
          console.error(`Error creating tag ${tag}:`, error);
        }
      });

      await Promise.all(tagPromises);

      if (videoId) {
        // Update existing video
        const { error } = await supabase
          .from('videos')
          .update(videoData)
          .eq('id', videoId);
          
        if (error) throw error;

        toast({
          title: "Vídeo atualizado",
          description: "O vídeo foi atualizado com sucesso."
        });
      } else {
        // Create new video
        const { error } = await supabase
          .from('videos')
          .insert([videoData]);
          
        if (error) throw error;

        toast({
          title: "Vídeo criado",
          description: "O novo vídeo foi adicionado com sucesso."
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving video:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar vídeo",
        description: "Não foi possível salvar o vídeo. Por favor, tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && videoId) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Nome do Vídeo *</Label>
            <Input
              id="titulo"
              name="titulo"
              placeholder="Digite o nome do vídeo"
              value={formData.titulo}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo_video">Tipo de Conteúdo *</Label>
            <Select value={formData.tipo_video} onValueChange={(value) => handleSelectChange("tipo_video", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de conteúdo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video_pronto">Vídeo Pronto</SelectItem>
                <SelectItem value="take">Take Bruto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Equipamentos *</Label>
            <div className="grid grid-cols-2 gap-2 border rounded-md p-3 max-h-[200px] overflow-y-auto">
              {equipmentOptions.map((equipment) => (
                <div key={equipment} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`equipment-${equipment}`}
                    checked={formData.equipamentos.includes(equipment)}
                    onCheckedChange={() => toggleEquipment(equipment)}
                  />
                  <Label 
                    htmlFor={`equipment-${equipment}`}
                    className="text-sm cursor-pointer"
                  >
                    {equipment}
                  </Label>
                </div>
              ))}
            </div>
            {formData.equipamentos.includes("Outro") && (
              <Input
                name="otherEquipment"
                placeholder="Digite o nome do equipamento"
                value={formData.otherEquipment}
                onChange={handleInputChange}
                className="mt-2"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="area_corpo">Área do Corpo *</Label>
            <Select value={formData.area_corpo} onValueChange={(value) => handleSelectChange("area_corpo", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a área do corpo" />
              </SelectTrigger>
              <SelectContent>
                {bodyAreas.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.area_corpo === "Outro" && (
              <Input
                name="otherBodyArea"
                placeholder="Digite a área do corpo"
                value={formData.otherBodyArea}
                onChange={handleInputChange}
                className="mt-2"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label>Finalidades do Tratamento *</Label>
            <div className="grid grid-cols-2 gap-2 border rounded-md p-3 max-h-[200px] overflow-y-auto">
              {purposeOptions.map((purpose) => (
                <div key={purpose} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`purpose-${purpose}`}
                    checked={formData.finalidade.includes(purpose)}
                    onCheckedChange={() => togglePurpose(purpose)}
                  />
                  <Label 
                    htmlFor={`purpose-${purpose}`}
                    className="text-sm cursor-pointer"
                  >
                    {purpose}
                  </Label>
                </div>
              ))}
            </div>
            {formData.finalidade.includes("Outro") && (
              <Input
                name="otherPurpose"
                placeholder="Digite a finalidade"
                value={formData.otherPurpose}
                onChange={handleInputChange}
                className="mt-2"
              />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url_video">Link do Vídeo (Dropbox ou Vimeo) *</Label>
            <Input
              id="url_video"
              name="url_video"
              placeholder="Cole o link do vídeo"
              value={formData.url_video}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preview_url">Link da Imagem de Preview (opcional)</Label>
            <Input
              id="preview_url"
              name="preview_url"
              placeholder="Cole o link da imagem de preview"
              value={formData.preview_url}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao_curta">Descrição Curta *</Label>
            <Textarea
              id="descricao_curta"
              name="descricao_curta"
              placeholder="Digite uma breve descrição"
              value={formData.descricao_curta}
              onChange={handleInputChange}
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={generateWithAI}
              disabled={isGenerating || !formData.titulo || formData.equipamentos.length === 0 || !formData.descricao_curta}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {isGenerating ? "Gerando..." : "Gerar Conteúdo com IA"}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="descricao_detalhada">Descrição Detalhada</Label>
          <span className="text-xs text-muted-foreground">
            {formData.descricao_detalhada ? 
              `${formData.descricao_detalhada.length} caracteres` : 
              "Use o botão 'Gerar Conteúdo com IA' ou escreva manualmente"}
          </span>
        </div>
        <Textarea
          id="descricao_detalhada"
          name="descricao_detalhada"
          placeholder="Descrição detalhada do vídeo"
          value={formData.descricao_detalhada}
          onChange={handleInputChange}
          rows={5}
        />
      </div>

      <div className="space-y-4">
        <Label>Tags</Label>
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground">Tags Selecionadas</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.length > 0 ? (
                formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleTagClick(tag)}>
                    {tag} ✕
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">Nenhuma tag selecionada</span>
              )}
            </div>
          </div>

          {suggestedTags.length > 0 && (
            <div>
              <Label className="text-sm text-muted-foreground">Tags Sugeridas pela IA</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {suggestedTags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant={formData.tags.includes(tag) ? "default" : "outline"} 
                    className="cursor-pointer" 
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="custom-tag" className="text-sm text-muted-foreground">Adicionar Tag Personalizada</Label>
            <Input
              id="custom-tag"
              placeholder="Digite uma tag e pressione Enter"
              onKeyPress={handleAddCustomTag}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {videoId ? "Salvar Alterações" : "Adicionar Vídeo"}
        </Button>
      </div>
    </form>
  );
};

export default VideoForm;
