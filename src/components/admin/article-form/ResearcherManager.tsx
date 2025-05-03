
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ResearcherManagerProps {
  extractedResearchers: string[];
  setExtractedResearchers: (researchers: string[]) => void;
}

const ResearcherManager: React.FC<ResearcherManagerProps> = ({
  extractedResearchers,
  setExtractedResearchers,
}) => {
  const [newResearcher, setNewResearcher] = useState<string>('');

  const handleAddResearcher = () => {
    if (newResearcher.trim()) {
      // Check if researcher doesn't already exist
      if (!extractedResearchers.includes(newResearcher.trim())) {
        setExtractedResearchers([...extractedResearchers, newResearcher.trim()]);
      }
      setNewResearcher('');
    }
  };

  const handleRemoveResearcher = (researcher: string) => {
    setExtractedResearchers(extractedResearchers.filter(r => r !== researcher));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddResearcher();
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="new-researcher">Adicionar Pesquisador/Autor</Label>
      <div className="flex items-center gap-2">
        <Input
          id="new-researcher"
          value={newResearcher}
          onChange={(e) => setNewResearcher(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nome do pesquisador/autor"
          className="flex-1"
        />
        <Button 
          type="button" 
          size="sm" 
          onClick={handleAddResearcher}
          disabled={!newResearcher.trim()}
        >
          <Plus className="h-4 w-4 mr-1" />
          Adicionar
        </Button>
      </div>
      
      {/* Display all researchers with option to remove */}
      {extractedResearchers.length > 0 && (
        <div className="mt-4 p-3 border rounded-md">
          <Label className="text-sm">Pesquisadores/Autores</Label>
          <ScrollArea className="h-auto max-h-[200px]">
            <div className="flex flex-wrap gap-2 mt-2 p-2">
              {extractedResearchers.map((researcher, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="flex items-center gap-1 py-1 px-2"
                >
                  {researcher}
                  <button 
                    type="button"
                    onClick={() => handleRemoveResearcher(researcher)}
                    className="ml-1 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default ResearcherManager;
