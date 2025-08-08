
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useSaveScript() {
  const [isSaving, setIsSaving] = useState(false);

  async function saveScript({
    content,
    title,
    format,
    equipment_used = []
  }: {
    content: string;
    title: string;
    format: string;
    equipment_used?: string[];
  }) {
    setIsSaving(true);

    // Obter usuário autenticado
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Você precisa estar logado para salvar o roteiro.");
      setIsSaving(false);
      return false;
    }

    const { error } = await supabase
      .from("approved_scripts")
      .insert({
        user_id: user.id,
        script_content: content,
        title,
        format,
        equipment_used,
        approval_status: "approved"
      });

    if (error) {
      toast.error("Erro ao salvar roteiro: " + error.message);
      setIsSaving(false);
      return false;
    }

    toast.success("Roteiro salvo com sucesso!");
    setIsSaving(false);
    return true;
  }

  return { saveScript, isSaving };
}
