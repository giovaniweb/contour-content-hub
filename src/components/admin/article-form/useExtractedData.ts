
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
  // Always initialize with empty state
  const [suggestedTitle, setSuggestedTitle] = useState<string>('');
  const [suggestedDescription, setSuggestedDescription] = useState<string>('');
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>([]);
  const [extractedResearchers, setExtractedResearchers] = useState<string[]>([]);
  
  // Create a ref to track if this is first mount to force reset
  const isInitialized = useCallback(() => {
    return initialData !== undefined;
  }, [initialData]);
  
  // Reset all data first, then set from initialData if available
  useEffect(() => {
    console.log("useExtractedData effect triggered, initialData:", initialData ? "present" : "absent");
    
    // Always clear previous data first
    setSuggestedTitle('');
    setSuggestedDescription('');
    setExtractedKeywords([]);
    setExtractedResearchers([]);
    
    // Only set data if initialData is provided (editing mode)
    if (initialData) {
      console.log("Setting extracted data from initialData:", initialData);
      
      if (initialData.title) {
        setSuggestedTitle(initialData.title);
      }
      
      if (initialData.description) {
        setSuggestedDescription(initialData.description);
      }
      
      if (initialData.keywords && initialData.keywords.length > 0) {
        setExtractedKeywords(initialData.keywords);
      }
      
      if (initialData.researchers && initialData.researchers.length > 0) {
        setExtractedResearchers(initialData.researchers);
      }
    } else {
      console.log("No initialData provided, keeping all states empty");
    }
  }, [initialData]);
  
  // Notify parent component when extracted data changes
  useEffect(() => {
    if (onDataChanged) {
      console.log("Notifying parent of extracted data change");
      onDataChanged({
        suggestedTitle,
        suggestedDescription,
        extractedKeywords,
        extractedResearchers
      });
    }
  }, [suggestedTitle, suggestedDescription, extractedKeywords, extractedResearchers, onDataChanged]);
  
  // Process new extracted data from document
  const handleExtractedData = useCallback((data: ExtractedData) => {
    console.log("Setting new extracted data from document:", data);
    
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
  
  // Complete reset of all extracted data
  const resetExtractedData = useCallback(() => {
    console.log("Explicitly resetting all extracted data to empty values");
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
    resetExtractedData,
    isInitialized
  };
};
