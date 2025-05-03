
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useEquipments } from "@/hooks/useEquipments";

interface ArticleData {
  id?: string;
  titulo?: string;
  descricao?: string;
  equipamento_id?: string;
  idioma_original?: string;
  link_dropbox?: string;
}

export const formSchema = z.object({
  titulo: z.string().min(3, { message: "Título precisa ter pelo menos 3 caracteres" }),
  descricao: z.string().optional(),
  equipamento_id: z.string().optional(),
  idioma_original: z.string().default("pt"),
  link_dropbox: z.string().url({ message: "Link inválido" }).optional().or(z.literal("")),
});

export type FormValues = z.infer<typeof formSchema>;

// Default values for the form
const defaultFormValues: FormValues = {
  titulo: "",
  descricao: "",
  equipamento_id: "",
  idioma_original: "pt",
  link_dropbox: ""
};

export const useArticleForm = (articleData: ArticleData | undefined, onSuccess: (data?: any) => void, isDialogOpen: boolean = false) => {
  // State for form submission control
  const [isLoading, setIsLoading] = useState(false);
  
  // Get available equipment data
  const { equipments } = useEquipments();
  
  // Reset all form state values to their defaults
  const resetFormState = useCallback(() => {
    console.log("Resetting form state");
    // This function is designed to be called externally
    // to reset form state when necessary (e.g., on dialog open,
    // on form submission success, or when unmounting the component)
  }, []);

  // Form submission handler
  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      console.log("Submitting form with values:", values);
      
      // Use fileUrl from upload step or link_dropbox value
      const finalFileUrl = values.link_dropbox || null;
      
      // Build article payload
      const articlePayload = {
        titulo: values.titulo,
        descricao: values.descricao || null,
        equipamento_id: values.equipamento_id === "none" ? null : values.equipamento_id || null,
        tipo: 'artigo_cientifico',
        idioma_original: values.idioma_original,
        link_dropbox: finalFileUrl,
        status: 'ativo',
        criado_por: (await supabase.auth.getUser()).data.user?.id || null
      };

      console.log("Submitting article payload:", articlePayload);

      let savedArticleData = null;

      if (articleData && articleData.id) {
        // Update existing article
        const { error, data } = await supabase
          .from('documentos_tecnicos')
          .update(articlePayload)
          .eq('id', articleData.id)
          .select();
          
        if (error) {
          console.error("Error updating article:", error);
          throw error;
        }

        savedArticleData = data ? data[0] : articleData;
      } else {
        // Create new article
        const { error, data } = await supabase
          .from('documentos_tecnicos')
          .insert([articlePayload])
          .select();
          
        if (error) {
          console.error("Error inserting article:", error);
          throw error;
        }

        savedArticleData = data ? data[0] : null;
      }

      // Pass the saved data to success handler
      onSuccess(savedArticleData);
    } catch (error: any) {
      console.error('Error saving article:', error);
      toast.error("Erro ao salvar artigo", {
        description: "Não foi possível salvar o artigo científico. Por favor, tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    equipments,
    resetFormState,
    onSubmit,
    formSchema
  };
};
