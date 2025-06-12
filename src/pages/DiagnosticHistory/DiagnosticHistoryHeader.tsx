
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, RefreshCw } from "lucide-react";
import { debugDiagnosticPersistence } from '@/hooks/useDiagnosticPersistence/debugUtils';

const DiagnosticHistoryHeader: React.FC = () => {
  const handleDebugSync = () => {
    console.log('🔧 Botão debug clicado');
    debugDiagnosticPersistence();
    
    // Forçar reload da página para testar
    window.location.reload();
  };

  return (
    <Card className="aurora-glass border-aurora-electric-purple/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History className="h-8 w-8 text-aurora-electric-purple" />
            <div>
              <CardTitle className="text-2xl aurora-heading">
                Histórico de Diagnósticos
              </CardTitle>
              <p className="aurora-body opacity-80 mt-1">
                Gerencie e visualize todos os seus diagnósticos FLUIDA
              </p>
            </div>
          </div>
          
          {/* Botão de debug temporário */}
          {process.env.NODE_ENV === 'development' && (
            <Button 
              onClick={handleDebugSync}
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Debug Sync
            </Button>
          )}
        </div>
      </CardHeader>
    </Card>
  );
};

export default DiagnosticHistoryHeader;
