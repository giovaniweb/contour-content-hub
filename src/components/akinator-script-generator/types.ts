
import React from 'react';

export interface AkinatorStep {
  id: string;
  question: string;
  options: { value: string; label: string }[];
}

export interface AkinatorState {
  contentType?: string;
  objective?: string;
  style?: string;
  theme?: string;
  channel?: string;
  currentStep: number;
  isComplete: boolean;
  generatedScript?: string;
  selectedMentor?: string;
  showDisneyOption?: boolean;
  isApproved?: boolean;
}

export interface MentorProfile {
  estilo: string;
  tom: string;
  exemplos: string[];
}
