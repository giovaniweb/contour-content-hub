import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import VideoObjectiveSelector from './VideoObjectiveSelector';
import { MarketingObjectiveType } from '@/types/script';

// Add a prop interface for VideoForm
interface VideoFormProps {
  onSuccess?: (result: any) => void;
  onCancel?: () => void;
  videoData?: any;
  equipmentId?: string | null;
}

const VideoForm: React.FC<VideoFormProps> = ({ onSuccess, onCancel, videoData = null, equipmentId = null }) => {
  // Form state
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [videoType, setVideoType] = useState('video_pronto');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbUrl, setThumbUrl] = useState('');
  const [equipment, setEquipment] = useState(equipmentId || '');
  const [bodyArea, setBodyArea] = useState('');
  const [purposes, setPurposes] = useState([]);
  const [tags, setTags] = useState('');
  const [instagramCaption, setInstagramCaption] = useState('');
  const [marketingObjective, setMarketingObjective] = useState<MarketingObjectiveType>('🟡 Atrair Atenção');
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('form');
  const [equipmentsList, setEquipmentsList] = useState([]);
  const [bodyAreasList, setBodyAreasList] = useState([]);
  
  // Load initial data
  useEffect(() => {
    if (videoData) {
      setTitle(videoData.titulo || '');
      setShortDescription(videoData.descricao_curta || '');
      setDetailedDescription(videoData.descricao_detalhada || '');
      setVideoType(videoData.tipo_video || 'video_pronto');
      setVideoUrl(videoData.url_video || '');
      setThumbUrl(videoData.preview_url || '');
      setEquipment(videoData.equipment_id || '');
      setBodyArea(videoData.area_corpo || '');
      setPurposes(videoData.finalidade || []);
      setTags(Array.isArray(videoData.tags) ? videoData.tags.join(', ') : videoData.tags || '');
      setInstagramCaption(videoData.legenda_instagram || '');
      // Convert legacy marketing objective values to new format if needed
      let objective = videoData.objetivo_marketing;
      if (objective === 'atrair_atencao') objective = '🟡 Atrair Atenção';
      else if (objective === 'criar_conexao') objective = '🟢 Criar Conexão';
      else if (objective === 'fazer_comprar') objective = '🔴 Fazer Comprar';
      else if (objective === 'reativar_interesse') objective = '🔁 Reativar Interesse';
      else if (objective === 'fechar_agora') objective = '✅ Fechar Agora';
      setMarketingObjective(objective as MarketingObjectiveType || '🟡 Atrair Atenção');
    }
    
    // Load equipment list and body areas
    const fetchReferenceData = async () => {
      try {
        // Fetch equipments
        const { data: equipmentsData } = await supabase
          .from('equipamentos')
          .select('id, nome')
          .order('nome');
          
        if (equipmentsData) {
          setEquipmentsList(equipmentsData);
        }
        
        // Fix: Query the areas from videos table since areas_corpo table doesn't exist
        // Get distinct areas from videos table
        const { data: areasData } = await supabase
          .from('videos')
          .select('area_corpo')
          .not('area_corpo', 'is', null)
          .order('area_corpo');
          
        if (areasData) {
          // Extract unique areas
          const uniqueAreas = [...new Set(areasData.map(item => item.area_corpo))].filter(Boolean);
          
          // Transform to expected format
          const formattedAreas = uniqueAreas.map(area => ({
            id: area,
            nome: area
          }));
          
          setBodyAreasList(formattedAreas);
        }
      } catch (error) {
        console.error('Error fetching reference data:', error);
        toast.error('Erro ao carregar dados de referência');
      }
    };
    
    fetchReferenceData();
  }, [videoData]);
  
  // After equipment is selected, prefill based on it
  useEffect(() => {
    if (equipment && !videoData) {
      const fetchEquipmentDetails = async () => {
        try {
          const { data } = await supabase
            .from('equipamentos')
            .select('*')
            .eq('id', equipment)
            .single();
            
          if (data) {
            // If the equipment has properties, use them
            if (data.indicacoes) {
              setPurposes(Array.isArray(data.indicacoes) ? data.indicacoes : []);
            }
            
            // Try to determine body area from equipment data if available
            // For now, just set the first area as body area if available from equipment
            if (data.indicacoes && data.indicacoes.length > 0) {
              setBodyArea(data.indicacoes[0]);
            }
          }
        } catch (error) {
          console.error('Error fetching equipment details:', error);
        }
      };
      
      fetchEquipmentDetails();
    }
  }, [equipment, videoData]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = {
        titulo: title,
        descricao_curta: shortDescription,
        descricao_detalhada: detailedDescription,
        tipo_video: videoType,
        url_video: videoUrl,
        preview_url: thumbUrl,
        equipment_id: equipment || null,
        area_corpo: bodyArea || null,
        finalidade: purposes,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        legenda_instagram: instagramCaption || null,
        objetivo_marketing: marketingObjective || null
      };

      let result;
      if (videoData?.id) {
        // Update existing video
        const { data, error } = await supabase
          .from('videos')
          .update(formData)
          .eq('id', videoData.id)
          .select();
          
        if (error) throw error;
        result = data;
        toast.success('Vídeo atualizado com sucesso!');
      } else {
        // Create new video
        const { data, error } = await supabase
          .from('videos')
          .insert([formData])
          .select();
          
        if (error) throw error;
        result = data;
        toast.success('Vídeo cadastrado com sucesso!');
      }
      
      if (onSuccess) onSuccess(result);
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error('Erro ao salvar vídeo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Tabs value="form" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="form">Formulário Manual</TabsTrigger>
        </TabsList>
        <TabsContent value="form">
          <form onSubmit={handleSubmit}>
            <Card className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Vídeo</Label>
                  <Input 
                    id="title" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Tratamento de flacidez facial com Ultraformer"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="videoType">Tipo de Vídeo</Label>
                  <RadioGroup 
                    id="videoType"
                    value={videoType} 
                    onValueChange={setVideoType}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="video_pronto" id="video-pronto" />
                      <Label htmlFor="video-pronto">Vídeo Pronto</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="take" id="take" />
                      <Label htmlFor="take">Take (Bruto)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="imagem" id="imagem" />
                      <Label htmlFor="imagem">Imagem</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="videoUrl">URL do Vídeo</Label>
                  <Input 
                    id="videoUrl"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://vimeo.com/123456789"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="thumbUrl">URL da Imagem de Capa</Label>
                  <Input 
                    id="thumbUrl"
                    value={thumbUrl}
                    onChange={(e) => setThumbUrl(e.target.value)}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Descrição Curta</Label>
                  <Input 
                    id="shortDescription"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Breve descrição (max. 150 caracteres)"
                    maxLength={150}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="equipment">Equipamento</Label>
                  <Select value={equipment || ""} onValueChange={setEquipment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um equipamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum equipamento</SelectItem>
                      {equipmentsList.map(eq => (
                        <SelectItem key={eq.id} value={eq.id}>{eq.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bodyArea">Área do Corpo</Label>
                  <Select value={bodyArea || ""} onValueChange={setBodyArea}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma área do corpo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nenhuma">Selecione</SelectItem>
                      {bodyAreasList.map(area => (
                        <SelectItem key={area.id} value={area.id}>{area.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label>Objetivo de Marketing</Label>
                  <VideoObjectiveSelector
                    value={marketingObjective}
                    onValueChange={setMarketingObjective}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="detailedDescription">Descrição Detalhada</Label>
                  <Textarea 
                    id="detailedDescription"
                    value={detailedDescription}
                    onChange={(e) => setDetailedDescription(e.target.value)}
                    placeholder="Descrição detalhada do vídeo"
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input 
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Palavras-chave separadas por vírgulas"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instagramCaption">Legenda para Instagram</Label>
                  <Textarea
                    id="instagramCaption"
                    value={instagramCaption}
                    onChange={(e) => setInstagramCaption(e.target.value)}
                    placeholder="Legenda para postagens no Instagram"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : videoData?.id ? (
                    'Atualizar Vídeo'
                  ) : (
                    'Cadastrar Vídeo'
                  )}
                </Button>
              </div>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VideoForm;
