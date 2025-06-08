
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagnosticContent: string;
}

const DiagnosticModal: React.FC<DiagnosticModalProps> = ({
  isOpen,
  onClose,
  diagnosticContent
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto p-0 border-none bg-transparent shadow-none">
        <Card className="aurora-glass border-aurora-electric-purple/30">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl text-foreground">
              <Brain className="h-6 w-6 text-aurora-electric-purple" />
              🧠 Diagnóstico Estratégico Completo - Análise Fluida
            </DialogTitle>
          </DialogHeader>
          <CardContent className="px-6 pb-6">
            <div className="prose prose-sm max-w-none text-foreground/80">
              {diagnosticContent.split('\n').map((paragraph: string, index: number) => (
                paragraph.trim() && (
                  <p key={index} className="mb-4 leading-relaxed text-foreground/80">
                    {paragraph.replace(/[*#]/g, '')}
                  </p>
                )
              ))}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default DiagnosticModal;
