
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { MessageCircle, Target, HeartHandshake, ShoppingCart, Repeat, CheckCircle2 } from "lucide-react";

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
        .replace(/Identificação/g, '<div class="py-1 px-2 rounded bg-blue-50 text-blue-800 font-semibold inline-block mb-2">Identificação →</div>')
        .replace(/\(Conflito\)/g, '<div class="py-1 px-2 rounded bg-orange-50 text-orange-800 font-semibold inline-block mb-2">Conflito →</div>')
        .replace(/Conflito/g, '<div class="py-1 px-2 rounded bg-orange-50 text-orange-800 font-semibold inline-block mb-2">Conflito →</div>')
        .replace(/\(Virada\)/g, '<div class="py-1 px-2 rounded bg-green-50 text-green-800 font-semibold inline-block mb-2">Virada →</div>')
        .replace(/Virada/g, '<div class="py-1 px-2 rounded bg-green-50 text-green-800 font-semibold inline-block mb-2">Virada →</div>')
        .replace(/\(Final marcante\)/g, '<div class="py-1 px-2 rounded bg-purple-50 text-purple-800 font-semibold inline-block mb-2">Final Marcante</div>')
        .replace(/Final Marcante/g, '<div class="py-1 px-2 rounded bg-purple-50 text-purple-800 font-semibold inline-block mb-2">Final Marcante</div>');
    }

    // Identify marketing objectives and style them
    formattedContent = formattedContent
      .replace(/🟡 Atrair Atenção/g, '<span class="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">🟡 Atrair Atenção</span>')
      .replace(/🟢 Criar Conexão/g, '<span class="bg-green-100 text-green-800 px-2 py-0.5 rounded font-medium">🟢 Criar Conexão</span>')
      .replace(/🔴 Fazer Comprar/g, '<span class="bg-red-100 text-red-800 px-2 py-0.5 rounded font-medium">🔴 Fazer Comprar</span>')
      .replace(/🔁 Reativar Interesse/g, '<span class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">🔁 Reativar Interesse</span>')
      .replace(/✅ Fechar Agora/g, '<span class="bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-medium">✅ Fechar Agora</span>');

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
          result += `<div class="mb-3 bg-gray-50 p-3 rounded-md border border-gray-100">
            <span class="font-medium">${label}:</span> 
            <span class="bg-yellow-100 px-2 py-0.5 rounded">${value.trim()}</span>
          </div>`;
        } else {
          result += `<div class="mb-3">${section}</div>`;
        }
      }
      // Format the Disney structure sections with better spacing and highlights
      else if (section.includes('Roteiro com estrutura Disney')) {
        result += `<div class="mb-4 p-3 bg-slate-50 rounded-md border border-slate-100">
          <div class="text-sm font-medium mb-2">Estrutura narrativa:</div>
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
      // Highlight key phrases with action items
      else if (section.includes('solução:') || 
              section.includes('primeiro passo') ||
              section.includes('tratamento') ||
              section.includes('não precisa') ||
              section.includes('Ideal para:') ||
              section.includes('Tom de linguagem:')) {
        result += `<div class="mb-3 bg-yellow-50 p-3 rounded-md">
          ${section}
          <button class="text-xs bg-white border text-gray-600 px-2 py-0.5 rounded mt-2 hover:bg-gray-50 flex items-center float-right">
            <MessageCircle className="h-3 w-3 mr-1" />
            Criar Conexão
          </button>
          <div class="clear-both"></div>
        </div>`;
      }
      // Format paragraphs that look like script parts with Disney structure
      else if (section.length > 20 && (
        section.includes("Você já se olhou") || 
        section.includes("A luta contra") || 
        section.includes("Conheça o") || 
        section.includes("Transforme seu")
      )) {
        result += `<div class="mb-4 p-3 bg-white border border-gray-100 rounded-md shadow-sm">
          ${section}
        </div>`;
      }
      // Regular paragraph
      else {
        result += `<div class="mb-3">${section}</div>`;
      }
    }
    
    return result;
  };

  // Function to render the script title with marketing objective icon
  const renderScriptTitle = (content: string) => {
    let title = "Roteiro";
    let objective = "";
    
    // Try to extract title from content
    const titleMatch = content.match(/Roteiro\s+sobre\s+([^\n]+)/i);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1];
    }
    
    // Try to extract marketing objective
    const objectiveMatch = content.match(/(🟡 Atrair Atenção|🟢 Criar Conexão|🔴 Fazer Comprar|🔁 Reativar Interesse|✅ Fechar Agora)/);
    if (objectiveMatch && objectiveMatch[1]) {
      objective = objectiveMatch[1];
    }
    
    return (
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          {objective && renderObjectiveIcon(objective)}
          <h2 className="text-xl font-medium">Roteiro: {title}</h2>
        </div>
        {objective && (
          <div className="text-sm text-muted-foreground ml-1">
            Objetivo: <span className="font-medium">{objective}</span>
          </div>
        )}
      </div>
    );
  };
  
  // Function to render the appropriate icon for marketing objective
  const renderObjectiveIcon = (objective: string) => {
    switch (objective) {
      case '🟡 Atrair Atenção':
        return <Target className="h-5 w-5 text-amber-500" />;
      case '🟢 Criar Conexão':
        return <HeartHandshake className="h-5 w-5 text-green-600" />;
      case '🔴 Fazer Comprar':
        return <ShoppingCart className="h-5 w-5 text-red-600" />;
      case '🔁 Reativar Interesse':
        return <Repeat className="h-5 w-5 text-blue-600" />;
      case '✅ Fechar Agora':
        return <CheckCircle2 className="h-5 w-5 text-purple-600" />;
      default:
        return null;
    }
  };

  return (
    <TabsContent value="conteudo" className="mt-0 p-0">
      <div className="bg-white rounded-md p-4">
        {/* Script headline and title with icon */}
        {renderScriptTitle(content)}
        
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
