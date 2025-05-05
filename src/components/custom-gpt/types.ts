
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
