
import React from 'react';
import { Button } from "@/components/ui/button";

interface ResultsHeaderProps {
  resultsCount: number;
  onClearAll: () => void;
}

const ResultsHeader: React.FC<ResultsHeaderProps> = ({ resultsCount, onClearAll }) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium">Resultados gerados</h3>
      {resultsCount > 1 && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={onClearAll}
        >
          Limpar todos
        </Button>
      )}
    </div>
  );
};

export default ResultsHeader;
