
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { extractScriptInfo, hasDisneyStructure } from "./utils/scriptFormatUtils";
import ScriptHeader from "./ScriptHeader";
import DisneyStructureIndicator from "./DisneyStructureIndicator";
import ScriptContentFormatter from "./ScriptContentFormatter";

interface ScriptContentProps {
  content: string;
}

const ScriptContent: React.FC<ScriptContentProps> = ({ content }) => {
  // Check if content has Disney structure
  const hasDisneyStructureElements = hasDisneyStructure(content);
  
  // Get script metadata
  const { title, objective, contentType } = extractScriptInfo(content);

  return (
    <TabsContent value="conteudo" className="mt-0 p-0">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        {/* Script header with title and metadata */}
        <ScriptHeader 
          title={title}
          contentType={contentType}
          objective={objective}
          hasDisneyStructure={hasDisneyStructureElements}
        />
        
        {/* Disney structure indicator if present */}
        <DisneyStructureIndicator hasDisneyStructure={hasDisneyStructureElements} />
        
        {/* Script content with formatted sections */}
        <ScriptContentFormatter content={content} />
      </div>
    </TabsContent>
  );
};

export default ScriptContent;
