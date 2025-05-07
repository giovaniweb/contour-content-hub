
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Fluida Te Entende
          <Badge variant="outline" className="ml-2 bg-primary/10 text-xs">
            Novo
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-[240px]">
        <div className="animate-pulse space-y-4 w-full">
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-5/6 mx-auto"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6 mx-auto"></div>
          </div>
          <div className="flex justify-center pt-2">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4">Analisando suas preferências...</p>
      </CardContent>
    </Card>
  );
};

export default LoadingState;
