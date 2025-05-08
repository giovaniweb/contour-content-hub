
import { useState, useCallback, useEffect, useRef } from "react";
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
  forceClearState?: boolean; // Flag to force clearing state
}

export const useExtractedData = ({ 
  initialData, 
  onDataChanged,
  forceClearState = false
}: UseExtractedDataProps = {}) => {
  // Debug tracking
  const instanceId = useRef(`extracted-data-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  
  // Always initialize with empty state
  const [suggestedTitle, setSuggestedTitle] = useState<string>('');
  const [suggestedDescription, setSuggestedDescription] = useState<string>('');
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>([]);
  const [extractedResearchers, setExtractedResearchers] = useState<string[]>([]);
  
  // Forced reset of all state
  const resetAllState = useCallback(() => {
    console.log(`[${instanceId.current}] Forcibly resetting all extracted data states to empty`);
    setSuggestedTitle('');
    setSuggestedDescription('');
    setExtractedKeywords([]);
    setExtractedResearchers([]);
  }, []);
  
  // On component mount
  useEffect(() => {
    console.log(`[${instanceId.current}] useExtractedData mounted, forceClearState: ${forceClearState}`);
    
    // Force reset on unmount
    return () => {
      console.log(`[${instanceId.current}] useExtractedData unmounting`);
      // Ensure we reset state on unmount
      resetAllState();
    };
  }, []);
  
  // Handle forceClearState prop changes
  useEffect(() => {
    if (forceClearState) {
      console.log(`[${instanceId.current}] forceClearState is true, resetting all states`);
      resetAllState();
    }
  }, [forceClearState, resetAllState]);
  
  // Set data from initialData if available (and not being cleared)
  useEffect(() => {
    // Only set data if initialData is provided (editing mode) and not forcing clear
    if (initialData && !forceClearState) {
      console.log(`[${instanceId.current}] Setting extracted data from initialData`);
      
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
    }
  }, [initialData, forceClearState]);
  
  // Notify parent component when extracted data changes
  useEffect(() => {
    if (onDataChanged) {
      console.log(`[${instanceId.current}] Notifying parent of extracted data change`);
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
    console.log(`[${instanceId.current}] Setting new extracted data from document:`, data);
    
    // Always clear previous data first
    resetAllState();
    
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
  }, [resetAllState]);
  
  // Complete reset of all extracted data
  const resetExtractedData = useCallback(() => {
    console.log(`[${instanceId.current}] Explicitly resetting all extracted data to empty values`);
    resetAllState();
  }, [resetAllState]);
  
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
