
import { supabase } from '@/integrations/supabase/client';

export type DeleteableEntity = 'video' | 'document' | 'before_after' | 'material' | 'download_storage' | 'user_profile';

interface DeleteResult {
  success: boolean;
  error?: string;
  deleted_files?: string[];
  message?: string;
}

/**
 * Universal delete service that handles complete deletion with cascading effects
 */
export class UniversalDeleteService {
  
  /**
   * Delete any entity using the appropriate cascade function
   */
  static async deleteEntity(entityType: DeleteableEntity, entityId: string): Promise<DeleteResult> {
    try {
      console.log(`🗑️ [UniversalDelete] Iniciando exclusão ${entityType}:`, entityId);
      
      const functionName = this.getFunctionName(entityType);
      const paramName = this.getParamName(entityType);
      
      // Use any type to bypass strict typing for custom functions
      const { data, error } = await (supabase.rpc as any)(functionName, {
        [paramName]: entityId
      });

      if (error) {
        console.error(`❌ [UniversalDelete] Erro em ${entityType}:`, error);
        throw error;
      }

      console.log(`✅ [UniversalDelete] Resultado ${entityType}:`, data);
      
      // Type assertion for the expected result structure
      const result = data as DeleteResult;
      
      // If we have files to cleanup from storage, we could implement that here
      if (result.deleted_files && result.deleted_files.length > 0) {
        console.log(`🧹 [UniversalDelete] Arquivos para cleanup:`, result.deleted_files);
        // TODO: Implementar cleanup de Storage se necessário
      }

      return result;
    } catch (error: any) {
      console.error(`💥 [UniversalDelete] Erro capturado em ${entityType}:`, error);
      return {
        success: false,
        error: error.message || `Erro ao excluir ${entityType}`
      };
    }
  }

  /**
   * Get the stored procedure function name for each entity type
   */
  private static getFunctionName(entityType: DeleteableEntity): string {
    const functionMap = {
      video: 'delete_video_cascade',
      document: 'delete_document_cascade',
      before_after: 'delete_before_after_cascade',
      material: 'delete_material_cascade',
      download_storage: 'delete_download_storage_cascade',
      user_profile: 'delete_user_profile_cascade'
    };
    
    return functionMap[entityType];
  }

  /**
   * Get the parameter name for each entity type
   */
  private static getParamName(entityType: DeleteableEntity): string {
    const paramMap = {
      video: 'video_id_param',
      document: 'document_id_param',
      before_after: 'photo_id_param',
      material: 'material_id_param',
      download_storage: 'download_id_param',
      user_profile: 'profile_id_param'
    };
    
    return paramMap[entityType];
  }

  /**
   * Convenience methods for each entity type
   */
  static deleteVideo(videoId: string) {
    return this.deleteEntity('video', videoId);
  }

  static deleteDocument(documentId: string) {
    return this.deleteEntity('document', documentId);
  }

  static deleteBeforeAfterPhoto(photoId: string) {
    return this.deleteEntity('before_after', photoId);
  }

  static deleteMaterial(materialId: string) {
    return this.deleteEntity('material', materialId);
  }

  static deleteDownloadStorage(downloadId: string) {
    return this.deleteEntity('download_storage', downloadId);
  }

  static deleteUserProfile(profileId: string) {
    return this.deleteEntity('user_profile', profileId);
  }
}

/**
 * Standardized delete handler for UI components
 * Provides consistent loading states, optimistic updates, and feedback
 */
export const createDeleteHandler = <T extends { id: string }>(
  entityType: DeleteableEntity,
  items: T[],
  setItems: (items: T[]) => void,
  toast: any,
  onSuccess?: () => void
) => {
  return async (itemId: string) => {
    // Find the item for optimistic update
    const item = items.find(i => i.id === itemId);
    if (!item) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Item não encontrado'
      });
      return;
    }

    // Optimistic update - remove from UI immediately
    const optimisticItems = items.filter(i => i.id !== itemId);
    setItems(optimisticItems);

    // Show loading toast
    toast({
      title: 'Excluindo...',
      description: 'Removendo item e todas as referências...'
    });

    try {
      const result = await UniversalDeleteService.deleteEntity(entityType, itemId);
      
      if (!result.success) {
        // Rollback optimistic update
        setItems(items);
        throw new Error(result.error || 'Falha na exclusão');
      }

      // Success feedback
      toast({
        title: 'Sucesso!',
        description: result.message || 'Item excluído completamente'
      });

      // Call success callback if provided
      onSuccess?.();

    } catch (error: any) {
      // Rollback optimistic update on error
      setItems(items);
      
      console.error(`Erro ao excluir ${entityType}:`, error);
      toast({
        variant: 'destructive',
        title: 'Erro na exclusão',
        description: error.message || `Não foi possível excluir o ${entityType}`
      });
    }
  };
};
