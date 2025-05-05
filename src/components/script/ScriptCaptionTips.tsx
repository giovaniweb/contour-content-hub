
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";

interface ScriptCaptionTipsProps {
  tips: string[];
}

const ScriptCaptionTips: React.FC<ScriptCaptionTipsProps> = ({ tips }) => {
  if (tips.length === 0) {
    return (
      <TabsContent value="legenda" className="mt-0 p-0">
        <div className="text-center p-4 text-muted-foreground">
          Nenhuma dica de legenda disponível para este roteiro.
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="legenda" className="mt-0 p-0">
      <div className="space-y-4">
        <div className="bg-muted/50 p-4 rounded-md">
          <h3 className="font-semibold mb-2">Dicas para sua legenda</h3>
          <ul className="space-y-2">
            {tips.map((tip, index) => (
              <li key={index} className="flex gap-2">
                <Sparkles className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </TabsContent>
  );
};

export default ScriptCaptionTips;
