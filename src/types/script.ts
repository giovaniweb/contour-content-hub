
export type MarketingObjectiveType = 'emotion' | 'sales';

export interface ScriptGeneratorState {
  ideaText?: string;
  objective?: MarketingObjectiveType;
  validatedIdea?: {
    topic: string;
    validationScore: number;
  };
}
