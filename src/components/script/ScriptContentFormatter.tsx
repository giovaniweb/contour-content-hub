
import React from "react";
import { hasDisneyStructure } from "./utils/scriptFormatUtils";
import DisneyStructureOverview from "./DisneyStructureOverview";

interface ScriptContentFormatterProps {
  content: string;
}

const ScriptContentFormatter: React.FC<ScriptContentFormatterProps> = ({ content }) => {
  // Format the content with improved styling and organization by topics
  const formatContent = (content: string) => {
    // Identify Disney structure markers in content
    const hasDisneyStructureElements = hasDisneyStructure(content);
    
    // First, pre-process content to identify major sections
    let processedContent = content;
    
    // Format the Disney structure sections with better styling
    if (hasDisneyStructureElements) {
      processedContent = processedContent
        .replace(/\b🟦 ?Identificação\b/g, '<div class="flex items-center gap-2 py-2 px-3 rounded-md bg-blue-100 text-blue-800 font-medium my-2"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>Identificação</div>')
        .replace(/\b🟧 ?Conflito\b/g, '<div class="flex items-center gap-2 py-2 px-3 rounded-md bg-orange-100 text-orange-800 font-medium my-2"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>Conflito</div>')
        .replace(/\b🟩 ?Virada\b/g, '<div class="flex items-center gap-2 py-2 px-3 rounded-md bg-green-100 text-green-800 font-medium my-2"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>Virada</div>')
        .replace(/\b🟪 ?Final ?Marcante\b/g, '<div class="flex items-center gap-2 py-2 px-3 rounded-md bg-purple-100 text-purple-800 font-medium my-2"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>Final Marcante</div>');
    }

    // Format marketing objectives with icons and badges
    processedContent = processedContent
      .replace(/🟡 Atrair Atenção/g, '<div class="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-md font-medium inline-flex"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-target"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>Atrair Atenção</div>')
      .replace(/🟢 Criar Conexão/g, '<div class="flex items-center gap-1.5 bg-green-50 text-green-800 px-3 py-1.5 rounded-md font-medium inline-flex"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-handshake"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/><path d="m18 15-2-2"/><path d="m15 18-2-2"/></svg>Criar Conexão</div>')
      .replace(/🔴 Fazer Comprar/g, '<div class="flex items-center gap-1.5 bg-red-50 text-red-800 px-3 py-1.5 rounded-md font-medium inline-flex"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>Fazer Comprar</div>')
      .replace(/🔁 Reativar Interesse/g, '<div class="flex items-center gap-1.5 bg-blue-50 text-blue-800 px-3 py-1.5 rounded-md font-medium inline-flex"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-repeat"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>Reativar Interesse</div>')
      .replace(/✅ Fechar Agora/g, '<div class="flex items-center gap-1.5 bg-purple-50 text-purple-800 px-3 py-1.5 rounded-md font-medium inline-flex"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle-2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>Fechar Agora</div>');

    // Format content types and additional metadata
    processedContent = processedContent
      .replace(/🎥 Tipo de Conteúdo: ([^\n]+)/g, '<div class="flex items-center gap-1.5 bg-indigo-50 text-indigo-800 px-3 py-1.5 rounded-md font-medium inline-flex"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-video"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>$1</div>')
      .replace(/🎯 Objetivo: ([^\n]+)/g, '<div class="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-md font-medium inline-flex"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-target"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>$1</div>')
      .replace(/✍️ Tom de linguagem: ([^\n]+)/g, '<div class="flex items-center gap-1.5 bg-teal-50 text-teal-800 px-3 py-1.5 rounded-md font-medium inline-flex"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/></svg>$1</div>')
      .replace(/✅ Ideal para: ([^\n]+)/g, '<div class="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-md font-medium inline-flex"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>$1</div>');
    
    // Split content into sections for better organization
    const sections = processedContent.split('\n\n');
    let result = '';
    
    // Create a metadata section at the top if metadata is present
    const metadataItems = [];
    
    if (processedContent.includes('Tipo de Conteúdo:')) {
      metadataItems.push('type');
    }
    
    if (processedContent.includes('Objetivo:')) {
      metadataItems.push('objective');
    }
    
    if (processedContent.includes('Tom de linguagem:')) {
      metadataItems.push('tone');
    }
    
    if (processedContent.includes('Ideal para:')) {
      metadataItems.push('audience');
    }
    
    // Create a structured result with improved formatting
    let hasAddedMetadataSection = false;
    let hasAddedTitleSection = false;
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i].trim();
      
      if (!section) continue;
      
      // Handle title section (usually the first line with the roteiro/script title)
      if (section.includes('Roteiro') && !hasAddedTitleSection) {
        // Extract equipment/topic name
        const titleMatch = section.match(/Roteiro[^:]*(?::|sobre)\s*([^\n]+)/i);
        const title = titleMatch ? titleMatch[1].trim() : "Roteiro";
        
        result += `<div class="text-xl font-bold text-gray-800 mb-3 border-b pb-2">${title}</div>`;
        hasAddedTitleSection = true;
      }
      // Handle metadata section (contains multiple metadata items)
      else if ((section.includes('Tipo de Conteúdo:') || 
                section.includes('Objetivo:') || 
                section.includes('Tom de linguagem:') || 
                section.includes('Ideal para:')) && 
                !hasAddedMetadataSection) {
        
        // Split multiple metadata entries if they exist
        const metadataEntries = section.split('\n');
        result += `<div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">`;
        
        for (const entry of metadataEntries) {
          if (entry.includes(':') || 
              entry.includes('Tipo de Conteúdo') || 
              entry.includes('Objetivo') || 
              entry.includes('Tom de linguagem') || 
              entry.includes('Ideal para')) {
            result += `<div>${entry}</div>`;
          }
        }
        
        result += `</div>`;
        hasAddedMetadataSection = true;
      }
      // Handle Disney structure header if present
      else if (section.includes('Roteiro com estrutura Disney') && hasDisneyStructureElements) {
        result += `<div class="mb-5 p-4 bg-slate-50 rounded-lg border border-slate-100">
          <div class="text-sm font-semibold mb-2 text-slate-600">Estrutura narrativa:</div>
          <div class="flex flex-wrap gap-3">
            <div class="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              Identificação
            </div>
            <span class="text-gray-400">→</span>
            <div class="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
              Conflito
            </div>
            <span class="text-gray-400">→</span>
            <div class="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              Virada
            </div>
            <span class="text-gray-400">→</span>
            <div class="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Final
            </div>
          </div>
        </div>`;
      }
      // Format Disney structure script parts with special card-like style
      else if (hasDisneyStructureElements && 
              (section.includes('Identificação') || 
               section.includes('Conflito') || 
               section.includes('Virada') || 
               section.includes('Final Marcante'))) {
        
        // Replace quotes with styled quotes
        let formattedSection = section;
        formattedSection = formattedSection.replace(/"([^"]+)"/g, '<div class="pl-3 border-l-4 border-gray-300 italic text-gray-700 my-2 py-1">$1</div>');
        
        result += `<div class="mb-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          ${formattedSection}
        </div>`;
      } 
      // Handle additional instructions or comments sections
      else if (section.includes('Sugestão de melhorias') || 
               section.includes('Prompt para Lovable') ||
               section.includes('Prompt:')) {
        result += `<div class="mt-6 pt-4 border-t border-gray-200">
          <div class="text-sm text-gray-500 italic">
            ${section}
          </div>
        </div>`;
      }
      // Regular content paragraph
      else {
        result += `<div class="mb-4">${section}</div>`;
      }
    }
    
    return result;
  };

  return (
    <div 
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: formatContent(content) }}
    />
  );
};

export default ScriptContentFormatter;
