
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
  const [suggestedTitle, setSuggestedTitle] = useState<string>(initialData?.title || '');
  const [suggestedDescription, setSuggestedDescription] = useState<string>(initialData?.description || '');
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>(initialData?.keywords || []);
  const [extractedResearchers, setExtractedResearchers] = useState<string[]>(initialData?.researchers || []);
  
  // Update extracted data when initialData changes
  useEffect(() => {
    if (initialData) {
      setSuggestedTitle(initialData.title || '');
      setSuggestedDescription(initialData.description || '');
      setExtractedKeywords(initialData.keywords || []);
      setExtractedResearchers(initialData.researchers || []);
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
    console.log("Setting extracted data:", data);
    
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
    console.log("Resetting extracted data");
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
