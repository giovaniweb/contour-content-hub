
import { supabase } from "@/integrations/supabase/client";

/**
 * Script provisório para popular a tabela approved_scripts, executado manualmente.
 * **Atenção:** Use apenas para testes em desenvolvimento.
 */
const seedScripts = [
  {
    title: "Roteiro Carrossel: Cuidados com a Pele",
    format: "carrossel",
    script_content: "1. Limpe o rosto diariamente...\n2. Use protetor solar...",
    equipment_used: ["Adella", "Dermalux"],
  },
  {
    title: "Roteiro Story: Rotina Matinal",
    format: "stories",
    script_content: "Bom dia! Prepare sua pele para o dia com esses passos...",
    equipment_used: ["Hipro"],
  },
  {
    title: "Roteiro Reels: Laser CO2 antes e depois",
    format: "reels",
    script_content: "Veja o resultado do laser CO2 em rugas profundas...",
    equipment_used: ["Laser CO2"],
  },
  {
    title: "Roteiro Imagem: Frase de impacto sobre autoestima",
    format: "imagem",
    script_content: "Sua autoestima merece esse cuidado! #beleza",
    equipment_used: ["Adella"],
  },
  // Adicione mais para garantir diversidade
];

export async function adminPopulateApprovedScripts(userId: string) {
  for (const item of seedScripts) {
    const { error } = await supabase.from("approved_scripts").insert({
      user_id: userId,
      script_content: item.script_content,
      title: item.title,
      format: item.format,
      equipment_used: item.equipment_used,
      approval_status: "approved",
      approved_at: new Date().toISOString(),
      approved_by: userId,
    });
    if (error) {
      console.error("Erro ao popular roteiro:", item.title, error);
    } else {
      console.log("Roteiro adicionado:", item.title);
    }
  }
}
