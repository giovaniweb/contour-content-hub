
import React from 'react';
import { CustomGptResult } from './types';
import ResultsHeader from './ResultsHeader';
import ResultItem from './ResultItem';

interface ResultDisplayProps {
  results: CustomGptResult[];
  setResults: React.Dispatch<React.SetStateAction<CustomGptResult[]>>;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ results, setResults }) => {
  // Handler for deleting a single result
  const handleDelete = (id: string) => {
    setResults(prev => prev.filter(result => result.id !== id));
  };

  // Handler for clearing all results
  const handleClearAll = () => {
    setResults([]);
  };

  if (results.length === 0) return null;

  return (
    <div className="space-y-4">
      <ResultsHeader 
        resultsCount={results.length} 
        onClearAll={handleClearAll} 
      />
      
      <div className="space-y-3">
        {results.map((result) => (
          <ResultItem
            key={result.id}
            result={result}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ResultDisplay;
