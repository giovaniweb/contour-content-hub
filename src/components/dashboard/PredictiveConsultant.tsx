
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePredictiveConsultant } from './predictive-consultant/usePredictiveConsultant';
import { getIconForType, getTypeLabel } from './predictive-consultant/utils';
import LoadingState from './predictive-consultant/LoadingState';
import SuggestionList from './predictive-consultant/SuggestionList';
import SuggestionDetail from './predictive-consultant/SuggestionDetail';
import { useNavigate } from 'react-router-dom';

const PredictiveConsultant: React.FC = () => {
  const { 
    suggestions,
    loading,
    selectedSuggestion,
    handleSuggestionClick,
    handleActionClick
  } = usePredictiveConsultant();
  
  const navigate = useNavigate();
  
  if (loading) {
    return <LoadingState />;
  }

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Fluida Te Entende
            <Badge variant="outline" className="ml-2 bg-primary/10 text-xs">
              Novo
            </Badge>
          </CardTitle>
          {suggestions.some(s => s.isNew) && (
            <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-200">
              {suggestions.filter(s => s.isNew).length} novas
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="grid grid-cols-1 gap-0 p-0">
        <div className="flex h-[240px]">
          {/* Suggestions list */}
          <div className={`border-r ${selectedSuggestion ? 'hidden md:block md:w-1/3' : 'w-full'}`}>
            <SuggestionList 
              suggestions={suggestions}
              selectedSuggestion={selectedSuggestion}
              onSuggestionClick={handleSuggestionClick}
              getIconForType={getIconForType}
            />
          </div>

          {/* Selected suggestion detail */}
          <SuggestionDetail
            suggestion={selectedSuggestion}
            onActionClick={handleActionClick}
            getTypeLabel={getTypeLabel}
          />
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-3">
        <p className="text-xs text-muted-foreground">
          Baseado nos seus padrões de uso e objetivos
        </p>
        <Button variant="link" size="sm" onClick={() => navigate('/marketing-consultant')}>
          Consultor de Marketing
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PredictiveConsultant;
