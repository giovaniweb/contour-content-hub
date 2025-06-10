
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';

interface FluidaScriptResult {
  roteiro: string;
  formato: string;
  emocao_central: string;
  intencao: string;
  objetivo: string;
  mentor: string;
}

interface ScriptResultsProps {
  results: FluidaScriptResult[];
  onScriptApproved?: (script: any) => void;
  onNewScript?: () => void;
}

const ScriptResults: React.FC<ScriptResultsProps> = ({
  results,
  onScriptApproved,
  onNewScript
}) => {
  return (
    <div className="space-y-6">
      {results.map((result, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
        >
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Roteiro FLUIDA - {result.formato}
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                  Emoção: {result.emocao_central}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                  Intenção: {result.intencao}
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                  Mentor: {result.mentor}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="font-medium">Objetivo:</Label>
                  <p className="text-gray-700">{result.objetivo}</p>
                </div>
                <div>
                  <Label className="font-medium">Roteiro:</Label>
                  <div className="bg-gray-50 p-4 rounded-lg mt-2">
                    <pre className="whitespace-pre-wrap text-sm">
                      {result.roteiro}
                    </pre>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => onScriptApproved?.(result)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Aprovar Roteiro
                  </Button>
                  <Button variant="outline" onClick={onNewScript}>
                    Novo Roteiro
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default ScriptResults;
