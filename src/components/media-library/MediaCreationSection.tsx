
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VideoIcon, PlusCircle } from "lucide-react";

const MediaCreationSection: React.FC = () => {
  return (
    <div className="text-center py-6">
      <div className="inline-block h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <VideoIcon className="h-8 w-8 text-blue-500" />
      </div>
      <h2 className="text-3xl font-semibold mb-6">O que quer Criar Hoje?</h2>
      
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <Button variant="outline" className="rounded-full">Encontrar algo</Button>
        <Button variant="outline" className="rounded-full">Planejamento</Button>
        <Button variant="outline" className="rounded-full">Criativo para anúncio</Button>
      </div>
      
      <Card className="bg-slate-50 p-4 mb-8 hover:shadow-md transition-all">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-700">Quer um vídeo, um folder, uma arte. Só pede!</p>
          <Button className="rounded-full w-full sm:w-auto">
            <PlusCircle className="h-4 w-4 mr-2" />
            Quero Agora
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MediaCreationSection;
