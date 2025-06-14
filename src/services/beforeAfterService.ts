
import { supabase } from '@/integrations/supabase/client';
import { BeforeAfterPhoto, BeforeAfterUploadData } from '@/types/before-after';

export const beforeAfterService = {
  // Upload de imagem para o storage
  async uploadImage(file: File, folder: 'before' | 'after'): Promise<string | null> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        console.log('❌ Usuário não autenticado');
        return null;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${userData.user.id}/${folder}/${Date.now()}.${fileExt}`;

      console.log(`📤 Fazendo upload da imagem ${folder}:`, fileName);

      const { data, error } = await supabase.storage
        .from('before-after-photos')
        .upload(fileName, file);

      if (error) {
        console.error('❌ Erro no upload:', error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('before-after-photos')
        .getPublicUrl(fileName);

      console.log(`✅ Upload ${folder} concluído:`, publicUrl);
      return publicUrl;
    } catch (error) {
      console.error(`❌ Erro ao fazer upload ${folder}:`, error);
      return null;
    }
  },

  // Criar registro de foto antes e depois
  async createBeforeAfterPhoto(
    beforeUrl: string,
    afterUrl: string,
    data: BeforeAfterUploadData
  ): Promise<BeforeAfterPhoto | null> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        console.log('❌ Usuário não autenticado');
        return null;
      }

      console.log('📝 Criando registro de foto antes/depois:', data.title);

      const { data: photo, error } = await supabase
        .from('before_after_photos')
        .insert({
          user_id: userData.user.id,
          title: data.title,
          description: data.description,
          before_image_url: beforeUrl,
          after_image_url: afterUrl,
          equipment_used: data.equipment_used,
          procedure_date: data.procedure_date,
          is_public: data.is_public,
          approved_script_id: data.approved_script_id
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao criar registro:', error);
        throw error;
      }

      console.log('✅ Registro criado com sucesso:', photo.id);
      return photo as BeforeAfterPhoto;
    } catch (error) {
      console.error('❌ Erro ao criar foto antes/depois:', error);
      return null;
    }
  },

  // Buscar fotos do usuário
  async getUserPhotos(): Promise<BeforeAfterPhoto[]> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        console.log('❌ Usuário não autenticado');
        return [];
      }

      console.log('🔍 Buscando fotos do usuário:', userData.user.id);

      const { data, error } = await supabase
        .from('before_after_photos')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro na busca:', error);
        throw error;
      }

      console.log('📊 Fotos encontradas:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ Erro ao buscar fotos:', error);
      return [];
    }
  },

  // Buscar fotos públicas
  async getPublicPhotos(): Promise<BeforeAfterPhoto[]> {
    try {
      console.log('🔍 Buscando fotos públicas');

      const { data, error } = await supabase
        .from('before_after_photos')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro na busca:', error);
        throw error;
      }

      console.log('📊 Fotos públicas encontradas:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ Erro ao buscar fotos públicas:', error);
      return [];
    }
  },

  // Deletar foto
  async deletePhoto(photoId: string): Promise<boolean> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return false;

      console.log('🗑️ Deletando foto:', photoId);

      const { error } = await supabase
        .from('before_after_photos')
        .delete()
        .eq('id', photoId)
        .eq('user_id', userData.user.id);

      if (error) {
        console.error('❌ Erro ao deletar:', error);
        throw error;
      }

      console.log('✅ Foto deletada com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao deletar foto:', error);
      return false;
    }
  },

  // Atualizar visibilidade
  async togglePublic(photoId: string, isPublic: boolean): Promise<boolean> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return false;

      console.log('👁️ Alterando visibilidade:', photoId, isPublic);

      const { error } = await supabase
        .from('before_after_photos')
        .update({ is_public: isPublic })
        .eq('id', photoId)
        .eq('user_id', userData.user.id);

      if (error) {
        console.error('❌ Erro ao alterar visibilidade:', error);
        throw error;
      }

      console.log('✅ Visibilidade alterada com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao alterar visibilidade:', error);
      return false;
    }
  }
};
