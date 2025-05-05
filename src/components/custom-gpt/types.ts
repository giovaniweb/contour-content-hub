
import { CustomGptType } from '@/utils/custom-gpt';
import { MarketingObjectiveType } from '@/types/script';
import { z } from 'zod';

export interface CustomGptResult {
  id: string;
  content: string;
  title?: string;
  type?: CustomGptType;
  equipment?: string;
  marketingObjective?: MarketingObjectiveType;
}

export interface CustomGptFormProps {
  onResults?: (results: CustomGptResult[]) => void;
  onScriptGenerated?: (script: any) => void;
  initialData?: any;
  mode?: 'simple' | 'advanced';
}

export interface AdvancedGeneratorProps {
  form: any;
  isSubmitting: boolean;
  selectedType: CustomGptType;
  setSelectedType: (type: CustomGptType) => void;
  selectedEquipment: string | undefined;
  setSelectedEquipment: (equipment: string | undefined) => void;
  selectedObjective: MarketingObjectiveType | undefined;
  setSelectedObjective: (objective: MarketingObjectiveType | undefined) => void;
  equipments: any[];
  equipmentsLoading: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export interface SimpleGeneratorProps {
  selectedType: CustomGptType;
  setSelectedType: (type: CustomGptType) => void;
  selectedEquipment: string | undefined;
  setSelectedEquipment: (equipment: string | undefined) => void;
  selectedObjective: MarketingObjectiveType | undefined;
  setSelectedObjective: (objective: MarketingObjectiveType | undefined) => void;
  equipments: any[];
  equipmentsLoading: boolean;
  handleQuickGenerate: (type: CustomGptType) => Promise<void>;
  isSubmitting: boolean;
}

export interface AdvancedOptionsProps {
  form: any;
  showAdvancedFields: boolean;
}

export const customGptFormSchema = z.object({
  topic: z.string().optional(),
  tone: z.string().optional(),
  quantity: z.string().optional(),
  additionalInfo: z.string().optional(),
  purposes: z.array(z.string()).optional(),
  bodyArea: z.string().optional(),
  marketingObjective: z.string().optional(),
  resetAfterSubmit: z.boolean().default(false)
});

export type CustomGptFormValues = z.infer<typeof customGptFormSchema>;
