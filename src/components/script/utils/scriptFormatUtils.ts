
import { TextAnnotation } from "@/components/script/AnnotatedText";

// Helper function to extract script information and title
export const extractScriptInfo = (content: string) => {
  const titleMatch = content.match(/Roteiro(?:\s+sobre)?\s+([^\n:]+)/i);
  const title = titleMatch ? titleMatch[1].trim() : "Roteiro";
  
  const objectiveMatch = content.match(/(🟡 Atrair Atenção|🟢 Criar Conexão|🔴 Fazer Comprar|🔁 Reativar Interesse|✅ Fechar Agora)/);
  const objective = objectiveMatch ? objectiveMatch[1] : "";
  
  const contentTypeMatch = content.match(/🎥 Tipo de Conteúdo:\s*([^\n]+)/i);
  const contentType = contentTypeMatch ? contentTypeMatch[1].trim() : "";
  
  return { title, objective, contentType };
};

// Check if content has Disney structure
export const hasDisneyStructure = (content: string): boolean => {
  return content.includes("Identificação") || 
         content.includes("Conflito") || 
         content.includes("Virada") || 
         content.includes("Final Marcante");
};

// Format Disney structure sections
export const formatDisneySection = (section: string): string => {
  let formattedSection = section;
  formattedSection = formattedSection.replace(/"([^"]+)"/g, 
    '<div class="pl-3 border-l-4 border-gray-300 italic text-gray-700 my-2 py-1">$1</div>');
  
  return `<div class="mb-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
    ${formattedSection}
  </div>`;
};
