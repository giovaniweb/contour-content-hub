
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RotateCcw, Check, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DisneyMagicButtonProps {
  originalScript: string;
  onApplyDisney: () => Promise<string>;
  onRevertDisney: () => void;
  isDisneyApplied: boolean;
  isProcessing: boolean;
}

const DisneyMagicButton: React.FC<DisneyMagicButtonProps> = ({
  originalScript,
  onApplyDisney,
  onRevertDisney,
  isDisneyApplied,
  isProcessing
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewScript, setPreviewScript] = useState('');
  const [showValidation, setShowValidation] = useState(false);

  const handlePreviewDisney = async () => {
    try {
      setShowValidation(true);
      const transformed = await onApplyDisney();
      setPreviewScript(transformed);
      setShowPreview(true);
      setShowValidation(false);
    } catch (error) {
      console.error('Erro ao gerar preview Disney:', error);
      setShowValidation(false);
    }
  };

  const handleConfirmDisney = () => {
    setShowPreview(false);
    // Script já foi aplicado no preview
  };

  const handleRejectDisney = () => {
    setShowPreview(false);
    onRevertDisney();
  };

  if (isDisneyApplied) {
    return (
      <div className="flex items-center gap-3">
        <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30 px-3 py-1">
          <Sparkles className="h-3 w-3 mr-1" />
          Disney Magic Ativa
        </Badge>
        <Button
          onClick={onRevertDisney}
          variant="outline"
          size="sm"
          className="border-yellow-400/50 text-yellow-300 hover:bg-yellow-500/10"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reverter
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Botão Principal */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="border-yellow-400/50 text-yellow-300 hover:bg-yellow-500/10"
            disabled={isProcessing}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isProcessing ? 'Aplicando Magia...' : 'Disney Magic'}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-yellow-300">
              <Sparkles className="h-5 w-5" />
              Aplicar Disney Magic
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Card className="bg-yellow-500/5 border-yellow-400/30">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-300">Transformação Disney 1928</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-slate-300 leading-relaxed">
                  Esta transformação aplicará a narrativa mágica de Walt Disney de 1928, 
                  criando uma história mais envolvente e emocional com elementos de 
                  storytelling clássico.
                </p>
              </CardContent>
            </Card>
            
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowValidation(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handlePreviewDisney}
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
                disabled={isProcessing}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Aplicar Magia
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Validação */}
      <AnimatePresence>
        {showValidation && (
          <Dialog open={showValidation} onOpenChange={setShowValidation}>
            <DialogContent className="max-w-lg">
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="mx-auto mb-4"
                >
                  <Sparkles className="h-12 w-12 text-yellow-400" />
                </motion.div>
                <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                  Aplicando Disney Magic...
                </h3>
                <p className="text-sm text-slate-400">
                  Transformando seu roteiro com a magia de Walt Disney
                </p>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Modal de Preview */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-yellow-300">
              <Sparkles className="h-5 w-5" />
              Preview - Disney Magic Aplicada
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Comparativo Antes/Depois */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader className="pb-3">
                  <h4 className="text-sm font-medium text-slate-300">Roteiro Original</h4>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-slate-200 bg-slate-900/50 p-3 rounded border max-h-40 overflow-y-auto">
                    {originalScript.substring(0, 300)}...
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-yellow-500/5 border-yellow-400/30">
                <CardHeader className="pb-3">
                  <h4 className="text-sm font-medium text-yellow-300">Com Disney Magic</h4>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-slate-200 bg-slate-900/50 p-3 rounded border max-h-40 overflow-y-auto">
                    {previewScript.substring(0, 300)}...
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Indicadores de Transformação */}
            <Card className="bg-yellow-500/5 border-yellow-400/30">
              <CardContent className="p-4">
                <h4 className="text-sm font-medium text-yellow-300 mb-3">Transformações Aplicadas:</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-400" />
                    <span className="text-slate-300">Narrativa emocional</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-400" />
                    <span className="text-slate-300">Storytelling clássico</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-400" />
                    <span className="text-slate-300">Linguagem encantadora</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-400" />
                    <span className="text-slate-300">Conexão emocional</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Ações */}
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={handleRejectDisney}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Rejeitar
              </Button>
              <Button
                onClick={handleConfirmDisney}
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                <Check className="h-4 w-4 mr-2" />
                Confirmar Magia
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DisneyMagicButton;
