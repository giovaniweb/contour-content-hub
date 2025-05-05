
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { MessageCircle } from "lucide-react";

interface ScriptContentProps {
  content: string;
}

const ScriptContent: React.FC<ScriptContentProps> = ({ content }) => {
  // Format the content with Disney structure markers
  const formatContent = (content: string) => {
    // Check if content already has Disney structure markers
    const hasDisneyStructure = content.includes("Identificação") || 
                              content.includes("Conflito") || 
                              content.includes("Virada") || 
                              content.includes("Final Marcante");
                              
    // Process content with Disney structure markers
    let formattedContent = content;
    
    if (hasDisneyStructure) {
      formattedContent = formattedContent
        .replace(/\(Identificação\)/g, '<div class="py-1 px-2 rounded bg-blue-50 text-blue-800 font-semibold inline-block mb-2">Identificação →</div>')
        .replace(/\(Conflito\)/g, '<div class="py-1 px-2 rounded bg-orange-50 text-orange-800 font-semibold inline-block mb-2">Conflito →</div>')
        .replace(/\(Virada\)/g, '<div class="py-1 px-2 rounded bg-green-50 text-green-800 font-semibold inline-block mb-2">Virada →</div>')
        .replace(/\(Final marcante\)/g, '<div class="py-1 px-2 rounded bg-purple-50 text-purple-800 font-semibold inline-block mb-2">Final Marcante</div>');
    }

    // Identify script sections and format them
    let sections = formattedContent.split('\n\n');
    let result = '';
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i].trim();
      
      // Skip empty sections
      if (!section) continue;
      
      // Check if it's a title section (starts with # or contains "Roteiro:" at the beginning)
      if (section.startsWith('# ') || section.startsWith('## ') || section.match(/^Roteiro:/i)) {
        result += `<div class="font-bold text-lg mb-3">${section.replace(/^#+ /, '')}</div>`;
      }
      // Marketing objective or content type
      else if (section.includes('Tipo de Conteúdo:') || section.includes('Objetivo:')) {
        const [label, value] = section.split(':');
        if (value) {
          result += `<div class="mb-3">
            <span class="font-medium">${label}:</span> 
            <span class="bg-yellow-100 px-2 py-0.5 rounded">${value.trim()}</span>
          </div>`;
        } else {
          result += `<div class="mb-3">${section}</div>`;
        }
      }
      // Highlight key phrases with action items
      else if (section.includes('solução:') || 
              section.includes('primeiro passo') ||
              section.includes('tratamento') ||
              section.includes('não precisa')) {
        result += `<div class="mb-3 bg-yellow-50 p-2 rounded">${section}
          <button class="text-xs bg-white border text-gray-600 px-2 py-0.5 rounded mt-1 hover:bg-gray-50 flex items-center float-right">
            <MessageCircle className="h-3 w-3 mr-1" />
            Criar Conexão
          </button>
          <div class="clear-both"></div>
        </div>`;
      }
      // Regular paragraph
      else {
        result += `<div class="mb-3">${section}</div>`;
      }
    }
    
    return result;
  };

  return (
    <TabsContent value="conteudo" className="mt-0 p-0">
      <div className="bg-white rounded-md p-4">
        {/* Script headline and structure */}
        {content.includes('Crystal 3D Plus') && (
          <div className="mb-4">
            <div className="text-lg font-medium mb-1">Roteiro sobre Crystal 3D Plus</div>
            <div className="text-sm text-muted-foreground mb-3">
              Roteiro com estrutura Disney: 
              <span className="text-blue-600">Identificação</span> → 
              <span className="text-orange-600">Conflito</span> → 
              <span className="text-green-600">Virada</span> → 
              <span className="text-purple-600">Final Marcante</span>
            </div>
          </div>
        )}
        
        {/* Content */}
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: formatContent(content) }}
        />
      </div>
    </TabsContent>
  );
};

export default ScriptContent;
