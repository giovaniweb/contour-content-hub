import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface EquipmentDocument {
  id: string;
  titulo_extraido: string;
  tipo_documento: string;
  palavras_chave: string[];
  autores: string[];
  data_upload: string;
  file_path?: string;
  equipamento_id?: string;
}

export interface EquipmentVideo {
  id: string;
  titulo: string;
  descricao?: string;
  url_video: string;
  thumbnail_url?: string;
  categoria?: string;
  data_upload: string;
  tags?: string[];
  favoritos_count?: number;
  downloads_count?: number;
}

export interface EquipmentMaterial {
  id: string;
  nome: string;
  categoria?: string;
  tipo?: string;
  arquivo_url?: string;
  preview_url?: string;
  tags?: string[];
  data_upload: string;
}

export const useEquipmentContent = (equipmentId: string, equipmentName: string) => {
  const [documents, setDocuments] = useState<EquipmentDocument[]>([]);
  const [videos, setVideos] = useState<EquipmentVideo[]>([]);
  const [materials, setMaterials] = useState<EquipmentMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      if (!equipmentId || !equipmentName) return;

      setLoading(true);
      setError(null);

      try {
        // Buscar documentos relacionados
        const { data: docsData, error: docsError } = await supabase
          .from('unified_documents')
          .select('*')
          .or(`equipamento_id.eq.${equipmentId},texto_completo.ilike.%${equipmentName}%,titulo_extraido.ilike.%${equipmentName}%`);

        if (docsError) throw docsError;

        // Buscar vídeos relacionados
        const { data: videosData, error: videosError } = await supabase
          .from('videos')
          .select('id, titulo, descricao, url_video, thumbnail_url, categoria, data_upload, tags, favoritos_count, downloads_count')
          .or(`titulo.ilike.%${equipmentName}%,descricao.ilike.%${equipmentName}%,tags.cs.{${equipmentName}}`);

        if (videosError) throw videosError;

        // Buscar materiais/artes relacionados
        const { data: materialsData, error: materialsError } = await supabase
          .from('materiais')
          .select('*')
          .or(`nome.ilike.%${equipmentName}%,tags.cs.{${equipmentName}}`);

        if (materialsError) throw materialsError;

        setDocuments(docsData || []);
        setVideos(videosData || []);
        setMaterials(materialsData || []);
      } catch (err) {
        console.error('Error fetching equipment content:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar conteúdo');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [equipmentId, equipmentName]);

  return {
    documents,
    videos,
    materials,
    loading,
    error
  };
};