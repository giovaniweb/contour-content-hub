
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit } from "lucide-react";

interface SummaryCardProps {
  summary: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ summary }) => {
  return (
    <Card className="border border-primary/20">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="flex items-center text-xl">
          <BrainCircuit className="mr-2 h-5 w-5 text-primary" />
          Resumo de Inteligência Artificial
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-4">
        <div className="relative">
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-fluida-blue to-fluida-pink"></div>
          <blockquote className="pl-6 italic text-lg">
            {summary}
          </blockquote>
        </div>
        
        <div className="mt-6 pt-4 border-t flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Gerado em {new Date().toLocaleDateString()}
          </div>
          <div className="text-sm bg-clip-text text-transparent bg-gradient-to-r from-fluida-blue to-fluida-pink font-semibold">
            Fluida AI
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
