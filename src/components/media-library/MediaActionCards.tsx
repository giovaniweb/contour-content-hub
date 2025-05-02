
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Upload,
  Film,
  PlusCircle,
  Square,
  LayoutGrid
} from "lucide-react";

const MediaActionCards: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Card className="border rounded-xl hover:shadow transition-all">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
            <Upload className="h-8 w-8 text-slate-600" />
          </div>
          <h3 className="font-medium text-lg mb-1">Carregar</h3>
          <p className="text-sm text-muted-foreground">do computador</p>
        </CardContent>
      </Card>
      
      <Card className="border rounded-xl hover:shadow transition-all">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
            <Film className="h-8 w-8 text-slate-600" />
          </div>
          <h3 className="font-medium text-lg mb-1">Importar</h3>
          <p className="text-sm text-muted-foreground">do Drive e muito mais</p>
        </CardContent>
      </Card>
      
      <Card className="border rounded-xl hover:shadow transition-all">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
            <PlusCircle className="h-8 w-8 text-slate-600" />
          </div>
          <h3 className="font-medium text-lg mb-1">Criar</h3>
          <p className="text-sm text-muted-foreground">novo ou com modelo</p>
        </CardContent>
      </Card>
      
      <Card className="border rounded-xl hover:shadow transition-all">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
            <Square className="h-8 w-8 text-slate-600" />
          </div>
          <h3 className="font-medium text-lg mb-1">Gravar</h3>
          <p className="text-sm text-muted-foreground">tela ou webcam</p>
        </CardContent>
      </Card>
      
      <Card className="border rounded-xl hover:shadow transition-all">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
            <LayoutGrid className="h-8 w-8 text-slate-600" />
          </div>
          <h3 className="font-medium text-lg mb-1">Organizar</h3>
          <p className="text-sm text-muted-foreground">evento ou webinar</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaActionCards;
