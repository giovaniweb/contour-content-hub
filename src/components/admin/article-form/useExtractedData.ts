
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
  const [suggestedTitle, setSuggestedTitle] = useState<string>('');
  const [suggestedDescription, setSuggestedDescription] = useState<string>('');
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>([]);
  const [extractedResearchers, setExtractedResearchers] = useState<string[]>([]);
  
  // Update extracted data when initialData changes
  useEffect(() => {
    if (initialData) {
      console.log("Inicializando dados extraídos a partir do initialData:", initialData);
      setSuggestedTitle(initialData.title || '');
      setSuggestedDescription(initialData.description || '');
      setExtractedKeywords(initialData.keywords || []);
      setExtractedResearchers(initialData.researchers || []);
    } else {
      // Se não houver initialData, garantir que os estados estejam vazios
      console.log("Resetando dados extraídos pois não há initialData");
      setSuggestedTitle('');
      setSuggestedDescription('');
      setExtractedKeywords([]);
      setExtractedResearchers([]);
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
