
import { ScriptResponse, MarketingObjectiveType } from "@/types/script";
import { CustomGptType } from "@/utils/custom-gpt";
import { UseFormReturn } from 'react-hook-form';

// Custom type for the results of content generation
export interface CustomGptResult {
  id: string;
  content: string;
}

export interface CustomGptFormProps {
  onResults?: (results: CustomGptResult[]) => void;
  onScriptGenerated?: (script: ScriptResponse) => void;
  initialData?: any;
  mode?: string;
}

export interface SimpleGeneratorProps {
  selectedEquipment: string | undefined;
  setSelectedEquipment: (value: string | undefined) => void;
  selectedObjective: MarketingObjectiveType | undefined;
  setSelectedObjective: (value: MarketingObjectiveType | undefined) => void;
  equipments: Array<{ id: string; nome: string }>;
  equipmentsLoading: boolean;
  handleQuickGenerate: (type: CustomGptType) => Promise<void>;
  isSubmitting: boolean;
  results: CustomGptResult[];
  setResults: React.Dispatch<React.SetStateAction<CustomGptResult[]>>;
  showAdvancedFields: boolean;
  setShowAdvancedFields: (value: boolean) => void;
}

export interface AdvancedGeneratorProps {
  form: UseFormReturn<any>;
  selectedType: CustomGptType;
  setSelectedType: (value: CustomGptType) => void;
  selectedEquipment: string | undefined;
  setSelectedEquipment: (value: string | undefined) => void;
  equipments: Array<{ id: string; nome: string }>;
  equipmentsLoading: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
}

export interface ResultDisplayProps {
  results: CustomGptResult[];
  setResults: React.Dispatch<React.SetStateAction<CustomGptResult[]>>;
}

export interface AdvancedOptionsProps {
  form: UseFormReturn<any>;
}
