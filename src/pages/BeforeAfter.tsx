import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image, Upload, Calendar, Edit } from 'lucide-react';

const BeforeAfter = () => {
  const photos = [
    {
      id: 1,
      title: "Harmonização Facial - Paciente 1",
      date: "15/01/2024",
      equipment: "Ácido Hialurônico",
      beforeUrl: "/api/placeholder/300/200",
      afterUrl: "/api/placeholder/300/200"
    },
    {
      id: 2,
      title: "Skinbooster - Paciente 2",
      date: "20/01/2024",
      equipment: "Profhilo",
      beforeUrl: "/api/placeholder/300/200",
      afterUrl: "/api/placeholder/300/200"
    }
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fotos Antes/Depois</h1>
          <p className="text-muted-foreground">
            Gerencie suas fotos de resultados de procedimentos
          </p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Adicionar Fotos
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo) => (
          <Card key={photo.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                {photo.title}
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{photo.date}</span>
                </div>
                <div className="text-sm text-primary mt-1">
                  Equipamento: {photo.equipment}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">ANTES</p>
                  <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                    <Image className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">DEPOIS</p>
                  <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                    <Image className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BeforeAfter;