import React, { useState } from 'react';
import { CustomGptResult } from './types';
import ResultsHeader from './ResultsHeader';
import ResultItem from './ResultItem';
import ScriptSwiper from './ScriptSwiper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Layers } from "lucide-react";

interface ResultDisplayProps {
  results: CustomGptResult[];
  setResults: React.Dispatch<React.SetStateAction<CustomGptResult[]>>;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ results, setResults }) => {
  const [viewMode, setViewMode] = useState<'swiper' | 'list'>(results.length > 1 ? 'swiper' : 'list');
  const [approvedResults, setApprovedResults] = useState<CustomGptResult[]>([]);
  const [rejectedResults, setRejectedResults] = useState<string[]>([]);
  
  // Active results are those that haven't been approved or rejected yet
  const activeResults = results.filter(
    result => !approvedResults.some(r => r.id === result.id) && !rejectedResults.includes(result.id)
  );

  // Handler for deleting a single result
  const handleDelete = (id: string) => {
    setResults(prev => prev.filter(result => result.id !== id));
  };

  // Handler for clearing all results
  const handleClearAll = () => {
    setResults([]);
    setApprovedResults([]);
    setRejectedResults([]);
  };

  // Handler for approving a result in swipe mode
  const handleApprove = (id: string) => {
    const approved = results.find(result => result.id === id);
    if (approved) {
      setApprovedResults(prev => [...prev, approved]);
    }
  };

  // Handler for rejecting a result in swipe mode
  const handleReject = (id: string) => {
    setRejectedResults(prev => [...prev, id]);
  };

  // Handler for finishing the swipe session
  const handleFinishSwipe = () => {
    // Keep only approved results
    setResults(approvedResults);
    // Reset state
    setApprovedResults([]);
    setRejectedResults([]);
    // Switch to list view
    setViewMode('list');
  };

  if (results.length === 0) return null;

  return (
    <div className="space-y-6">
      <ResultsHeader 
        resultsCount={results.length} 
        onClearAll={handleClearAll} 
      />
      
      {results.length > 1 && (
        <div className="flex justify-center mb-4">
          <Tabs 
            value={viewMode} 
            onValueChange={(value) => setViewMode(value as 'swiper' | 'list')}
            className="w-full max-w-md mx-auto"
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="swiper" className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4" />
                Modo Tinder
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Lista
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}
      
      {viewMode === 'swiper' && results.length > 0 ? (
        <div className="bg-muted/30 rounded-lg p-4">
          <ScriptSwiper 
            results={activeResults.length > 0 ? activeResults : results}
            onApprove={handleApprove}
            onReject={handleReject}
            onFinish={handleFinishSwipe}
          />
          
          {approvedResults.length > 0 && (
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                {approvedResults.length} roteiro(s) aprovado(s) de {results.length} total
              </p>
              
              <Button onClick={handleFinishSwipe} className="mx-auto">
                Finalizar e salvar aprovados
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((result) => (
            <ResultItem
              key={result.id}
              result={result}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
