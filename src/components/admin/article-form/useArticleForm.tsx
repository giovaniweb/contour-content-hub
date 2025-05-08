
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

// Valores padrão para o formulário
const defaultFormValues: FormValues = {
  titulo: "",
  descricao: "",
  equipamento_id: "",
  idioma_original: "pt",
  link_dropbox: ""
};

export const useArticleForm = (articleData: ArticleData | undefined, onSuccess: (data?: any) => void, isDialogOpen: boolean = false) => {
  // Estado para controle de submissão do formulário
  const [isLoading, setIsLoading] = useState(false);
  
  // Obtém dados de equipamentos disponíveis
  const { equipments } = useEquipments();
  
  // Resetar todos os valores do estado do formulário para os padrões
  const resetFormState = useCallback(() => {
    console.log("Resetting form state");
    // Esta função é projetada para ser chamada externamente
    // para resetar o estado do formulário quando necessário
  }, []);

  // Manipulador de envio do formulário
  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      console.log("Submitting form with values:", values);
      
      // Use fileUrl do passo de upload ou valor de link_dropbox
      const finalFileUrl = values.link_dropbox || null;
      
      // Construir payload do artigo
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
        // Atualizar artigo existente
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
        console.log("Article updated successfully:", savedArticleData);
      } else {
        // Criar novo artigo
        const { error, data } = await supabase
          .from('documentos_tecnicos')
          .insert([articlePayload])
          .select();
          
        if (error) {
          console.error("Error inserting article:", error);
          throw error;
        }

        savedArticleData = data ? data[0] : null;
        console.log("Article created successfully:", savedArticleData);
      }

      // Passar os dados salvos para o manipulador de sucesso
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
