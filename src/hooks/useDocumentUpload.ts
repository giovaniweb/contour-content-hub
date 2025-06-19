
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DocumentUploadForm } from '@/types/document';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

export const useDocumentUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const uploadDocument = async (formData: DocumentUploadForm): Promise<string | null> => {
    if (!formData.file) {
      toast({
        title: "Erro",
        description: "Nenhum arquivo selecionado.",
        variant: "destructive"
      });
      return null;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      setUploadProgress(25);

      // Generate unique filename
      const fileExt = formData.file.name.split('.').pop();
      const fileName = `${user.id}/${uuidv4()}.${fileExt}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, formData.file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      setUploadProgress(50);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      setUploadProgress(75);

      // Create document record in database
      const { data: documentData, error: insertError } = await supabase
        .from('documentos_tecnicos')
        .insert({
          titulo: formData.titulo,
          descricao: formData.descricao || null,
          tipo: formData.tipo,
          equipamento_id: formData.equipamento_id || null,
          arquivo_url: publicUrl,
          link_dropbox: publicUrl, // For backward compatibility
          idioma_original: formData.idioma_original,
          status: 'processando',
          criado_por: user.id,
        })
        .select('id')
        .single();

      if (insertError) {
        throw insertError;
      }

      setUploadProgress(90);

      // Trigger text extraction
      try {
        await supabase.functions.invoke('pdf-text-extraction', {
          body: {
            pdfUrl: publicUrl,
            documentId: documentData.id
          }
        });
      } catch (extractionError) {
        console.warn('Text extraction failed:', extractionError);
        // Don't throw here, document is still uploaded
      }

      setUploadProgress(100);

      toast({
        title: "Sucesso",
        description: "Documento enviado com sucesso!",
      });

      return documentData.id;

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Erro",
        description: error.message || 'Erro ao enviar documento',
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    uploadDocument,
    isUploading,
    uploadProgress
  };
};
