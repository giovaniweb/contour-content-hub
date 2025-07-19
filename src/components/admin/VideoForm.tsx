
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
import VideoFormFields from './VideoFormFields';
import VideoFormActions from './VideoFormActions';

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
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  
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
  
  // Set equipment from props
  useEffect(() => {
    if (equipmentId && !videoData) {
      setEquipment(equipmentId);
    }
  }, [equipmentId, videoData]);
  
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

  // Generate thumbnail from video
  const generateThumbnailFromVideo = async (videoUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.preload = 'metadata';
      
      video.addEventListener('loadedmetadata', () => {
        // Set video time to 1 second or 10% of duration, whichever is smaller
        const seekTime = Math.min(1, video.duration * 0.1);
        video.currentTime = seekTime;
      });
      
      video.addEventListener('seeked', () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set canvas dimensions to video dimensions
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          // Draw the video frame to canvas
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convert canvas to blob
          canvas.toBlob((blob) => {
            if (blob) {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            } else {
              reject(new Error('Failed to create thumbnail'));
            }
          }, 'image/jpeg', 0.8);
        } catch (error) {
          reject(error);
        }
      });
      
      video.addEventListener('error', reject);
      video.src = videoUrl;
    });
  };

  // Handle video URL change and generate thumbnail
  useEffect(() => {
    if (videoUrl && !thumbUrl && !isGeneratingThumbnail) {
      const generateThumbnail = async () => {
        try {
          setIsGeneratingThumbnail(true);
          const thumbnail = await generateThumbnailFromVideo(videoUrl);
          setThumbUrl(thumbnail);
          toast.success('Thumbnail gerada automaticamente!');
        } catch (error) {
          console.error('Error generating thumbnail:', error);
          toast.error('Não foi possível gerar thumbnail automaticamente');
        } finally {
          setIsGeneratingThumbnail(false);
        }
      };
      
      generateThumbnail();
    }
  }, [videoUrl, thumbUrl, isGeneratingThumbnail]);

  const handleGenerateThumbnail = async () => {
    if (!videoUrl) {
      toast.error('Adicione uma URL de vídeo primeiro para gerar a thumbnail.');
      return;
    }

    try {
      setIsGeneratingThumbnail(true);
      const thumbnail = await generateThumbnailFromVideo(videoUrl);
      setThumbUrl(thumbnail);
      toast.success('Thumbnail gerada automaticamente!');
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      toast.error('Não foi possível gerar thumbnail automaticamente');
    } finally {
      setIsGeneratingThumbnail(false);
    }
  };
  
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
              <VideoFormFields
                title={title}
                setTitle={setTitle}
                shortDescription={shortDescription}
                setShortDescription={setShortDescription}
                detailedDescription={detailedDescription}
                setDetailedDescription={setDetailedDescription}
                videoType={videoType}
                setVideoType={setVideoType}
                videoUrl={videoUrl}
                setVideoUrl={setVideoUrl}
                thumbUrl={thumbUrl}
                setThumbUrl={setThumbUrl}
                equipment={equipment}
                setEquipment={setEquipment}
                bodyArea={bodyArea}
                setBodyArea={setBodyArea}
                tags={tags}
                setTags={setTags}
                instagramCaption={instagramCaption}
                setInstagramCaption={setInstagramCaption}
                marketingObjective={marketingObjective}
                setMarketingObjective={setMarketingObjective}
                equipmentsList={equipmentsList}
                bodyAreasList={bodyAreasList}
                purposes={purposes}
                isGeneratingThumbnail={isGeneratingThumbnail}
                onGenerateThumbnail={handleGenerateThumbnail}
              />

              <VideoFormActions 
                onCancel={onCancel}
                isLoading={isLoading}
                isEditing={!!videoData?.id}
              />

            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VideoForm;
