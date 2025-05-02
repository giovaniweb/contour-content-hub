
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
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Sparkles, Check, X, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  
  // Updated purpose options list based on requirements
  const [purposeOptions] = useState([
    "Rugas", // Replaced "Anti-aging"
    "Emagrecimento", 
    "Tonificação", 
    "Hidratação", 
    "Flacidez",
    "Gordura localizada",
    "Lipedema", // Added as requested
    "Sarcopenia", // Added as requested
    "Outro"
  ]);

  // State for purpose search/filter
  const [purposeSearch, setPurposeSearch] = useState("");
  const [purposeDropdownOpen, setPurposeDropdownOpen] = useState(false);

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
  const [userProfile, setUserProfile] = useState<any>(null);

  // Filter purpose options
  const filteredPurposeOptions = purposeSearch.trim() !== "" 
    ? purposeOptions.filter(purpose => 
        purpose.toLowerCase().includes(purposeSearch.toLowerCase()))
    : purposeOptions;

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
      setPurposeSearch(""); // Clear search after selection
    } else {
      setFormData({ 
        ...formData, 
        finalidade: formData.finalidade.filter(p => p !== purpose) 
      });
    }
  };

  // Fetch user profile to get equipment preferences
  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('perfis')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data && data.equipamentos && data.equipamentos.length === 1) {
          // Auto-select the equipment if user has only one
          setFormData(prev => ({
            ...prev,
            equipamentos: [...data.equipamentos]
          }));
        }
        
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
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
    fetchUserProfile();
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

  // Handle custom purpose input
  const handleAddCustomPurpose = () => {
    if (formData.otherPurpose.trim() && !formData.finalidade.includes(formData.otherPurpose.trim())) {
      setFormData({
        ...formData,
        finalidade: [...formData.finalidade, formData.otherPurpose.trim()],
        otherPurpose: ""
      });
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
      {/* Section 1: Main Data */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Dados principais</CardTitle>
        </CardHeader>
        <CardContent>
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Clinical Context */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Contexto Clínico</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Equipamentos *</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 border rounded-md p-3 max-h-[200px] overflow-y-auto">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div className="space-y-2">
                  {/* Selected purposes as badges */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {formData.finalidade.map(purpose => (
                      <Badge 
                        key={purpose} 
                        variant="secondary"
                        className="flex items-center gap-1 px-2 py-1"
                      >
                        {purpose}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => togglePurpose(purpose)} 
                        />
                      </Badge>
                    ))}
                  </div>

                  <Popover open={purposeDropdownOpen} onOpenChange={setPurposeDropdownOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={purposeDropdownOpen}
                        className="w-full justify-between"
                      >
                        Selecione ou digite uma finalidade
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput 
                          placeholder="Procurar finalidade..." 
                          onValueChange={setPurposeSearch} 
                          value={purposeSearch}
                        />
                        <CommandList>
                          <CommandEmpty>
                            {purposeSearch.trim() !== "" ? (
                              <div className="py-2 px-3 text-sm flex flex-col gap-2">
                                <span>Nenhuma finalidade encontrada</span>
                                <Button 
                                  size="sm" 
                                  onClick={() => {
                                    if (purposeSearch.trim()) {
                                      setFormData({
                                        ...formData, 
                                        finalidade: [...formData.finalidade, purposeSearch.trim()]
                                      });
                                      setPurposeSearch("");
                                      setPurposeDropdownOpen(false);
                                    }
                                  }}
                                >
                                  Adicionar "{purposeSearch}"
                                </Button>
                              </div>
                            ) : (
                              "Nenhuma finalidade encontrada"
                            )}
                          </CommandEmpty>
                          <CommandGroup>
                            {filteredPurposeOptions.map((purpose) => (
                              <CommandItem
                                key={purpose}
                                value={purpose}
                                onSelect={() => {
                                  togglePurpose(purpose);
                                  setPurposeDropdownOpen(false);
                                }}
                                className="flex items-center justify-between"
                              >
                                {purpose}
                                {formData.finalidade.includes(purpose) && (
                                  <Check className="h-4 w-4" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  
                  {/* Custom purpose input */}
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      name="otherPurpose"
                      placeholder="Ou digite uma nova finalidade"
                      value={formData.otherPurpose}
                      onChange={handleInputChange}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCustomPurpose()}
                    />
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline" 
                      onClick={handleAddCustomPurpose}
                      disabled={!formData.otherPurpose.trim()}
                    >
                      Adicionar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Video Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Conteúdo do Vídeo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {isGenerating ? "Gerando..." : "Gerar Descrição Detalhada com IA"}
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="descricao_detalhada">Descrição Detalhada</Label>
                <span className="text-xs text-muted-foreground">
                  {formData.descricao_detalhada ? 
                    `${formData.descricao_detalhada.length} caracteres` : 
                    "Use o botão 'Gerar Descrição Detalhada com IA' ou escreva manualmente"}
                </span>
              </div>
              
              {isGenerating ? (
                <div className="h-[150px] flex items-center justify-center border rounded-md">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Gerando descrição...</span>
                  </div>
                </div>
              ) : (
                <Textarea
                  id="descricao_detalhada"
                  name="descricao_detalhada"
                  placeholder="Descrição detalhada do vídeo"
                  value={formData.descricao_detalhada}
                  onChange={handleInputChange}
                  rows={6}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Tags and Interaction */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Tags e Interação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suggestedTags.length > 0 && (
              <div>
                <Label className="text-sm">Tags Sugeridas pela IA</Label>
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
              <Label className="text-sm">Tags Selecionadas</Label>
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

            <div>
              <Label htmlFor="custom-tag" className="text-sm">Adicionar Tag Manual</Label>
              <Input
                id="custom-tag"
                placeholder="Digite uma tag e pressione Enter"
                onKeyPress={handleAddCustomTag}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer with buttons */}
      <div className="flex justify-end gap-2 pt-4">
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
