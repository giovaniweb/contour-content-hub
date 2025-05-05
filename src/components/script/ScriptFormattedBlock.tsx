
import React from 'react';
import ScriptBlockScore from './ScriptBlockScore';

interface ScriptFormattedBlockProps {
  blockType: string;
  score: number;
  originalText: string;
  adaptedText?: string;
  showAdapted?: boolean;
}

const ScriptFormattedBlock: React.FC<ScriptFormattedBlockProps> = ({
  blockType,
  score,
  originalText,
  adaptedText,
  showAdapted = false
}) => {
  return (
    <div className="mb-6 border rounded-lg overflow-hidden">
      <ScriptBlockScore 
        blockType={blockType} 
        score={score} 
      />
      
      <div className="p-4">
        <div className="mb-3">
          <div className="text-sm text-muted-foreground mb-1">
            Texto original:
          </div>
          <div className="p-3 bg-slate-50 rounded-md">
            {originalText}
          </div>
        </div>
        
        {adaptedText && showAdapted && (
          <div>
            <div className="text-sm text-muted-foreground mb-1">
              Texto adaptado:
            </div>
            <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded-md font-medium">
              {adaptedText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScriptFormattedBlock;
