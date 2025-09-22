import { supabase } from '@/integrations/supabase/client';

export interface Photo {
  id: string;
  user_id: string;
  titulo: string;
  descricao_curta?: string;
  categoria?: string;
  tags?: string[];
  equipamentos?: string[];
  url_imagem: string;
  thumbnail_url?: string;
  downloads_count?: number;
  favoritos_count?: number;
  data_upload: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePhotoData {
  titulo: string;
  descricao_curta?: string;
  categoria?: string;
  tags?: string[];
  equipamentos?: string[];
  url_imagem: string;
  thumbnail_url?: string;
}

export interface UpdatePhotoData {
  titulo?: string;
  descricao_curta?: string;
  categoria?: string;
  tags?: string[];
  equipamentos?: string[];
  thumbnail_url?: string;
}

export const photoService = {
  async getUserPhotos(params?: {
    page?: number;
    itemsPerPage?: number;
    searchTerm?: string;
    selectedEquipment?: string;
  }): Promise<{ data: Photo[] | null; error: string | null; totalCount?: number }> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        return { data: null, error: 'Usuário não autenticado' };
      }

      const { page = 1, itemsPerPage = 12, searchTerm = '', selectedEquipment = '' } = params || {};
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let query = supabase
        .from('fotos')
        .select(`
          id,
          titulo,
          descricao_curta,
          categoria,
          tags,
          equipamentos,
          thumbnail_url,
          url_imagem,
          downloads_count,
          favoritos_count,
          data_upload,
          created_at,
          updated_at,
          user_id
        `, { count: 'exact' })
        .eq('user_id', userData.user.id);

      // Apply search filter
      if (searchTerm.trim()) {
        query = query.or(`titulo.ilike.%${searchTerm}%,categoria.ilike.%${searchTerm}%,tags.cs.{${searchTerm}},equipamentos.cs.{${searchTerm}}`);
      }

      // Apply equipment filter
      if (selectedEquipment.trim()) {
        query = query.or(`equipamentos.cs.{${selectedEquipment}},categoria.ilike.%${selectedEquipment}%`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('Erro ao buscar fotos:', error);
        return { data: null, error: error.message };
      }

      return { data: data || [], error: null, totalCount: count || 0 };
    } catch (error) {
      console.error('Erro inesperado:', error);
      return { data: null, error: 'Erro inesperado ao buscar fotos' };
    }
  },

  async getAllPhotos(filters?: {
    search?: string;
    categoria?: string;
  }): Promise<{ data: Photo[] | null; error: string | null }> {
    try {
      let query = supabase
        .from('fotos')
        .select(`
          id,
          titulo,
          descricao_curta,
          categoria,
          tags,
          equipamentos,
          thumbnail_url,
          url_imagem,
          downloads_count,
          favoritos_count,
          data_upload,
          created_at,
          updated_at,
          user_id
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.search) {
        query = query.or(`titulo.ilike.%${filters.search}%,descricao_curta.ilike.%${filters.search}%,tags.cs.{${filters.search}}`);
      }

      if (filters?.categoria && filters.categoria !== 'all') {
        query = query.eq('categoria', filters.categoria);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar fotos:', error);
        return { data: null, error: error.message };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Erro inesperado:', error);
      return { data: null, error: 'Erro inesperado ao buscar fotos' };
    }
  },

  async createPhoto(photoData: CreatePhotoData): Promise<{ data: Photo | null; error: string | null }> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        return { data: null, error: 'Usuário não autenticado' };
      }

      const { data, error } = await supabase
        .from('fotos')
        .insert({
          ...photoData,
          user_id: userData.user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar foto:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Erro inesperado:', error);
      return { data: null, error: 'Erro inesperado ao criar foto' };
    }
  },

  async updatePhoto(id: string, photoData: UpdatePhotoData): Promise<{ data: Photo | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('fotos')
        .update(photoData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar foto:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Erro inesperado:', error);
      return { data: null, error: 'Erro inesperado ao atualizar foto' };
    }
  },

  async deletePhoto(id: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('fotos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar foto:', error);
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (error) {
      console.error('Erro inesperado:', error);
      return { success: false, error: 'Erro inesperado ao deletar foto' };
    }
  },

  async uploadPhoto(file: File): Promise<{ url: string | null; error: string | null }> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        return { url: null, error: 'Usuário não autenticado' };
      }

      const fileName = `${userData.user.id}/fotos/${Date.now()}_${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        return { url: null, error: uploadError.message };
      }

      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      return { url: urlData.publicUrl, error: null };
    } catch (error) {
      console.error('Erro inesperado no upload:', error);
      return { url: null, error: 'Erro inesperado no upload' };
    }
  }
};