
import { useState, useCallback, useEffect } from "react";
import { ExtractedData } from "./useUploadHandler";

interface UseExtractedDataProps {
  initialData?: {
    title?: string;
    description?: string;
    keywords?: string[];
    researchers?: string[];
  };
  onDataChanged?: (data: {
    suggestedTitle: string;
    suggestedDescription: string;
    extractedKeywords: string[];
    extractedResearchers: string[];
  }) => void;
}

export const useExtractedData = ({ initialData, onDataChanged }: UseExtractedDataProps = {}) => {
  // Always start with empty states rather than initializing with initialData
  const [suggestedTitle, setSuggestedTitle] = useState<string>('');
  const [suggestedDescription, setSuggestedDescription] = useState<string>('');
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>([]);
  const [extractedResearchers, setExtractedResearchers] = useState<string[]>([]);
  
  // Update extracted data when initialData changes
  useEffect(() => {
    // Clear previous data first to avoid stale data showing up
    setSuggestedTitle('');
    setSuggestedDescription('');
    setExtractedKeywords([]);
    setExtractedResearchers([]);
    
    if (initialData) {
      console.log("Inicializando dados extraídos a partir do initialData:", initialData);
      // Only set values if they exist in initialData
      if (initialData.title) setSuggestedTitle(initialData.title);
      if (initialData.description) setSuggestedDescription(initialData.description);
      if (initialData.keywords && initialData.keywords.length > 0) setExtractedKeywords(initialData.keywords);
      if (initialData.researchers && initialData.researchers.length > 0) setExtractedResearchers(initialData.researchers);
    } else {
      console.log("Não há initialData, estados ficam vazios");
    }
  }, [initialData]);
  
  // Notify parent when extracted data changes
  useEffect(() => {
    if (onDataChanged) {
      onDataChanged({
        suggestedTitle,
        suggestedDescription,
        extractedKeywords,
        extractedResearchers
      });
    }
  }, [suggestedTitle, suggestedDescription, extractedKeywords, extractedResearchers, onDataChanged]);
  
  // Handle new extracted data from document processing
  const handleExtractedData = useCallback((data: ExtractedData) => {
    console.log("Definindo novos dados extraídos:", data);
    
    if (data.title) {
      setSuggestedTitle(data.title);
    }
    
    if (data.conclusion) {
      setSuggestedDescription(data.conclusion);
    }
    
    if (data.keywords) {
      setExtractedKeywords(data.keywords);
    }
    
    if (data.researchers) {
      setExtractedResearchers(data.researchers);
    }
  }, []);
  
  // Reset all extracted data
  const resetExtractedData = useCallback(() => {
    console.log("Resetando todos os dados extraídos");
    setSuggestedTitle('');
    setSuggestedDescription('');
    setExtractedKeywords([]);
    setExtractedResearchers([]);
  }, []);
  
  return {
    suggestedTitle,
    setSuggestedTitle,
    suggestedDescription,
    setSuggestedDescription,
    extractedKeywords,
    setExtractedKeywords,
    extractedResearchers, 
    setExtractedResearchers,
    handleExtractedData,
    resetExtractedData
  };
};
