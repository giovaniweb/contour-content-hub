
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { 
  MessageCircle, 
  Target, 
  HeartHandshake, 
  ShoppingCart, 
  Repeat, 
  CheckCircle2,
  File
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ScriptContentProps {
  content: string;
}

const ScriptContent: React.FC<ScriptContentProps> = ({ content }) => {
  // Identify Disney structure markers in content
  const hasDisneyStructure = content.includes("Identificação") || 
                            content.includes("Conflito") || 
                            content.includes("Virada") || 
                            content.includes("Final Marcante");
  
  // Format the content with improved styling and organization by topics
  const formatContent = (content: string) => {
    // First, pre-process content to identify major sections
    let processedContent = content;
    
    // Format the Disney structure sections with better styling
    if (hasDisneyStructure) {
      processedContent = processedContent
        .replace(/\bIdentificação\b/g, '<span class="py-1 px-3 rounded-md bg-blue-100 text-blue-800 font-medium inline-block my-1">Identificação</span>')
        .replace(/\bConflito\b/g, '<span class="py-1 px-3 rounded-md bg-orange-100 text-orange-800 font-medium inline-block my-1">Conflito</span>')
        .replace(/\bVirada\b/g, '<span class="py-1 px-3 rounded-md bg-green-100 text-green-800 font-medium inline-block my-1">Virada</span>')
        .replace(/\bFinal Marcante\b/g, '<span class="py-1 px-3 rounded-md bg-purple-100 text-purple-800 font-medium inline-block my-1">Final Marcante</span>');
    }

    // Format marketing objectives with icons and badges
    processedContent = processedContent
      .replace(/🟡 Atrair Atenção/g, '<div class="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-md font-medium inline-flex"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-target"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>Atrair Atenção</div>')
      .replace(/🟢 Criar Conexão/g, '<div class="flex items-center gap-1.5 bg-green-50 text-green-800 px-3 py-1.5 rounded-md font-medium inline-flex"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-handshake"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/><path d="m18 15-2-2"/><path d="m15 18-2-2"/></svg>Criar Conexão</div>')
      .replace(/🔴 Fazer Comprar/g, '<div class="flex items-center gap-1.5 bg-red-50 text-red-800 px-3 py-1.5 rounded-md font-medium inline-flex"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>Fazer Comprar</div>')
      .replace(/🔁 Reativar Interesse/g, '<div class="flex items-center gap-1.5 bg-blue-50 text-blue-800 px-3 py-1.5 rounded-md font-medium inline-flex"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-repeat"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>Reativar Interesse</div>')
      .replace(/✅ Fechar Agora/g, '<div class="flex items-center gap-1.5 bg-purple-50 text-purple-800 px-3 py-1.5 rounded-md font-medium inline-flex"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle-2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>Fechar Agora</div>');

    // Split content into sections for better organization
    const sections = processedContent.split('\n\n');
    let result = '';
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i].trim();
      
      if (!section) continue;
      
      // Format title sections
      if (section.startsWith('# ') || section.startsWith('## ') || section.match(/^Roteiro:/i)) {
        result += `<div class="text-xl font-bold text-gray-800 mb-3 border-b pb-2">${section.replace(/^#+ /, '')}</div>`;
      }
      // Format subtitle or Disney structure overview
      else if (section.includes('Roteiro com estrutura Disney')) {
        result += `<div class="mb-4 p-3 bg-slate-50 rounded-md border border-slate-100">
          <div class="text-sm font-semibold mb-1.5 text-slate-600">Estrutura narrativa:</div>
          <div class="flex flex-wrap gap-2">
            <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">Identificação</span>
            <span class="text-gray-400">→</span>
            <span class="bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-sm">Conflito</span>
            <span class="text-gray-400">→</span>
            <span class="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm">Virada</span>
            <span class="text-gray-400">→</span>
            <span class="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-sm">Final Marcante</span>
          </div>
        </div>`;
      }
      // Format script metadata sections
      else if (section.includes('Tipo de Conteúdo:') || section.includes('Objetivo:')) {
        // Split multiple metadata entries if they exist
        const metadataEntries = section.split('\n');
        result += `<div class="mb-4 grid grid-cols-1 md:grid-cols-2 gap-2">`;
        
        for (const entry of metadataEntries) {
          if (entry.includes(':')) {
            const [label, value] = entry.split(':');
            if (value) {
              result += `<div class="bg-gray-50 p-2.5 rounded-md border border-gray-100">
                <span class="font-medium text-gray-700">${label}:</span> 
                <span class="ml-1 bg-yellow-50 px-2 py-0.5 rounded-md text-yellow-800">${value.trim()}</span>
              </div>`;
            }
          }
        }
        result += `</div>`;
      }
      // Format the Disney structure script parts
      else if (
        (section.includes('"Você já se olhou') && section.includes('Identificação')) ||
        (section.includes('"Flacidez') && section.includes('Conflito')) ||
        (section.includes('"Conheça o') && section.includes('Virada')) ||
        (section.includes('"Redefina seu') && section.includes('Final Marcante'))
      ) {
        // This is likely a Disney structure section, format as cards
        result += `<div class="mb-3 p-3.5 bg-white border border-gray-200 rounded-md shadow-sm">
          ${section}
        </div>`;
      }
      // Additional metadata like tone, target audience
      else if (section.includes('Ideal para:') || section.includes('Tom de linguagem:')) {
        result += `<div class="mt-4 mb-3 p-3 bg-slate-50 rounded-md border border-slate-100">
          <h3 class="font-medium mb-2 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            Detalhes Adicionais
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            ${section.split('\n').map(line => `<div class="p-2 bg-white rounded border">${line}</div>`).join('')}
          </div>
        </div>`;
      }
      // Regular paragraph with important content
      else if (section.length > 30) {
        result += `<div class="mb-4 p-3 bg-white border border-gray-100 rounded-md">
          ${section}
        </div>`;
      }
      // Short informational paragraph
      else {
        result += `<div class="mb-3">${section}</div>`;
      }
    }
    
    return result;
  };
  
  // Extract script information and title
  const extractScriptInfo = (content: string) => {
    const titleMatch = content.match(/Roteiro(?:\s+sobre)?\s+([^\n:]+)/i);
    const title = titleMatch ? titleMatch[1].trim() : "Roteiro";
    
    const objectiveMatch = content.match(/(🟡 Atrair Atenção|🟢 Criar Conexão|🔴 Fazer Comprar|🔁 Reativar Interesse|✅ Fechar Agora)/);
    const objective = objectiveMatch ? objectiveMatch[1] : "";
    
    const contentTypeMatch = content.match(/Tipo de Conteúdo:\s*([^\n]+)/i);
    const contentType = contentTypeMatch ? contentTypeMatch[1].trim() : "";
    
    return { title, objective, contentType };
  };

  // Get script metadata
  const { title, objective, contentType } = extractScriptInfo(content);
  
  // Render objective icon based on type
  const renderObjectiveIcon = (objective: string) => {
    switch (objective) {
      case '🟡 Atrair Atenção':
        return <Target className="h-5 w-5 text-amber-500" />;
      case '🟢 Criar Conexão':
        return <HeartHandshake className="h-5 w-5 text-green-500" />;
      case '🔴 Fazer Comprar':
        return <ShoppingCart className="h-5 w-5 text-red-500" />;
      case '🔁 Reativar Interesse':
        return <Repeat className="h-5 w-5 text-blue-500" />;
      case '✅ Fechar Agora':
        return <CheckCircle2 className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <TabsContent value="conteudo" className="mt-0 p-0">
      <div className="bg-white rounded-md p-4 shadow-sm">
        {/* Script header with title and metadata */}
        <div className="mb-5">
          {/* Title with badge */}
          <div className="flex flex-wrap gap-2 mb-2">
            <div className={cn(
              "px-2.5 py-1 rounded-md text-sm font-medium",
              contentType?.includes("Vídeo") ? "bg-blue-100 text-blue-800" : 
              contentType?.includes("Stories") ? "bg-amber-100 text-amber-800" : 
              "bg-purple-100 text-purple-800"
            )}>
              {contentType || "Roteiro para Vídeo"}
            </div>
            
            {objective && (
              <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md text-sm">
                {renderObjectiveIcon(objective)}
                <span className="font-medium">{objective.replace(/[🟡🟢🔴🔁✅]\s/, '')}</span>
              </div>
            )}
          </div>
          
          {/* Script title */}
          <h2 className="text-xl font-bold text-gray-800 mb-1">{title}</h2>
          
          {/* Disney structure indicator */}
          {hasDisneyStructure && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-xs">Identificação</span>
              <span className="text-gray-400">→</span>
              <span className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded text-xs">Conflito</span>
              <span className="text-gray-400">→</span>
              <span className="bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-xs">Virada</span>
              <span className="text-gray-400">→</span>
              <span className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded text-xs">Final</span>
            </div>
          )}
        </div>
        
        {/* Script content with formatted sections */}
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: formatContent(content) }}
        />
      </div>
    </TabsContent>
  );
};

export default ScriptContent;
